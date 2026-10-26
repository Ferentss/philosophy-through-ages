// Запускає обидва сервери в одному терміналі VS Code без сторонніх бібліотек.
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
let closing = false
const servers = [
  { folder: 'cms', label: 'Payload CMS: http://localhost:3000/admin' },
  { folder: 'frontend', label: 'Сайт: http://localhost:5173' },
]
const children = []

function stop(code = 0) {
  if (closing) return
  closing = true
  for (const child of children) if (child.exitCode === null) child.kill()
  process.exitCode = code
}

for (const server of servers) {
  console.log(`Запускаємо ${server.label}`)
  const child = spawn(command, ['run', 'dev'], {
    cwd: path.join(root, server.folder),
    shell: process.platform === 'win32',
    stdio: 'inherit',
  })
  children.push(child)
  child.on('error', (error) => { console.error(error.message); stop(1) })
  child.on('exit', (code) => { if (!closing) stop(code || 1) })
}

process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())
