import type { CommonResponse, PageResponse } from '../types/api'

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

type JsonObject = Record<string, unknown>

function isObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// T — тип відповіді, який перевіряємо перед використанням.
async function getJson<T>(path: string, check: (value: unknown) => value is T): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) throw new Error(`HTTP ${response.status}. Спробуйте пізніше.`)

  const data: unknown = await response.json()
  if (!check(data)) throw new Error('CMS повернула некоректні дані.')
  return data
}

function isMenuItem(value: unknown): boolean {
  return isObject(value) && isString(value.label) && isString(value.link)
}

export function isCommon(value: unknown): value is CommonResponse {
  return isObject(value) &&
    isString(value.siteName) &&
    isString(value.logoText) &&
    Array.isArray(value.menu) &&
    value.menu.every(isMenuItem) &&
    isObject(value.footer) &&
    isString(value.footer.text)
}

export function isPage(value: unknown): value is PageResponse {
  return isObject(value) &&
    isString(value.path) &&
    isString(value.title) &&
    Array.isArray(value.blocks) &&
    value.blocks.every((block: unknown) => isObject(block) && isString(block.type))
}

export function getCommon(): Promise<CommonResponse> {
  return getJson('/api/common', isCommon)
}

export function getPage(path = '/'): Promise<PageResponse> {
  return getJson(`/api/page?path=${encodeURIComponent(path)}`, isPage)
}
