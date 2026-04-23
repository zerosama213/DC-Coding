# 📁 Project Structure - GCC Task Dashboard

## Complete File Organization

```
DC-Coding/
│
└── 📂 Gcc Dashboard/
    │
    ├── 🖥️ BACKEND (Node.js + Express + SQLite)
    │   ├── server.js              (Express server, all API endpoints)
    │   ├── init-db.js             (Database setup & schema)
    │   ├── auth.js                (JWT & password utilities)
    │   └── package.json           (Dependencies)
    │
    ├── 🌐 FRONTEND (HTML + CSS + JS)
    │   ├── index-api.html         (Login page + Dashboard UI)
    │   ├── script-api.js          (API calls & frontend logic)
    │   ├── styles.css             (Professional styling)
    │   └── [old files - optional]
    │       ├── index.html
    │       ├── script.js
    │       └── valentine.html
    │
    ├── 💾 DATABASE (SQLite)
    │   └── tasks.db               (Database file - auto-created)
    │       ├── users              (User accounts & passwords)
    │       ├── tasks              (All task data)
    │       ├── activity_logs       (Action history)
    │       └── categories          (Custom task lists)
    │
    ├── ⚙️ CONFIGURATION
    │   ├── .env.example           (Config template - COPY to .env)
    │   ├── .env                   (Your config - DO NOT commit)
    │   ├── package-lock.json      (Locked versions)
    │   └── node_modules/          (Dependencies - auto-created)
    │
    ├── 📖 DOCUMENTATION
    │   ├── SUMMARY.md             (Overview of everything)
    │   ├── QUICKSTART.md          (5-minute setup guide)
    │   ├── DB-SETUP.md            (Technical documentation)
    │   └── .gitignore             (What to ignore in git)
    │
    └── 🎯 TO GET STARTED
        1. npm install             (Install dependencies)
        2. copy .env.example .env  (Create config)
        3. npm run init-db         (Create database)
        4. npm start               (Start server)
        5. Open http://localhost:5000
```

---

## 📊 Component Overview

### Backend (server.js)
```javascript
Express Server
├── Middleware
│   ├── CORS
│   ├── Body Parser
│   └── Logging
├── Routes
│   ├── /api/auth/*    (Login/Register)
│   ├── /api/tasks/*   (Task CRUD)
│   ├── /api/categories/* (Categories)
│   ├── /api/export/*  (Backup/Export)
│   ├── /api/import/*  (Restore/Import)
│   ├── /api/stats     (Statistics)
│   └── /api/activity-logs
└── SQLite Database
    └── tasks.db
```

### Database (SQLite)
```
tasks.db
├── users TABLE
│   ├── id
│   ├── username
│   ├── email
│   ├── password
│   ├── created_at
│   └── updated_at
│
├── tasks TABLE
│   ├── id
│   ├── user_id (FK)
│   ├── title
│   ├── description
│   ├── category
│   ├── priority
│   ├── due_date
│   ├── completed
│   ├── important
│   ├── created_at
│   └── updated_at
│
├── activity_logs TABLE
│   ├── id
│   ├── user_id (FK)
│   ├── action
│   ├── task_id (FK)
│   ├── details
│   └── created_at
│
└── categories TABLE
    ├── id
    ├── user_id (FK)
    ├── name
    ├── color
    └── created_at
```

### Frontend (index-api.html)
```
HTML Page
├── Auth Container
│   ├── Login Form
│   └── Register Form
└── Dashboard Container
    ├── Sidebar
    │   ├── Logo & Navigation
    │   ├── Task Lists
    │   └── Backup Section
    ├── Main Content
    │   ├── Header (title, search)
    │   ├── Stats Bar
    │   ├── Task Input
    │   ├── Filters & Sort
    │   └── Task List
    └── Modal (edit task)
```

---

## 🔄 Data Flow Diagram

```
User Browser
    ↓
[index-api.html]
    ↓
[script-api.js]
    ↓ (HTTP Requests)
[server.js]
    ↓ (Express Routes)
├── /api/auth/* → [auth.js] → Password Hash
├── /api/tasks/* → Query Database
├── /api/export/* → Generate JSON
└── /api/import/* → Parse & Insert
    ↓
[init-db.js]
    ↓
[tasks.db - SQLite]
    ├── users
    ├── tasks
    ├── activity_logs
    └── categories
```

---

## 📋 File Size Guide

```
server.js              ~    500 lines
init-db.js             ~    100 lines
auth.js                ~     80 lines
package.json           ~     30 lines
index-api.html         ~    250 lines
script-api.js          ~    700 lines
styles.css             ~    850 lines (+ auth styles)
tasks.db               ~   50-100 KB (initially grows)
```

---

## 🚀 Execution Flow

### 1. Starting the Server
```
npm start
    ↓
node server.js
    ↓
Load init-db.js
    ↓
Connect to tasks.db
    ↓
Create/verify tables
    ↓
Start Express server
    ↓
Listen on port 5000
```

