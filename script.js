let isEditing = false;  // Track if we are editing a task
let currentTaskTitle = '';  // To keep track of the current task being edited

// Load tasks from local storage when the DOM is ready
document.addEventListener('DOMContentLoaded', loadTasksFromStorage);

// Add task form submit event listener
document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-description').value.trim();
    const dueDate = document.getElementById('task-due-date').value;
    const category = document.getElementById('task-category').value;
    const priority = document.getElementById('task-priority').value;

    if (title === '' || description === '') {
        alert('Please enter both a task title and description.');
        return;
    }

    const task = {
        title,
        description,
        dueDate,
        category,
        priority,
        completed: false
    };

    if (isEditing) {
        // Remove the original task and replace with updated task
        updateTask(task);
    } else {
        // Add the new task to the list and local storage
        addTaskToList(task);
        saveTaskToLocalStorage(task);
    }

    // Reset form and editing state
    document.getElementById('task-form').reset();
    isEditing = false;
    currentTaskTitle = '';
});

// Search functionality for filtering tasks
document.getElementById('search-task').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(function(task) {
        const taskText = task.textContent.toLowerCase();
        if (taskText.includes(searchValue)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
});

// Filter tasks by category
document.getElementById('filter-all').addEventListener('click', function() {
    filterTasks('');
});
document.getElementById('filter-work').addEventListener('click', function() {
    filterTasks('Work');
});
document.getElementById('filter-personal').addEventListener('click', function() {
    filterTasks('Personal');
});
document.getElementById('filter-urgent').addEventListener('click', function() {
    filterTasks('Urgent');
});

function filterTasks(category) {
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(function(task) {
        const taskCategory = task.querySelector('em').textContent;
        if (category === '' || taskCategory.includes(category)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

// Add a task to the list in the UI
function addTaskToList(task) {
    const listItem = document.createElement('li');
    listItem.classList.add('task-item');
    listItem.innerHTML = `
        <span class="task-details">
            <strong>${task.title}</strong>: ${task.description}
            <br>
            <em>Due: ${task.dueDate} | Category: ${task.category}</em>
        </span>
    `;

    // Create buttons for each task
    const taskButtons = document.createElement('div');
    taskButtons.classList.add('task-buttons');

    const checkButton = document.createElement('button');
    checkButton.innerHTML = '<i class="fas fa-check"></i>';
    checkButton.classList.add('complete-btn');

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.classList.add('edit-btn');

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add('delete-btn');

    // Event listeners for buttons
    checkButton.addEventListener('click', function() {
        listItem.classList.toggle('completed');
        updateTaskCompletionStatus(task.title);
    });

    deleteButton.addEventListener('click', function() {
        listItem.remove();
        removeTaskFromLocalStorage(task.title);
    });

    editButton.addEventListener('click', function() {
        editTask(task);
    });

    taskButtons.appendChild(checkButton);
    taskButtons.appendChild(editButton);
    taskButtons.appendChild(deleteButton);

    listItem.appendChild(taskButtons);
    document.getElementById('task-list').appendChild(listItem);

    // Mark the task as completed in the UI if it's already completed
    if (task.completed) {
        listItem.classList.add('completed');
    }
}

// Update an existing task
function updateTask(task) {
    removeTaskFromLocalStorage(currentTaskTitle); 
    addTaskToList(task); 
    saveTaskToLocalStorage(task); 
}

// Local storage functions
function saveTaskToLocalStorage(task) {
    let tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach(addTaskToList);
}

function getTasksFromLocalStorage() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
}

function removeTaskFromLocalStorage(taskTitle) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.title !== taskTitle);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskCompletionStatus(taskTitle) {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        if (task.title === taskTitle) {
            task.completed = !task.completed;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Edit task function
function editTask(task) {
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description;
    document.getElementById('task-due-date').value = task.dueDate;
    document.getElementById('task-category').value = task.category;
    document.getElementById('task-priority').value = task.priority;

    isEditing = true; // Set editing state to true
    currentTaskTitle = task.title; // Store current task title for reference
}