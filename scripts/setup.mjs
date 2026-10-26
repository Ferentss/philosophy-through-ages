// Одна команда встановлення для всього VS Code-проєкту.
import { copyFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const version = process.versions.node
const [major, minor, patch] = version.split('.').map(Number)
const supported = major >= 24 ||
  (major === 22 && (minor > 23 || (minor === 23 && patch >= 4)))

if (!supported) {
  console.error(`Потрібна новіша версія Node.js (зараз ${version}). Рекомендовано Node.js 24.x або 22.23.4+.`)
  process.exit(1)
}

for (const folder of ['cms', 'frontend']) {
  const directory = path.join(root, folder)
  const example = path.join(directory, '.env.example')
  const actual = path.join(directory, '.env')

  if (!existsSync(actual)) {
    copyFileSync(example, actual)
    console.log(`Створено ${folder}/.env. Заповніть змінні перед запуском.`)
  }

  console.log(`\nВстановлення: ${folder}`)
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const args = ['ci']
  const result = spawnSync(command, args, {
    cwd: directory,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.status !== 0) {
    console.error(`Не вдалося встановити пакети ${folder}. Перевірте з'єднання з інтернетом і npm.`)
    process.exit(result.status || 1)
  }
}

console.log('\nГотово. Налаштуйте cms/.env та frontend/.env, потім npm run dev.')
