import type { Block } from 'payload'
export const PhilosophersBlock: Block = {
  slug: 'philosophers', labels: { singular: 'Філософи', plural: 'Філософи' },
  fields: [
    { name: 'anchor', type: 'text', defaultValue: 'philosophers' },
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'textarea' },
  ],
}
