# Філософія крізь віки

Готова структура навчального fullstack-проєкту **для Visual Studio Code**. Односторінковий сайт українською у стилі Dark Academia, з керуванням контентом через справжню Payload CMS і базою PostgreSQL (Neon). Основу взято з наданого `landos-it21-bosco-main`, стару кавову тематику вилучено.

> Visual Studio Code — редактор коду. Для цього завдання **не потрібні Visual Studio, Python, Django, PHP або розширення Live Server**. Використовується стек викладача: **Vite + TypeScript → Payload CMS / Next.js → PostgreSQL**.

## ВАЖЛИВО: де справжній сайт та як його побачити

**Адмінпанель уже відкривається, але на :5173 помилка?** Це означає, що CMS запущено, проте **стартову сторінку ще треба записати у PostgreSQL**. Це не помилка CSS. Зробіть так у VS Code:

1. Залиште `npm run dev` запущеним у першому терміналі.
2. Відкрийте **другий** термінал у корені проєкту і виконайте `npm run seed` (додає тільки відсутні початкові записи). Якщо ви використовуєте важливу production-базу Neon, спочатку зробіть тестову гілку або резервну копію.
3. Виконайте `npm run check:site` — перевірка має показати 7 блоків, 5 епох, 6 філософів і цитати.
4. Оновіть **http://localhost:5173/** — це оформлений односторінковий сайт із темною темою, картками та меню.

**Якщо хочете спочатку подивитися дизайн без бази:** відкрийте **http://localhost:5173/?preview=1**. Це *позначене демо*, його дані не редагуються в Payload. Якщо CMS не містить сторінки, девсервер також може показати це демо з попереджувальною стрічкою. Після `npm run seed` звичайна адреса `/` знову бере контент **тільки з Payload API**.

**Різниця між портами:** `:3000/admin` — лише редактор контенту Payload CMS, а `:5173` — оформлений сайт для відвідувача. Корінь CMS `:3000/` перенаправляє на Vite. Не намагайтеся відкривати сайт через `manage.py` або VS Code Live Server.

**Якщо розпакували нову версію після того, як Neon уже працював у старій:** перенесіть **лише ваш власний** `cms/.env` у нову папку `cms/` (без публікації, без Git). `frontend/.env` не повинен містити `PAYLOAD_SECRET` чи пароль БД.

## Запуск у VS Code за кілька кроків (Windows)

1. Розпакуйте ZIP у папку, наприклад `C:\Projects\Philosophy_VSCode_Ready`.
2. Запустіть **Visual Studio Code** і відкрийте файл `Philosophy.code-workspace` з цієї папки (**File → Open Workspace from File**). Можна також відкрити всю папку через **File → Open Folder**.
3. Встановіть **Node.js 24.x** або **22.23.4+**, перевірте версію в терміналі VS Code командою `node -v`.
4. У VS Code відкрийте **Terminal → New Terminal** (PowerShell) і виконайте:

```powershell
npm run setup
```

Ця команда створює `.env` із прикладів (не перезаписує існуючі) та встановлює залежності окремо для `cms/` та `frontend/`. У `cms/` вона використовує `npm install`: попередній lock-файл мав відсутні транзитивні пакети, тому npm **перегенерує його на вашому комп’ютері**. Для `frontend/` використовується `npm ci`. Потрібний інтернет. Після успішного встановлення додайте оновлений `cms/package-lock.json` у Git.

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
VITE_API_URL=
```

У режимі розробки залиште значення **порожнім**: Vite сам передає запити `/api` до CMS. Це працює також через локальну мережу. Для production у Vercel задайте публічний CMS URL.

7. Запустіть **обидва сервери однією командою** з кореня проєкту:

```powershell
npm run dev
```

8. Відкрийте **http://localhost:3000/admin** і створіть першого адміністратора Payload. Якщо база порожня, дайте CMS можливість ініціалізувати таблиці у development-режимі.
9. **Важливо: Payload Admin — це не публічний сайт.**
   - `http://localhost:3000/admin` — редактор даних (окремий застосунок).
   - `http://localhost:5173/` — **повний односторінковий сайт** із секціями від Hero до Footer.
   - `http://localhost:3000/` — перенаправлення до Vite-сайту.

   Якщо адміністративна панель відкрилася, але сайт показує 404 або 500, перевірте наявність стартових даних. Якщо база порожня, наступна команда створить їх. **На Neon production спочатку зробіть резервну копію/тестову гілку, бо seed записує дані.**

10. Відкрийте ще один термінал VS Code (**Terminal → New Terminal**) і виконайте:

```powershell
npm run seed
```

11. Перевірте, що API справді повертає контент:

```powershell
npm run check:site
```

Повинні відобразитися `/api/common`, `/api/page`, кількість секцій, епох, філософів і цитат. Якщо API повертає `404`, перевірте створення головної сторінки через seed. Якщо `500`, дивіться першу помилку у терміналі CMS. Для `npm run check:site` обидва сервери мають працювати.

12. Відкрийте готовий сайт: **http://localhost:5173/**. Змініть щось у Payload Admin і оновіть сторінку, щоб побачити зміни.

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

