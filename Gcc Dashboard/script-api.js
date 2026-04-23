// ============================================
// TASK DASHBOARD - FRONTEND (API VERSION)
// ============================================

const API_URL = 'http://localhost:5000/api';

// State Management
const AppState = {
    tasks: [],
    currentFilter: 'all',
    currentCategory: 'work',
    currentSort: 'date',
    isEditMode: false,
    editingTaskId: null,
    user: null,
    token: null,
    isAuthenticated: false,
};

// DOM Elements
const DOM = {
    // Auth elements
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    authContainer: document.getElementById('authContainer'),
    dashboardContainer: document.getElementById('dashboardContainer'),
    
    // Input elements
    taskInput: document.getElementById('taskInput'),
    categorySelect: document.getElementById('categorySelect'),
    prioritySelect: document.getElementById('prioritySelect'),
    searchInput: document.getElementById('searchInput'),
    sortSelect: document.getElementById('sortSelect'),
    
    // Task elements
    tasksList: document.getElementById('tasksList'),
    tasksEmpty: document.getElementById('tasksEmpty'),
    
    // Stats
    totalTasks: document.getElementById('totalTasks'),
    completedTasks: document.getElementById('completedTasks'),
    pendingTasks: document.getElementById('pendingTasks'),
    dueTodayTasks: document.getElementById('dueTodayTasks'),
    
    // Header
    headerTitle: document.getElementById('headerTitle'),
    headerSubtitle: document.getElementById('headerSubtitle'),
    
    // Modal
    taskModal: document.getElementById('taskModal'),
    taskForm: document.getElementById('taskForm'),
    taskTitle: document.getElementById('taskTitle'),
    taskDescription: document.getElementById('taskDescription'),
    taskDueDate: document.getElementById('taskDueDate'),
    taskPriority: document.getElementById('taskPriority'),
    taskCategory: document.getElementById('taskCategory'),
    
    // Buttons
    addTaskBtn: document.getElementById('addTaskBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    addCategoryBtn: document.getElementById('addCategoryBtn'),
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    exportBtn: document.getElementById('exportBtn'),
    importBtn: document.getElementById('importBtn'),
    backupBtn: document.getElementById('backupBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // Categories
    categoriesList: document.getElementById('categoriesList'),
    navLinks: document.querySelectorAll('.nav-link'),
    categoryItems: document.querySelectorAll('.category-item'),
    filterButtons: document.querySelectorAll('.filter-btn'),
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard initialized');
    
    // Check if user is already logged in
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
        AppState.token = savedToken;
        verifyToken();
    } else {
        showAuthScreen();
    }
});

function showAuthScreen() {
    if (DOM.authContainer) DOM.authContainer.style.display = 'flex';
    if (DOM.dashboardContainer) DOM.dashboardContainer.style.display = 'none';
    setupAuthEventListeners();
}

function showDashboard() {
    if (DOM.authContainer) DOM.authContainer.style.display = 'none';
    if (DOM.dashboardContainer) DOM.dashboardContainer.style.display = 'flex';
    setupEventListeners();
    loadTasks();
    updateStats();
    updateDate();
}

// ============================================
// AUTHENTICATION
// ============================================

function setupAuthEventListeners() {
    if (DOM.loginBtn) {
        DOM.loginBtn.addEventListener('click', handleLogin);
    }
    if (DOM.registerBtn) {
        DOM.registerBtn.addEventListener('click', handleRegister);
    }
}

async function handleLogin() {
    const email = document.getElementById('loginEmail')?.value?.trim();
    const password = document.getElementById('loginPassword')?.value?.trim();

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Login failed');
            return;
        }

        AppState.token = data.token;
        AppState.user = { id: data.userId, username: data.username };
        AppState.isAuthenticated = true;

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(AppState.user));

        showDashboard();
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
}

async function handleRegister() {
    const username = document.getElementById('registerUsername')?.value?.trim();
    const email = document.getElementById('registerEmail')?.value?.trim();
    const password = document.getElementById('registerPassword')?.value?.trim();
    const confirmPassword = document.getElementById('registerConfirmPassword')?.value?.trim();

    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Registration failed');
            return;
        }

        AppState.token = data.token;
        AppState.user = { id: data.userId, username };
        AppState.isAuthenticated = true;

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(AppState.user));

        showDashboard();
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed: ' + error.message);
    }
}

