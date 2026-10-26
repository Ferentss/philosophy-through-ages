import type { Block } from 'payload'
export const ProjectInfo: Block = {
  slug: 'projectInfo', labels: { singular: 'Про проєкт', plural: 'Про проєкт' },
  fields: [
    { name: 'anchor', type: 'text', defaultValue: 'project' },
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea', required: true },
    { name: 'contactEmail', type: 'email', label: 'Контакт (необов’язково)' },
  ],
}
