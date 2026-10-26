import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
export const Philosophers: CollectionConfig = {
  slug: 'philosophers', labels: { singular: 'Філософ', plural: 'Філософи' },
  admin: { useAsTitle: 'name' },
  access: { read: () => true, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true, label: "Ім'я" },
    { name: 'years', type: 'text', required: true, label: 'Роки життя' },
    { name: 'idea', type: 'text', required: true, label: 'Основна ідея' },
    { name: 'bio', type: 'textarea', required: true, label: 'Біографія' },
    { name: 'epoch', type: 'relationship', relationTo: 'epochs', label: 'Епоха' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Фото' },
    { name: 'imageUrl', type: 'text', label: 'Адреса запасного зображення' },
    { name: 'order', type: 'number', defaultValue: 0, required: true },
  ],
}
