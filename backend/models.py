from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class SubjectCreate(BaseModel):
    name: str


class SubjectOut(BaseModel):
    id: int
    name: str


class PYQCreate(BaseModel):
    subject_id: int
    semester: int
    year: int
    title: str


class PYQUpdate(BaseModel):
    subject_id: Optional[int] = None
    semester: Optional[int] = None
    year: Optional[int] = None
    title: Optional[str] = None


class PYQOut(BaseModel):
    id: int
    subject_id: int
    subject_name: str
    semester: int
    year: int
    title: str
    pdf_url: str
    created_at: datetime
