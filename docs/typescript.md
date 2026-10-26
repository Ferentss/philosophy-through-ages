# TypeScript у проєкті «Філософія крізь віки»

Вимогу викладача 3.3 виконано в **обох застосунках**: публічний сайт використовує **Vanilla TypeScript**, а Payload CMS використовує **TypeScript** та **TSX** для компонентів Next.js.

| Вимога | Реалізація |
|---|---|
| Type Aliases | `frontend/src/types/blocks.ts` — `BaseBlock` |
| Interfaces | `frontend/src/types/blocks.ts` — `MediaImage`, `Epoch`, `Philosopher` |
| Intersection Types `&` | `HeroBlock = BaseBlock & { ... }` |
| Union Types `|` | `PageBlock = HeroBlock | AboutBlock | ...` |
| Дискриміновані типи | Поле `type` використовується в `frontend/src/renderBlocks.ts` |
| Типізовані параметри й результат | `frontend/src/api/client.ts` — `getJson<T>` |
| `unknown` і валідація | `frontend/src/api/validation.ts`, `frontend/src/api/client.ts` |
| Типізовані відповіді API | `frontend/src/types/api.ts` |
| CMS колекції, блоки й API | `cms/src/collections/`, `cms/src/blocks/`, `cms/src/endpoints.ts` |
| Строга типізація | `frontend/tsconfig.json` та `cms/tsconfig.json`: `strict: true` |

У файлах `frontend/src/` немає JavaScript-модулів. Вхідна точка — `frontend/src/main.ts`. CMS має TypeScript-конфігурацію `cms/src/payload.config.ts`.

**Чому залишилися окремі файли `.js`/`.mjs`?** Файл `cms/src/app/(payload)/admin/importMap.js` автоматично генерує Payload CMS. Скрипти `scripts/setup.mjs` і `scripts/dev.mjs` запускаються безпосередньо через Node.js. Це службові файли, а не вихідний код публічного фронтенду: вони не порушують вимогу використовувати TypeScript у сайті та CMS.

## Команди перевірки у VS Code

Після `npm run setup` у кореневому терміналі PowerShell:

```powershell
npm run typecheck:site
npm run typecheck:cms
npm run typecheck
npm run build:site
npm run build:cms
npm run build
npm test
```

`npm run typecheck` перевіряє TypeScript в обох частинах. `npm run build` запускає збірки Vite і Next.js послідовно. Для CMS потрібні встановлені пакети, коректний `.env` та, залежно від налаштувань, доступ до PostgreSQL.

**Статус перевірки:** локальні Node.js тести можна виконати без бази даних. Повну CMS-збірку та підключення до Neon необхідно перевірити у власному середовищі після налаштування `cms/.env`. Жоден тест без реальної БД не доводить, що Neon уже підключений.
