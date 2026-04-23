# GCC Task Dashboard - Database Setup Guide

## 📋 Overview

Complete task management system with:
- **Backend Database**: Node.js + Express + SQLite
- **User Authentication**: JWT-based login/register
- **Task Management**: Full CRUD operations
- **Data Persistence**: SQLite database (tasks.db)
- **Export/Import**: JSON backup and restore
- **Activity Logging**: Track all user actions
- **User Categories**: Custom task lists

## 🗄️ Database Structure

### Tables

#### `users`
- `id` (UUID) - Primary key
- `username` (TEXT) - Unique username
- `email` (TEXT) - Unique email
- `password` (TEXT) - Hashed password
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### `tasks`
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key
- `title` (TEXT) - Task title
- `description` (TEXT) - Task details
- `category` (TEXT) - Work/Personal/Shopping
- `priority` (TEXT) - high/medium/low
- `due_date` (DATE) - Task deadline
- `completed` (BOOLEAN) - Completion status
- `important` (BOOLEAN) - Mark as important
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### `activity_logs`
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key
- `action` (TEXT) - Action type (TASK_CREATED, TASK_UPDATED, etc.)
- `task_id` (UUID) - Related task
- `details` (TEXT) - Action details
- `created_at` - Timestamp

#### `categories`
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key
- `name` (TEXT) - Category name
- `color` (TEXT) - Category color (hex)
- `created_at` - Timestamp

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- SQLite3

### Step 1: Install Dependencies

```bash
cd "Gcc Dashboard"
npm install
```

### Step 2: Create Environment File

Create a `.env` file in the project root:

```env
PORT=5000
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=development
```

### Step 3: Initialize Database

Run the database initialization script:

```bash
npm run init-db
```

This will create:
- `tasks.db` SQLite database file
- All required tables
- Indexes for performance optimization

### Step 4: Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

Server will be available at: `http://localhost:5000`

## 📱 API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "securepassword"
}

Response:
{
    "success": true,
    "userId": "uuid",
    "username": "johndoe",
    "token": "jwt-token"
}
```

#### Verify Token
```
GET /api/auth/verify
Authorization: Bearer <token>
```

### Tasks

#### Get All Tasks
```
GET /api/tasks
Authorization: Bearer <token>
```

#### Create Task
```
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Buy groceries",
    "description": "Milk, eggs, vegetables",
    "category": "shopping",
    "priority": "medium",
    "dueDate": "2024-04-25",
    "important": false
}
```

#### Update Task
```
PUT /api/tasks/:taskId
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Updated title",
    "completed": true,
    "priority": "high"
}
```

#### Delete Task
```
DELETE /api/tasks/:taskId
Authorization: Bearer <token>
```

### Categories

#### Get All Categories
```
GET /api/categories
Authorization: Bearer <token>
```

#### Create Category
```
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Projects",
    "color": "#FF6B6B"
}
```

### Export/Import

#### Export Tasks as JSON
```
GET /api/export/tasks
Authorization: Bearer <token>

Downloads: tasks-export-<timestamp>.json
```

#### Create Full Backup
```
GET /api/export/backup
Authorization: Bearer <token>

Downloads: backup-<timestamp>.json
(Includes tasks, categories, and activity logs)
```

#### Import Tasks
```
POST /api/import/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
    "tasks": [
        {
            "title": "Task 1",
            "description": "Description",
            "category": "work",
            "priority": "high",
            "dueDate": "2024-04-25",
            "completed": false,
            "important": true
        }
    ]
}
```

### Activity & Stats

#### Get Activity Logs
```
GET /api/activity-logs?limit=50
Authorization: Bearer <token>
```

#### Get Dashboard Stats
```
GET /api/stats
Authorization: Bearer <token>

