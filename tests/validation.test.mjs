import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isCommon, isPageBlock, parsePage } from '../frontend/src/api/validation.ts'

test('Common API response validates nested links', () => {
  assert.equal(isCommon({ siteName: 'Історія', logoText: 'Філософія',
    footer: { text: 'Footer' }, menu: [{ label: 'Початок', link: '#home' }] }), true)
  assert.equal(isCommon({ siteName: 'Історія', logoText: 'Філософія',
    footer: { text: 'Footer' }, menu: [{ label: null, link: '#home' }] }), false)
})

test('Block validator rejects malformed nested data', () => {
  const base = { type: 'questions', anchor: 'questions', title: 'Питання', subtitle: '' }
  assert.equal(isPageBlock({ ...base, items: [{ question: 'Навіщо?', answer: 'Щоб знати.' }] }), true)
  assert.equal(isPageBlock({ ...base, items: [{ question: 42, answer: 'Ні.' }] }), false)
  assert.equal(isPageBlock({ ...base, items: 'bad' }), false)
})

test('Page parser skips unknown blocks but retains valid ones', () => {
  const result = parsePage({ path: '/', title: 'Філософія', blocks: [
    { type: 'hero', anchor: 'home', title: 'Головна', subtitle: 'Вітаємо', badge: 'Історія', image: null,
      buttons: [{ text: 'Далі', link: '#about', variant: 'primary' }] },
    { type: 'future-widget', title: 'невідомий' },
    { type: 'questions', title: 'некоректний', items: 13 },
  ] })
  assert.equal(result.blocks.length, 1)
  assert.equal(result.blocks[0].type, 'hero')
  assert.throws(() => parsePage({ path: '/', title: 'Тема', blocks: null }), /некоректні/)
})
