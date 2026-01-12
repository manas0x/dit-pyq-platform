CREATE DATABASE IF NOT EXISTS pyq_db;
USE pyq_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

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

-- Seed some subjects
INSERT IGNORE INTO subjects (name) VALUES
    ('DBMS'),
    ('Data Structures'),
    ('Computer Networks'),
    ('Operating Systems'),
    ('Software Engineering'),
    ('Web Technology'),
    ('Mathematics'),
    ('Python Programming');
