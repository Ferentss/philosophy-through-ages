import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { previewCommon, previewPage } from '../frontend/src/preview.ts'

const main = readFileSync(new URL('../frontend/src/main.ts', import.meta.url), 'utf8')
const css = readFileSync(new URL('../frontend/src/styles/base.css', import.meta.url), 'utf8')

test('Сім секцій односторінкового оформленого сайту наявні', () => {
  assert.equal(previewPage.path, '/')
  assert.deepEqual(previewPage.blocks.map((block) => block.type), [
    'hero', 'about', 'epochs', 'philosophers', 'questions', 'quotes', 'projectInfo',
  ])
  assert.equal(previewPage.blocks.find((block) => block.type === 'epochs')?.items.length, 5)
  assert.equal(previewPage.blocks.find((block) => block.type === 'philosophers')?.items.length, 6)
})

test('Навігація веде до якорів односторінкового сайту', () => {
  const anchors = new Set(previewPage.blocks.map((block) => `#${block.anchor}`))
  for (const item of previewCommon.menu) assert.ok(anchors.has(item.link), item.link)
})

test('Демо чітко позначено, реальний сайт читає обидва API', () => {
  assert.match(main, /import\.meta\.env\.DEV/)
  assert.match(main, /new URLSearchParams\(location\.search\)/)
  assert.match(main, /ДЕМО ДИЗАЙНУ/)
  assert.match(main, /Promise\.all\(\[getCommon\(\), getPage\('\/'\)\]\)/)
  assert.match(css, /\.preview-banner/)
  assert.match(css, /\.hero-grid/)
  assert.match(css, /@media\(max-width:680px\)/)
})
