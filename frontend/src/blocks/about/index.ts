import type { AboutBlock } from '../../types/blocks'
import { el, append, heading, text, section } from '../../lib/dom'
export function renderAbout(data: AboutBlock): HTMLElement {
  const root = section(data.anchor || 'about', 'about-section')
  const wrap = el('div', 'container')
  append(wrap, heading('01 · ОСНОВИ', data.title), text('p', 'about-intro', data.text))
  const grid = el('div', 'topic-grid')
  for (const topic of data.topics ?? []) {
    const card = el('article', 'topic-card')
    append(card, text('span', 'topic-symbol', topic.icon), text('h3', '', topic.title), text('p', '', topic.text))
    grid.append(card)
  }
  wrap.append(grid); root.append(wrap); return root
}
