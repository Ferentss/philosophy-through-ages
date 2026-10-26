import type { PhilosophersBlock, Philosopher } from '../../types/blocks'
import { el, append, heading, picture, text, section } from '../../lib/dom'
function openDetails(data: Philosopher) {
  const dialog = el('dialog', 'thinker-dialog')
  const close = el('button', 'dialog-close', '✕'); close.type = 'button'; close.setAttribute('aria-label', 'Закрити')
  close.addEventListener('click', () => dialog.close())
  const content = el('div', 'dialog-inner')
  const visual = picture(data.image?.src, data.image?.alt || data.name, 'dialog-portrait', '/assets/socrates.svg')
  const body = el('div', 'dialog-content')
  append(body, text('span', 'eyebrow', data.epoch || 'ФІЛОСОФ'), text('h2', '', data.name), text('span', 'dialog-years', data.years), text('h3', '', data.idea), text('p', '', data.bio))
  append(content, visual, body); append(dialog, close, content)
  document.body.append(dialog)
  dialog.addEventListener('close', () => dialog.remove(), { once: true })
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close() })
  dialog.showModal()
}
export function renderPhilosophers(data: PhilosophersBlock): HTMLElement {
  const root = section(data.anchor || 'philosophers', 'thinkers-section')
  const wrap = el('div', 'container')
  wrap.append(heading('03 · ОСОБИСТОСТІ', data.title, data.subtitle))
  const cards = el('div', 'thinker-grid')
  for (const thinker of data.items ?? []) {
    const card = el('button', 'thinker-card')
    card.type = 'button'; card.setAttribute('aria-label', `Докладніше: ${thinker.name}`)
    const visual = el('div', 'thinker-photo')
    visual.append(picture(thinker.image?.src, thinker.image?.alt || thinker.name, '', '/assets/socrates.svg'))
    visual.append(text('span', 'thinker-more', 'ДІЗНАТИСЯ БІЛЬШЕ ↗'))
    const copy = el('div', 'thinker-copy')
    append(copy, text('span', 'thinker-years', thinker.years), text('h3', '', thinker.name), text('p', '', thinker.idea))
    append(card, visual, copy)
    card.addEventListener('click', () => openDetails(thinker))
    cards.append(card)
  }
  wrap.append(cards); root.append(wrap); return root
}
