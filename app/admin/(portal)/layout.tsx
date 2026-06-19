import type { ReactNode } from 'react'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminToast from '@/components/admin/AdminToast'

export default function AdminPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <AdminSidebar />
      <div className="flex-1 min-w-0 overflow-auto">{children}</div>
      <AdminToast />
    </div>
  )
}
