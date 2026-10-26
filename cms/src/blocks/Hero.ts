import type { Block } from 'payload'
export const Hero: Block = {
  slug: 'hero', labels: { singular: 'Головний екран', plural: 'Головний екран' },
  fields: [
    { name: 'anchor', type: 'text', defaultValue: 'home', label: 'ID секції' },
    { name: 'badge', type: 'text', label: 'Підпис' },
    { name: 'title', type: 'text', required: true, label: 'Назва' },
    { name: 'subtitle', type: 'textarea', label: 'Опис' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Фонове фото (за потреби)' },
    { name: 'buttons', type: 'array', maxRows: 2, label: 'Кнопки', fields: [
      { name: 'text', type: 'text', required: true },
      { name: 'link', type: 'text', required: true },
      { name: 'variant', type: 'select', defaultValue: 'primary', options: [
        { label: 'Основна', value: 'primary' }, { label: 'Додаткова', value: 'secondary' },
      ] },
    ] },
  ],
}
