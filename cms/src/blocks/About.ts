import type { Block } from 'payload'
export const About: Block = {
  slug: 'about', labels: { singular: 'Про філософію', plural: 'Про філософію' },
  fields: [
    { name: 'anchor', type: 'text', defaultValue: 'about' },
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea', required: true, label: 'Опис' },
    { name: 'topics', type: 'array', label: 'Напрями філософії', fields: [
      { name: 'icon', type: 'text', required: true },
      { name: 'title', type: 'text', required: true },
      { name: 'text', type: 'textarea', required: true },
    ] },
  ],
}
