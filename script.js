document.addEventListener('DOMContentLoaded', loadTasksFromStorage);

let editingTask = null; // Variable to keep track of the task being edited

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

    if (editingTask) {
        // Update existing task
        updateTaskInList(editingTask, task);
        updateTaskInLocalStorage(editingTask, task);
        editingTask = null; // Reset editing task
    } else {
        // Add new task
        addTaskToList(task);
        saveTaskToLocalStorage(task);
    }

    // Reset form
    document.getElementById('task-form').reset();
});
//sort task by due date
function sortTasksByDueDate() {
    const tasks = getTasksFromLocalStorage();
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort by due date
    clearTaskList(); // Clear existing list
    tasks.forEach(task => addTaskToList(task)); // Re-add sorted tasks to the list
}
function clearTaskList() {
    const taskList = document.getElementById('task-list');
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
}
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
// Function to insert task in order based on due date
function insertTaskInOrder(listItem, dueDate) {
    const taskList = document.getElementById('task-list');
    const tasks = Array.from(taskList.children);
    
    // Find the correct position to insert the new task
    for (let i = 0; i < tasks.length; i++) {
        const currentDueDate = tasks[i].querySelector('em').textContent.match(/Due: (.+) \|/)[1];
        if (new Date(dueDate) < new Date(currentDueDate)) {
            taskList.insertBefore(listItem, tasks[i]);
            return; // Exit the function after inserting
        }
    }
    // If the new task is the latest, append it to the end
    taskList.appendChild(listItem);
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

    // Mark the task as completed in the UI if it's already completed
    if (task.completed) {
        listItem.classList.add('completed');
    }

    // Insert the new task in the correct position based on due date
    insertTaskInOrder(listItem, task.dueDate);
}

function updateTaskInList(originalTask, updatedTask) {
    const taskItems = document.querySelectorAll('#task-list li');
    taskItems.forEach(item => {
        const titleText = item.querySelector('strong').textContent;
        if (titleText === originalTask.title) {
            // Update the displayed task details
            item.innerHTML = `<span class="task-details"><strong>${updatedTask.title}</strong>: ${updatedTask.description} <br> <em>Due: ${updatedTask.dueDate} | Category: ${updatedTask.category}</em></span>`;

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
                item.classList.toggle('completed');
                updateTaskCompletionStatus(updatedTask.title);
            });

            deleteButton.addEventListener('click', function() {
                item.remove();
                removeTaskFromLocalStorage(updatedTask.title);
            });

            editButton.addEventListener('click', function() {
                editTask(updatedTask);
            });

            taskButtons.appendChild(checkButton);
            taskButtons.appendChild(editButton);
            taskButtons.appendChild(deleteButton);
            item.appendChild(taskButtons);
        }
    });
}

function updateTaskInLocalStorage(originalTask, updatedTask) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.map(task => {
        if (task.title === originalTask.title) {
            return updatedTask; // Update the task
        }
        return task; // Keep the original task
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTask(task) {
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description;
    document.getElementById('task-due-date').value = task.dueDate;
    document.getElementById('task-category').value = task.category;
    document.getElementById('task-priority').value = task.priority;

    // Set the current task being edited
    editingTask = task; // This stores the reference to the task being edited
}

// Local storage functions
function saveTaskToLocalStorage(task) {
    let tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        addTaskToList(task);
    });
    sortTasksByDueDate(); // Sort tasks after loading
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