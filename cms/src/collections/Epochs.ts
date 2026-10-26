import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
export const Epochs: CollectionConfig = {
  slug: 'epochs', labels: { singular: 'Епоха', plural: 'Епохи' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'period', 'order'] },
  access: { read: () => true, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, label: 'Ключ' },
    { name: 'title', type: 'text', required: true, label: 'Назва' },
    { name: 'period', type: 'text', required: true, label: 'Період' },
    { name: 'description', type: 'textarea', required: true, label: 'Опис' },
    { name: 'detail', type: 'textarea', label: 'Цікаві факти' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Завантажене фото' },
    { name: 'imageUrl', type: 'text', label: 'Адреса запасного зображення' },
    { name: 'order', type: 'number', required: true, defaultValue: 0, label: 'Порядок' },
  ],
}
