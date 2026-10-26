import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
test('Vite loads the TypeScript entrypoint', () => {
  assert.match(read('index.html'), /src\/main\.ts/)
  assert.doesNotMatch(read('index.html'), /<script[^>]+src=".*\.js"/)
})
test('TypeScript renderer supports all sections', () => {
  const code = read('src/renderBlocks.ts')
  for (const name of ['hero','about','features','epochs','philosophers','questions','quotes','projectInfo']) {
    assert.match(code, new RegExp(`case '${name}'`))
  }
})
test('CMS content is inserted with textContent, not HTML templates', () => {
  assert.match(read('src/lib/dom.ts'), /textContent/)
  assert.doesNotMatch(read('src/lib/dom.ts'), /\.innerHTML\s*=/)
})
test('Offline illustration assets are available', () => {
  for (const name of ['hero-statue','socrates','plato','aristotle','descartes','kant','nietzsche','antiquity','medieval','renaissance','modern','contemporary']) {
    assert.ok(existsSync(new URL(`../public/assets/${name}.svg`, import.meta.url)), `Missing ${name}`)
  }
})
