document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get task title, description, due date, and category
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    const category = document.getElementById('task-category').value;

    // Validate input
    if (title === '' || description === '') {
        alert('Please enter both a task title and description.');
        return;
    }

    // Create a new list item
    const listItem = document.createElement('li');

    // Create the task content
    const taskContent = document.createElement('span');
    taskContent.innerHTML = `<strong>${title}</strong>: ${description} <br> <em>Due: ${dueDate} | Category: ${category}</em>`;
    listItem.appendChild(taskContent);

    // Create a check button (task complete)
    const checkButton = document.createElement('button');
    checkButton.innerHTML = '<i class="fas fa-check"></i>';
    checkButton.classList.add('complete-btn');
    listItem.appendChild(checkButton);

    // Create an edit button
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.classList.add('edit-btn');
    listItem.appendChild(editButton);

    // Create a delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add('delete-btn');
    listItem.appendChild(deleteButton);

    // Add the list item to the task list
    document.getElementById('task-list').appendChild(listItem);

    // Clear the input fields
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-due-date').value = '';
    document.getElementById('task-category').value = '';

    // Event listener for marking tasks as complete
    checkButton.addEventListener('click', function() {
        listItem.classList.toggle('completed');
    });

    // Event listener for editing tasks
    editButton.addEventListener('click', function() {
        const newTitle = prompt('Edit task title:', title);
        const newDescription = prompt('Edit task description:', description);
        const newDueDate = prompt('Edit due date:', dueDate);
        const newCategory = prompt('Edit category:', category);
        if (newTitle !== null && newDescription !== null && newDueDate !== null && newCategory !== null) {
            taskContent.innerHTML = `<strong>${newTitle}</strong>: ${newDescription} <br> <em>Due: ${newDueDate} | Category: ${newCategory}</em>`;
        }
    }); // Close the edit button listener correctly

    // Event listener for deleting tasks
    deleteButton.addEventListener('click', function() {
        listItem.remove();
    });
});