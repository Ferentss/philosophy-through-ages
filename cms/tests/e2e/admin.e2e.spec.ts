import { test, expect } from '@playwright/test'
const cms = process.env.CMS_URL || 'http://localhost:3000'
test('Адміністративна панель Payload доступна', async ({ page }) => {
  await page.goto(`${cms}/admin`)
  await expect(page).toHaveURL(/\/admin/)
})
test.skip(!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD, 'Для перевірки входу потрібні окремі тестові облікові дані')
test('Вхід адміністратора й редактор філософів', async ({ page }) => {
  await page.goto(`${cms}/admin/login`)
  await page.locator('#field-email').fill(process.env.TEST_ADMIN_EMAIL || '')
  await page.locator('#field-password').fill(process.env.TEST_ADMIN_PASSWORD || '')
  await page.locator('button[type="submit"]').click()
  await expect(page).toHaveURL(/\/admin/)
  await page.goto(`${cms}/admin/collections/philosophers`)
  await expect(page).toHaveURL(/\/admin\/collections\/philosophers/)
})
