import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access'
export const Common: GlobalConfig = {
  slug: 'common', label: 'Налаштування сайту',
  access: { read: () => true, update: isAdmin },
  fields: [
    { name: 'siteName', type: 'text', required: true, label: 'Назва сайту' },
    { name: 'logoText', type: 'text', label: 'Текст логотипа' },
    { name: 'menu', type: 'array', label: 'Головне меню', fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'link', type: 'text', required: true },
    ] },
    { name: 'footer', type: 'group', label: 'Нижня частина сторінки', fields: [
      { name: 'text', type: 'textarea', label: 'Опис' },
    ] },
  ],
}
