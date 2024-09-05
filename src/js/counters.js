export function updateCounters(todos) {
    console.log(todos)

    const todoCount = todos.filter(todo => todo.status === 'todo').length
    const inProgressCount = todos.filter(todo => todo.status === 'in-progress').length
    const doneCount = todos.filter(todo => todo.status === 'done').length

    document.querySelector('.todo-counter').textContent = todoCount
    document.querySelector('.in-progress-counter').textContent = inProgressCount
    document.querySelector('.done-counter').textContent = doneCount
}