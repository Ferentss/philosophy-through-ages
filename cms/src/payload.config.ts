import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Epochs } from './collections/Epochs'
import { Philosophers } from './collections/Philosophers'
import { Quotes } from './collections/Quotes'
import { Common } from './globals/Common'
import { commonEndpoint, pageEndpoint } from './endpoints'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'

export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: dirname } },
  serverURL: process.env.CMS_URL || 'http://localhost:3000',
  cors: [frontendOrigin], csrf: [frontendOrigin],
  collections: [Users, Media, Pages, Epochs, Philosophers, Quotes],
  globals: [Common],
  endpoints: [commonEndpoint, pageEndpoint],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || '' } }),
  sharp,
  plugins: [vercelBlobStorage({
    enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    collections: { media: true },
    token: process.env.BLOB_READ_WRITE_TOKEN,
    clientUploads: true,
  })],
})
