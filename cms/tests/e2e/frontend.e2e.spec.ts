import { test, expect } from '@playwright/test'
const base = process.env.FRONTEND_URL || 'http://localhost:5173'
test('Показує всі основні розділи з даних CMS', async ({ page }) => {
  await page.goto(base)
  await expect(page.locator('h1')).toHaveText('Філософія крізь віки')
  for (const id of ['home','about','epochs','philosophers','questions','quotes','project']) {
    await expect(page.locator(`#${id}`)).toBeVisible()
  }
  await expect(page.locator('.thinker-card')).toHaveCount(6)
  await page.locator('.thinker-card').first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Закрити' }).click()
})
test('На смартфоні меню відкривається', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto(base)
  await page.getByRole('button', { name: 'Відкрити меню' }).click()
  await expect(page.getByRole('navigation', { name: 'Головна навігація' })).toBeVisible()
})
test('Помилка API має кнопку повтору', async ({ page }) => {
  await page.route('**/api/common', (route) => route.abort())
  await page.goto(base)
  await expect(page.getByText('Не вдалося завантажити сайт')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Спробувати знову' })).toBeVisible()
})
