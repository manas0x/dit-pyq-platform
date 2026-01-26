from fastapi import APIRouter, Depends, HTTPException
from mysql.connector import MySQLConnection
from database import get_db
from models import SubjectCreate, SubjectOut
from auth import require_admin

router = APIRouter(prefix="/subjects", tags=["subjects"])


@router.get("", response_model=list[SubjectOut])
def get_subjects(db: MySQLConnection = Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM subjects ORDER BY name")
    subjects = cursor.fetchall()
    cursor.close()
    return subjects


@router.post("", response_model=SubjectOut, status_code=201)
def create_subject(
    data: SubjectCreate,
    db: MySQLConnection = Depends(get_db),
    _: dict = Depends(require_admin)
):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("INSERT INTO subjects (name) VALUES (%s)", (data.name,))
        db.commit()
        cursor.execute("SELECT * FROM subjects WHERE id = %s", (cursor.lastrowid,))
        subject = cursor.fetchone()
        cursor.close()
        return subject
    except Exception:
        raise HTTPException(status_code=400, detail="Subject already exists")
