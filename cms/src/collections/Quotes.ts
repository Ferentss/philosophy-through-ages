import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
export const Quotes: CollectionConfig = {
  slug: 'quotes', labels: { singular: 'Ідея / цитата', plural: 'Ідеї та цитати' },
  admin: { useAsTitle: 'author' },
  access: { read: () => true, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'text', type: 'textarea', required: true, label: 'Текст' },
    { name: 'author', type: 'text', required: true, label: 'Автор' },
    { name: 'source', type: 'text', label: 'Джерело (якщо відоме)' },
    { name: 'isParaphrase', type: 'checkbox', defaultValue: true, label: 'Це переказ ідеї, не пряма цитата' },
    { name: 'philosopher', type: 'relationship', relationTo: 'philosophers', label: 'Філософ' },
    { name: 'order', type: 'number', defaultValue: 0, required: true },
  ],
}