Response:
{
    "success": true,
    "stats": {
        "totalTasks": 25,
        "completedTasks": 12,
        "pendingTasks": 13,
        "dueTodayTasks": 5,
        "importantTasks": 3,
        "overdueTasks": 2
    }
}
```

## 🔐 Authentication Flow

1. **User Registration**: Create new account with username, email, password
2. **Password Hashing**: Passwords encrypted with bcryptjs (10 rounds)
3. **JWT Token**: 7-day expiration token issued on login
4. **Token Storage**: Token stored in localStorage
5. **Protected Routes**: All API endpoints require valid JWT token
6. **Auto-Logout**: Expired tokens redirect user to login

## 💾 Data Backup & Recovery

### Auto-Backup
- Export all tasks as JSON anytime
- Contains full task metadata
- Timestamped filenames for organization

### Import/Restore
- Upload previously exported JSON file
- Automatically creates new tasks
- Maps to current user account
- Preserves all task properties

### Database Backup
The SQLite database file (`tasks.db`) can be backed up directly:
```bash
cp tasks.db tasks.db.backup
```

## 🔧 Frontend Integration

The frontend (`index-api.html`) includes:
- Login/Register screens
- JWT token management
- API integration with all endpoints
- Export/Import UI
- Activity tracking display

### Using the Frontend

1. **Start Server** (backend)
```bash
npm start
```

2. **Open Dashboard**
```
http://localhost:5000
```

3. **Register/Login** with credentials

4. **Use Export Features** in the Backup section

## 📊 Database Queries

### Get user's completed tasks
```sql
SELECT * FROM tasks 
WHERE user_id = 'user-id' AND completed = 1;
```

### Get overdue tasks
```sql
SELECT * FROM tasks 
WHERE user_id = 'user-id' 
AND due_date < DATE('now') 
AND completed = 0;
```

### Get user activity history
```sql
SELECT * FROM activity_logs 
WHERE user_id = 'user-id' 
ORDER BY created_at DESC 
LIMIT 50;
```

### Get category stats
```sql
SELECT category, COUNT(*) as count, 
       SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
FROM tasks 
WHERE user_id = 'user-id'
GROUP BY category;
```

## 🛡️ Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS enabled for frontend
- ✅ User data isolation (each user sees only their data)

## 📁 Project Structure

```
Gcc Dashboard/
├── server.js              # Express server & API routes
├── init-db.js            # Database initialization
├── auth.js               # Authentication utilities
├── package.json          # Dependencies
├── index-api.html        # Frontend with auth
├── script-api.js         # Frontend API integration
├── styles.css            # Dashboard styling
├── tasks.db              # SQLite database (created)
└── DB-SETUP.md          # This file
```

## 🐛 Troubleshooting

### Database Connection Error
- Ensure `tasks.db` exists in project root
- Try running: `npm run init-db`
- Check SQLite is installed: `sqlite3 --version`

### JWT Token Error
- Clear localStorage and re-login
- Check that JWT_SECRET is set in .env
- Verify token hasn't expired (7 days)

### Import Failing
- Ensure JSON file has correct format
- Check file contains `tasks` array
- Verify all required fields are present

### Server Won't Start
- Check port 5000 is available
- Install all dependencies: `npm install`
- Check Node.js version: `node --version`

## 📝 Sample Data

On first run without initial data, the system is ready for new users. To add test data:

```bash
# Register a new user via the login screen
# Or use the API directly:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🚀 Production Deployment

Before deploying:

1. **Change JWT_SECRET** to a strong, unique value
2. **Set NODE_ENV=production**
3. **Use environment variables** for all secrets
4. **Enable HTTPS** in production
5. **Regular database backups** to secure location
6. **Monitor API logs** for suspicious activity

## 📚 Additional Resources

- Express.js: https://expressjs.com
- JWT: https://jwt.io
- SQLite: https://www.sqlite.org
- bcryptjs: https://github.com/dcodeIO/bcrypt.js

## 📞 Support

For issues or questions:
1. Check database is initialized
2. Verify all environment variables are set
3. Check server logs for detailed errors
4. Ensure correct API endpoint format

---

**Last Updated**: April 2024
**Version**: 1.0.0
