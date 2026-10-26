import type { EpochsBlock } from '../../types/blocks'
import { el, append, heading, picture, text, section } from '../../lib/dom'
export function renderEpochs(data: EpochsBlock): HTMLElement {
  const root = section(data.anchor || 'epochs', 'epochs-section')
  const wrap = el('div', 'container')
  wrap.append(heading('02 · ІСТОРІЯ', data.title, data.subtitle))
  const cards = el('div', 'epoch-grid')
  for (const [index, epoch] of (data.items ?? []).entries()) {
    const card = el('article', 'epoch-card')
    const photo = el('div', 'epoch-photo')
    photo.append(picture(epoch.image?.src, epoch.image?.alt || epoch.title, '', `/assets/${['antiquity','medieval','renaissance','modern','contemporary'][index % 5]}.svg`))
    photo.append(text('span', 'epoch-index', String(index + 1).padStart(2, '0')))
    const body = el('div', 'epoch-info')
    append(body, text('span', 'epoch-period', epoch.period), text('h3', '', epoch.title), text('p', '', epoch.description))
    if (epoch.detail) body.append(text('p', 'epoch-detail', epoch.detail))
    append(card, photo, body); cards.append(card)
  }
  wrap.append(cards); root.append(wrap); return root
}
