// CLOCK
const clockElement = document.getElementById('clock')

export function clock() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  clockElement.textContent = `${hours}:${minutes}:${seconds}`
}

setInterval(clock, 1000)
clock()