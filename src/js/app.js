import { Modal } from 'bootstrap'
import { clock } from './clock.js'
import { updateCounters } from './counters.js'

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

// Clear Completed
const clearCompletedButton = document.querySelector('.clear-completed')
const clearCompletedModalElement = document.getElementById('clearCompletedModal')
const clearCompletedModal = new Modal(clearCompletedModalElement)
const confirmClearCompletedButton = document.querySelector('.confirm-clear-completed')

// Listeners
addTodoButton.addEventListener('click', handleOpenModalForAdd)
saveTodoButton.addEventListener('click', handleSaveNewTodo)
saveEditTodoButton.addEventListener('click', handleSaveEditTodo)
confirmDeleteTodoButton.addEventListener('click', handleConfirmDeleteTodo)
clearCompletedButton.addEventListener('click', handleClearCompletedButtonClick)
confirmClearCompletedButton.addEventListener('click', handleConfirmClearCompleted)

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

function handleClearCompletedButtonClick() {
    clearCompletedModal.show()
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

        updateCounters(data)
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

function handleConfirmClearCompleted() {
    data = data.filter(todo => todo.status !== 'done')
    setData(data)
    renderTodos()
    clearCompletedModal.hide()
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
    todoContainer.innerHTML = ''
    inProgressContainer.innerHTML = ''
    doneContainer.innerHTML = ''

    data.forEach(todo => {
        const todoElement = buildTodoElement(todo)
        appendTodoToContainer(todo, todoElement)
    })

    updateCounters(data)
}

function appendTodoToContainer(todo, todoElement) {
    if (todo.status === 'todo') {
        todoContainer.append(todoElement)
    } else if (todo.status === 'in-progress') {
        inProgressContainer.append(todoElement)
    } else if (todo.status === 'done') {
        doneContainer.append(todoElement)
    }
}

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

// Build Todo
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

    div.querySelector('.edit-btn').addEventListener('click', () => handleOpenEditModal(todo))
    div.querySelector('.delete-btn').addEventListener('click', () => handleOpenDeleteModal(todo.id))

    const radioButtons = div.querySelectorAll('input[type="radio"]')
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            const newStatus = this.value
            changeTodoStatus(todo.id, newStatus)
        })
    })

    return div
}

// Helper functions 
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

// Initial Render
renderTodos()

// Clock
setInterval(clock, 1000)
clock()