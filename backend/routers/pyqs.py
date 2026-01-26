from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from mysql.connector import MySQLConnection
from typing import Optional
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
from database import get_db
from models import PYQOut, PYQUpdate
from auth import require_admin, get_current_user

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

router = APIRouter(prefix="/pyqs", tags=["pyqs"])


def row_to_pyq(row: dict) -> PYQOut:
    return PYQOut(**row)


@router.get("", response_model=list[PYQOut])
def get_pyqs(
    subject: Optional[str] = None,
    semester: Optional[int] = None,
    year: Optional[int] = None,
    search: Optional[str] = None,
    db: MySQLConnection = Depends(get_db)
):
    query = """
        SELECT p.id, p.subject_id, s.name AS subject_name,
               p.semester, p.year, p.title, p.pdf_url, p.created_at
        FROM pyqs p
        JOIN subjects s ON p.subject_id = s.id
        WHERE 1=1
    """
    params = []

    if subject:
        query += " AND s.name LIKE %s"
        params.append(f"%{subject}%")
    if semester:
        query += " AND p.semester = %s"
        params.append(semester)
    if year:
        query += " AND p.year = %s"
        params.append(year)
    if search:
        query += " AND p.title LIKE %s"
        params.append(f"%{search}%")

    query += " ORDER BY p.created_at DESC"

    cursor = db.cursor(dictionary=True)
    cursor.execute(query, params)
    rows = cursor.fetchall()
    cursor.close()
    return [row_to_pyq(r) for r in rows]


@router.get("/{pyq_id}", response_model=PYQOut)
def get_pyq(pyq_id: int, db: MySQLConnection = Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT p.id, p.subject_id, s.name AS subject_name,
               p.semester, p.year, p.title, p.pdf_url, p.created_at
        FROM pyqs p
        JOIN subjects s ON p.subject_id = s.id
        WHERE p.id = %s
        """,
        (pyq_id,)
    )
    row = cursor.fetchone()
    cursor.close()

    if not row:
        raise HTTPException(status_code=404, detail="PYQ not found")
    return row_to_pyq(row)


@router.post("", response_model=PYQOut, status_code=201)
async def create_pyq(
    subject_id: int = Form(...),
    semester: int = Form(...),
    year: int = Form(...),
    title: str = Form(...),
    pdf: UploadFile = File(...),
    db: MySQLConnection = Depends(get_db),
    _: dict = Depends(require_admin)
):
    if pdf.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    contents = await pdf.read()
    upload_result = cloudinary.uploader.upload(
        contents,
        folder="pyq-platform",
        resource_type="raw",
        format="pdf"
    )
    pdf_url = upload_result["secure_url"]

    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "INSERT INTO pyqs (subject_id, semester, year, title, pdf_url) VALUES (%s, %s, %s, %s, %s)",
        (subject_id, semester, year, title, pdf_url)
    )
    db.commit()
    new_id = cursor.lastrowid

    cursor.execute(
        """
        SELECT p.id, p.subject_id, s.name AS subject_name,
               p.semester, p.year, p.title, p.pdf_url, p.created_at
        FROM pyqs p JOIN subjects s ON p.subject_id = s.id
        WHERE p.id = %s
        """,
        (new_id,)
    )
    row = cursor.fetchone()
    cursor.close()
    return row_to_pyq(row)


@router.put("/{pyq_id}", response_model=PYQOut)
def update_pyq(
    pyq_id: int,
    data: PYQUpdate,
    db: MySQLConnection = Depends(get_db),
    _: dict = Depends(require_admin)
):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id FROM pyqs WHERE id = %s", (pyq_id,))
    if not cursor.fetchone():
        cursor.close()
        raise HTTPException(status_code=404, detail="PYQ not found")

    fields = {k: v for k, v in data.model_dump().items() if v is not None}
    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    set_clause = ", ".join(f"{k} = %s" for k in fields)
    cursor.execute(
        f"UPDATE pyqs SET {set_clause} WHERE id = %s",
        (*fields.values(), pyq_id)
    )
    db.commit()

    cursor.execute(
        """
        SELECT p.id, p.subject_id, s.name AS subject_name,
               p.semester, p.year, p.title, p.pdf_url, p.created_at
        FROM pyqs p JOIN subjects s ON p.subject_id = s.id
        WHERE p.id = %s
        """,
        (pyq_id,)
    )
    row = cursor.fetchone()
    cursor.close()
    return row_to_pyq(row)


@router.delete("/{pyq_id}")
def delete_pyq(
    pyq_id: int,
    db: MySQLConnection = Depends(get_db),
    _: dict = Depends(require_admin)
):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id FROM pyqs WHERE id = %s", (pyq_id,))
    if not cursor.fetchone():
        cursor.close()
        raise HTTPException(status_code=404, detail="PYQ not found")

    cursor.execute("DELETE FROM pyqs WHERE id = %s", (pyq_id,))
    db.commit()
    cursor.close()
    return {"message": "PYQ deleted successfully"}
