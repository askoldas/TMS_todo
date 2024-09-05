import { Modal } from 'bootstrap'
import { clock } from './clock.js'

// Variables
let data = getData()
const addTodoButton = document.querySelector('.add-todo')
const saveTodoButton = document.querySelector('.save-todo')
const todoInputTitle = document.getElementById('todo-title')
const todoInputDescription = document.getElementById('todo-description')
const todoContainer = document.querySelector('.todo-placeholder.todo-todo')
const inProgressContainer = document.querySelector('.todo-placeholder.todo-in-progress')
const doneContainer = document.querySelector('.todo-placeholder.todo-done')

const addTodoModalElement = document.getElementById('addTodoModal')
const addTodoModal = new Modal(addTodoModalElement)

// Variables for Edit Modal
const editTodoModalElement = document.getElementById('editTodoModal')
const editTodoModal = new Modal(editTodoModalElement)
const editTodoInputTitle = document.getElementById('edit-todo-title')
const editTodoInputDescription = document.getElementById('edit-todo-description')
const saveEditTodoButton = document.querySelector('.save-edit-todo')

// Variables for Delete Modal
const deleteTodoModalElement = document.getElementById('deleteTodoModal')
const deleteTodoModal = new Modal(deleteTodoModalElement)
const confirmDeleteTodoButton = document.querySelector('.confirm-delete-todo')

// Variable to track the ID of the todo
let currentEditId = null
let currentDeleteId = null

// Listeners
addTodoButton.addEventListener('click', handleOpenModalForAdd)
saveTodoButton.addEventListener('click', handleSaveNewTodo)
saveEditTodoButton.addEventListener('click', handleSaveEditTodo)
confirmDeleteTodoButton.addEventListener('click', handleConfirmDeleteTodo)

// Handlers

function handleOpenModalForAdd() {
    currentEditId = null 
    clearModalFields()
    addTodoModal.show()
}

function handleOpenEditModal(todo) {
    currentEditId = todo.id
    populateEditModalFields(todo)
    editTodoModal.show()
}

function handleOpenDeleteModal(todoId) {
    currentDeleteId = todoId
    deleteTodoModal.show()
}

function handleSaveNewTodo() {
    const title = todoInputTitle.value.trim()
    const description = todoInputDescription.value.trim()

    if (title && description) {
        const newTodo = new TodoItem(title, description)
        data.push(newTodo)
        setData(data)
        renderTodos()

        todoInputTitle.value = ''
        todoInputDescription.value = ''
        addTodoModal.hide()
    } else {
        alert('Please fill in both the title and description!')
    }
}

function handleSaveEditTodo() {
    const title = editTodoInputTitle.value.trim()
    const description = editTodoInputDescription.value.trim()

    if (title && description) {
        data = data.map(todo => {
            if (todo.id === currentEditId) {
                todo.title = title
                todo.description = description
            }
            return todo
        })

        setData(data)
        renderTodos()

        clearEditModalFields()
        editTodoModal.hide()
    } else {
        alert('Please fill in both the title and description!')
    }
}

function handleConfirmDeleteTodo() {
    data = data.filter(todo => todo.id !== currentDeleteId)
    setData(data)
    renderTodos()
    deleteTodoModal.hide()
}

// Change status 
function changeTodoStatus(id, newStatus) {
    data = data.map(todo => {
        if (todo.id === id) {
            todo.status = newStatus
        }
        return todo
    })

    setData(data)
    renderTodos()
}

// Functions

function TodoItem(title, description) {
    this.id = crypto.randomUUID()
    this.title = title
    this.description = description
    this.status = 'todo'
    this.createdAt = new Date().toLocaleDateString()
}

function getData() {
    const storedTodos = localStorage.getItem('todos')
    return storedTodos ? JSON.parse(storedTodos) : []
}

function setData(data) {
    localStorage.setItem('todos', JSON.stringify(data))
}

function renderTodos() {
    // Clear containers before re-rendering
    todoContainer.innerHTML = ''
    inProgressContainer.innerHTML = ''
    doneContainer.innerHTML = ''

    // Render todos into their respective containers based on status
    data.forEach(todo => {
        const todoElement = buildTodoElement(todo)

        // Append todos to their respective containers
        if (todo.status === 'todo') {
            todoContainer.appendChild(todoElement)
        } else if (todo.status === 'in-progress') {
            inProgressContainer.appendChild(todoElement)
        } else if (todo.status === 'done') {
            doneContainer.appendChild(todoElement)
        }
    })

    // Attach event listeners to the dynamically created radio buttons
    attachEventListenersToRadioButtons()
}

// Build the HTML structure for a todo item
function buildTodoElement(todo) {
    const div = document.createElement('div')
    div.classList.add('todo-item', todo.status)
    div.setAttribute('data-id', todo.id)

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
    `

    // Attach edit and delete event listeners
    div.querySelector('.edit-btn').addEventListener('click', () => handleOpenEditModal(todo))
    div.querySelector('.delete-btn').addEventListener('click', () => handleOpenDeleteModal(todo.id))

    return div
}

// Attach event listeners to the radio buttons
function attachEventListenersToRadioButtons() {
    const radioButtons = document.querySelectorAll('input[type="radio"]')

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            const todoId = this.closest('.todo-item').getAttribute('data-id')
            const newStatus = this.value
            changeTodoStatus(todoId, newStatus)
        })
    })
}

// Helper functions for modal field handling
function populateEditModalFields(todo) {
    editTodoInputTitle.value = todo.title
    editTodoInputDescription.value = todo.description
}

function clearModalFields() {
    todoInputTitle.value = ''
    todoInputDescription.value = ''
}

function clearEditModalFields() {
    editTodoInputTitle.value = ''
    editTodoInputDescription.value = ''
}

// Render the todos when the app is first loaded
renderTodos()
