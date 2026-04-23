# ⚡ GCC Task Dashboard - Quick Reference Card

## 🚀 Setup in 4 Commands

```bash
npm install                    # 1. Install dependencies
npm run init-db               # 2. Create database
copy .env.example .env        # 3. Setup config (Windows)
npm start                     # 4. Start server
```

**Open**: http://localhost:5000

---

## 📊 What You Have

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Database | SQLite | Stores all data (tasks.db) |
| Backend | Node.js + Express | API server |
| Frontend | HTML + CSS + JS | Dashboard UI |
| Auth | JWT + bcrypt | User login & security |
| Backup | JSON export/import | Data backup & restore |

---

## 🗄️ Database Tables

```
users          → User accounts (login/password)
tasks          → All task data (titles, dates, etc)
categories     → Custom task lists
activity_logs  → Action history & audit trail
```

---

## 📁 Key Files

| File | What It Does |
|------|-------------|
| `server.js` | Express API server |
| `index-api.html` | Login & dashboard |
| `script-api.js` | Frontend logic |
| `styles.css` | UI styling |
| `tasks.db` | Database file |
| `.env` | Configuration |

---

## 🔌 Top API Endpoints

```
POST   /api/auth/register      → Create account
POST   /api/auth/login         → Login
GET    /api/tasks              → Get all tasks
POST   /api/tasks              → Create task
PUT    /api/tasks/:id          → Update task
DELETE /api/tasks/:id          → Delete task
GET    /api/export/tasks       → Export JSON
POST   /api/import/tasks       → Import JSON
GET    /api/stats              → Stats
```

All require: `Authorization: Bearer <JWT_TOKEN>`

---

## 💾 Backup & Restore

```
Export:  Sidebar → "Export Tasks" → JSON file
Import:  Sidebar → "Import Tasks" → Select JSON
Backup:  Sidebar → "Create Backup" → Full backup
```

---

## 🔐 Security

- ✅ Passwords: hashed with bcryptjs
- ✅ Auth: JWT tokens (7 day expiry)
- ✅ Privacy: Each user isolated
- ✅ Queries: Parameterized (no SQL injection)

---

## 🛠️ Common Commands

```bash
npm start              # Start server
npm run dev           # Auto-reload development
npm run init-db       # Initialize database
npm install           # Install dependencies
npm update            # Update dependencies
```

---

## 🐛 Quick Troubleshooting

| Error | Fix |
|-------|-----|
| npm ERR | `npm install` |
| Port 5000 used | Change PORT in .env |
| Database error | `npm run init-db` |
| Can't login | Register first |
| CORS error | Check backend running |

---

## 📊 Dashboard Features

- 📝 Create & edit tasks
- ✅ Mark complete/incomplete
- ⭐ Mark as important
- 📅 Set due dates
- 🏷️ Assign categories
- 🔍 Search & filter
- 📊 View stats
- 💾 Export/Import

---

## 👤 User System

- Register: Create account
- Login: Email + password
- Sessions: 7 day tokens
- Logout: Clear session
- Data: Each user isolated

---

## 🎯 Priority Levels

- 🔴 **High** - Urgent tasks
- 🟡 **Medium** - Normal tasks
- 🟢 **Low** - Nice to do

---

## 📂 Default Categories

- 💼 Work
- 👤 Personal
- 🛒 Shopping
- ✨ Custom (create your own)

---

## 📈 Stats Shown

- Total tasks
- Completed tasks
- Pending tasks
- Due today
- Overdue tasks

---

## 🔄 Data Flow

```
You → Browser → Server → Database → Response
                  ↑         ↓
            Authentication & Logging
```

---

## 🌐 Network Requirements

- Localhost for development: `http://localhost:5000`
- Port 5000 must be available
- Modern browser (Chrome, Firefox, Safari, Edge)

---

## 📦 Dependencies

```json
express         - Web server
cors            - Cross-origin
sqlite3         - Database
jwt             - Authentication
bcrypt          - Password hashing
uuid            - Unique IDs
```

---

## 🔑 Important Files to Keep

- ✅ `tasks.db` - Your database (backup regularly!)
- ✅ `.env` - Your secrets (don't commit to git)
- ✅ `package.json` - Your dependencies

---

## ❌ Never Do

- ❌ Don't commit `.env` to git
- ❌ Don't share `JWT_SECRET`
- ❌ Don't delete `.env` file
- ❌ Don't move `tasks.db` without backup

---

## ✅ RegularlyDo

- ✅ Export tasks weekly
- ✅ Backup tasks.db
- ✅ Keep node_modules updated
- ✅ Check server logs

---

## 📞 Emergency Recovery

### Lost Tasks?
```sql
SELECT * FROM tasks;  -- Check database
```

### Need to Recover?
- Import from JSON export
- Restore from backup
- Check activity_logs

### Database Corrupted?
1. `npm run init-db` (creates fresh)
2. `npm run import` (restore from backup)

---

## 🚀 Production Checklist

- [ ] Change `JWT_SECRET` (random 32+ chars)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Set up backups
- [ ] Monitor logs
- [ ] Update regularly

---

## 📚 Documentation

- **README.md** ← Start here
- **QUICKSTART.md** ← Fast setup
- **SUMMARY.md** ← What you have
- **DB-SETUP.md** ← Technical details
- **STRUCTURE.md** ← Architecture

---

## 🎯 Goals Accomplished

✅ Database system created  
✅ User authentication added  
✅ API endpoints built  
✅ Export/Import featured  
✅ Activity logging set up  
✅ Professional UI included  
✅ Documentation complete  

---

## 🚀 Next Steps

1. **Run setup**: Follow commands above
2. **Register**: Create an account
3. **Create tasks**: Add test tasks
4. **Test features**: Try all buttons
5. **Export data**: Download JSON
6. **Read docs**: Full documentation

---

## 📞 Need Help?

1. Check QUICKSTART.md
2. Check troubleshooting section
3. Check server console
4. Check browser console (F12)

---

**Version**: 1.0-0  
**Last Updated**: April 2024

```
╔════════════════════════════════════════╗
║  GCC TASK DASHBOARD - READY TO USE    ║
║  Database: ✅ Created                  ║
║  API: ✅ Built                         ║
║  Frontend: ✅ Updated                  ║
║  Docs: ✅ Complete                     ║
╚════════════════════════════════════════╝
```

**Ready to run!** 🎉
