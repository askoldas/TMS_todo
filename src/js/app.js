import { Modal } from 'bootstrap'
import { clock } from './clock.js'
import { updateCounters } from './counters.js'
import { getData, setData } from './data.js'
import { TodoItem } from './constructors.js'

// Variables

let data = getData()
let currentEditId = null
let currentDeleteId = null

// Add Event Listeners directly to the buttons
document.querySelector('.add-todo').addEventListener('click', handleAddTodoButtonClick);
document.querySelector('.save-todo').addEventListener('click', handleSaveNewTodo);
document.querySelector('.confirm-delete-todo').addEventListener('click', handleConfirmDeleteTodo);
document.querySelector('.clear-completed').addEventListener('click', handleClearCompletedButtonClick);
document.querySelector('.confirm-clear-completed').addEventListener('click', handleConfirmClearCompleted);

// Handlers

function handleAddTodoButtonClick() {
    currentEditId = null;
    document.getElementById('addTodoForm').reset();
    new Modal(document.getElementById('addTodoModal')).show();
}

function handleClearCompletedButtonClick() {
    new Modal(document.getElementById('clearCompletedModal')).show();
}

function handleOpenEditModal(todo) {
    currentEditId = todo.id;
    populateEditModalFields(todo);
    new Modal(document.getElementById('editTodoModal')).show();
}

function handleOpenDeleteModal(todoId) {
    currentDeleteId = todoId;
    new Modal(document.getElementById('deleteTodoModal')).show();
}

function handleSaveNewTodo() {
    const form = document.getElementById('addTodoForm');
    const formData = new FormData(form);
    const title = formData.get('title');
    const description = formData.get('description');

    if (title && description) {
        const newTodo = new TodoItem(title, description);
        data.push(newTodo);
        setData(data);
        renderTodos();

        form.reset();
        new Modal(document.getElementById('addTodoModal')).hide();

        updateCounters(data);
    } else {
        alert('Please fill in both the title and description!');
    }
}

function handleSaveEditTodo() {
    const form = document.getElementById('editTodoForm');
    const formData = new FormData(form);
    const title = formData.get('title');
    const description = formData.get('description');

    if (title && description) {
        data = data.map(todo => {
            if (todo.id === currentEditId) {
                todo.title = title;
                todo.description = description;
            }
            return todo;
        });

        setData(data);
        renderTodos();

        form.reset();
        new Modal(document.getElementById('editTodoModal')).hide();
    } else {
        alert('Please fill in both the title and description!');
    }
}

function handleConfirmDeleteTodo() {
    data = data.filter(todo => todo.id !== currentDeleteId);
    setData(data);
    renderTodos();
    new Modal(document.getElementById('deleteTodoModal')).hide();
}

function handleConfirmClearCompleted() {
    data = data.filter(todo => todo.status !== 'done');
    setData(data);
    renderTodos();
    new Modal(document.getElementById('clearCompletedModal')).hide();
}

// Functions

function renderTodos() {
    clearTodoContainers();

    data.forEach(todo => {
        const todoElement = buildTodoElement(todo);

        if (todo.status === 'todo') {
            document.querySelector('.todo-placeholder.todo-todo').append(todoElement);
        } else if (todo.status === 'in-progress') {
            document.querySelector('.todo-placeholder.todo-in-progress').append(todoElement);
        } else if (todo.status === 'done') {
            document.querySelector('.todo-placeholder.todo-done').append(todoElement);
        }
    });

    updateCounters(data);
}

function changeTodoStatus(id, newStatus) {
    data = data.map(todo => {
        if (todo.id === id) {
            todo.status = newStatus;
        }
        return todo;
    });

    setData(data);
    renderTodos();
}

// Build Todo
function buildTodoElement(todo) {
    const div = document.createElement('div');
    div.classList.add('todo-item', todo.status);
    div.setAttribute('data-id', todo.id);

    div.innerHTML = `
        <div class="actions">
            <button class="btn btn-sm btn-info edit-btn">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn">Delete</button>
        </div>
        <h5>${todo.title}</h5>
        <p>${todo.description}</p>
        <div>
            <label>
                <input type="radio" name="status-${todo.id}" value="todo" ${todo.status === 'todo' ? 'checked' : ''}> Todo
            </label>
            <label>
                <input type="radio" name="status-${todo.id}" value="in-progress" ${todo.status === 'in-progress' ? 'checked' : ''}> In Progress
            </label>
            <label>
                <input type="radio" name="status-${todo.id}" value="done" ${todo.status === 'done' ? 'checked' : ''}> Done
            </label>
        </div>
        <span class="todo-date">${todo.createdAt}</span>
    `;

    div.querySelector('.edit-btn').addEventListener('click', () => handleOpenEditModal(todo));
    div.querySelector('.delete-btn').addEventListener('click', () => handleOpenDeleteModal(todo.id));

    const radioButtons = div.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            const newStatus = this.value;
            changeTodoStatus(todo.id, newStatus);
        });
    });

    return div;
}

// Helper functions 
function populateEditModalFields(todo) {
    const form = document.getElementById('editTodoForm');
    form.elements['title'].value = todo.title;
    form.elements['description'].value = todo.description;
}

function clearTodoContainers() {
    document.querySelector('.todo-placeholder.todo-todo').innerHTML = '';
    document.querySelector('.todo-placeholder.todo-in-progress').innerHTML = '';
    document.querySelector('.todo-placeholder.todo-done').innerHTML = '';
}

// Initial Render
renderTodos();
