import { redirect } from 'next/navigation'

// CMS — окремий службовий застосунок. Публічна односторінкова
// сторінка працює у Vite (порт 5173 під час локальної розробки).
export default function Home() {
  const site = process.env.FRONTEND_URL || 'http://localhost:5173'
  redirect(site)
}
