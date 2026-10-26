import type { ProjectInfoBlock } from '../../types/blocks'
import { el, append, heading, text, section } from '../../lib/dom'
export function renderProjectInfo(data: ProjectInfoBlock): HTMLElement {
  const root = section(data.anchor || 'project', 'project-section')
  const inner = el('div', 'container project-layout')
  const copy = el('div')
  append(copy, heading('06 · ПРО НАС', data.title), text('p', 'project-text', data.text))
  if (data.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
    const link = el('a', 'contact-link', `Написати: ${data.contactEmail}`)
    link.href = `mailto:${data.contactEmail}`; copy.append(link)
  }
  append(inner, copy, text('span', 'project-monogram', 'Φ'))
  root.append(inner); return root
}
