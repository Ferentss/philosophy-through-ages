import type { CollectionConfig } from 'payload'
export const Users: CollectionConfig = {
  slug: 'users', labels: { singular: 'Адміністратор', plural: 'Адміністратори' },
  auth: true, admin: { useAsTitle: 'email' },
  // Першого адміністратора Payload створює через власний екран реєстрації.
  // Далі облікові записи може додавати лише адміністратор.
  access: {
    read: ({ req }) => Boolean(req.user),
    create: async ({ req }) => Boolean(req.user) || (await req.payload.count({ collection: 'users', overrideAccess: true })).totalDocs === 0,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [],
}
