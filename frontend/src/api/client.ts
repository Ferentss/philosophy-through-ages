import type { CommonResponse, PageResponse } from '../types/api'
import { isCommon, parsePage } from './validation'

// У режимі розробки /api проходить через проксі Vite.
// Тому API працює також з телефона чи іншого ПК у локальній мережі.
// У production VITE_API_URL має містити публічну адресу Payload CMS.
export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

const apiUrl = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

// T — тип відповіді, що пройшла перевірку.
async function getJson<T>(path: string, check: (value: unknown) => value is T): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new ApiError(response.status, `HTTP ${response.status}. Спробуйте пізніше.`)
  const data: unknown = await response.json()
  if (!check(data)) throw new Error('CMS повернула некоректні дані.')
  return data
}

export function getCommon(): Promise<CommonResponse> {
  return getJson('/api/common', isCommon)
}

export async function getPage(path = '/'): Promise<PageResponse> {
  const response = await fetch(`${apiUrl}/api/page?path=${encodeURIComponent(path)}`, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new ApiError(response.status, `HTTP ${response.status}. Спробуйте пізніше.`)
  const data: unknown = await response.json()
  return parsePage(data)
}
