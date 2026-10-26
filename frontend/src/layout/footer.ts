import type { CommonResponse } from '../types/api'
import { el, append, anchor, text } from '../lib/dom'
export function footer(common: CommonResponse): HTMLElement {
  const foot = el('footer', 'site-footer')
  const inner = el('div', 'container footer-content')
  const left = el('div')
  append(left, text('h3', 'footer-logo', 'Φ ' + common.siteName), text('p', '', common.footer.text))
  const links = el('div', 'footer-links')
  for (const item of common.menu.filter((i) => /^#[a-z\d_-]+$/i.test(i.link))) links.append(anchor(item.link, item.label))
  append(inner, left, links); foot.append(inner)
  foot.append(text('p', 'footer-copy', `© ${new Date().getFullYear()} · Навчальний проєкт про філософію`))
  return foot
}
