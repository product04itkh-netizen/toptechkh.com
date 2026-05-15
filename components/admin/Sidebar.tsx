'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Tag, Building2, LogOut, ChevronRight } from 'lucide-react'
import { logoutAction } from '@/app/admin/login/actions'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/brands', label: 'Brands', icon: Building2 },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 bg-[#041e42] text-white flex flex-col min-h-screen sticky top-0">
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 flex-shrink-0">
        <Image src="/top-tech-logo.png" alt="Top Tech" width={34} height={34} className="rounded-full flex-shrink-0" />
        <div className="min-w-0">
          <div className="font-black text-sm leading-tight truncate">Top Tech</div>
          <div className="text-[10px] text-white/50 leading-tight">Admin Portal</div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
              {active && <ChevronRight size={12} className="ml-auto opacity-50" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-2 pb-4 pt-2 border-t border-white/10">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </form>
      </div>
    </aside>
  )
}
