let tasks = []; 
let taskIdCounter = 1; 

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const themeToggle = document.getElementById('themeToggle');

function init() {
    loadTheme();
    
    loadTasks();
    
    renderTasks();
    
    updateCounter();
    
    setupEventListeners();
}

function setupEventListeners() {
    addBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    themeToggle.addEventListener('click', toggleTheme);
}

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Task tidak boleh kosong!');
        return;
    }
    
    const newTask = {
        id: taskIdCounter++,
        text: taskText,
        completed: false
    };
    
    tasks.push(newTask);
    
    saveTasks();
    
    renderTasks();
    
    updateCounter();
    
    taskInput.value = '';
    taskInput.focus();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    
    saveTasks();
    
    renderTasks();
    
    updateCounter();
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
    }
    
    saveTasks();
    
    renderTasks();
    
    updateCounter();
}

function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">Tidak ada task. Mulai tambahkan task baru!</div>
            </div>
        `;
        return;
    }
    
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})" aria-label="Hapus task">
                ✕
            </button>
        `;
        taskList.appendChild(taskItem);
    });
}

function updateCounter() {
    const activeTasksCount = tasks.filter(task => !task.completed).length;
    taskCounter.textContent = activeTasksCount;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('taskIdCounter', taskIdCounter);
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    const savedCounter = localStorage.getItem('taskIdCounter');
    
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        taskIdCounter = parseInt(savedCounter) || 1;
    } else {
        tasks = [
            { id: 1, text: 'Belajar JavaScript', completed: false },
            { id: 2, text: 'Membuat aplikasi To-Do List', completed: true },
            { id: 3, text: 'Olahraga pagi', completed: false }
        ];
        taskIdCounter = 4;
        saveTasks();
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = prefersDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    localStorage.setItem('theme', newTheme);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

init();