async function verifyToken() {
    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${AppState.token}`,
            },
        });

        if (!response.ok) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            showAuthScreen();
            return;
        }

        const data = await response.json();
        AppState.user = data.user;
        AppState.isAuthenticated = true;
        showDashboard();
    } catch (error) {
        console.error('Token verification error:', error);
        localStorage.removeItem('authToken');
        showAuthScreen();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        AppState.token = null;
        AppState.user = null;
        AppState.isAuthenticated = false;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        showAuthScreen();
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Add task
    if (DOM.addTaskBtn) {
        DOM.addTaskBtn.addEventListener('click', addTask);
    }
    if (DOM.taskInput) {
        DOM.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
    }

    // Modal
    if (DOM.taskForm) {
        DOM.taskForm.addEventListener('submit', saveTaskEdit);
    }
    if (DOM.cancelBtn) {
        DOM.cancelBtn.addEventListener('click', closeModal);
    }
    document.querySelector('.close')?.addEventListener('click', closeModal);

    // Filters
    DOM.filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            DOM.filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            AppState.currentFilter = button.getAttribute('data-filter');
            renderTasks();
        });
    });

    // Sidebar navigation
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            DOM.navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const filter = link.getAttribute('data-filter');
            AppState.currentFilter = filter;
            updateHeaderByFilter(filter);
            renderTasks();
        });
    });

    // Categories
    DOM.categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            DOM.categoryItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            AppState.currentCategory = item.getAttribute('data-category');
            renderTasks();
        });
    });

    // Search
    if (DOM.searchInput) {
        DOM.searchInput.addEventListener('input', renderTasks);
    }

    // Sort
    if (DOM.sortSelect) {
        DOM.sortSelect.addEventListener('change', (e) => {
            AppState.currentSort = e.target.value;
            renderTasks();
        });
    }

    // Add category
    if (DOM.addCategoryBtn) {
        DOM.addCategoryBtn.addEventListener('click', addCategory);
    }

    // Export/Import/Backup buttons
    if (DOM.exportBtn) {
        DOM.exportBtn.addEventListener('click', exportTasks);
    }
    if (DOM.importBtn) {
        DOM.importBtn.addEventListener('click', triggerImport);
    }
    if (DOM.backupBtn) {
        DOM.backupBtn.addEventListener('click', createBackup);
    }
    if (DOM.logoutBtn) {
        DOM.logoutBtn.addEventListener('click', logout);
    }
}

// ============================================
// TASK MANAGEMENT
// ============================================

async function addTask() {
    const title = DOM.taskInput?.value?.trim();
    const category = DOM.categorySelect?.value || 'work';
    const priority = DOM.prioritySelect?.value || 'medium';

    if (!title) {
        alert('Please enter a task title');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.token}`,
            },
            body: JSON.stringify({
                title,
                category,
                priority,
                dueDate: getTodayDate(),
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Failed to create task');
            return;
        }

        AppState.tasks.push(data.task);
        if (DOM.taskInput) DOM.taskInput.value = '';
        updateStats();
        renderTasks();
    } catch (error) {
        console.error('Add task error:', error);
        alert('Failed to create task: ' + error.message);
    }
}

async function toggleTaskComplete(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.token}`,
            },
            body: JSON.stringify({
                completed: !task.completed,
            }),
        });

        if (!response.ok) {
            alert('Failed to update task');
            return;
        }

        task.completed = !task.completed;
        updateStats();
        renderTasks();
    } catch (error) {
        console.error('Toggle task error:', error);
    }
}

async function toggleTaskImportant(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.token}`,
            },
            body: JSON.stringify({
                important: !task.important,
            }),
        });

        if (!response.ok) {
            alert('Failed to update task');
            return;
        }

        task.important = !task.important;
        renderTasks();
    } catch (error) {
        console.error('Toggle important error:', error);
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AppState.token}`,
            },
        });

        if (!response.ok) {
            alert('Failed to delete task');
            return;
        }

        AppState.tasks = AppState.tasks.filter(t => t.id !== taskId);
        updateStats();
        renderTasks();
    } catch (error) {
        console.error('Delete task error:', error);
        alert('Failed to delete task: ' + error.message);
    }
}

function editTask(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (!task) return;

    AppState.isEditMode = true;
    AppState.editingTaskId = taskId;

    if (DOM.taskTitle) DOM.taskTitle.value = task.title;
    if (DOM.taskDescription) DOM.taskDescription.value = task.description || '';
    if (DOM.taskDueDate) DOM.taskDueDate.value = task.due_date || '';
    if (DOM.taskPriority) DOM.taskPriority.value = task.priority;
    if (DOM.taskCategory) DOM.taskCategory.value = task.category;

    openModal();
}

async function saveTaskEdit(e) {
    e.preventDefault();

    if (!AppState.isEditMode || !AppState.editingTaskId) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${AppState.editingTaskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.token}`,
            },
            body: JSON.stringify({
                title: DOM.taskTitle?.value?.trim(),
                description: DOM.taskDescription?.value?.trim(),
                dueDate: DOM.taskDueDate?.value,
                priority: DOM.taskPriority?.value,
                category: DOM.taskCategory?.value,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Failed to update task');
            return;
        }

        const index = AppState.tasks.findIndex(t => t.id === AppState.editingTaskId);
        if (index !== -1) {
            AppState.tasks[index] = data.task;
        }

        updateStats();
        renderTasks();
        closeModal();
    } catch (error) {
        console.error('Save task error:', error);
        alert('Failed to save task: ' + error.message);
    }
}

