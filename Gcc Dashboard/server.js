// ============================================
// TASK DASHBOARD - BACKEND SERVER
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const db = require('./init-db.js');
const {
    generateToken,
    hashPassword,
    verifyPassword,
    authenticateToken,
} = require('./auth.js');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname)));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// Register user
app.post('/api/auth/register', (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const userId = uuidv4();
        const hashedPassword = hashPassword(password);

        const stmt = db.prepare(`
            INSERT INTO users (id, username, email, password)
            VALUES (?, ?, ?, ?)
        `);

        stmt.run(userId, username, email, hashedPassword);

        const token = generateToken(userId);
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId,
            token,
        });
    } catch (error) {
        console.error('Registration error:', error.message);
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        return res.status(500).json({ error: error.message });
    }
});

// Login user
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = db
            .prepare('SELECT * FROM users WHERE email = ?')
            .get(email);

        if (!user || !verifyPassword(password, user.password)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user.id);
        return res.json({
            success: true,
            message: 'Login successful',
            userId: user.id,
            username: user.username,
            token,
        });
    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ error: error.message });
    }
});

// Verify token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
    try {
        const user = db
            .prepare('SELECT id, username, email FROM users WHERE id = ?')
            .get(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// ============================================
// TASKS ENDPOINTS
// ============================================

// Get all tasks for user
app.get('/api/tasks', authenticateToken, (req, res) => {
    try {
        const tasks = db
            .prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC')
            .all(req.userId);

        return res.json({ success: true, tasks });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get single task
app.get('/api/tasks/:taskId', authenticateToken, (req, res) => {
    try {
        const task = db
            .prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?')
            .get(req.params.taskId, req.userId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        return res.json({ success: true, task });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Create task
app.post('/api/tasks', authenticateToken, (req, res) => {
    try {
        const {
            title,
            description = '',
            category = 'work',
            priority = 'medium',
            dueDate = null,
            important = false,
        } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Task title required' });
        }

        const taskId = uuidv4();

        const stmt = db.prepare(`
            INSERT INTO tasks (id, user_id, title, description, category, priority, due_date, important)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(taskId, req.userId, title, description, category, priority, dueDate, important ? 1 : 0);

        // Log activity
        logActivity(req.userId, 'TASK_CREATED', taskId, `Created task: ${title}`);

        const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);

        return res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task,
        });
    } catch (error) {
        console.error('Task creation error:', error.message);
        return res.status(500).json({ error: error.message });
    }
});

// Update task
app.put('/api/tasks/:taskId', authenticateToken, (req, res) => {
    try {
        const { title, description, category, priority, dueDate, completed, important } = req.body;

        // Verify task ownership
        const task = db
            .prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?')
            .get(req.params.taskId, req.userId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const updates = [];
        const values = [];

        if (title !== undefined) {
            updates.push('title = ?');
            values.push(title);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }
        if (category !== undefined) {
            updates.push('category = ?');
            values.push(category);
        }
        if (priority !== undefined) {
            updates.push('priority = ?');
            values.push(priority);
        }
        if (dueDate !== undefined) {
            updates.push('due_date = ?');
            values.push(dueDate);
        }
        if (completed !== undefined) {
            updates.push('completed = ?');
            values.push(completed ? 1 : 0);
        }
        if (important !== undefined) {
            updates.push('important = ?');
            values.push(important ? 1 : 0);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(req.params.taskId);
        values.push(req.userId);

        const stmt = db.prepare(`
            UPDATE tasks SET ${updates.join(', ')}
            WHERE id = ? AND user_id = ?
        `);

        stmt.run(...values);

        // Log activity
        logActivity(req.userId, 'TASK_UPDATED', req.params.taskId, `Updated task: ${title || task.title}`);

        const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.taskId);

        return res.json({
            success: true,
            message: 'Task updated successfully',
            task: updatedTask,
        });
    } catch (error) {
        console.error('Task update error:', error.message);
        return res.status(500).json({ error: error.message });
    }
});

// Delete task
app.delete('/api/tasks/:taskId', authenticateToken, (req, res) => {
    try {
        // Verify task ownership
        const task = db
            .prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?')
            .get(req.params.taskId, req.userId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.taskId);

        // Log activity
        logActivity(req.userId, 'TASK_DELETED', req.params.taskId, `Deleted task: ${task.title}`);

        return res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Task deletion error:', error.message);
        return res.status(500).json({ error: error.message });
    }
});

// ============================================
// CATEGORIES ENDPOINTS
// ============================================

// Get all categories for user
app.get('/api/categories', authenticateToken, (req, res) => {
    try {
        const categories = db
            .prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY created_at')
            .all(req.userId);

        return res.json({ success: true, categories });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Create category
app.post('/api/categories', authenticateToken, (req, res) => {
    try {
        const { name, color = '#4A90E2' } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Category name required' });
        }

        const categoryId = uuidv4();

        const stmt = db.prepare(`
            INSERT INTO categories (id, user_id, name, color)
            VALUES (?, ?, ?, ?)
        `);

        stmt.run(categoryId, req.userId, name, color);

        const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);

        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category,
        });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Category already exists' });
        }
        return res.status(500).json({ error: error.message });
    }
});

// ============================================
// ACTIVITY LOG ENDPOINTS
// ============================================

// Get activity logs
app.get('/api/activity-logs', authenticateToken, (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;

        const logs = db
            .prepare('SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?')
            .all(req.userId, limit);

        return res.json({ success: true, logs });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Helper function to log activities
function logActivity(userId, action, taskId = null, details = null) {
    try {
        const logId = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO activity_logs (id, user_id, action, task_id, details)
            VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(logId, userId, action, taskId, details);
    } catch (error) {
        console.error('Error logging activity:', error.message);
    }
}

// ============================================
// EXPORT/IMPORT ENDPOINTS
// ============================================

// Export tasks as JSON
app.get('/api/export/tasks', authenticateToken, (req, res) => {
    try {
        const tasks = db
            .prepare('SELECT * FROM tasks WHERE user_id = ?')
            .all(req.userId);

        const user = db
            .prepare('SELECT username FROM users WHERE id = ?')
            .get(req.userId);

        const exportData = {
            exportedAt: new Date().toISOString(),
            user: user.username,
            taskCount: tasks.length,
            tasks: tasks.map(task => ({
                ...task,
                completed: task.completed === 1,
                important: task.important === 1,
            })),
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="tasks-export-${Date.now()}.json"`
        );
        res.send(JSON.stringify(exportData, null, 2));

        logActivity(req.userId, 'TASKS_EXPORTED', null, `Exported ${tasks.length} tasks`);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Import tasks from JSON
app.post('/api/import/tasks', authenticateToken, (req, res) => {
    try {
        const { tasks } = req.body;

        if (!Array.isArray(tasks)) {
            return res.status(400).json({ error: 'Invalid import format' });
        }

        let importedCount = 0;
        const stmt = db.prepare(`
            INSERT INTO tasks (id, user_id, title, description, category, priority, due_date, completed, important)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const task of tasks) {
            try {
                const taskId = uuidv4();
                stmt.run(
                    taskId,
                    req.userId,
                    task.title,
                    task.description || '',
                    task.category || 'work',
                    task.priority || 'medium',
                    task.dueDate || null,
                    task.completed ? 1 : 0,
                    task.important ? 1 : 0
                );
                importedCount++;
            } catch (error) {
                console.error('Error importing task:', error.message);
            }
        }

        logActivity(req.userId, 'TASKS_IMPORTED', null, `Imported ${importedCount} tasks`);

        return res.json({
            success: true,
            message: `Successfully imported ${importedCount} tasks`,
            importedCount,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Export all data (backup)
app.get('/api/export/backup', authenticateToken, (req, res) => {
    try {
        const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(req.userId);
        const user = db
            .prepare('SELECT username, email FROM users WHERE id = ?')
            .get(req.userId);
        const categories = db.prepare('SELECT * FROM categories WHERE user_id = ?').all(req.userId);
        const logs = db
            .prepare('SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 100')
            .all(req.userId);

        const backupData = {
            exportedAt: new Date().toISOString(),
            user: user,
            summary: {
                totalTasks: tasks.length,
                completedTasks: tasks.filter(t => t.completed).length,
                totalCategories: categories.length,
                recentActivities: logs.length,
            },
            tasks: tasks.map(task => ({
                ...task,
                completed: task.completed === 1,
                important: task.important === 1,
            })),
            categories,
            activityLogs: logs,
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="backup-${Date.now()}.json"`
        );
        res.send(JSON.stringify(backupData, null, 2));

        logActivity(req.userId, 'BACKUP_CREATED', null, 'Created full backup');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// ============================================
// STATS ENDPOINTS
// ============================================

// Get dashboard stats
app.get('/api/stats', authenticateToken, (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const stats = {
            totalTasks: db.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ?').get(req.userId).count,
            completedTasks: db
                .prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND completed = 1')
                .get(req.userId).count,
            pendingTasks: db
                .prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND completed = 0')
                .get(req.userId).count,
            dueTodayTasks: db
                .prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND due_date = ? AND completed = 0')
                .get(req.userId, today).count,
            importantTasks: db
                .prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND important = 1 AND completed = 0')
                .get(req.userId).count,
            overdueTasks: db
                .prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND due_date < ? AND completed = 0')
                .get(req.userId, today).count,
        };

        return res.json({ success: true, stats });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
    return res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================
// SERVER STARTUP
// ============================================

app.listen(PORT, () => {
    console.log('\n========================================');
    console.log('🚀 GCC Task Dashboard Server Started');
    console.log('========================================');
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`Database: tasks.db`);
    console.log('========================================\n');

    // Initialize database on startup
    console.log('✓ Database connected and ready');
    console.log('✓ All tables initialized');
});

module.exports = app;
