'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  Search, Menu, X, ChevronDown, Wrench, Tag,
  Laptop, Monitor, Cpu, Mouse, Package, Printer, Volume2, Wifi,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ICON_MAP: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  Laptop, Monitor, Cpu, Mouse, Package, Printer, Volume2, Wifi,
}

type NavItem = { id: number; type: 'custom_link' | 'category' | 'build_pc' | 'promotion'; label: string; url: string | null; category_id: number | null; position: number }
type Category = { id: number; name: string; slug: string; icon_name: string }
type Subcategory = { id: number; name: string; slug: string; category_id: number }
type Brand = { id: number; name: string; slug: string }

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState('')
  const [searchCat, setSearchCat] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [brandOpen, setBrandOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isShop = pathname === '/shop'
  const activeCategory = isShop ? searchParams.get('category') : null
  const activeBrand = isShop ? searchParams.get('brand') : null

  useEffect(() => {
    setMobileOpen(false)
    setBrandOpen(false)
  }, [pathname, searchParams])

  // Load unified navigation items
  useEffect(() => {
    async function loadNav() {
      try {
        const { data: nav, error: navError } = await supabase
          .from('navigation_items')
          .select('*')
          .eq('visible', true)
          .order('position')

        if (navError) {
          console.error('[Header] Failed to load navigation:', navError)
          return
        }

        if (!nav) return
        setNavItems(nav)

        // Load category data for category-type items
        const categoryIds = nav.filter(i => i.type === 'category').map(i => i.category_id).filter(Boolean) as number[]
        if (categoryIds.length > 0) {
          const { data: cats, error: catError } = await supabase
            .from('categories')
            .select('id, name, slug, icon_name')
            .in('id', categoryIds)

          if (catError) {
            console.error('[Header] Failed to load categories:', catError)
            return
          }

          setCategories(cats ?? [])

          // Load subcategories for all categories
          const { data: subs, error: subError } = await supabase
            .from('subcategories')
            .select('id, name, slug, category_id')
            .in('category_id', categoryIds)
            .order('name')

          if (subError) {
            console.error('[Header] Failed to load subcategories:', subError)
            return
          }

          setSubcategories(subs ?? [])
        }
      } catch (err) {
        console.error('[Header] Navigation loading error:', err)
      }
    }
    loadNav()
  }, [])

  useEffect(() => {
    async function loadBrands() {
      try {
        const { data: rows, error: rowError } = await supabase
          .from('products')
          .select('brand_id')
          .not('brand_id', 'is', null)

        if (rowError) {
          console.error('[Header] Failed to load brand IDs:', rowError)
          return
        }

        const ids = [...new Set((rows ?? []).map((r) => r.brand_id as number))]
        if (!ids.length) return

        const { data, error: brandError } = await supabase
          .from('brands')
          .select('id, name, slug')
          .in('id', ids)
          .order('name')

        if (brandError) {
          console.error('[Header] Failed to load brands:', brandError)
          return
        }

        setBrands(data ?? [])
      } catch (err) {
        console.error('[Header] Brands loading error:', err)
      }
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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#e5e8ec] shadow-sm overflow-visible">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-4 h-[68px] overflow-visible">

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
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
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

        {/* Desktop navigation from unified table */}
        <nav className="hidden sm:flex items-center flex-shrink-0 gap-1.5">
          {navItems.map((item) => {
            if (item.type === 'custom_link') {
              return (
                <Link
                  key={item.id}
                  href={item.url || '/'}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium whitespace-nowrap border rounded-full transition-all duration-150 ${
                    pathname === item.url
                      ? 'bg-[#041e42] text-white border-[#041e42]'
                      : 'text-[#333] bg-[#f2f3f5] hover:bg-[#041e42] hover:text-white border-[#e5e8ec] hover:border-[#041e42]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            }

            if (item.type === 'category') {
              const cat = categories.find(c => c.id === item.category_id)
              if (!cat) return null
              const isActive = activeCategory === cat.slug
              const catSubs = subcategories.filter(s => s.category_id === cat.id)
              const hasDropdown = catSubs.length > 0
              const isOpen = activeDropdown === item.id

              const handleMouseEnter = () => {
                if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
                if (hasDropdown) setActiveDropdown(item.id)
              }

              const handleMouseLeave = () => {
                dropdownTimeoutRef.current = setTimeout(() => {
                  setActiveDropdown(null)
                }, 200)
              }

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium whitespace-nowrap border rounded-full transition-all duration-150 ${
                      isActive || isOpen
                        ? 'bg-[#041e42] text-white border-[#041e42]'
                        : 'text-[#333] bg-[#f2f3f5] hover:bg-[#041e42] hover:text-white border-[#e5e8ec] hover:border-[#041e42]'
                    }`}
                  >
                    {cat.name}
                    {hasDropdown && <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
                  </Link>

                  {hasDropdown && isOpen && (
                    <div className="absolute top-[calc(100%+6px)] left-0 w-56 bg-white border border-[#e5e8ec] rounded-xl shadow-xl z-40 py-2 max-h-[360px] overflow-y-auto">
                      {catSubs.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                          className="block px-4 py-2 text-sm font-medium text-[#021523] hover:bg-[#f5f6f8] hover:text-[#041e42] transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            if (item.type === 'build_pc') {
              return (
                <Link
                  key={item.id}
                  href="/build-pc"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium whitespace-nowrap border rounded-full transition-all duration-150 ${
                    pathname === '/build-pc'
                      ? 'bg-[#041e42] text-white border-[#041e42]'
                      : 'text-[#333] bg-[#f2f3f5] border-[#e5e8ec] hover:bg-[#041e42] hover:text-white hover:border-[#041e42]'
                  }`}
                >
                  <Wrench size={13} />
                  {item.label}
                </Link>
              )
            }

            if (item.type === 'promotion') {
              return (
                <Link
                  key={item.id}
                  href={item.url || '/shop?sale=true'}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#ef262c] font-bold whitespace-nowrap bg-[#fff0f0] hover:bg-[#ef262c] hover:text-white border border-[#fccdd0] hover:border-[#ef262c] rounded-full transition-all duration-150"
                >
                  <Tag size={12} />
                  {item.label}
                </Link>
              )
            }

            return null
          })}

          {/* Brands dropdown */}
          <div
            ref={brandRef}
            className="relative flex items-center"
            onMouseEnter={() => {
              if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
              setBrandOpen(true)
            }}
            onMouseLeave={() => {
              dropdownTimeoutRef.current = setTimeout(() => {
                setBrandOpen(false)
              }, 200)
            }}
          >
            <button
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

      {/* Mobile menu from unified navigation */}
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
              {navItems.map((item) => {
                if (item.type === 'custom_link') {
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.url || '/'}
                        className="flex items-center gap-3 py-2.5 px-2 text-sm font-medium border-b border-[#f2f3f5] text-[#021523]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                }

                if (item.type === 'category') {
                  const cat = categories.find(c => c.id === item.category_id)
                  if (!cat) return null
                  const Icon = ICON_MAP[cat.icon_name] || Package
                  const catSubs = subcategories.filter(s => s.category_id === cat.id)

                  return (
                    <li key={item.id} className="border-b border-[#f2f3f5]">
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className={`flex items-center gap-3 py-2.5 px-2 text-sm font-medium ${
                          activeCategory === cat.slug ? 'text-[#041e42]' : 'text-[#021523]'
                        }`}
                      >
                        <Icon size={15} className="text-[#818ea0]" />
                        {cat.name}
                      </Link>
                      {catSubs.length > 0 && (
                        <div className="bg-[#f9f9fb] pl-8">
                          {catSubs.map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                              className="block py-2 px-2 text-xs font-medium text-[#818ea0] hover:text-[#041e42] transition-colors border-b border-[#f2f3f5] last:border-0"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  )
                }

                if (item.type === 'build_pc') {
                  return (
                    <li key={item.id}>
                      <Link
                        href="/build-pc"
                        className="flex items-center gap-3 py-2.5 px-2 text-sm font-bold text-[#041e42]"
                      >
                        <Wrench size={15} /> {item.label}
                      </Link>
                    </li>
                  )
                }

                if (item.type === 'promotion') {
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.url || '/shop?sale=true'}
                        className="flex items-center gap-3 py-2.5 px-2 text-sm text-[#ef262c] font-bold"
                      >
                        <Tag size={15} /> {item.label}
                      </Link>
                    </li>
                  )
                }

                return null
              })}

              {/* Brands section */}
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
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