**Мова комітів — українська.** Історію можна переглянути через `git log --oneline` і пояснена в `docs/git-history.md`. Приклади TypeScript для вимог викладача 3.3 наведено в `docs/typescript.md`.

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
npm run check:site       # HTTP-перевірка, що сторінка наповнена
npm run typecheck:site  # перевірка TypeScript сайту
npm run typecheck:cms   # перевірка TypeScript CMS
npm run typecheck       # обидві перевірки TypeScript
npm run build:site      # production-збірка Vite
npm run build:cms       # production-збірка Next.js / Payload
npm run build           # обидві збірки послідовно
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

**Увага щодо npm-залежностей:** Пакети Payload та Blob мають одну версію `3.90.2`, але вкладений `cms/package-lock.json` **неповний** (відсутні транзитивні залежності на кшталт `yjs` і `monaco-editor`). Оскільки npm-реєстр у середовищі підготовки недоступний, оновлений lock-файл не вдалося згенерувати та перевірити. Команда `npm run setup` тепер використовує `npm install` для CMS і доповнює lock-файл на вашому комп’ютері. Після успішного встановлення виконайте `cd cms; npm ci; cd ..` для перевірки чистого встановлення, потім збережіть новий `cms/package-lock.json` у Git. Для деплою потрібно мати перевірений lock-файл.

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

## Якщо `npm run setup` показав `EUSAGE`

У попередньому ZIP файл `cms/package-lock.json` не містив усі транзитивні залежності. Для старої версії проєкту в терміналі VS Code виконайте:

```powershell
cd cms
npm install
cd ..\frontend
npm install
cd ..
npm run dev
```

У цьому ZIP достатньо `npm run setup` — він автоматично виконає `npm install` у CMS. Запускайте `npm run dev` **тільки після успішного встановлення**. Після цього перевірте чисту інсталяцію `npm ci` у `cms/` і додайте оновлений lock-файл у Git.

## Git-коміти

У ZIP **включена папка `.git` із вісьмома локальними комітами**: базова версія, залежності, дані та міграції, безпека API, перевірка frontend JSON, функціональні тести, документація та виправлення встановлення npm. Це **локальна історія**, не публікація в GitHub. Переглянути її можна у VS Code в Source Control або командою:

```powershell
git log --oneline -8
```

Перед завантаженням на GitHub перевірте `git status`, не додавайте `.env` та особисті ключі. Докладніше: `docs/git-history.md`.

## Що фактично перевірено

Перевірки API на імітованому Payload, валідації JSON і структури коду можна повторити командою `npm run test` (31 локальний тест), вона працює без підключення до Neon. Встановлення npm-залежностей, повну збірку CMS, інтеграційні HTTP-тести, створення користувача, роботу Media та production-міграції потрібно додатково перевірити після встановлення залежностей та налаштування робочої БД. Даних для скриншотів `docs/` не вигадано.

Додаткова інструкція: `docs/VSCode.md`. Матеріали звіту викладачу: `docs/report.md`; список перевірок: `docs/testing.md`.

## Підсумок аудиту

Виправлено конфлікт Payload/Blob, повторне наповнення Common, валідацію шляху `/`, захист завантажень у Vercel, перевірку отриманого JSON і помилку обробки натискання у мобільному меню. Наявні `20` локальних тестів. **Це не замінює** повний запуск CMS: перевірки Postgres, реального адміністратора, зміни зображень, production-міграцій і двох деплоїв залишаються обов'язковими. Повний чесний перелік міститься в `docs/testing.md`.


## Якщо на телефоні чи іншому комп'ютері з'являється `Failed to fetch`

У режимі `npm run dev` фронтенд тепер звертається до **власного** `/api`,
а Vite перенаправляє запити на Payload CMS (`127.0.0.1:3000`) на **серверному ПК**.
Це працює для `http://localhost:5173` і для `http://IP-КОМП'ЮТЕРА:5173`
за умови, що обидва сервери запущені та доступні в мережі.

Після оновлення коду зупиніть сервер (`Ctrl+C`) і виконайте `npm run dev`.
У `frontend/.env` можете залишити `VITE_API_URL=`: у development цей параметр
навмисно не використовується. У production **обов'язково** вкажіть публічну
адресу Payload CMS. У `cms/.env` окремо заповніть `PAYLOAD_SECRET` і
`DATABASE_URL`, інакше Payload поверне помилку навіть із робочим проксі.

Для перевірки безпосередньо в браузері відкрийте:

- `http://localhost:3000/admin` — Payload Admin на серверному ПК;
- `http://localhost:5173/api/common` — API через проксі Vite;
- `http://IP-КОМП'ЮТЕРА:5173/api/page?path=%2F` — API з іншого пристрою.

Якщо API повертає 500 — дивіться помилки CMS у терміналі; 404 після першого
запуску може означати, що потрібен `npm run seed`. Якщо сторінка не відкривається
через IP взагалі — перевірте мережу та брандмауер Windows. Не відкривайте порти
розробки в публічний інтернет і не показуйте `.env` стороннім.

## Підказка про вкладені папки й секрети

У цій версії архів розпаковується **одразу з `package.json` у корені**. У VS Code вибирайте папку, що містить `package.json`, `cms`, `frontend` і `scripts`. Запуск: `npm run setup`, потім `npm run dev`.

Файли `cms/.env` і `frontend/.env` у ZIP уже створені, але їхні секретні значення **порожні**. Вставте свій `DATABASE_URL` і новий `PAYLOAD_SECRET` самостійно. Ці файли виключено з Git, щоб майбутні коміти не оприлюднили секрети. У репозиторії залишено безпечні `.env.example`.
