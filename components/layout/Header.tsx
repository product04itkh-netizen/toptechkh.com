'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  Search, Menu, X,
  Laptop, Monitor, Cpu, Mouse, Package, Printer, Volume2, Wifi, Tag, ChevronDown, Wrench,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const departments = [
  { name: 'Laptop',            slug: 'laptop',          Icon: Laptop },
  { name: 'PC',                slug: 'pc',              Icon: Monitor },
  { name: 'Components',        slug: 'components',      Icon: Cpu },
  { name: 'LCD Monitor',       slug: 'lcd-monitor',     Icon: Monitor },
  { name: 'Peripherals',       slug: 'peripherals',     Icon: Mouse },
  { name: 'Accessories',       slug: 'accessories',     Icon: Package },
  { name: 'Printer & Scanner', slug: 'printer-scanner', Icon: Printer },
  { name: 'Speaker',           slug: 'speaker',         Icon: Volume2 },
  { name: 'Network',           slug: 'network',         Icon: Wifi },
]

const navTabs = [
  { name: 'Laptop',      slug: 'laptop' },
  { name: 'PC',          slug: 'pc' },
  { name: 'Components',  slug: 'components' },
  { name: 'LCD Monitor', slug: 'lcd-monitor' },
  { name: 'Peripherals', slug: 'peripherals' },
]

