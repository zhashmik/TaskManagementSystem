document.addEventListener('DOMContentLoaded', loadTasksFromStorage);

document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
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

    addTaskToList(task);
    saveTaskToLocalStorage(task);

    // Reset form
    document.getElementById('task-form').reset();
});

// Search functionality
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

// Filter functionality
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

function addTaskToList(task) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span class="task-details"><strong>${task.title}</strong>: ${task.description} <br> <em>Due: ${task.dueDate} | Category: ${task.category}</em></span>`;

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

function editTask(task) {
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description;
    document.getElementById('task-due-date').value = task.dueDate;
    document.getElementById('task-category').value = task.category;
    document.getElementById('task-priority').value = task.priority;

    // Remove the old task and update it with the edited one when the form is submitted
    removeTaskFromLocalStorage(task.title);
}