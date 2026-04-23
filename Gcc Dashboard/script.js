// ============================================
// TASK DASHBOARD - JAVASCRIPT
// ============================================

// State Management
const AppState = {
    tasks: [],
    currentFilter: 'all',
    currentCategory: 'work',
    currentSort: 'date',
    isEditMode: false,
    editingTaskId: null,
};

// DOM Elements
const DOM = {
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
    headerDate: document.getElementById('headerDate'),
    
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
    viewToggle: document.getElementById('viewToggle'),
    
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
    initializeApp();
    setupEventListeners();
    loadTasks();
    updateStats();
    updateDate();
});

function initializeApp() {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        AppState.tasks = JSON.parse(savedTasks);
    } else {
        // Sample tasks for demo
        AppState.tasks = [
            {
                id: 1,
                title: 'Review project proposal',
                description: 'Go through the new client proposal and prepare feedback',
                category: 'work',
                priority: 'high',
                dueDate: getTodayDate(),
                completed: false,
                important: true,
                createdAt: new Date().toISOString(),
            },
            {
                id: 2,
                title: 'Buy groceries',
                description: 'Milk, eggs, vegetables, bread',
                category: 'shopping',
                priority: 'medium',
                dueDate: getTodayDate(),
                completed: false,
                important: false,
                createdAt: new Date().toISOString(),
            },
            {
                id: 3,
                title: 'Team meeting preparation',
                description: 'Prepare slides and agenda',
                category: 'work',
                priority: 'high',
                dueDate: getDateInDays(1),
                completed: false,
                important: true,
                createdAt: new Date().toISOString(),
            },
        ];
        saveTasks();
    }
}

function setupEventListeners() {
    // Add task
    DOM.addTaskBtn.addEventListener('click', addTask);
    DOM.taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Modal
    DOM.taskForm.addEventListener('submit', saveTaskEdit);
    DOM.cancelBtn.addEventListener('click', closeModal);
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === DOM.taskModal) closeModal();
    });

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
    DOM.searchInput.addEventListener('input', renderTasks);

    // Sort
    DOM.sortSelect.addEventListener('change', (e) => {
        AppState.currentSort = e.target.value;
        renderTasks();
    });

    // Add category
    DOM.addCategoryBtn.addEventListener('click', addCategory);
}

// ============================================
// TASK MANAGEMENT
// ============================================

function addTask() {
    const title = DOM.taskInput.value.trim();
    const category = DOM.categorySelect.value;
    const priority = DOM.prioritySelect.value;

    if (!title) {
        alert('Please enter a task title');
        return;
    }

    const task = {
        id: Date.now(),
        title,
        description: '',
        category,
        priority,
        dueDate: getTodayDate(),
        completed: false,
        important: false,
        createdAt: new Date().toISOString(),
    };

    AppState.tasks.push(task);
    saveTasks();
    DOM.taskInput.value = '';
    updateStats();
    renderTasks();
}

function toggleTaskComplete(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        updateStats();
        renderTasks();
    }
}

function toggleTaskImportant(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (task) {
        task.important = !task.important;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        AppState.tasks = AppState.tasks.filter(t => t.id !== taskId);
        saveTasks();
        updateStats();
        renderTasks();
    }
}

function editTask(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (!task) return;

    AppState.isEditMode = true;
    AppState.editingTaskId = taskId;

    DOM.taskTitle.value = task.title;
    DOM.taskDescription.value = task.description;
    DOM.taskDueDate.value = task.dueDate;
    DOM.taskPriority.value = task.priority;
    DOM.taskCategory.value = task.category;

    openModal();
}

function saveTaskEdit(e) {
    e.preventDefault();

    if (AppState.isEditMode && AppState.editingTaskId) {
        const task = AppState.tasks.find(t => t.id === AppState.editingTaskId);
        if (task) {
            task.title = DOM.taskTitle.value.trim();
            task.description = DOM.taskDescription.value.trim();
            task.dueDate = DOM.taskDueDate.value;
            task.priority = DOM.taskPriority.value;
            task.category = DOM.taskCategory.value;

            saveTasks();
            updateStats();
            renderTasks();
            closeModal();
        }
    }

    AppState.isEditMode = false;
    AppState.editingTaskId = null;
}

// ============================================
// RENDERING
// ============================================

function renderTasks() {
    let filteredTasks = filterTasks();
    sortTasks(filteredTasks);

    if (filteredTasks.length === 0) {
        DOM.tasksEmpty.style.display = 'block';
        DOM.tasksList.innerHTML = '';
        return;
    }

    DOM.tasksEmpty.style.display = 'none';
    DOM.tasksList.innerHTML = filteredTasks.map(task => createTaskElement(task)).join('');

    // Add event listeners to task elements
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            toggleTaskComplete(parseInt(e.target.dataset.taskId));
        });
    });

    document.querySelectorAll('.task-btn.important').forEach(btn => {
        btn.addEventListener('click', (e) => {
            toggleTaskImportant(parseInt(e.target.closest('.task-btn').dataset.taskId));
        });
    });

    document.querySelectorAll('.task-btn.edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            editTask(parseInt(e.target.closest('.task-btn').dataset.taskId));
        });
    });

    document.querySelectorAll('.task-btn.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            deleteTask(parseInt(e.target.closest('.task-btn').dataset.taskId));
        });
    });

    document.querySelectorAll('.task-title').forEach(title => {
        title.addEventListener('click', (e) => {
            editTask(parseInt(e.target.dataset.taskId));
        });
    });
}

