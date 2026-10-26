# Використання у Visual Studio Code

## Перший запуск

1. Розпакуйте архів у звичайну папку (наприклад, `C:\Projects\Philosophy_VSCode_Ready`).
2. Відкрийте файл `Philosophy.code-workspace` у **Visual Studio Code** (Файл → Відкрити робочу область з файлу).
3. Перевірте Node.js: термінал VS Code → `node -v`. Для CMS потрібно 22.23.4+ або 24.x.
4. Відкрийте `Термінал → Виконати завдання` та виберіть `1. Встановити залежності`. Потрібен інтернет.
5. Перейдіть до `cms/.env`, вставте своє `DATABASE_URL` (Neon) і `PAYLOAD_SECRET`. У `frontend/.env` перевірте `VITE_API_URL=` (порожній рядок, оскільки Vite використовує проксі `/api`).
6. `Термінал → Виконати завдання → 2. Запустити CMS і сайт`.
7. У браузері відкрийте `http://localhost:3000/admin`, створіть адміністратора.
8. Запустіть завдання `3. Заповнити базу` лише після налаштування CMS; воно не повинно дублювати дані.
9. Сайт: `http://localhost:5173`. F5 відкриває налагоджувач Chrome (сервери мають бути вже запущені).

## Де який код

- `frontend/src/main.ts` — завантаження сторінки (loading, error, success).
- `frontend/src/api/client.ts` — `fetch` до Payload CMS.
- `frontend/src/renderBlocks.ts` — вибір компонента за типом.
- `frontend/src/blocks/` — окремі секції.
- `frontend/src/layout/` — header і footer.
- `frontend/src/styles/base.css` — дизайн і адаптивність.
- `cms/src/payload.config.ts` — основна конфігурація Payload.
- `cms/src/collections/` — вміст, який редагується через адмінпанель.
- `cms/src/blocks/` — поля секцій сторінки в адмінпанелі.
- `cms/src/endpoints.ts` — публічні API-ендпоінти.
- `cms/src/seed.ts` — стартові записи.

## Важливо

VS Code — це редактор, а не новий бекенд. Не потрібно замінювати Vite, TypeScript, Payload або PostgreSQL: усі вони працюють із VS Code. **Live Server не потрібний**: фронтенд стартує через Vite, CMS — через Next.js.

Якщо у браузері є повідомлення про помилку API, перевірте `cms/.env`, стан CMS і адресу `VITE_API_URL`, а не замінюйте API статичним JSON.

Збірка CMS / міграції потребують робочої БД. Для production перевірте міграції на тестовій базі перед застосуванням до основної.

## Якщо є CMS, але немає оформленого сайту

- `http://localhost:3000/admin` — **не** публічний сайт, а редактор.
- У другому терміналі запустіть `npm run seed`, щоб наповнити PostgreSQL.
- Перевірте `npm run check:site` і відкрийте `http://localhost:5173`.
- Лише для перевірки дизайну (позначене демо): `http://localhost:5173/?preview=1`.
- Якщо у CMS не створено сторінку, у режимі розробки демонстрація може з'явитися автоматично, але вона не вважається даними PostgreSQL.
