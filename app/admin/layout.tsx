import type { ReactNode } from 'react'

export const metadata = { title: 'Admin — Top Tech Computer' }

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen">{children}</div>
}
