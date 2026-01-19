from fastapi import APIRouter, Depends, HTTPException, status
from mysql.connector import MySQLConnection
from database import get_db
from models import UserRegister, UserLogin, Token, UserOut
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=201)
def register(data: UserRegister, db: MySQLConnection = Depends(get_db)):
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id FROM users WHERE email = %s", (data.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(data.password)
    cursor.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
        (data.name, data.email, hashed)
    )
    db.commit()
    user_id = cursor.lastrowid

    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()

    token = create_access_token({"sub": str(user["id"]), "role": user["role"]})
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserOut(**user)
    )


@router.post("/login", response_model=Token)
def login(data: UserLogin, db: MySQLConnection = Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (data.email,))
    user = cursor.fetchone()
    cursor.close()

    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user["id"]), "role": user["role"]})
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserOut(**user)
    )


@router.get("/me", response_model=UserOut)
def get_me(current_user: dict = Depends(get_current_user), db: MySQLConnection = Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (int(current_user["sub"]),))
    user = cursor.fetchone()
    cursor.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(**user)
