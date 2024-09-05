import { Modal } from 'bootstrap'
import { clock } from './clock.js'

// Variables
let data = getData() 
const addTodoButton = document.querySelector('.add-todo')
const saveTodoButton = document.querySelector('.save-todo')
const todoInputTitle = document.getElementById('todo-title')
const todoInputDescription = document.getElementById('todo-description')
const todoContainer = document.querySelector('.todo-placeholder.todo-todo')
const addTodoModalElement = document.getElementById('addTodoModal')
const addTodoModal = new Modal(addTodoModalElement)

// Listeners
addTodoButton.addEventListener('click', handleOpenModal)
saveTodoButton.addEventListener('click', handleSaveNewTodo)

// Handlers


function handleOpenModal() {
    addTodoModal.show()
}

function handleSaveNewTodo() {
    const title = todoInputTitle.value.trim()
    const description = todoInputDescription.value.trim()

    if (title && description) {
        const newTodo = new TodoItem(title, description)
        data.push(newTodo) 
        setData(data) 
        renderTodos(data)

        
        todoInputTitle.value = ''
        todoInputDescription.value = ''
        addTodoModal.hide()
    } else {
        alert('Please fill in both the title and description!')
    }
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


function renderTodos(todos) {
    todos.forEach(todo => {
        const todoElement = buildTodoElement(todo)
        todoContainer.appendChild(todoElement)
    })
}


function buildTodoElement(todo) {
    const div = document.createElement('div')
    div.classList.add('todo-item', todo.status)
    div.setAttribute('data-id', todo.id)

    div.innerHTML = `
        <div class="actions">
            <button class="btn btn-sm btn-info">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteTodo('${todo.id}')">Delete</button>
        </div>
        <h5>${todo.title}</h5>
        <p>${todo.description}</p>
        <div>
            <label>
                <input type="radio" name="status-${todo.id}" ${todo.status === 'todo' ? 'checked' : ''} onchange="changeTodoStatus('${todo.id}', 'todo')"> Todo
            </label>
            <label>
                <input type="radio" name="status-${todo.id}" ${todo.status === 'in-progress' ? 'checked' : ''} onchange="changeTodoStatus('${todo.id}', 'in-progress')"> In Progress
            </label>
            <label>
                <input type="radio" name="status-${todo.id}" ${todo.status === 'done' ? 'checked' : ''} onchange="changeTodoStatus('${todo.id}', 'done')"> Done
            </label>
        </div>
        <span class="todo-date">${todo.createdAt}</span>
    `
    return div
}

renderTodos(data)