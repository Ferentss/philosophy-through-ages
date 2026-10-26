import { test } from 'node:test'
import assert from 'node:assert/strict'
import { commonEndpoint, pageEndpoint, mediaImage } from '../cms/src/endpoints.ts'

function fakeRequest(path, { missing = false, fail = false } = {}) {
  const calls = []
  const payload = {
    logger: { error: () => {} },
    findGlobal: async () => {
      if (fail) throw new Error('secret database error')
      return { siteName: 'Філософія крізь віки', logoText: 'Філософія',
        menu: [{ label: 'Головна', link: '#home', internalSecret: 'private' }],
        footer: { text: 'Освітній проєкт' }, token: 'private' }
    },
    find: async (options) => {
      calls.push(options)
      if (fail) throw new Error('secret database error')
      switch (options.collection) {
        case 'pages':
          return { docs: missing ? [] : [{ title: 'Філософія', path: '/', password: 'private', blocks: [
            { blockType: 'hero', anchor: 'home', title: 'Філософія', subtitle: 'Пізнання',
              badge: 'НАУКА', buttons: [{ text: 'Далі', link: '#epochs', variant: 'primary' }] },
            { blockType: 'epochs', title: 'Епохи', anchor: 'epochs', subtitle: 'Історія' },
            { blockType: 'philosophers', title: 'Мислителі', anchor: 'philosophers' },
            { blockType: 'quotes', title: 'Ідеї', anchor: 'quotes' },
            { blockType: 'unknown-plugin', title: 'Невідомий блок' },
          ] }] }
        case 'epochs': return { docs: [{ title: 'Античність', period: 'VI–IV', description: 'Опис',
          detail: 'Факт', imageUrl: '/assets/antiquity.svg', secret: 'private' }] }
        case 'philosophers': return { docs: [{ name: 'Сократ', years: '469–399', idea: 'Запитання',
          bio: 'Історія', epoch: { title: 'Античність' }, image: {
            url: '/api/media/file/socrates.jpg', alt: 'Сократ' }, token: 'private' }] }
        case 'quotes': return { docs: [{ text: 'Переказ', author: 'Сократ', source: 'Переказ',
          isParaphrase: true, secret: 'private' }] }
        default: throw new Error('unexpected collection')
      }
    },
  }
  return { req: { url: `http://localhost:3000${path}`, payload }, calls }
}

test('API /common has only public keys and proper status', async () => {
  const { req } = fakeRequest('/api/common')
  const response = await commonEndpoint.handler(req)
  assert.equal(response.status, 200)
  const result = await response.json()
  assert.deepEqual(Object.keys(result).sort(), ['siteName', 'logoText', 'menu', 'footer'].sort())
  assert.equal(result.menu[0].internalSecret, undefined)
  assert.doesNotMatch(JSON.stringify(result), /private/)
})

test('API /page populates collections and normalizes CMS media', async () => {
  const { req, calls } = fakeRequest('/api/page?path=%2F')
  const response = await pageEndpoint.handler(req)
  assert.equal(response.status, 200)
  const result = await response.json()
  assert.deepEqual(result.blocks.map((b) => b.type), ['hero', 'epochs', 'philosophers', 'quotes', 'unknown'])
  assert.equal(result.blocks[1].items[0].image.src, '/assets/antiquity.svg')
  assert.equal(result.blocks[2].items[0].image.src, process.env.NODE_ENV === 'production'
    ? 'http://localhost:3000/api/media/file/socrates.jpg'
    : '/api/media/file/socrates.jpg')
  assert.equal(result.blocks[3].items[0].isParaphrase, true)
  assert.ok(calls.every((item) => item.overrideAccess === false))
  assert.doesNotMatch(JSON.stringify(result), /private/)
})

test('API rejects missing, malicious and duplicate page path', async () => {
  for (const url of ['/api/page', '/api/page?path=%3Cscript%3E',
    '/api/page?path=%2F&path=%2F', '/api/page?path=%2F&unknown=1']) {
    const { req } = fakeRequest(url)
    const response = await pageEndpoint.handler(req)
    assert.equal(response.status, 400, url)
  }
})

test('API page without record returns 404', async () => {
  const { req } = fakeRequest('/api/page?path=%2Fmissing', { missing: true })
  assert.equal((await pageEndpoint.handler(req)).status, 404)
})

test('API server failures respond 500 without leaking exception text', async () => {
  for (const [handler, url] of [[commonEndpoint.handler, '/api/common'],
    [pageEndpoint.handler, '/api/page?path=%2F']]) {
    const { req } = fakeRequest(url, { fail: true })
    const response = await handler(req)
    assert.equal(response.status, 500)
    assert.doesNotMatch(await response.text(), /secret database error/)
  }
})

test('Uploaded media does not accept scripts, data URLs or unsafe paths', () => {
  assert.equal(mediaImage({ url: 'javascript:alert(1)' }), null)
  assert.equal(mediaImage({ url: 'data:image/svg+xml,hi' }), null)
  assert.equal(mediaImage({ url: '/private/admin' }), null)
  assert.deepEqual(mediaImage(null, '/assets/modern.svg'), { src: '/assets/modern.svg', alt: '' })
})
