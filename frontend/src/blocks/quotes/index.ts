import type { QuotesBlock } from '../../types/blocks'
import { el, append, heading, text, section } from '../../lib/dom'
export function renderQuotes(data: QuotesBlock): HTMLElement {
  const root = section(data.anchor || 'quotes', 'quotes-section')
  const wrap = el('div', 'container')
  wrap.append(heading('05 · ІДЕЇ', data.title, data.subtitle))
  const frame = el('div', 'quote-frame')
  const mark = text('span', 'quote-mark', '“')
  const quote = el('blockquote', 'quote-text')
  const author = text('p', 'quote-author', '')
  const source = text('p', 'quote-source', '')
  const controls = el('div', 'quote-controls')
  const prev = el('button', 'round-button', '←'); const next = el('button', 'round-button', '→')
  prev.type = next.type = 'button'; prev.setAttribute('aria-label', 'Попередня думка'); next.setAttribute('aria-label', 'Наступна думка')
  const count = text('span', 'quote-count', '')
  const quotes = data.items ?? []
  let active = 0
  function show() {
    const item = quotes[active]
    if (!item) { quote.textContent = 'Думки невдовзі з’являться.'; author.textContent = ''; source.textContent = ''; return }
    quote.textContent = item.text
    author.textContent = `— ${item.author}`
    source.textContent = `${item.isParaphrase ? 'Переказ ідеї' : 'Цитата'}${item.source ? ' · ' + item.source : ''}`
    count.textContent = `${String(active + 1).padStart(2,'0')} / ${String(quotes.length).padStart(2,'0')}`
  }
  prev.addEventListener('click', () => { active = (active - 1 + quotes.length) % quotes.length; show() })
  next.addEventListener('click', () => { active = (active + 1) % quotes.length; show() })
  prev.disabled = next.disabled = quotes.length < 2
  append(controls, prev, count, next); append(frame, mark, quote, author, source, controls)
  wrap.append(frame); root.append(wrap); show(); return root
}