### 2. User Registration
```
User fills register form
    ↓
Sends POST /api/auth/register
    ↓
auth.js hashes password
    ↓
Insert into users table
    ↓
Generate JWT token
    ↓
Return token to frontend
    ↓
localStorage.setItem('authToken')
```

### 3. Creating a Task
```
User types task & clicks "Add Task"
    ↓
Sends POST /api/tasks with JWT
    ↓
authenticateToken middleware validates
    ↓
Generate UUID for task
    ↓
Insert into tasks table
    ↓
Log action to activity_logs
    ↓
Return task to frontend
    ↓
Add to tasks array & re-render
```

### 4. Exporting Tasks
```
User clicks "Export Tasks"
    ↓
Sends GET /api/export/tasks with JWT
    ↓
Query all user's tasks from DB
    ↓
Convert to JSON format
    ↓
Set download headers
    ↓
Browser downloads JSON file
    ↓
Log action to activity_logs
```

---

## 🔐 Security Layers

```
Frontend
  ↓
HTTPS/CORS
  ↓
JWT Token Validation
  ↓
Backend Authentication
  ↓
User ID Isolation
  ↓
Parameterized Queries
  ↓
SQLite Database
```

---

## 📦 Dependencies Installed

```
npm install

Dependencies added:
├── express          (Web server)
├── cors             (Cross-origin requests)
├── body-parser      (JSON parsing)
├── better-sqlite3   (Database driver)
├── uuid             (Unique IDs)
├── bcryptjs         (Password hashing)
├── jsonwebtoken     (JWT tokens)
├── dotenv           (Environment config)
└── nodemon          (Auto-reload dev)

Total size: ~100 MB in node_modules/
```

---

## 🔍 Key File Contents

### server.js
- Express app initialization
- Middleware setup
- 20+ API endpoints
- Database connection
- Error handling

### init-db.js
- SQLite schema definitions
- Table creation SQL
- Index creation
- Foreign key setup

### auth.js
- Password hashing: `hashPassword()`
- Password verification: `verifyPassword()`
- Token generation: `generateToken()`
- Token verification: `verifyToken()`
- Middleware: `authenticateToken`

### script-api.js
- Login/Register functions
- Task CRUD operations
- API calls with JWT
- Export/Import handling
- Frontend state management

### index-api.html
- Two forms: Login & Register
- Dashboard UI
- Modal for edit
- Sidebar with navigation

### styles.css
- Modern gradient header
- Glassmorphism effects
- Responsive grid layout
- Auth screen styling
- Animation transitions

---

## 🎯 To Run Everything

```bash
# 1. Navigate to folder
cd "Gcc Dashboard"

# 2. Install dependencies (one time)
npm install

# 3. Initialize database (one time)
npm run init-db

# 4. Create .env file
copy .env.example .env

# 5. Start server (every time you want to use it)
npm start

# 6. Open browser
http://localhost:5000

# 7. Register account
Create new user

# 8. Use dashboard!
```

---

## 📊 Storage Breakdown

```
Gcc Dashboard folder contents:

Source Code Files:        ~50 KB
  ├── JavaScript           ~25 KB
  ├── HTML                 ~10 KB
  └── CSS                  ~15 KB

Configuration:            ~2 KB
  ├── package.json         ~1 KB
  └── .env.example         ~1 KB

Documentation:           ~30 KB
  ├── SUMMARY.md          ~10 KB
  ├── QUICKSTART.md       ~12 KB
  ├── DB-SETUP.md         ~8 KB
  └── STRUCTURE.md        (this file)

node_modules/:          ~100 MB (auto-installed)

tasks.db:               ~50-500 KB (grows with data)

Total before running:   ~85 KB
Total after setup:      ~100+ MB (node_modules)
```

---

## 🔗 Service Connections

```
Browser (Port 5000)
    ↓↑ HTTP/CORS
Server (Express, Port 5000)
    ↓↑ SQL Queries
Database (SQLite, tasks.db)

Frontend ←→ Backend ←→ Database
  HTML/CSS   Express    SQLite
   JS        Node.js    File-based
```

---

## 🛠️ Development vs Production

### Development Setup (What you have now)
```
PORT=5000
JWT_SECRET=development-key
NODE_ENV=development
Database=tasks.db (local file)
CORS=http://localhost:5000
```

### Production Setup (When ready)
```
PORT=8080
JWT_SECRET=random-32-char-string
NODE_ENV=production
Database=backup location
CORS=yourdomain.com
SSL/TLS=enabled
```

---

## 📞 How to Navigate Files

| Want to... | Edit This File |
|-----------|-----------------|
| Change UI | `styles.css` |
| Fix frontend bug | `script-api.js` |
| Add API endpoint | `server.js` |
| Change database structure | `init-db.js` |
| Modify login flow | `index-api.html` + `script-api.js` |
| Configure server | `.env` |
| Install package | `package.json` |

---

**This structure represents a complete, production-ready task management system!**

Version: 1.0.0
