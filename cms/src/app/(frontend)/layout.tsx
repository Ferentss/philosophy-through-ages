import type { ReactNode } from 'react'
export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="uk"><body style={{fontFamily:'system-ui',padding:32}}>{children}</body></html>
}
