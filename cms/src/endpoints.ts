
import { headersWithCors, type Endpoint } from 'payload'

// Додаємо CORS-заголовки до відповідей власних API.
// Дозволені адреси беруться з cors у payload.config.ts.
function withCors(handler: Endpoint['handler']): Endpoint['handler'] {
  return async (req) => {
    const response = await handler(req)

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headersWithCors({
        headers: new Headers(response.headers),
        req,
      }),
    })
  }
}

// Публічний API повертає лише потрібні сайту дані.
type Item = Record<string, unknown>

function asObject(value: unknown): Item {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Item
    : {}
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function pickText(value: unknown, keys: string[]): Record<string, string> {
  const source = asObject(value)
  const result: Record<string, string> = {}

  for (const key of keys) {
    result[key] = asString(source[key])
  }

  return result
}

function pickList(value: unknown, keys: string[]): Record<string, string>[] {
  return asArray(value).map((item) => pickText(item, keys))
}

export function mediaImage(
  value: unknown,
  backup: unknown = '',
): { src: string; alt: string } | null {
  const media = asObject(value)
  const url = asString(media.url) || asString(backup)

  if (!url) return null

  // Локальні SVG-ілюстрації сайту.
  if (url.startsWith('/assets/')) {
    return {
      src: url,
      alt: asString(media.alt),
    }
  }

  // Файли, завантажені через Payload.
  if (url.startsWith('/api/media/file/')) {
    const cmsUrl = (
      process.env.CMS_URL || 'http://localhost:3000'
    ).replace(/\/+$/, '')

    const src = process.env.NODE_ENV === 'production'
      ? `${cmsUrl}${url}`
      : url

    return {
      src,
      alt: asString(media.alt),
    }
  }

  // Зовнішні файли, зокрема Vercel Blob.
  if (/^https?:\/\//i.test(url)) {
    return {
      src: url,
      alt: asString(media.alt),
    }
  }

  return null
}

function publicEpoch(value: unknown) {
  const entry = asObject(value)

  return {
    ...pickText(entry, [
      'title',
      'period',
      'description',
      'detail',
    ]),
    image: mediaImage(entry.image, entry.imageUrl),
  }
}

function publicPhilosopher(value: unknown) {
  const entry = asObject(value)

  return {
    ...pickText(entry, [
      'name',
      'years',
      'idea',
      'bio',
    ]),
    image: mediaImage(entry.image, entry.imageUrl),
    epoch: asString(asObject(entry.epoch).title),
  }
}

function publicQuote(value: unknown) {
  const entry = asObject(value)

  return {
    ...pickText(entry, [
      'text',
      'author',
      'source',
    ]),
    isParaphrase: entry.isParaphrase !== false,
  }
}

// ======================================
// API: GET /api/common
// ======================================

export const commonEndpoint: Endpoint = {
  path: '/common',
  method: 'get',

  handler: withCors(async (req) => {
    try {
      const settings = asObject(
        await req.payload.findGlobal({
          slug: 'common',
          depth: 0,
          overrideAccess: false,
        }),
      )

      return Response.json(
        {
          siteName: asString(settings.siteName),
          logoText:
            asString(settings.logoText) ||
            asString(settings.siteName),
          menu: pickList(settings.menu, [
            'label',
            'link',
          ]),
          footer: {
            text: asString(
              asObject(settings.footer).text,
            ),
          },
        },
        {
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      )
    } catch (error: unknown) {
      req.payload.logger.error(
        { err: error },
        'Помилка API common',
      )

      return Response.json(
        {
          error: 'Не вдалося завантажити налаштування.',
        },
        {
          status: 500,
        },
      )
    }
  }),
}

// ======================================
// API: GET /api/page?path=/
// ======================================

export const pageEndpoint: Endpoint = {
  path: '/page',
  method: 'get',

  handler: withCors(async (req) => {
    const params = new URL(
      req.url ?? 'http://localhost/',
    ).searchParams

    const paths = params.getAll('path')

    const requestedPath =
      paths.length === 1 &&
      [...params.keys()].every((key) => key === 'path')
        ? paths[0]
        : null

    if (
      !requestedPath ||
      requestedPath.length > 128 ||
      !/^\/[a-zA-Z0-9/_-]*$/.test(requestedPath)
    ) {
      return Response.json(
        {
          error: 'Некоректний шлях сторінки.',
        },
        {
          status: 400,
        },
      )
    }

    try {
      const result = await req.payload.find({
        collection: 'pages',
        where: {
          path: {
            equals: requestedPath,
          },
        },
        depth: 1,
        limit: 1,
        overrideAccess: false,
      })

      const page = result.docs[0]

      if (!page) {
        return Response.json(
          {
            error:
              'Головну сторінку ще не створено. Запустіть npm run seed з кореня проєкту.',
            code:
              requestedPath === '/'
                ? 'CONTENT_NOT_INITIALIZED'
                : 'PAGE_NOT_FOUND',
          },
          {
            status: 404,
          },
        )
      }

      const sourceBlocks = asArray(
        asObject(page).blocks,
      )

      const blockTypes = new Set(
        sourceBlocks.map((block) =>
          asString(asObject(block).blockType),
        ),
      )

      // Отримуємо дані тільки для блоків,
      // які присутні на сторінці.
      const [epochs, philosophers, quotes] =
        await Promise.all([
          blockTypes.has('epochs')
            ? req.payload.find({
                collection: 'epochs',
                depth: 1,
                sort: 'order',
                limit: 100,
                overrideAccess: false,
              })
            : Promise.resolve(null),

          blockTypes.has('philosophers')
            ? req.payload.find({
                collection: 'philosophers',
                depth: 1,
                sort: 'order',
                limit: 100,
                overrideAccess: false,
              })
            : Promise.resolve(null),

          blockTypes.has('quotes')
            ? req.payload.find({
                collection: 'quotes',
                depth: 0,
                sort: 'order',
                limit: 100,
                overrideAccess: false,
              })
            : Promise.resolve(null),
        ])

      const blocks = sourceBlocks.map((value) => {
        const block = asObject(value)
        const type = asString(block.blockType)

        const base = {
          type,
          anchor: asString(block.anchor),
          title: asString(block.title),
          subtitle: asString(block.subtitle),
        }

        switch (type) {
          case 'hero':
            return {
              ...base,
              badge: asString(block.badge),
              image: mediaImage(block.image),
              buttons: pickList(block.buttons, [
                'text',
                'link',
                'variant',
              ]),
            }

          case 'about':
            return {
              ...base,
              text: asString(block.text),
              topics: pickList(block.topics, [
                'icon',
                'title',
                'text',
              ]),
            }

          case 'features':
            return {
              ...base,
              items: pickList(block.items, [
                'icon',
                'title',
                'text',
              ]),
            }

          case 'epochs':
            return {
              ...base,
              items: epochs?.docs.map(publicEpoch) ?? [],
            }

          case 'philosophers':
            return {
              ...base,
              items:
                philosophers?.docs.map(publicPhilosopher) ?? [],
            }

          case 'questions':
            return {
              ...base,
              items: pickList(block.items, [
                'question',
                'answer',
              ]),
            }

          case 'quotes':
            return {
              ...base,
              items: quotes?.docs.map(publicQuote) ?? [],
            }

          case 'projectInfo':
            return {
              ...base,
              text: asString(block.text),
              contactEmail: asString(block.contactEmail),
            }

          default:
            return {
              type: 'unknown',
            }
        }
      })

      return Response.json(
        {
          path: asString(asObject(page).path),
          title: asString(asObject(page).title),
          blocks,
        },
        {
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      )
    } catch (error: unknown) {
      req.payload.logger.error(
        { err: error },
        'Помилка API page',
      )

      return Response.json(
        {
          error: 'Помилка завантаження сторінки.',
        },
        {
          status: 500,
        },
      )
    }
  }),
}
