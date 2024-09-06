export function getData() {
    const storedTodos = localStorage.getItem('todos')
    return storedTodos ? JSON.parse(storedTodos) : []
}

export function setData(data) {
    localStorage.setItem('todos', JSON.stringify(data))
}