// ============================================
// RENDERING
// ============================================

function renderTasks() {
    let filteredTasks = [...AppState.tasks];

    // Search filter
    const searchTerm = DOM.searchInput?.value?.toLowerCase() || '';
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(t =>
            t.title.toLowerCase().includes(searchTerm) ||
            (t.description && t.description.toLowerCase().includes(searchTerm))
        );
    }

    // Category filter
    if (AppState.currentCategory && AppState.currentCategory !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.category === AppState.currentCategory);
    }

    // Status filter
    const activeButton = document.querySelector('.filter-btn.active');
    if (activeButton) {
        const filterType = activeButton.getAttribute('data-filter');
        if (filterType === 'pending') {
            filteredTasks = filteredTasks.filter(t => !t.completed);
        } else if (filterType === 'completed') {
            filteredTasks = filteredTasks.filter(t => t.completed);
        }
    }

    // Sort
    sortTasks(filteredTasks);

    if (filteredTasks.length === 0) {
        if (DOM.tasksEmpty) DOM.tasksEmpty.style.display = 'block';
        if (DOM.tasksList) DOM.tasksList.innerHTML = '';
        return;
    }

    if (DOM.tasksEmpty) DOM.tasksEmpty.style.display = 'none';
    if (DOM.tasksList) {
        DOM.tasksList.innerHTML = filteredTasks.map(task => createTaskElement(task)).join('');
    }

    attachTaskEventListeners();
}

function sortTasks(tasks) {
    const sortBy = DOM.sortSelect?.value || AppState.currentSort;

    tasks.sort((a, b) => {
        switch (sortBy) {
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'created':
                return new Date(b.created_at) - new Date(a.created_at);
            case 'date':
            default:
                return new Date(a.due_date) - new Date(b.due_date);
        }
    });
}

function createTaskElement(task) {
    const isToday = task.due_date === getTodayDate();
    const isOverdue = new Date(task.due_date) < new Date(getTodayDate()) && !task.completed;

    return `
        <div class="task-item priority-${task.priority} ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
            
            <div class="task-content">
                <div class="task-header">
                    <span class="task-title" data-task-id="${task.id}">${escapeHtml(task.title)}</span>
                </div>
                
                <div class="task-metadata">
                    <span class="priority-badge ${task.priority}">${task.priority.toUpperCase()}</span>
                    <span class="category-badge ${task.category}">${capitalize(task.category)}</span>
                    ${isToday ? '<span class="task-meta-item"><i class="fas fa-clock"></i> Today</span>' : ''}
                    ${isOverdue ? '<span class="task-meta-item" style="color: #d13438;"><i class="fas fa-exclamation-circle"></i> Overdue</span>' : ''}
                    ${task.due_date && !isToday ? `<span class="task-meta-item"><i class="fas fa-calendar"></i> ${formatDate(task.due_date)}</span>` : ''}
                </div>
            </div>
            
            <div class="task-actions">
                <button class="task-btn important ${task.important ? 'active' : ''}" data-task-id="${task.id}" title="Mark as important">
                    <i class="fas fa-star"></i>
                </button>
                <button class="task-btn edit" data-task-id="${task.id}" title="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-btn delete" data-task-id="${task.id}" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function attachTaskEventListeners() {
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            toggleTaskComplete(e.target.dataset.taskId);
        });
    });

    document.querySelectorAll('.task-btn.important').forEach(btn => {
        btn.addEventListener('click', (e) => {
            toggleTaskImportant(e.target.closest('.task-btn').dataset.taskId);
        });
    });

    document.querySelectorAll('.task-btn.edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            editTask(e.target.closest('.task-btn').dataset.taskId);
        });
    });

    document.querySelectorAll('.task-btn.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            deleteTask(e.target.closest('.task-btn').dataset.taskId);
        });
    });

    document.querySelectorAll('.task-title').forEach(title => {
        title.addEventListener('click', (e) => {
            editTask(e.target.dataset.taskId);
        });
    });
}

// ============================================
// STATS & UPDATES
// ============================================

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${AppState.token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Failed to load tasks');
            return;
        }

        AppState.tasks = data.tasks;
        renderTasks();
    } catch (error) {
        console.error('Load tasks error:', error);
        alert('Failed to load tasks: ' + error.message);
    }
}

async function updateStats() {
    try {
        const response = await fetch(`${API_URL}/stats`, {
            headers: {
                'Authorization': `Bearer ${AppState.token}`,
            },
        });

        if (!response.ok) return;

        const { stats } = await response.json();

        if (DOM.totalTasks) DOM.totalTasks.textContent = stats.totalTasks;
        if (DOM.completedTasks) DOM.completedTasks.textContent = stats.completedTasks;
        if (DOM.pendingTasks) DOM.pendingTasks.textContent = stats.pendingTasks;
        if (DOM.dueTodayTasks) DOM.dueTodayTasks.textContent = stats.dueTodayTasks;
    } catch (error) {
        console.error('Update stats error:', error);
    }
}

function updateHeaderByFilter(filter) {
    const titles = {
        all: 'My Day',
        important: 'Important',
        today: 'Today',
        upcoming: 'Upcoming'
    };

    if (DOM.headerTitle) DOM.headerTitle.textContent = titles[filter] || 'My Day';
}

function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    if (DOM.headerSubtitle) {
        DOM.headerSubtitle.textContent = today.toLocaleDateString('en-US', options);
    }
}

// ============================================
// EXPORT/IMPORT
// ============================================

async function exportTasks() {
    try {
        const response = await fetch(`${API_URL}/export/tasks`, {
            headers: {
                'Authorization': `Bearer ${AppState.token}`,
            },
        });

        if (!response.ok) {
            alert('Failed to export tasks');
            return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-export-${Date.now()}.json`;
        link.click();
        window.URL.revokeObjectURL(url);

        alert('Tasks exported successfully!');
    } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export tasks: ' + error.message);
    }
}

