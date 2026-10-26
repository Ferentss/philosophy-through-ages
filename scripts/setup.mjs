// Встановлює залежності та створює приклади налаштувань у VS Code.
import { copyFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const version = process.versions.node
const [major, minor, patch] = version.split('.').map(Number)
const supported = major >= 24 || (major === 22 && (minor > 23 || (minor === 23 && patch >= 4)))

if (!supported) {
  console.error(`Потрібна новіша версія Node.js (зараз ${version}). Рекомендовано Node.js 24.x або 22.23.4+.`)
  process.exit(1)
}

// npm run setup передає шлях до npm-cli.js через npm_execpath.
// Це дозволяє запускати npm без shell: true та попередження DEP0190 на Windows.
function runNpm(directory, args) {
  const npmCli = process.env.npm_execpath
  const options = { cwd: directory, stdio: 'inherit' }
  if (npmCli && existsSync(npmCli)) {
    return spawnSync(process.execPath, [npmCli, ...args], options)
  }
  if (process.platform === 'win32') {
    return spawnSync('cmd.exe', ['/d', '/s', '/c', `npm ${args.join(' ')}`], options)
  }
  return spawnSync('npm', args, options)
}

for (const folder of ['cms', 'frontend']) {
  const directory = path.join(root, folder)
  const example = path.join(directory, '.env.example')
  const actual = path.join(directory, '.env')

  if (!existsSync(actual)) {
    copyFileSync(example, actual)
    console.log(`Створено ${folder}/.env. Заповніть змінні перед запуском.`)
  }

  // Старий cms/package-lock.json мав відсутні транзитивні залежності.
  // npm install узгоджує lock-файл; після цього можливий чистий npm ci.
  const args = folder === 'cms' ? ['install', '--no-audit', '--no-fund'] : ['ci', '--no-audit', '--no-fund']
  console.log(`\nВстановлення ${folder}: npm ${args.join(' ')}`)
  const result = runNpm(directory, args)

  if (result.error || result.status !== 0) {
    console.error(`\nНе вдалося встановити пакети ${folder}.`)
    if (result.error) console.error(result.error.message)
    console.error(`Відкрийте папку ${folder} у терміналі VS Code та запустіть npm install, щоб побачити причину.`)
    process.exit(result.status || 1)
  }
}

console.log('\nЗалежності встановлено. Перевірте cms/.env, потім npm run dev.')
console.log('Якщо cms/package-lock.json змінився, збережіть його у Git.')
