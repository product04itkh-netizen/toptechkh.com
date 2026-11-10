import type { ReactNode } from 'react'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminToast from '@/components/admin/AdminToast'
import { requireAdmin } from '@/lib/admin-session'

export default async function AdminPortalLayout({ children }: { children: ReactNode }) {
  // Defence in depth: every portal page also verifies the session, not only proxy.ts
  await requireAdmin()

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <AdminSidebar />
      <div className="flex-1 min-w-0 overflow-auto">{children}</div>
      <AdminToast />
    </div>
  )
}
