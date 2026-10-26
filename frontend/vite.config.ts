import { defineConfig } from 'vite'

// Локальний проксі дозволяє відвідувачам сайту звертатися до CMS
// через той самий хост та порт, на якому відкрито Vite.
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
  preview: { port: 4173 },
})
