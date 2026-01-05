# DIT PYQ Platform 🎓

A full-stack web application designed for students and faculty to search, view, download, and manage previous year question papers (PYQs). Built with a modern, high-performance tech stack: **React (Vite) + Tailwind CSS** on the frontend, and **FastAPI (Python) + MySQL + Cloudinary** on the backend.

---

## 📑 Table of Contents

- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup (FastAPI)](#1-backend-setup-fastapi)
  - [2. Frontend Setup (React)](#2-frontend-setup-react)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [API Endpoints](#-api-endpoints)
- [User Roles & Permissions](#-user-roles--permissions)
- [License](#-license)

---

## 🚀 Tech Stack

### Frontend
- **React.js 18** (Vite build tool)
- **Tailwind CSS** (Modern responsive design system)
- **React Router DOM v6** (Client-side routing with protected routes)
- **Axios** (HTTP client with JWT request interceptors)
- **Lucide React** (Modern iconography)

### Backend
- **Python 3.10+ / 3.14**
- **FastAPI** (High performance, async REST API)
- **Pydantic v2** (Request validation and data schemas)
- **MySQL Connector Python** (Database pooling & operations)
- **Cloudinary SDK** (Secure cloud PDF storage & direct streaming)
- **python-jose & passlib (bcrypt)** (JWT authentication & secure password hashing)

---

## ✨ Key Features

### 👤 Student / User
- 🔍 **Real-Time Search**: Search papers by subject name, subject code, or title.
- 🎯 **Multi-Criteria Filtering**: Filter by Year, Semester, Branch, and Exam Type (Mid-Term / End-Term / Supplementary).
- 📄 **In-App PDF Viewer**: View PDF papers directly in browser without downloading.
- ⬇️ **One-Click Download**: Download original PDF papers instantly.
- 🔐 **Authentication**: User registration and JWT-based session login.

### 🛡️ Admin
- 📊 **Admin Dashboard**: Overview of all uploaded question papers.
- ➕ **Upload PYQ**: Upload question papers with metadata and PDF files (stored securely on Cloudinary).
- ✏️ **Edit PYQ**: Update paper details, subject codes, years, and semesters.
- 🗑️ **Delete PYQ**: Remove papers from database and cloud storage.

---

## 📁 Project Architecture

```
dit-pyq-platform/
├── README.md                  # Main project documentation
├── backend-python/            # FastAPI Python backend
│   ├── .env                   # Backend environment variables
│   ├── .gitignore             # Python gitignore
│   ├── README.md              # Backend documentation
│   ├── auth.py                # JWT tokens & bcrypt password hashing
│   ├── database.py            # MySQL lazy connection pool
│   ├── init_db.sql            # Database schema & sample data
│   ├── main.py                # FastAPI entrypoint & CORS config
│   ├── models.py              # Pydantic validation schemas
│   ├── requirements.txt       # Python dependencies
│   └── routers/
│       ├── auth.py            # /api/auth routes (register, login, me)
│       ├── pyqs.py            # /api/pyqs CRUD & Cloudinary upload routes
│       └── subjects.py        # /api/subjects routes
│
└── frontend/                  # React + Vite frontend
    ├── .env                   # Frontend environment variables
    ├── index.html             # HTML entrypoint
    ├── package.json           # Frontend dependencies & scripts
    ├── vite.config.js         # Vite configuration
    └── src/
        ├── App.jsx            # Main route configuration
        ├── main.jsx           # React DOM root
        ├── api.js             # Axios instance with auth interceptor
        ├── index.css          # Tailwind CSS styles
        ├── components/        # Reusable UI components
        │   ├── AdminRoute.jsx # Route guard for admin-only pages
        │   ├── Filter.jsx     # Dropdown filter component
        │   ├── Loading.jsx    # Loading spinner component
        │   ├── Navbar.jsx     # Navigation bar with role awareness
        │   ├── PYQCard.jsx    # Question paper card component
        │   ├── ProtectedRoute.jsx # Route guard for logged-in users
        │   └── SearchBar.jsx  # Search input bar
        ├── context/
        │   └── AuthContext.jsx # Authentication state management
        └── pages/
            ├── Home.jsx           # Landing / Hero page
            ├── Login.jsx          # User & Admin login page
            ├── Register.jsx       # Student registration page
            ├── PYQList.jsx        # Question papers listing & filters
            ├── PYQDetail.jsx      # PDF preview & details view
            ├── AdminDashboard.jsx # Admin management portal
            ├── AddPYQ.jsx         # Admin paper upload form
            └── EditPYQ.jsx        # Admin paper edit form
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v18.x or later
- **Python**: v3.10+ (compatible with Python 3.14)
- **MySQL Database**: Local MySQL or Cloud MySQL (Aiven, PlanetScale, etc.)
- **Cloudinary Account**: Free tier for PDF file hosting

---

### 1. Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend-python
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure your `.env` file in `backend-python/.env`:
   ```env
   DB_HOST=your_mysql_host
   DB_PORT=3306
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=pyq_db

   SECRET_KEY=your-super-secret-jwt-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Initialize the MySQL Database schema:
   - Run `init_db.sql` on your MySQL server to create the tables.

5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The API will be live at `http://localhost:8000` (Interactive API docs at `http://localhost:8000/docs`).

---

### 2. Frontend Setup (React)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will run at `http://localhost:5173`.

---

## 🗄️ Database Setup

Run the SQL script [`backend-python/init_db.sql`](backend-python/init_db.sql) to initialize your database tables:

```sql
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pyqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(150) NOT NULL,
    subject_code VARCHAR(50) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    year INT NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    file_public_id VARCHAR(255),
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);
```

> **To promote a user to Admin**:
> ```sql
> UPDATE users SET role = 'admin' WHERE email = 'your_registered_email@example.com';
> ```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Login and receive JWT access token | Public |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Authenticated |
| `GET` | `/api/pyqs` | List PYQs with search & filter query params | Public |
| `GET` | `/api/pyqs/{id}` | Get single PYQ details | Public |
| `POST` | `/api/pyqs` | Upload new PYQ PDF & metadata | Admin only |
| `PUT` | `/api/pyqs/{id}` | Update existing PYQ metadata | Admin only |
| `DELETE`| `/api/pyqs/{id}` | Delete PYQ and its Cloudinary PDF | Admin only |
| `GET` | `/api/subjects` | Get unique list of subjects & codes | Public |

---

## 👥 User Roles & Permissions

| Feature | Student / Public | Admin |
|---|:---:|:---:|
| Browse & View PYQs | ✅ | ✅ |
| Search & Filter Papers | ✅ | ✅ |
| Preview & Download PDFs | ✅ | ✅ |
| Upload New Papers | ❌ | ✅ |
| Edit Paper Metadata | ❌ | ✅ |
| Delete Papers | ❌ | ✅ |
| Access Admin Dashboard | ❌ | ✅ |

---

## 📄 License
This project is licensed under the MIT License.
