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

    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-due-date').value = '';
    document.getElementById('task-category').value = '';
    document.getElementById('task-priority').value = '';
});

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

document.getElementById('filter-work').addEventListener('click', function() {
    filterTasks('Work');
});
document.getElementById('filter-personal').addEventListener('click', function() {
    filterTasks('Personal');
});
document.getElementById('filter-urgent').addEventListener('click', function() {
    filterTasks('Urgent');
});
document.getElementById('filter-all').addEventListener('click', function() {
    filterTasks('');
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
    listItem.classList.add(task.priority.toLowerCase() + '-priority');
    listItem.innerHTML = `<span><strong>${task.title}</strong>: ${task.description} <br> <em>Due: ${task.dueDate} | Category: ${task.category}</em></span>`;

    const checkButton = document.createElement('button');
    checkButton.innerHTML = '<i class="fas fa-check"></i>';
    checkButton.classList.add('complete-btn');