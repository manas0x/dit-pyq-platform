import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "pyq_db"),
}

_pool = None

def get_pool():
    global _pool
    if _pool is None:
        _pool = pooling.MySQLConnectionPool(
            pool_name="pyq_pool",
            pool_size=5,
            **db_config
        )
    return _pool

def init_db():
    conn = get_pool().get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin') DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subjects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pyqs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject_id INT NOT NULL,
            semester INT NOT NULL,
            year INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            pdf_url TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
        );
    """)
    subjects = [
        'DBMS', 'Data Structures', 'Computer Networks', 'Operating Systems',
        'Software Engineering', 'Web Technology', 'Mathematics', 'Python Programming'
    ]
    for s in subjects:
        cursor.execute("INSERT IGNORE INTO subjects (name) VALUES (%s)", (s,))
    conn.commit()
    cursor.close()
    conn.close()


def get_db():
    conn = get_pool().get_connection()
    try:
        yield conn
    finally:
        conn.close()

