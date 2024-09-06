export function TodoItem(title, description) {
    this.id = crypto.randomUUID()
    this.title = title
    this.description = description
    this.status = 'todo'
    this.createdAt = new Date().toLocaleDateString()
}