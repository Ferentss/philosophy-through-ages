import type { Block } from 'payload'
export const QuotesBlock: Block = {
  slug: 'quotes', labels: { singular: 'Цитати', plural: 'Цитати' },
  fields: [
    { name: 'anchor', type: 'text', defaultValue: 'quotes' },
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'textarea' },
  ],
}
