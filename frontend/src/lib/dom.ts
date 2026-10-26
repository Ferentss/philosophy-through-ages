// Безпечне створення HTML: текст з CMS не підставляється в innerHTML.
export function el<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', value?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (value !== undefined) element.textContent = value
  return element
}
export function append(parent: HTMLElement, ...children: Array<Node | null | undefined>): HTMLElement {
  children.forEach((child) => { if (child) parent.append(child) })
  return parent
}
export function text(tag: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span', className: string, value: string) { return el(tag, className, value) }
export function anchor(href: string, label: string, className = ''): HTMLAnchorElement {
  const a = el('a', className, label)
  a.href = /^#[a-z\d_-]+$/i.test(href) ? href : '#home'
  return a
}
export function section(id: string, className: string): HTMLElement {
  const s = el('section', `section ${className}`)
  s.id = /^[a-z\d_-]+$/i.test(id) ? id : 'section'
  return s
}
export function heading(kicker: string, title: string, subtitle?: string): HTMLElement {
  const wrap = el('div', 'section-heading')
  append(wrap, text('span', 'eyebrow', kicker), text('h2', 'section-title', title))
  if (subtitle) wrap.append(text('p', 'section-lede', subtitle))
  return wrap
}
export function picture(src: string | undefined, alt: string, className: string, fallback: string): HTMLImageElement {
  const img = el('img', className)
  img.src = src && (src.startsWith('/assets/') || /^https?:\/\//i.test(src)) ? src : fallback
  img.alt = alt
  img.loading = 'lazy'
  img.decoding = 'async'
  img.addEventListener('error', () => { if (!img.src.endsWith(fallback)) img.src = fallback }, { once: true })
  return img
}
