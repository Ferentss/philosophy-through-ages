// Запускає CMS та сайт в одному терміналі VS Code.
import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const servers = [
  { folder: 'cms', label: 'Payload CMS: http://localhost:3000/admin', package: 'next' },
  { folder: 'frontend', label: 'Сайт: http://localhost:5173', package: 'vite' },
]

// Не запускаємо сервери після невдалого встановлення пакетів.
const missing = servers.filter(({ folder, package: name }) =>
  !existsSync(path.join(root, folder, 'node_modules', name, 'package.json')))
if (missing.length) {
  console.error('Не встановлені залежності: ' + missing.map((item) => item.folder).join(', '))
  console.error('Спочатку запустіть npm run setup з кореня проєкту.')
  process.exit(1)
}

let closing = false
const children = []

function stop(code = 0) {
  if (closing) return
  closing = true
  for (const child of children) {
    if (child.exitCode === null) child.kill()
  }
  process.exitCode = code
}

function npmCommand() {
  const npmCli = process.env.npm_execpath
  if (npmCli && existsSync(npmCli)) {
    return { command: process.execPath, args: [npmCli, 'run', 'dev'] }
  }
  if (process.platform === 'win32') {
    return { command: 'cmd.exe', args: ['/d', '/s', '/c', 'npm run dev'] }
  }
  return { command: 'npm', args: ['run', 'dev'] }
}

for (const server of servers) {
  console.log(`Запускаємо ${server.label}`)
  const { command, args } = npmCommand()
  const child = spawn(command, args, {
    cwd: path.join(root, server.folder),
    stdio: 'inherit',
  })
  children.push(child)
  child.on('error', (error) => { console.error(error.message); stop(1) })
  child.on('exit', (code) => { if (!closing) stop(code || 1) })
}

process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())
