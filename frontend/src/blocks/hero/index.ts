import type { HeroBlock } from '../../types/blocks'
import { el, append, anchor, picture, text, section } from '../../lib/dom'
export function renderHero(data: HeroBlock): HTMLElement {
  const root = section(data.anchor || 'home', 'hero')
  const grid = el('div', 'container hero-grid')
  const copy = el('div', 'hero-copy')
  append(copy, text('span', 'eyebrow hero-eyebrow', data.badge), text('h1', 'hero-title', data.title), text('p', 'hero-subtitle', data.subtitle || ''))
  const actions = el('div', 'hero-actions')
  for (const b of data.buttons ?? []) actions.append(anchor(b.link, b.text, `button ${b.variant === 'secondary' ? 'button-outline' : 'button-gold'}`))
  copy.append(actions)
  const visual = el('div', 'hero-visual')
  visual.append(picture(data.image?.src, data.image?.alt || 'Антична скульптура мислителя', 'hero-art', '/assets/hero-statue.svg'))
  visual.append(text('span', 'visual-caption', 'ПІЗНАЙ СЕБЕ · ДУМАЙ ГЛИБШЕ'))
  append(grid, copy, visual); root.append(grid)
  root.append(text('span', 'hero-index', '01 / 07 · ДОСЛІДЖУЙ ДУМКУ'))
  return root
}
