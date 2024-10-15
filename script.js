document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get task title and description
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;

    if (title === '' || description === '') {
        alert('Please enter both a task title and description.');
        return;
    }

    // Create a new list item
    const listItem = document.createElement('li');

    // Create the task content
    const taskContent = document.createElement('span');
    taskContent.textContent = `${title}: ${description}`;
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

    // Event listener for marking tasks as complete
    checkButton.addEventListener('click', function() {
        listItem.classList.toggle('completed');
    });

    // Event listener for editing tasks
    editButton.addEventListener('click', function() {
        const newTitle = prompt('Edit task title:', title);
        const newDescription = prompt('Edit task description:', description);
        if (newTitle !== null && newDescription !== null) {
            taskContent.textContent = `${newTitle}: ${newDescription}`;
        }
    });

    // Event listener for deleting tasks
    deleteButton.addEventListener('click', function() {
        listItem.remove();
    });
});