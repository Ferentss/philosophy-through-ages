# Філософія крізь віки

Готова структура навчального fullstack-проєкту **для Visual Studio Code**. Односторінковий сайт українською у стилі Dark Academia, з керуванням контентом через справжню Payload CMS і базою PostgreSQL (Neon). Основу взято з наданого `landos-it21-bosco-main`, стару кавову тематику вилучено.

> Visual Studio Code — редактор коду. Для цього завдання **не потрібні Visual Studio, Python, Django, PHP або розширення Live Server**. Використовується стек викладача: **Vite + TypeScript → Payload CMS / Next.js → PostgreSQL**.

## Запуск у VS Code за кілька кроків (Windows)

1. Розпакуйте ZIP у папку, наприклад `C:\Projects\Philosophy_VSCode_Ready`.
2. Запустіть **Visual Studio Code** і відкрийте файл `Philosophy.code-workspace` з цієї папки (**File → Open Workspace from File**). Можна також відкрити всю папку через **File → Open Folder**.
3. Встановіть **Node.js 24.x** або **22.23.4+**, перевірте версію в терміналі VS Code командою `node -v`.
4. У VS Code відкрийте **Terminal → New Terminal** (PowerShell) і виконайте:

```powershell
npm run setup
```

Ця команда створює порожні `.env` із прикладів (не перезаписує існуючі) та виконує встановлення npm-залежностей окремо для `cms/` та `frontend/`. Потрібний інтернет.

5. Відкрийте `cms/.env` **прямо у VS Code** і введіть свої значення:

```env
DATABASE_URL=postgresql://КОРИСТУВАЧ:ПАРОЛЬ@ВАШ-СЕРВЕР/ВАША-БАЗА?sslmode=require
PAYLOAD_SECRET=ВАШ_ДОВГИЙ_ВИПАДКОВИЙ_СЕКРЕТ
CMS_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
BLOB_READ_WRITE_TOKEN=
```

Приклад `DATABASE_URL` є лише шаблоном, а не робочим підключенням. Отримайте реальний рядок у своїй панелі Neon. Для локальної роботи Blob-токен не обов'язковий. Не копіюйте справжні секрети у звіт чи GitHub.

6. У `frontend/.env` повинен бути рядок:

```env
VITE_API_URL=http://localhost:3000
```

7. Запустіть **обидва сервери однією командою** з кореня проєкту:

```powershell
npm run dev
```

8. Відкрийте **http://localhost:3000/admin** і створіть першого адміністратора Payload. Якщо база порожня, дайте CMS можливість ініціалізувати таблиці у development-режимі.
9. Відкрийте ще один термінал VS Code (**Terminal → New Terminal**) і виконайте:

```powershell
npm run seed
```

10. Відкрийте готовий сайт: **http://localhost:5173/**. Змініть щось у Payload Admin і оновіть сторінку, щоб побачити зміни.

**Також можна працювати через меню VS Code:** `Terminal → Run Task` і вибирати `1. Встановити залежності`, `2. Запустити CMS і сайт`, `3. Заповнити базу`, `4. Перевірити TypeScript сайту` тощо. Після запуску серверів клавіша **F5** відкриває Chrome з налагодженням фронтенду. Потрібно, щоб сервер Vite вже працював.

## Де редагувати код

| Що потрібно змінити | Файл або папка |
|---|---|
| Весь вигляд сайту, кольори, адаптивність | `frontend/src/styles/base.css` |
| Завантаження API, loading/error/success | `frontend/src/main.ts` |
| API-запити через `fetch` | `frontend/src/api/client.ts` |
| Типи `interface`, `|`, `&` | `frontend/src/types/` |
| Вибір і рендеринг секцій | `frontend/src/renderBlocks.ts`, `frontend/src/blocks/` |
| Меню та Footer | `frontend/src/layout/` |
| Структура бази і Payload | `cms/src/payload.config.ts`, `cms/src/collections/` |
| Поля секцій, які можна редагувати | `cms/src/blocks/` |
| Публічні API | `cms/src/endpoints.ts` |
| Початковий контент | `cms/src/seed.ts` |
| Старт та перевірки VS Code | `.vscode/`, `scripts/` |
| Звіт викладачу | `docs/report.md` |

## Архітектура і функції

- `frontend/` — **Vite + Vanilla TypeScript**, одна публічна сторінка `/`. Header, Hero, Про філософію, Епохи, Мислителі, Питання, Цитати, Про проєкт, Footer. Адаптивне меню, модальне вікно мислителя, акуратні анімації, перемикач ідей.
- `cms/` — **Next.js + Payload CMS 3 + PostgreSQL**. Адмінпанель `/admin`, колекції `Users`, `Media`, `Pages`, `Epochs`, `Philosophers`, `Quotes`, Global `Common`, блоки CMS, скрипт seed, міграції.
- Основні дані надходять через **`GET /api/common`** та **`GET /api/page?path=/`**, а не з локального JSON. Публічний API повертає вибрані поля та підтримує HTTP-помилки. Медійні адреси Payload приводяться до CMS URL.
- Для користувача реалізовано стани **Loading**, **Error + повторити**, **Success**. Для TypeScript використано строгі типи, `type`, `interface`, union `|`, intersection `&`, `unknown`, `Promise.all` і `try/catch`.

## Корисні команди з термінала VS Code

Усі наведені команди запускайте **з кореня проєкту**:

```powershell
npm run setup            # встановлення залежностей (один раз)
npm run dev              # CMS і сайт одночасно
npm run dev:cms          # тільки адмінпанель / API
npm run dev:site         # тільки Vite сайт
npm run seed             # початкові дані без масового дублювання
npm run typecheck:site  # перевірка TypeScript сайту
npm run typecheck:cms   # перевірка TypeScript CMS
npm run build:site      # production-збірка Vite
npm run build:cms       # production-збірка Next.js / Payload
npm run test            # локальні перевірки структури й фронтенду
```

