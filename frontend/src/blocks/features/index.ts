import type { FeaturesBlock } from '../../types/blocks'
import { el, append, heading, text, section } from '../../lib/dom'
export function renderFeatures(data: FeaturesBlock): HTMLElement {
  const root = section(data.anchor || 'features', 'about-section')
  const wrap = el('div', 'container')
  wrap.append(heading('НАПРЯМИ', data.title))
  const grid = el('div', 'topic-grid')
  for (const item of data.items ?? []) {
    const card = el('article', 'topic-card')
    append(card, text('span', 'topic-symbol', item.icon), text('h3', '', item.title), text('p', '', item.text))
    grid.append(card)
  }
  wrap.append(grid); root.append(wrap); return root
}
