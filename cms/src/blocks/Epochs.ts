import type { Block } from 'payload'
export const EpochsBlock: Block = {
  slug: 'epochs', labels: { singular: 'Епохи', plural: 'Епохи' },
  fields: [
    { name: 'anchor', type: 'text', defaultValue: 'epochs' },
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'textarea' },
  ],
}
