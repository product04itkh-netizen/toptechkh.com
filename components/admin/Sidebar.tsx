'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Tag, Building2, LogOut, ChevronRight,
  GalleryHorizontal, Layers, BookOpen, ListTree, Globe, Palette, Menu,
} from 'lucide-react'
import { logoutAction } from '@/app/admin/login/actions'

const catalogItems = [
  { href: '/admin/dashboard',          label: 'Dashboard',         icon: LayoutDashboard },
  { href: '/admin/products',           label: 'Products',          icon: Package },
  { href: '/admin/categories',         label: 'Categories',        icon: Tag },
  { href: '/admin/subcategories',      label: 'Subcategories',     icon: BookOpen },
  { href: '/admin/sub-subcategories',  label: 'Sub-subcategories', icon: ListTree },
  { href: '/admin/brands',             label: 'Brands',            icon: Building2 },
  { href: '/admin/series',             label: 'Series',            icon: Layers },
  { href: '/admin/banners',            label: 'Banners',           icon: GalleryHorizontal },
]

const websiteItems = [
  { href: '/admin/cms',           label: 'CMS Pages',  icon: Globe },
  { href: '/admin/navigation',    label: 'Navigation', icon: Menu },
  { href: '/admin/cms/settings',  label: 'Site Style', icon: Palette },
]

function isActive(href: string, pathname: string): boolean {
  if (href === '/admin/cms') {
    // Active on /admin/cms and sub-pages — but NOT /admin/cms/settings
    return pathname === '/admin/cms' ||
      (pathname.startsWith('/admin/cms/') && !pathname.startsWith('/admin/cms/settings'))
  }
  return pathname === href || pathname.startsWith(href + '/')
}

function NavItem({ href, label, icon: Icon, pathname }: {
  href: string; label: string; icon: React.ComponentType<{ size?: number }>; pathname: string
}) {
  const active = isActive(href, pathname)
  return (
    <Link
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
}

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 bg-[#041e42] text-white flex flex-col min-h-screen sticky top-0">

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 flex-shrink-0">
        <Image src="/top-tech-logo.png" alt="Top Tech" width={34} height={34} className="rounded-full flex-shrink-0" />
        <div className="min-w-0">
          <div className="font-black text-sm leading-tight truncate">Top Tech</div>
          <div className="text-[10px] text-white/50 leading-tight">Admin Portal</div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 overflow-y-auto">

        {/* Catalog section */}
        <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">Catalog</p>
        <div className="space-y-0.5 mb-4">
          {catalogItems.map(item => (
            <NavItem key={item.href} {...item} pathname={pathname} />
          ))}
        </div>

        {/* Website section */}
        <div className="border-t border-white/10 pt-4">
          <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">Website</p>
          <div className="space-y-0.5">
            {websiteItems.map(item => (
              <NavItem key={item.href} {...item} pathname={pathname} />
            ))}
          </div>
        </div>

      </nav>

      {/* Logout */}
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
