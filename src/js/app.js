import { Modal } from 'bootstrap'
import { clock } from './clock.js'
import { updateCounters } from './counters.js'
import { getData, setData } from './data.js'

// Variables

let data = getData()
let currentEditId = null
let currentDeleteId = null

const todoContainer = document.querySelector('.todo-placeholder.todo-todo')
const inProgressContainer = document.querySelector('.todo-placeholder.todo-in-progress')
const doneContainer = document.querySelector('.todo-placeholder.todo-done')

// Variables Add Todo Modal
const addTodoModalElement = document.getElementById('addTodoModal')
const addTodoModal = new Modal(addTodoModalElement)
const addTodoButton = document.querySelector('.add-todo')
const saveTodoButton = document.querySelector('.save-todo')

// Variables Edit Todo Modal
const editTodoModalElement = document.getElementById('editTodoModal')
const editTodoModal = new Modal(editTodoModalElement)
const saveEditTodoButton = document.querySelector('.save-edit-todo')

// Variables Delete Todo Modal
const deleteTodoModalElement = document.getElementById('deleteTodoModal')
const deleteTodoModal = new Modal(deleteTodoModalElement)
const confirmDeleteTodoButton = document.querySelector('.confirm-delete-todo')

// Variables Clear Completed Modal
const clearCompletedModalElement = document.getElementById('clearCompletedModal')
const clearCompletedModal = new Modal(clearCompletedModalElement)
const clearCompletedButton = document.querySelector('.clear-completed')
const confirmClearCompletedButton = document.querySelector('.confirm-clear-completed')

// Listeners

addTodoButton.addEventListener('click', handleAddTodoButtonClick)
clearCompletedButton.addEventListener('click', handleClearCompletedButtonClick)
saveTodoButton.addEventListener('click', handleSaveNewTodo)
saveEditTodoButton.addEventListener('click', handleSaveEditTodo)
confirmDeleteTodoButton.addEventListener('click', handleConfirmDeleteTodo)
confirmClearCompletedButton.addEventListener('click', handleConfirmClearCompleted)

// Handlers

function handleAddTodoButtonClick() {
    currentEditId = null 
    clearModalFields()
    addTodoModal.show()
}

function handleClearCompletedButtonClick() {
    clearCompletedModal.show()
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
    const form = document.getElementById('addTodoForm')
    const formData = new FormData(form)
    const title = formData.get('title')
    const description = formData.get('description')

    if (title && description) {
        const newTodo = new TodoItem(title, description)
        data.push(newTodo)
        setData(data)
        renderTodos()

        form.reset() 
        addTodoModal.hide()

        updateCounters(data)
    } else {
        alert('Please fill in both the title and description!')
    }
}

function handleSaveEditTodo() {
    const form = document.getElementById('editTodoForm')
    const formData = new FormData(form)
    const title = formData.get('title')
    const description = formData.get('description')

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

        form.reset() 
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

function renderTodos() {

    clearTodoContainers()

    data.forEach(todo => {
        const todoElement = buildTodoElement(todo)
        
        if (todo.status === 'todo') {
            todoContainer.append(todoElement)
        } else if (todo.status === 'in-progress') {
            inProgressContainer.append(todoElement)
        } else if (todo.status === 'done') {
            doneContainer.append(todoElement)
        }
    })

    updateCounters(data)
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
    const form = document.getElementById('editTodoForm')
    form.elements['title'].value = todo.title
    form.elements['description'].value = todo.description
}

function clearModalFields() {
    document.getElementById('addTodoForm').reset()
}

function clearTodoContainers() {
    todoContainer.innerHTML = ''
    inProgressContainer.innerHTML = ''
    doneContainer.innerHTML = ''
}

// Initial Render
renderTodos()
