# Статус перевірок (версія для VS Code)

Наведено тільки виконані перевірки. Доступу до Neon та npm-реєстру в середовищі підготовки не було.

| Перевірка | Фактичний результат |
|---|---|
| `npm test` у корені (5 тестів workspace + 4 frontend smoke) | **9 / 9 пройшло** |
| Статична перевірка TypeScript фронтенду | Успішно за допомогою глобального `tsc 5.8.3` і **тимчасового** shim `vite/client` (без встановлених npm-пакетів) |
| Синтаксис `scripts/setup.mjs`, `scripts/dev.mjs` | `node --check` пройшов |
| Файли `.vscode/*.json`, workspace і `package.json` | JSON успішно розібрано |
| npm ci | **Не перевірено**: npm registry відповів EAI_AGAIN, offline cache порожній |
| `npm run build:site` | Не перевірено: залежності не встановлені |
| `npm run build:cms` і повний TypeScript CMS | Не перевірено: залежності не встановлені |
| PostgreSQL, міграції і seed | Не перевірено на реальній БД |
| HTTP API `/api/common`, `/api/page` | Не перевірено з живою CMS |
| Payload Admin, Media, Vercel | Не перевірено: потрібні запущені сервери, БД і ключі |
| Мобільне меню, loading/error/success в браузері | Код присутній, але браузерні E2E не запускалися |

Щоб завершити перевірку на своєму ПК, у терміналі VS Code (із кореня проєкту) виконайте:

```powershell
npm run setup
npm run typecheck:site
npm --prefix cms run generate:types
npm run typecheck:cms
npm run build:site
npm run build:cms
npm run test
npm run dev
```

Коли CMS працює, перевірте `http://localhost:3000/api/common`, `http://localhost:3000/api/page?path=%2F`, а також сторінку на `http://localhost:5173`. Перевірка адміністратора та збереження після перезапуску потребує реальної тестової бази.

У `cms/package-lock.json` залишається неузгоджена peer dependency: Blob `3.91.0` та Payload `3.90.2`. Для остаточної збірки потрібно узгодити їх в одному сумісному наборі версій і перегенерувати lock-файл (див. README). Це не вважається перевіреним.
