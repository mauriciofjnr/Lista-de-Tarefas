document.getElementById('task-form').addEventListener('submit', addTask);
document.addEventListener('DOMContentLoaded', loadTasks);

function removeAccentAndApplyLowerCase(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

function addTask(e) {
    e.preventDefault();

    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();

    const allListItems = document.querySelectorAll('li');

    const allListItemsData = []

    allListItems.forEach((tag) => {
        allListItemsData.push(removeAccentAndApplyLowerCase(tag.textContent))
    })

    if (taskText === '') {
        alert('Por favor adicione uma tarefa');
    } else if (allListItemsData.includes(removeAccentAndApplyLowerCase(`${taskText}X`))) {
        alert('Tarefa já adicionada');
        taskInput.value = '';
        return
    } else {
        addTaskToDOM(taskText);
        saveTaskToLocalStorage(taskText)
        taskInput.value = '';

    }
}

function addTaskToDOM(taskText, completed = false) {
    const listItem = document.createElement('li'); // <li></li>
    listItem.textContent = taskText; // <li>taskText</li>

    // if (completed) {
    //     li.classList.add('completed');
    // }

    listItem.addEventListener('click', toggleTaskCompletion);

    // <li onclick="toggleTaskCompletion">taskText</li>

    const deleteButton = document.createElement('button');

    deleteButton.textContent = 'X';  
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', deleteTask);

    listItem.appendChild(deleteButton);

    // <li onclick="toggleTaskCompletion">taskText<button>X</button></li>

    document.getElementById('task-list').appendChild(listItem);

    // <ul id="task-list">
    //     <li onclick="toggleTaskCompletion">taskText<button>X</button></li>
    // </ul>
}

function toggleTaskCompletion(e) {
    e.target.classList.toggle('completed');
}

function deleteTask(e) {
    const li = e.target.parentElement;
    const taskText = li.textContent.slice(0, -1);

    removeTaskFromLocalStorage(taskText);
    
    li.remove();
}


function getTasksFromLocalStorage () {
    return localStorage.getItem('tasks')
    ? JSON.parse(localStorage.getItem('tasks'))
    :[];
}

function saveTaskToLocalStorage(taskText) {
    const tasks = getTasksFromLocalStorage();
    tasks.push({ text: taskText, completed: false});
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskText) {
    const tasks = getTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(task => task.text === taskText);
    tasks.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasks () {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.completed);
    });
}