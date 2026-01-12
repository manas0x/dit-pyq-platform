# DIT PYQ Platform — Python Backend

FastAPI + MySQL + Cloudinary backend for the DIT PYQ Platform.

## Setup

### 1. Create the database
Run the SQL script in MySQL:
```bash
mysql -u root -p < init_db.sql
```

### 2. Configure environment
Edit `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pyq_db
SECRET_KEY=any-long-random-string
```

### 3. Install dependencies
```bash
python -m pip install -r requirements.txt
```

### 4. Run the server
```bash
uvicorn main:app --reload
```

API docs available at: http://localhost:8000/docs

## Create an Admin User
After registering via `/auth/register`, update the role in MySQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## API Endpoints

| Method | Route | Access |
|--------|-------|--------|
| POST | /auth/register | Public |
| POST | /auth/login | Public |
| GET | /auth/me | Authenticated |
| GET | /subjects | Public |
| POST | /subjects | Admin |
| GET | /pyqs | Public |
| GET | /pyqs/{id} | Public |
| POST | /pyqs | Admin |
| PUT | /pyqs/{id} | Admin |
| DELETE | /pyqs/{id} | Admin |