async function createBackup() {
    try {
        const response = await fetch(`${API_URL}/export/backup`, {
            headers: {
                'Authorization': `Bearer ${AppState.token}`,
            },
        });

        if (!response.ok) {
            alert('Failed to create backup');
            return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup-${Date.now()}.json`;
        link.click();
        window.URL.revokeObjectURL(url);

        alert('Backup created successfully!');
    } catch (error) {
        console.error('Backup error:', error);
        alert('Failed to create backup: ' + error.message);
    }
}

function triggerImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', handleImport);
    input.click();
}

async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const content = await file.text();
        const data = JSON.parse(content);

        let tasksToImport = data.tasks || data;
        if (!Array.isArray(tasksToImport)) {
            tasksToImport = [tasksToImport];
        }

        const response = await fetch(`${API_URL}/import/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.token}`,
            },
            body: JSON.stringify({ tasks: tasksToImport }),
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || 'Failed to import tasks');
            return;
        }

        alert(`Successfully imported ${result.importedCount} tasks!`);
        loadTasks();
        updateStats();
    } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import tasks: ' + error.message);
    }
}

async function addCategory() {
    const categoryName = prompt('Enter category name:');
    if (categoryName && categoryName.trim()) {
        try {
            const response = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AppState.token}`,
                },
                body: JSON.stringify({
                    name: categoryName.trim(),
                    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
                }),
            });

            if (!response.ok) {
                alert('Failed to create category');
                return;
            }

            alert('Category created successfully!');
            location.reload();
        } catch (error) {
            console.error('Add category error:', error);
        }
    }
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal() {
    if (DOM.taskModal) {
        DOM.taskModal.classList.add('show');
    }
}

function closeModal() {
    if (DOM.taskModal) {
        DOM.taskModal.classList.remove('show');
    }
    if (DOM.taskForm) {
        DOM.taskForm.reset();
    }
    AppState.isEditMode = false;
    AppState.editingTaskId = null;
}

window.addEventListener('click', (e) => {
    if (DOM.taskModal && e.target === DOM.taskModal) {
        closeModal();
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date(getTodayDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateString === getTodayDate()) {
        return 'Today';
    } else if (date.toISOString().split('T')[0] === tomorrow.toISOString().split('T')[0]) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// EXPORT FOR DEBUGGING
// ============================================

window.AppDebug = {
    getState: () => AppState,
    getTasks: () => AppState.tasks,
    exportTasks: () => JSON.stringify(AppState.tasks, null, 2)
};

console.log('Dashboard ready. Use AppDebug to inspect state.');
