import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = new URL('../', import.meta.url)
const read = (file) => readFileSync(new URL(file, root), 'utf8')

// TypeScript використовується в коді обох застосунків, а не лише в назвах файлів.
test('Vite працює через TypeScript і strict-режим', () => {
  assert.match(read('frontend/index.html'), /src="\/src\/main\.ts"/)
  const config = JSON.parse(read('frontend/tsconfig.json'))
  assert.equal(config.compilerOptions.strict, true)
  const items = readdirSync(new URL('frontend/src/', root))
  assert.ok(items.includes('main.ts'))
  assert.ok(!items.includes('main.js'))
})

test('Код TypeScript має інтерфейси, & і |', () => {
  const types = read('frontend/src/types/blocks.ts')
  assert.match(types, /export interface Epoch/)
  assert.match(types, /BaseBlock\s*&/)
  assert.match(types, /HeroBlock\s*\|/)
  assert.match(read('frontend/src/api/client.ts'), /value:\s*unknown/)
})

test('Payload CMS використовує TS, TSX і строгу типізацію', () => {
  const config = JSON.parse(read('cms/tsconfig.json'))
  assert.equal(config.compilerOptions.strict, true)
  assert.match(read('cms/src/payload.config.ts'), /from ['"]payload['"]|import.*payload/)
  const app = fileURLToPath(new URL('cms/src/app/(payload)/layout.tsx', root))
  assert.ok(readFileSync(app, 'utf8').includes('RootLayout'))
})

test('Команди перевірки TypeScript і збірки доступні з кореня', () => {
  const { scripts } = JSON.parse(read('package.json'))
  assert.match(scripts.typecheck, /typecheck:site.*typecheck:cms/)
  assert.match(scripts.build, /build:site.*build:cms/)
})
