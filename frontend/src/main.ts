import './styles/base.css'
import { ApiError, getCommon, getPage } from './api/client'
import { header } from './layout/header'
import { footer } from './layout/footer'
import { renderBlocks } from './renderBlocks'
import { el, append, text } from './lib/dom'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Елемент #app відсутній')
const root: HTMLDivElement = app

let requestId = 0

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

function showError(error: unknown): void {
  const details = error instanceof Error ? error.message : 'Невідома помилка.'
  const missingPage = error instanceof ApiError && error.status === 404
  const serverError = error instanceof ApiError && error.status >= 500
  const panel = el('div', 'error-state')

  append(
    panel,
    text('span', 'error-symbol', '◇'),
    text('h1', '', missingPage ? 'Сайт ще не наповнено' : 'Не вдалося завантажити сайт'),
    text('p', '', missingPage
      ? 'Відкрийте другий термінал VS Code і виконайте npm run seed. Потім оновіть сторінку.'
      : serverError
        ? 'Payload CMS повернула помилку. Перевірте термінал, у якому працює сервер CMS.'
        : 'Перевірте підключення до CMS і спробуйте ще раз.'),
    text('p', 'error-detail', details),
  )

  const retry = el('button', 'button button-gold', 'Спробувати знову')
  retry.type = 'button'
  retry.addEventListener('click', () => { void start() })
  panel.append(retry)
  root.replaceChildren(panel)
}

async function start(): Promise<void> {
  const currentRequest = ++requestId
  showLoading()

  try {
    // Promise.all завантажує обидва API одночасно.
    const [common, page] = await Promise.all([getCommon(), getPage('/')])
    if (currentRequest !== requestId) return

    if (page.blocks.length === 0) {
      throw new ApiError(404, 'Головна сторінка не містить опублікованих блоків. Додайте блоки у Payload Admin.')
    }

    document.title = page.title || common.siteName
    const main = el('main')
    main.id = 'content'
    main.append(renderBlocks(page.blocks))
    root.replaceChildren(header(common), main, footer(common))

    revealSections()
    if (location.hash && /^#[a-z\d_-]+$/i.test(location.hash)) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
    }
  } catch (error: unknown) {
    if (currentRequest === requestId) showError(error)
  }
}

void start()