function filterTasks() {
    let filtered = AppState.tasks;

    // Search filter
    const searchTerm = DOM.searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(t =>
            t.title.toLowerCase().includes(searchTerm) ||
            t.description.toLowerCase().includes(searchTerm)
        );
    }

    // Filter by category (sidebar)
    if (AppState.currentCategory !== 'all') {
        filtered = filtered.filter(t => t.category === AppState.currentCategory);
    }

    // Filter by status/type
    switch (DOM.tasksList.closest('.tasks-container')?.parentElement?.querySelector?.('[data-filter="pending"]')?.parentElement?.querySelector?.('.active')?.getAttribute?.('data-filter') || AppState.currentFilter) {
        case 'pending':
            filtered = filtered.filter(t => !t.completed);
            break;
        case 'completed':
            filtered = filtered.filter(t => t.completed);
            break;
        case 'important':
            filtered = filtered.filter(t => t.important && !t.completed);
            break;
        case 'today':
            filtered = filtered.filter(t => t.dueDate === getTodayDate());
            break;
        case 'upcoming':
            filtered = filtered.filter(t => new Date(t.dueDate) > new Date(getTodayDate()));
            break;
    }

    // Check for active filter button
    const activeButton = document.querySelector('.filter-btn.active');
    if (activeButton) {
        const filterType = activeButton.getAttribute('data-filter');
        if (filterType === 'pending') {
            filtered = filtered.filter(t => !t.completed);
        } else if (filterType === 'completed') {
            filtered = filtered.filter(t => t.completed);
        }
    }

    return filtered;
}

function sortTasks(tasks) {
    const sortBy = DOM.sortSelect.value || AppState.currentSort;

    tasks.sort((a, b) => {
        switch (sortBy) {
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'created':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'date':
            default:
                return new Date(a.dueDate) - new Date(b.dueDate);
        }
    });
}

function createTaskElement(task) {
    const isToday = task.dueDate === getTodayDate();
    const isOverdue = new Date(task.dueDate) < new Date(getTodayDate()) && !task.completed;

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
                    ${task.dueDate && !isToday ? `<span class="task-meta-item"><i class="fas fa-calendar"></i> ${formatDate(task.dueDate)}</span>` : ''}
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

// ============================================
// STATS & UPDATES
// ============================================

function updateStats() {
    const total = AppState.tasks.length;
    const completed = AppState.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const dueToday = AppState.tasks.filter(t => t.dueDate === getTodayDate() && !t.completed).length;

    DOM.totalTasks.textContent = total;
    DOM.completedTasks.textContent = completed;
    DOM.pendingTasks.textContent = pending;
    DOM.dueTodayTasks.textContent = dueToday;

    // Update category counts
    DOM.categoryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const count = AppState.tasks.filter(t => t.category === category && !t.completed).length;
        const countSpan = item.querySelector('.task-count');
        if (countSpan) {
            countSpan.textContent = count;
        }
    });
}

function updateHeaderByFilter(filter) {
    const titles = {
        all: 'My Day',
        important: 'Important',
        today: 'Today',
        upcoming: 'Upcoming'
    };

    DOM.headerTitle.textContent = titles[filter] || 'My Day';
}

function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    DOM.headerSubtitle.textContent = today.toLocaleDateString('en-US', options);
}

function addCategory() {
    const categoryName = prompt('Enter category name:');
    if (categoryName && categoryName.trim()) {
        const newCategory = categoryName.trim().toLowerCase();
        const categoryExists = Array.from(DOM.categoryItems).some(
            item => item.getAttribute('data-category') === newCategory
        );

        if (!categoryExists) {
            const li = document.createElement('li');
            li.className = 'category-item';
            li.setAttribute('data-category', newCategory);
            li.innerHTML = `
                <i class="fas fa-circle" style="color: #${Math.floor(Math.random()*16777215).toString(16)};"></i>
                <span>${capitalize(newCategory)}</span>
                <span class="task-count">0</span>
            `;
            li.addEventListener('click', () => {
                DOM.categoryItems.forEach(i => i.classList.remove('active'));
                li.classList.add('active');
                AppState.currentCategory = newCategory;
                renderTasks();
            });
            DOM.categoriesList.appendChild(li);

            // Add option to select dropdowns
            [DOM.categorySelect, DOM.taskCategory].forEach(select => {
                const option = document.createElement('option');
                option.value = newCategory;
                option.textContent = capitalize(newCategory);
                select.appendChild(option);
            });
        }
    }
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal() {
    DOM.taskModal.classList.add('show');
}

function closeModal() {
    DOM.taskModal.classList.remove('show');
    DOM.taskForm.reset();
    AppState.isEditMode = false;
    AppState.editingTaskId = null;
}

// ============================================
// STORAGE
// ============================================

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(AppState.tasks));
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getDateInDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

function formatDate(dateString) {
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
    clearTasks: () => {
        AppState.tasks = [];
        saveTasks();
        location.reload();
    },
    exportTasks: () => JSON.stringify(AppState.tasks, null, 2)
};

console.log('Use AppDebug.getTasks() to view all tasks');
