import type { CommonResponse, PageResponse } from '../types/api'
import type { PageBlock } from '../types/blocks'

type Entry = Record<string, unknown>

function record(value: unknown): value is Entry {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function hasText(item: Entry, ...keys: string[]): boolean {
  return keys.every((key) => typeof item[key] === 'string')
}

function list(value: unknown, valid: (item: unknown) => boolean): boolean {
  return Array.isArray(value) && value.every(valid)
}

function fields(value: unknown, ...keys: string[]): boolean {
  return record(value) && hasText(value, ...keys)
}

function image(value: unknown): boolean {
  return value === null || fields(value, 'src', 'alt')
}

// Перевіряємо невідомі JSON-дані до того, як використовувати їх як PageBlock.
export function isPageBlock(value: unknown): value is PageBlock {
  if (!record(value) || !hasText(value, 'type', 'anchor', 'title', 'subtitle')) return false

  switch (value.type) {
    case 'hero':
      return hasText(value, 'badge') && image(value.image) &&
        list(value.buttons, (button) => fields(button, 'text', 'link', 'variant') &&
          record(button) && (button.variant === 'primary' || button.variant === 'secondary'))
    case 'about':
      return hasText(value, 'text') && list(value.topics, (item) => fields(item, 'icon', 'title', 'text'))
    case 'features':
      return list(value.items, (item) => fields(item, 'icon', 'title', 'text'))
    case 'epochs':
      return list(value.items, (item) => record(item) &&
        hasText(item, 'title', 'period', 'description', 'detail') && image(item.image))
    case 'philosophers':
      return list(value.items, (item) => record(item) &&
        hasText(item, 'name', 'years', 'idea', 'bio', 'epoch') && image(item.image))
    case 'questions':
      return list(value.items, (item) => fields(item, 'question', 'answer'))
    case 'quotes':
      return list(value.items, (item) => record(item) &&
        hasText(item, 'text', 'author', 'source') && typeof item.isParaphrase === 'boolean')
    case 'projectInfo':
      return hasText(value, 'text', 'contactEmail')
    default:
      return false // Новий блок CMS не заважає показати решту сторінки.
  }
}

// Interface описує структуру відповіді; JSON з мережі спочатку має тип unknown.
export function isCommon(value: unknown): value is CommonResponse {
  return record(value) && hasText(value, 'siteName', 'logoText') &&
    list(value.menu, (item) => fields(item, 'label', 'link')) &&
    record(value.footer) && hasText(value.footer, 'text')
}

export function parsePage(value: unknown): PageResponse {
  if (!record(value) || !hasText(value, 'path', 'title') || !Array.isArray(value.blocks)) {
    throw new Error('CMS повернула некоректні дані сторінки.')
  }
  const blocks = value.blocks.filter(isPageBlock)
  return { path: value.path as string, title: value.title as string, blocks }
}
