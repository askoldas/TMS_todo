export function renderTodos() {
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