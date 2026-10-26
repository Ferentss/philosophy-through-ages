import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(file) {
  return readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
}

test('Vite forwards /api to local Payload CMS', () => {
  const vite = read('frontend/vite.config.ts')
  assert.match(vite, /'\/api':/)
  assert.match(vite, /http:\/\/127\.0\.0\.1:3000/)
  assert.match(vite, /changeOrigin: true/)
})

test('Development fetch avoids localhost URLs on remote clients', () => {
  const client = read('frontend/src/api/client.ts')
  assert.match(client, /import\.meta\.env\.DEV/)
  assert.match(client, /\? ''/)
  assert.match(client, /VITE_API_URL/)
  assert.doesNotMatch(read('frontend/.env.example'), /VITE_API_URL=http:\/\/localhost/)
})

test('Local media is served via /api proxy', () => {
  const endpoints = read('cms/src/endpoints.ts')
  const dom = read('frontend/src/lib/dom.ts')
  assert.match(endpoints, /NODE_ENV === 'production'/)
  assert.match(dom, /src\.startsWith\('\/api\/media\/file\/'\)/)
})
