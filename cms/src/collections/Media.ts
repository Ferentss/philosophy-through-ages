import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
export const Media: CollectionConfig = {
  slug: 'media', labels: { singular: 'Зображення', plural: 'Медіафайли' },
  access: { read: () => true, create: isAdmin, update: isAdmin, delete: isAdmin },
  upload: { mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] },
  fields: [{ name: 'alt', type: 'text', required: true, label: 'Опис зображення' }],
}
