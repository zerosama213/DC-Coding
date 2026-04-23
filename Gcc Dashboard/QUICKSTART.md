# 🚀 Quick Start Guide - GCC Task Dashboard with Database

## What You Now Have

✅ **Full-Stack Task Management System**
- Node.js backend with Express
- SQLite database with multi-table structure  
- User authentication (login/register)
- Complete task CRUD operations
- Export/Import functionality
- Activity logging
- Data persistence

---

## 5-Minute Setup

### 1️⃣ Install Dependencies
```bash
cd "Gcc Dashboard"
npm install
```

### 2️⃣ Setup Environment
```bash
# Create .env file
copy .env.example .env

# Or manually create .env with:
PORT=5000
JWT_SECRET=change-this-secret-in-production
NODE_ENV=development
```

### 3️⃣ Initialize Database
```bash
npm run init-db
```

This creates:
- `tasks.db` - SQLite database file
- 4 tables: users, tasks, activity_logs, categories
- Performance indexes

### 4️⃣ Start Server
```bash
npm start
```

You'll see:
```
========================================
🚀 GCC Task Dashboard Server Started
========================================
Server running on: http://localhost:5000
Database: tasks.db
========================================
```

### 5️⃣ Open Dashboard
Open your browser to: **http://localhost:5000**

---

## Features Available

### 🔐 User Accounts
- Register new account
- Login with email/password  
- 7-day session tokens
- Auto-logout on expiration

### 📝 Task Management
- Create/Edit/Delete tasks
- Assign to categories (Work/Personal/Shopping)
- Set priorities (High/Medium/Low)
- Set due dates
- Mark as important
- Track completion status

### 💾 Data Backup
- **Export**: Download all tasks as JSON
- **Backup**: Full system backup (tasks + logs + categories)
- **Import**: Upload JSON to restore tasks
- Located in sidebar "Backup" section

### 📊 Activity Tracking
- Every action logged to database
- View activity logs via API
- Track who did what and when

### 🗂️ Custom Categories
- Create custom task lists
- Assign colors
- Organize by preference

---

## Database File Explained

### `tasks.db` File
- **Location**: `Gcc Dashboard/tasks.db`
- **Size**: Auto-grows as data is added
- **Backup**: Copy this file to backup all data
- **Access**: Can be read with SQLite tools

### Database Tables

```
users
├─ id, username, email, password
├─ created_at, updated_at
└─ 1-to-many → tasks, categories, activity_logs

tasks
├─ id, user_id, title, description
├─ category, priority, due_date
├─ completed, important
└─ created_at, updated_at

activity_logs
├─ id, user_id, action
├─ task_id, details, created_at
└─ Tracks: TASK_CREATED, TASK_UPDATED, TASK_DELETED

categories
├─ id, user_id, name, color
└─ created_at
```

---

## API Endpoints Quick Reference

All endpoints require `Authorization: Bearer <token>` header

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Data
- `GET /api/export/tasks` - Download tasks JSON
- `GET /api/export/backup` - Full backup
- `POST /api/import/tasks` - Import JSON

### Info
- `GET /api/stats` - Dashboard statistics
- `GET /api/activity-logs` - Recent activities

---

## File Structure

```
Gcc Dashboard/
├── server.js           ← Express backend
├── init-db.js          ← Database setup
├── auth.js             ← Auth utilities
├── package.json        ← Dependencies
├── .env.example        ← Config template
├── index-api.html      ← Login/Dashboard
├── script-api.js       ← Frontend JS
├── styles.css          ← Styling
├── tasks.db            ← Database (auto-created)
├── DB-SETUP.md         ← Full documentation
└── QUICKSTART.md       ← This file
```

---

## Common Tasks

### Export Your Tasks
1. Click **Export Tasks** button in sidebar
2. File `tasks-export-[timestamp].json` downloads
3. Keep as backup

### Import Tasks
1. Click **Import Tasks** button
2. Select previously exported JSON file
3. Tasks are restored

### Create Backup
1. Click **Create Backup** button
2. `backup-[timestamp].json` downloads
3. Contains everything (tasks + logs + categories)

### Switch Users
1. Click **Logout** button (top-right)
2. Login with different account
3. Each user has isolated data

### Add Custom Category
1. Click **+ icon** next to "Lists"
2. Enter category name
3. Will appear in dropdown

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "npm ERR!" | Run `npm install` again |
| "Cannot find module" | Still run `npm install` |
| Port 5000 in use | Change PORT in .env or stop other app |
| Database locked | Restart server (`npm start`) |
| Can't login | Check you registered first |
| Export won't work | Ensure JSON is valid format |

---

## Terminal Commands Reference

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start server (development, auto-reload)
npm run dev

# Initialize database
npm run init-db

# Stop server
Ctrl + C
```

---

## What Gets Saved in Database

### When You Create a Task:
✅ Task title, description, priority
✅ Due date, category, completion status
✅ Whether it's marked important
✅ When created and last updated
✅ Your user ID (for privacy)

### When You Export:
✅ All tasks in JSON format
✅ Timestamp of export
✅ Your username

### When You Change Something:
✅ Action logged to activity_logs
✅ Timestamp recorded
✅ What changed is noted

---

## Next Steps

1. ✅ Run `npm install`
2. ✅ Create `.env` file
3. ✅ Run `npm run init-db`
4. ✅ Run `npm start`
5. ✅ Open http://localhost:5000
6. ✅ Register account
7. ✅ Start creating tasks!

---

## Security Notes

⚠️ Current setup is for **development/personal use**

For production:
- Change `JWT_SECRET` to random 32+ character string
- Enable HTTPS
- Use strong passwords
- Regular database backups
- Hide `.env` file from version control

---

## Need Help?

1. Check **DB-SETUP.md** for detailed documentation
2. Check server console for error messages
3. Check browser console (F12) for frontend errors
4. Verify all files are in `Gcc Dashboard` folder
5. Ensure Node.js is installed: `node --version`

---

**Version**: 1.0.0  
**Last Updated**: April 2024
