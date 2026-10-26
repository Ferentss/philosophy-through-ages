import type { Block } from 'payload'
// Збережений і доопрацьований базовий блок початкового ZIP.
export const Features: Block = {
  slug: 'features', labels: { singular: 'Інформаційні картки', plural: 'Інформаційні картки' },
  fields: [
    { name: 'anchor', type: 'text', label: 'ID секції' },
    { name: 'title', type: 'text', required: true, label: 'Заголовок' },
    { name: 'items', type: 'array', fields: [
      { name: 'icon', type: 'text', required: true },
      { name: 'title', type: 'text', required: true },
      { name: 'text', type: 'textarea' },
    ] },
  ],
}
