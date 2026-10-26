import { describe, it, expect } from 'vitest'
import { commonEndpoint, pageEndpoint } from '../../src/endpoints'
// Ці тести потребують запущеної CMS, PostgreSQL і виконаного seed.
const base = process.env.CMS_URL || 'http://localhost:3000'
describe('Філософський API', () => {
  it('експонує read-only ендпоінти', () => {
    expect(commonEndpoint.path).toBe('/common')
    expect(pageEndpoint.path).toBe('/page')
    expect(commonEndpoint.method).toBe('get')
  })
  it.skipIf(!process.env.RUN_LIVE_TESTS)('GET /api/common', async () => {
    const res = await fetch(`${base}/api/common`)
    expect(res.status).toBe(200)
    const data: unknown = await res.json()
    expect(data).toHaveProperty('siteName', 'Філософія крізь віки')
    expect(JSON.stringify(data)).not.toContain('password')
  })
  it.skipIf(!process.env.RUN_LIVE_TESTS)('GET /api/page?path=/', async () => {
    const res = await fetch(`${base}/api/page?path=%2F`)
    expect(res.status).toBe(200)
    const data = await res.json() as { blocks: unknown[] }
    expect(data.blocks.length).toBeGreaterThanOrEqual(7)
  })
  it.skipIf(!process.env.RUN_LIVE_TESTS)('Некоректний шлях має 400', async () => {
    const res = await fetch(`${base}/api/page?path=%3Cscript%3E`)
    expect(res.status).toBe(400)
  })
})