Для генерації типів Payload у корені:

```powershell
npm --prefix cms run generate:types
```

Ручні адреси перевірки API:

- `http://localhost:3000/api/common` — глобальні налаштування.
- `http://localhost:3000/api/page?path=%2F` — блоки головної.
- `http://localhost:3000/api/page?path=%3Cscript%3E` — має повертати HTTP 400.
- `http://localhost:3000/api/page?path=%2Fno-page` — має повертати HTTP 404.

## База, міграції й обмеження

Для Payload потрібна реальна PostgreSQL/Neon БД; **SQLite не використовується**. Локально Payload у development може оновлювати схему самостійно. Міграції в `cms/src/migrations/` включають початкову схему й адаптацію до філософських секцій. **Адаптаційні міграції ще не перевірено на реальній Neon-базі, а друга міграція не має автоматично згенерованого snapshot**; перед production запуском протестуйте їх на окремій БД й створіть резервну копію. Вони не призначені для сліпого застосування до важливої існуючої БД.

```powershell
npm --prefix cms run migrate
npm --prefix cms run migrate:status
```

**Увага щодо npm-залежностей:** Виправлено прямий конфлікт версій: Payload і адаптер Blob мають спільну версію `3.90.2`. Lock-файл відкориговано, але пакетний реєстр був недоступний, тому перевірити завантаження саме цих пакетів, цілісність усього dependency graph та `npm ci` **не вдалося**. Для двох відкоригованих записів у lock відсутні перевірені integrity-хеші; після першого успішного встановлення слід виконати `npm install --package-lock-only` у `cms/`, перевірити lock-файл і повторно виконати `npm ci` на чистій папці. Перед здачею обов'язково перевірте це на своєму комп'ютері.

## Vercel: два проєкти з одного репозиторію

1. Завантажте файли в GitHub **без `.env`**, токенів і `node_modules`.
2. Створіть у Vercel проєкт **CMS**, Root Directory = `cms`, Framework = **Next.js**, Install = `npm ci`, Build = `npm run build`.
3. Додайте CMS environment variables: `DATABASE_URL`, `PAYLOAD_SECRET`, `CMS_URL` (домен CMS), `FRONTEND_URL` (домен сайту), `BLOB_READ_WRITE_TOKEN` (токен створеного Blob Store).
4. Створіть інший проєкт **сайту**, Root Directory = `frontend`, Framework = **Vite**, Install = `npm ci`, Build = `npm run build`, Output = `dist`. Перед збіркою встановіть `VITE_API_URL` (домен CMS).
5. Випробуйте міграції у тестовій БД, після підтвердження виконайте їх для production через контрольований процес, без видалення даних.
6. Перевірте `/admin`, `/api/common`, `/api/page?path=/`, CORS, медіафайли, редагування матеріалів, навігацію та мобільну версію. Не використовуйте локальну файлову систему Vercel для постійних завантажень.

Розгортання в Vercel **не виконувалося**: потрібні власні облікові дані та база.

## Відповідність 3.1–3.4

| Вимога | Реалізація |
|---|---|
| **3.1 Payload + архітектура** | `cms/src/payload.config.ts`, `cms/src/collections/`, `cms/src/blocks/`, `cms/src/globals/Common.ts`, `cms/src/endpoints.ts` |
| **3.2 UI, запити і стани** | `frontend/src/main.ts`, `frontend/src/api/client.ts`, `frontend/src/renderBlocks.ts`, `frontend/src/blocks/`, `frontend/src/styles/base.css` |
| **3.3 TypeScript** | `frontend/src/types/blocks.ts`, `frontend/src/types/api.ts`, `frontend/src/api/client.ts`; `npm run typecheck:site`; Payload types: `npm --prefix cms run generate:types` |
| **3.4 Деплой** | `cms/.env.example`, `frontend/.env.example`, `cms/next.config.ts`, `frontend/vite.config.ts`, інструкції Vercel вище |

## Git-коміти

У ZIP **включена папка `.git` із сімома локальними комітами**: базова версія, залежності, дані та міграції, безпека API, перевірка frontend JSON, функціональні тести, документація. Це **локальна історія**, не публікація в GitHub. Переглянути її можна у VS Code в Source Control або командою:

```powershell
git log --oneline -7
```

Перед завантаженням на GitHub перевірте `git status`, не додавайте `.env` та особисті ключі. Докладніше: `docs/git-history.md`.

## Що фактично перевірено

Перевірки API на імітованому Payload, валідації JSON і структури коду можна повторити командою `npm run test` (18 тестів), вона працює без підключення до Neon. Встановлення npm-залежностей, повну збірку CMS, інтеграційні HTTP-тести, створення користувача, роботу Media та production-міграції потрібно додатково перевірити після встановлення залежностей та налаштування робочої БД. Даних для скриншотів `docs/` не вигадано.

Додаткова інструкція: `docs/VSCode.md`. Матеріали звіту викладачу: `docs/report.md`; список перевірок: `docs/testing.md`.

## Підсумок аудиту

Виправлено конфлікт Payload/Blob, повторне наповнення Common, валідацію шляху `/`, захист завантажень у Vercel, перевірку отриманого JSON і помилку обробки натискання у мобільному меню. Наявні `18` локальних тестів. **Це не замінює** повний запуск CMS: перевірки Postgres, реального адміністратора, зміни зображень, production-міграцій і двох деплоїв залишаються обов'язковими. Повний чесний перелік міститься в `docs/testing.md`.
