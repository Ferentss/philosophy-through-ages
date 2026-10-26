import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
import { Hero } from '../blocks/Hero'
import { Features } from '../blocks/Features'
import { About } from '../blocks/About'
import { EpochsBlock } from '../blocks/Epochs'
import { PhilosophersBlock } from '../blocks/Philosophers'
import { Questions } from '../blocks/Questions'
import { QuotesBlock } from '../blocks/Quotes'
import { ProjectInfo } from '../blocks/ProjectInfo'
export const Pages: CollectionConfig = {
  slug: 'pages', labels: { singular: 'Сторінка', plural: 'Сторінки' },
  admin: { useAsTitle: 'title' },
  access: { read: () => true, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'path', type: 'text', required: true, unique: true, defaultValue: '/', label: 'Адреса сторінки',
      validate: (value: unknown) => value === '/' || 'Цей сайт має тільки одну публічну сторінку: /' },
    { name: 'title', type: 'text', required: true, label: 'Назва сторінки' },
    { name: 'blocks', type: 'blocks', required: true, label: 'Блоки', blocks: [
      Hero, About, Features, EpochsBlock, PhilosophersBlock, Questions, QuotesBlock, ProjectInfo,
    ] },
  ],
}
