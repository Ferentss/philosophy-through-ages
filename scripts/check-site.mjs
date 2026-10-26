// Перевірка реального HTTP API через Vite. Не потребує доступу до секретів Neon.
const origin = (process.env.SITE_URL || 'http://127.0.0.1:5173').replace(/\/+$/, '')
const paths = ['/api/common', '/api/page?path=%2F']
let failed = false

for (const path of paths) {
  const url = `${origin}${path}`
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(12000), headers: { Accept: 'application/json' } })
    const body = await response.json().catch(() => null)
    const contentType = response.headers.get('content-type') || ''

    if (!response.ok || !contentType.includes('application/json')) {
      console.error(`✗ ${path}: HTTP ${response.status}`)
      if (response.status === 404) console.error('  Не знайдено сторінку: перевірте npm run seed та записи CMS.')
      if (response.status >= 500) console.error('  Перевірте помилки в терміналі Payload CMS та з’єднання з Neon.')
      failed = true
      continue
    }
    if (path === '/api/common') {
      if (!body || typeof body.siteName !== 'string' || !Array.isArray(body.menu)) {
        console.error('✗ /api/common: некоректний JSON налаштувань')
        failed = true
      } else {
        console.log(`✓ /api/common: ${body.siteName}; пунктів меню ${body.menu.length}`)
      }
      continue
    }
    const types = Array.isArray(body?.blocks) ? body.blocks.map((block) => block.type) : []
    const required = ['hero', 'about', 'epochs', 'philosophers', 'questions', 'quotes', 'projectInfo']
    const missing = required.filter((type) => !types.includes(type))
    if (missing.length) {
      console.error(`✗ /api/page: бракує секцій ${missing.join(', ')}`)
      failed = true
      continue
    }
    console.log(`✓ /api/page: ${types.length} секцій головної сторінки`)
    for (const type of ['epochs', 'philosophers', 'quotes']) {
      const count = body.blocks.find((block) => block.type === type)?.items?.length || 0
      console.log(`  ${type}: ${count} записів`)
      if (!count) failed = true
    }
  } catch (error) {
    failed = true
    console.error(`✗ ${path}: CMS недоступна (${error instanceof Error ? error.message : 'невідома помилка'})`)
    console.error('  Запустіть npm run dev, перевірте cms/.env і повторіть перевірку.')
  }
}

if (failed) {
  console.error('\nПеревірка не пройдена. Дивіться повідомлення вище.')
  process.exitCode = 1
} else {
  console.log('\nПублічний API повертає головну сторінку та її вміст.')
}
