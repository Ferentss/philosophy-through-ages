import type { CommonResponse } from '../types/api'
import { el, append, anchor } from '../lib/dom'
export function header(common: CommonResponse): HTMLElement {
  const top = el('header', 'site-header')
  const inner = el('div', 'header-inner container')
  const brand = anchor('#home', common.logoText || common.siteName, 'brand')
  brand.prepend(el('span', 'brand-mark', 'Φ'))
  const nav = el('nav', 'header-nav')
  nav.id = 'main-navigation'
  nav.setAttribute('aria-label', 'Головна навігація')
  const links = common.menu.filter((m) => typeof m.link === 'string' && /^#[a-z\d_-]+$/i.test(m.link))
  for (const item of links) nav.append(anchor(item.link, item.label))
  const toggle = el('button', 'menu-toggle', '☰')
  toggle.type = 'button'; toggle.setAttribute('aria-label', 'Відкрити меню')
  toggle.setAttribute('aria-controls', nav.id); toggle.setAttribute('aria-expanded', 'false')
  function setOpen(open: boolean) {
    nav.classList.toggle('open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню')
    toggle.textContent = open ? '✕' : '☰'
  }
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')))
  nav.addEventListener('click', (event) => { if ((event.target as HTMLElement).closest('a')) setOpen(false) })
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false) })
  append(inner, brand, nav, toggle); top.append(inner)
  return top
}
