import './styles/base.css'
import { ApiError, getCommon, getPage } from './api/client'
import { header } from './layout/header'
import { footer } from './layout/footer'
import { renderBlocks } from './renderBlocks'
import { el, append, text } from './lib/dom'
import type { CommonResponse, PageResponse } from './types/api'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Елемент #app відсутній')
const root: HTMLDivElement = app
let requestId = 0

// Перегляд прикладу доступний лише у Vite dev і ніколи не замінює дані у production.
const previewRequested = import.meta.env.DEV &&
  new URLSearchParams(location.search).get('preview') === '1'

function revealSections(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!('IntersectionObserver' in window)) return

  const sections = document.querySelectorAll<HTMLElement>('.section:not(.hero)')
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    }
  }, { threshold: 0.08 })

  for (const section of sections) {
    section.classList.add('will-reveal')
    observer.observe(section)
  }
}

function showLoading(): void {
  root.replaceChildren(
    append(el('div', 'loading'), el('div', 'spinner'), text('p', '', 'Завантажуємо світ ідей…')),
  )
}

function showPage(common: CommonResponse, page: PageResponse, demo = false): void {
  document.title = page.title || common.siteName
  const main = el('main')
  main.id = 'content'
  main.append(renderBlocks(page.blocks))

  const nodes: Node[] = []
  if (demo) {
    const notice = el('div', 'preview-banner')
    notice.setAttribute('role', 'status')
    notice.append(text('span', '', 'ДЕМО ДИЗАЙНУ · Це не дані з CMS. Щоб опублікувати сайт, виконай npm run seed.'))
    const close = el('a', '', 'Перевірити живий сайт ↗')
    close.href = '/'
    notice.append(close)
    nodes.push(notice)
  }

  nodes.push(header(common), main, footer(common))
  root.replaceChildren(...nodes)
  revealSections()

  if (location.hash && /^#[a-z\d_-]+$/i.test(location.hash)) {
    document.getElementById(location.hash.slice(1))?.scrollIntoView()
  }
}

async function showPreview(): Promise<void> {
  // Демо завантажується окремим чанком, лише коли його явно відкрили
  // або початкова сторінка ще не існує в базі розробки.
  const { previewCommon, previewPage } = await import('./preview')
  showPage(previewCommon, previewPage, true)
}

function showError(error: unknown): void {
  const details = error instanceof Error ? error.message : 'Невідома помилка.'
  const serverError = error instanceof ApiError && error.status >= 500
  const panel = el('div', 'error-state')

  append(panel,
    text('span', 'error-symbol', '◇'),
    text('span', 'eyebrow', 'НЕ ВДАЛОСЯ ПІДКЛЮЧИТИ CMS'),
    text('h1', '', 'Не вдалося завантажити сайт'),
    text('p', '', serverError
      ? 'CMS повернула помилку. Перевір термінал Payload CMS і DATABASE_URL у cms/.env.'
      : 'Перевір, чи працюють CMS і PostgreSQL. Дані сайту беруться з Payload API.'),
    text('p', 'error-detail', details),
  )

  const retry = el('button', 'button button-gold', 'Спробувати знову')
  retry.type = 'button'
  retry.addEventListener('click', () => { void start() })
  panel.append(retry)

  if (import.meta.env.DEV) {
    const previewLink = el('a', 'button button-outline', 'Переглянути дизайн сайту')
    previewLink.href = '/?preview=1'
    panel.append(previewLink)
  }
  root.replaceChildren(panel)
}

async function start(): Promise<void> {
  const currentRequest = ++requestId
  showLoading()

  try {
    if (previewRequested) {
      await showPreview()
      return
    }

    // Звичайний сайт завжди читає обидва JSON API Payload CMS.
    const [common, page] = await Promise.all([getCommon(), getPage('/')])
    if (currentRequest !== requestId) return
    if (page.blocks.length === 0) {
      throw new ApiError(404, 'У CMS ще немає блоків головної сторінки. Виконай npm run seed.')
    }
    showPage(common, page)
  } catch (error: unknown) {
    if (currentRequest !== requestId) return
    // Якщо CMS доступна, але немає запису Pages, показуємо чітко позначене демо.
    // Після npm run seed оновлення звичайної адреси покаже дані з PostgreSQL.
    if (import.meta.env.DEV && error instanceof ApiError && error.status === 404) {
      try {
        await showPreview()
        return
      } catch (previewError: unknown) {
        showError(previewError)
        return
      }
    }
    showError(error)
  }
}

void start()
