import type { Block } from 'payload'
export const Questions: Block = {
  slug: 'questions', labels: { singular: 'Запитання', plural: 'Запитання' },
  fields: [
    { name: 'anchor', type: 'text', defaultValue: 'questions' },
    { name: 'title', type: 'text', required: true },
    { name: 'items', type: 'array', label: 'Питання та відповіді', fields: [
      { name: 'question', type: 'text', required: true },
      { name: 'answer', type: 'textarea', required: true },
    ] },
  ],
}
