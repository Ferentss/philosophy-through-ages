import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const files = (name) => new URL(`../${name}`, import.meta.url)
const read = (name) => readFileSync(files(name), 'utf8')
const json = (name) => JSON.parse(read(name))

test('Workspace opens in VS Code and provides runnable tasks', () => {
  assert.equal(json('Philosophy.code-workspace').folders[0].path, '.')
  const tasks = json('.vscode/tasks.json').tasks.map((task) => task.label)
  assert.ok(tasks.some((name) => name.includes('Встановити')))
  assert.ok(tasks.some((name) => name.includes('Запустити')))
})

test('Both applications and environment examples are available', () => {
  for (const file of ['cms/package.json', 'frontend/package.json', 'cms/.env.example', 'frontend/.env.example']) {
    assert.ok(existsSync(files(file)), file)
  }
  assert.equal(json('frontend/tsconfig.json').compilerOptions.strict, true)
})

test('API returns data from CMS rather than static JSON', () => {
  const api = read('cms/src/endpoints.ts')
  assert.match(api, /req\.payload\.findGlobal/)
  assert.match(api, /req\.payload\.find\(/)
  assert.match(api, /collection: 'pages'/)
  assert.match(api, /collection: 'quotes'/)
  assert.match(api, /mediaImage\(entry\.image/)
})

test('CMS uploaded images resolve against CMS origin', () => {
  const api = read('cms/src/endpoints.ts')
  assert.match(api, /url\.startsWith\('\/api\/media\/'\)/)
  assert.match(api, /CMS_URL/)
})

test('Secrets are ignored and not populated in examples', () => {
  const ignore = read('.gitignore')
  assert.match(ignore, /\*\*\/\.env/)
  assert.doesNotMatch(read('cms/.env.example'), /postgresql:\/\/[^\s=]+@/)
})


test('Setup can restore incomplete CMS lock while keeping frontend clean install', () => {
  const setup = read('scripts/setup.mjs')
  assert.match(setup, /folder === 'cms' \? \['install'/)
  assert.match(setup, /\['ci', '--no-audit', '--no-fund'\]/)
  assert.doesNotMatch(setup, /^\s*shell:\s*true/m)
})

test('Dev script fails clearly when dependencies were not installed', () => {
  const dev = read('scripts/dev.mjs')
  assert.match(dev, /Не встановлені залежності/)
  assert.match(dev, /npm run setup/)
  assert.doesNotMatch(dev, /^\s*shell:\s*true/m)
})
