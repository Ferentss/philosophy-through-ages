import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'
export default defineConfig({
  testDir: './tests/e2e', timeout: 30_000,
  use: { trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Спочатку вручну запустіть CMS і Vite (див. README).
})
