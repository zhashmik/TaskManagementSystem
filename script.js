document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get task title and description
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;

    // Create a new list item
    const listItem = document.createElement('li');
    listItem.textContent = `${title}: ${description}`;

    // Add the list item to the task list
    document.getElementById('task-list').appendChild(listItem);

    // Clear the input fields
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
});