type Brand = { id: number; name: string; slug: string }

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState('')
  const [searchCat, setSearchCat] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [brandOpen, setBrandOpen] = useState(false)
  const brandRef = useRef<HTMLDivElement>(null)

  // Active state based on current URL
  const isShop = pathname === '/shop'
  const activeCategory = isShop ? searchParams.get('category') : null
  const activeBrand = isShop ? searchParams.get('brand') : null

  // Close mobile menu and brand dropdown on navigation
  useEffect(() => {
    setMobileOpen(false)
    setBrandOpen(false)
  }, [pathname, searchParams])

  useEffect(() => {
    async function loadBrands() {
      const { data: rows } = await supabase
        .from('products')
        .select('brand_id')
        .not('brand_id', 'is', null)

      const ids = [...new Set((rows ?? []).map((r) => r.brand_id as number))]
      if (!ids.length) return

      const { data } = await supabase
        .from('brands')
        .select('id, name, slug')
        .in('id', ids)
        .order('name')

      setBrands(data ?? [])
    }
    loadBrands()
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setBrandOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    const params = new URLSearchParams({ q: query.trim() })
    if (searchCat) params.set('category', searchCat)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#e5e8ec] shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-4 h-[68px]">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 hover:opacity-85 transition-opacity">
          <Image
            src="/top-tech-logo.png"
            alt="Top Tech Computer"
            width={56}
            height={56}
            className="rounded-full"
            priority
          />
          <div className="hidden lg:block leading-tight">
            <div className="font-black text-[#041e42] text-base leading-none">Top Tech</div>
            <div className="font-semibold text-[#041e42] text-base leading-none">Computer</div>
          </div>
        </Link>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex items-stretch border border-[#c8cdd5] rounded-md overflow-hidden focus-within:border-[#041e42] transition-colors flex-1 min-w-0 max-w-[520px] h-10 ml-4"
        >
          <select
            value={searchCat}
            onChange={(e) => setSearchCat(e.target.value)}
            className="border-r border-[#c8cdd5] bg-[#f5f6f8] text-[#333] text-xs px-2 outline-none cursor-pointer flex-shrink-0 max-w-[130px]"
          >
            <option value="">All</option>
            {departments.map((d) => (
              <option key={d.slug} value={d.slug}>{d.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-3 text-sm outline-none text-[#021523] bg-white min-w-0"
          />
          <button
            type="submit"
            className="bg-[#041e42] hover:bg-[#0a3060] text-white px-4 flex items-center transition-colors flex-shrink-0"
          >
            <Search size={14} />
          </button>
        </form>

        {/* Category nav tabs */}
        <nav className="hidden sm:flex items-center flex-shrink-0 gap-1.5">
          {navTabs.map((tab) => {
            const isActive = activeCategory === tab.slug
            return (
              <Link
                key={tab.slug}
                href={`/shop?category=${tab.slug}`}
                className={`flex items-center px-3 py-1.5 text-sm font-medium whitespace-nowrap border rounded-full transition-all duration-150 ${
                  isActive
                    ? 'bg-[#041e42] text-white border-[#041e42]'
                    : 'text-[#333] bg-[#f2f3f5] hover:bg-[#041e42] hover:text-white border-[#e5e8ec] hover:border-[#041e42]'
                }`}
              >
                {tab.name}
              </Link>
            )
          })}

          {/* Build PC */}
          <Link
            href="/build-pc"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium whitespace-nowrap border rounded-full transition-all duration-150 ${
              pathname === '/build-pc'
                ? 'bg-[#041e42] text-white border-[#041e42]'
                : 'text-[#333] bg-[#f2f3f5] border-[#e5e8ec] hover:bg-[#041e42] hover:text-white hover:border-[#041e42]'
            }`}
          >
            <Wrench size={13} />
            Build PC
          </Link>

          {/* Brands dropdown */}
          <div ref={brandRef} className="relative flex items-center">
            <button
              onClick={() => setBrandOpen((o) => !o)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium whitespace-nowrap border rounded-full transition-all duration-150 ${
                brandOpen || activeBrand
                  ? 'bg-[#041e42] text-white border-[#041e42]'
                  : 'text-[#333] bg-[#f2f3f5] border-[#e5e8ec] hover:bg-[#041e42] hover:text-white hover:border-[#041e42]'
              }`}
            >
              Brands
              <ChevronDown size={13} className={`transition-transform duration-200 ${brandOpen ? 'rotate-180' : ''}`} />
            </button>
            {brandOpen && brands.length > 0 && (
              <div className="absolute top-[calc(100%+6px)] left-0 w-56 bg-white border border-[#e5e8ec] rounded-xl shadow-xl z-50 py-2 max-h-[360px] overflow-y-auto">
                {brands.map((brand) => (
                  <Link
                    key={brand.slug}
                    href={`/shop?brand=${brand.slug}`}
                    className={`block px-4 py-2 text-sm font-medium transition-colors ${
                      activeBrand === brand.slug
                        ? 'bg-[#041e42] text-white'
                        : 'text-[#021523] hover:bg-[#f5f6f8] hover:text-[#041e42]'
                    }`}
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/shop?sale=true"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#ef262c] font-bold whitespace-nowrap bg-[#fff0f0] hover:bg-[#ef262c] hover:text-white border border-[#fccdd0] hover:border-[#ef262c] rounded-full transition-all duration-150"
          >
            <Tag size={12} />
            Promotion
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden ml-auto text-[#041e42] p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t border-[#e5e8ec] shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="flex border border-[#c8cdd5] rounded-md overflow-hidden mb-4 h-9">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-3 text-sm outline-none"
              />
              <button type="submit" className="bg-[#041e42] px-3 text-white">
                <Search size={15} />
              </button>
            </form>
            <ul>
              {departments.map((dept) => (
                <li key={dept.slug}>
                  <Link
                    href={`/shop?category=${dept.slug}`}
                    className={`flex items-center gap-3 py-2.5 px-2 text-sm font-medium border-b border-[#f2f3f5] ${
                      activeCategory === dept.slug ? 'text-[#041e42]' : 'text-[#021523]'
                    }`}
                  >
                    <dept.Icon size={15} className="text-[#818ea0]" />
                    {dept.name}
                  </Link>
                </li>
              ))}
              {brands.length > 0 && (
                <li>
                  <p className="px-2 pt-3 pb-1 text-[10px] font-bold text-[#818ea0] uppercase tracking-wider">Brands</p>
                  <div className="grid grid-cols-2 gap-x-2">
                    {brands.map((brand) => (
                      <Link
                        key={brand.slug}
                        href={`/shop?brand=${brand.slug}`}
                        className={`py-2 px-2 text-sm font-medium border-b border-[#f2f3f5] ${
                          activeBrand === brand.slug ? 'text-[#041e42]' : 'text-[#021523]'
                        }`}
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                </li>
              )}
              <li>
                <Link
                  href="/build-pc"
                  className="flex items-center gap-3 py-2.5 px-2 text-sm font-bold text-[#041e42]"
                >
                  <Wrench size={15} /> Build PC
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?sale=true"
                  className="flex items-center gap-3 py-2.5 px-2 text-sm text-[#ef262c] font-bold"
                >
                  <Tag size={15} /> Promotion
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
