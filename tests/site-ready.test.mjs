import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path) => readFileSync(join(root, path), 'utf8')

test('Корінь CMS веде на фронтенд, а не видає порожню HTML-сторінку', () => {
  const code = read('cms/src/app/(frontend)/page.tsx')
  assert.match(code, /redirect\(site\)/)
  assert.match(code, /FRONTEND_URL/)
  assert.doesNotMatch(code, /Адміністративна частина проєкту/)
})

test('Початкові дані охоплюють усі розділи односторінкового сайту', () => {
  const seed = read('cms/src/seed.ts')
  for (const type of ['hero','about','epochs','philosophers','questions','quotes','projectInfo']) {
    assert.match(seed, new RegExp(`blockType:'${type}'`), `Немає секції ${type}`)
  }
  for (const slug of ['socrates','plato','aristotle','descartes','kant','nietzsche']) {
    assert.match(seed, new RegExp(`slug:'${slug}'`))
  }
  assert.match(seed, /if \(!found\.docs\.length\)/)
  assert.match(seed, /if \(found\.docs\.length\) return/)
})

test('Помилка порожньої CMS містить зрозумілу дію', () => {
  assert.match(read('cms/src/endpoints.ts'), /CONTENT_NOT_INITIALIZED/)
  assert.match(read('frontend/src/main.ts'), /npm run seed/)
})

const exec = promisify(execFile)

async function checkApi(mode) {
  // Копія відповіді CMS для перевірки діагностичного скрипту.
  const server = createServer((req, res) => {
    res.setHeader('content-type', 'application/json')
    if (req.url === '/api/common') return res.end(JSON.stringify({ siteName:'Філософія крізь віки', menu:[] }))
    if (mode === 'empty') { res.statusCode = 404; return res.end(JSON.stringify({ error:'не створено' })) }
    res.end(JSON.stringify({ path:'/', title:'Філософія', blocks: [
      ...['hero','about','questions','projectInfo'].map((type) => ({ type })),
      ...['epochs','philosophers','quotes'].map((type) => ({ type,items:[{}] })),
    ] }))
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const url = `http://127.0.0.1:${server.address().port}`
  // Тестуємо справжній HTTP fetch без запуску Payload і без доступу до Neon.
  try {
    const result = await exec(process.execPath, ['scripts/check-site.mjs'], {
      cwd: root, env: { ...process.env, SITE_URL: url }, timeout: 5000,
    }).then(({ stdout, stderr }) => ({ success: true, stdout, stderr }))
      .catch((error) => ({ success: false, stdout: String(error.stdout || ''), stderr: String(error.stderr || '') }))
    return result
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
}

test('HTTP-діагностика розрізняє заповнений і порожній API', async () => {
  const seeded = await checkApi('seeded')
  assert.equal(seeded.success, true, seeded.stderr)
  assert.match(seeded.stdout, /7 секцій/)
  const empty = await checkApi('empty')
  assert.equal(empty.success, false)
  assert.match(empty.stderr, /HTTP 404/)
  assert.match(read('scripts/check-site.mjs'), /CONTENT|бракує секцій|Не знайдено сторінку/)
})
