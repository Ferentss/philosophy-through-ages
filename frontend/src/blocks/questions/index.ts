import type { QuestionsBlock } from '../../types/blocks'
import { el, append, heading, text, section } from '../../lib/dom'
export function renderQuestions(data: QuestionsBlock): HTMLElement {
  const root = section(data.anchor || 'questions', 'questions-section')
  const wrap = el('div', 'container question-layout')
  const side = el('div', 'question-head')
  append(side, heading('04 · РОЗДУМИ', data.title), text('p', '', 'Натисніть на запитання, щоб переглянути одну з можливих відповідей.'))
  const list = el('div', 'question-list')
  for (const [index, item] of (data.items ?? []).entries()) {
    const details = el('details', 'question-item')
    const summary = el('summary')
    append(summary, text('span', 'question-num', `${String(index + 1).padStart(2,'0')}.`), text('span', 'question-title', item.question), text('span', 'question-plus', '+'))
    append(details, summary, text('p', 'question-answer', item.answer))
    list.append(details)
  }
  append(wrap, side, list); root.append(wrap); return root
}
