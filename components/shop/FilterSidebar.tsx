'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'

const priceRanges = [
  { label: 'Under $50',    min: 0,    max: 50 },
  { label: '$50 - $200',   min: 50,   max: 200 },
  { label: '$200 - $500',  min: 200,  max: 500 },
  { label: '$500 - $1000', min: 500,  max: 1000 },
  { label: 'Over $1000',   min: 1000, max: 99999 },
]

interface FilterOption  { name: string; slug: string }
interface SeriesOption  { name: string; slug: string; brand_slug: string }
interface SubcatOption  { name: string; slug: string; category_slug: string }
interface SubSubOption  { name: string; slug: string; subcategory_slug: string }

interface FilterSidebarProps {
  onClose?: () => void
  categories: FilterOption[]
  brands: FilterOption[]
  allSeries: SeriesOption[]
  allSubcategories: SubcatOption[]
  allSubSubcategories: SubSubOption[]
}

export default function FilterSidebar({
  onClose, categories, brands, allSeries, allSubcategories, allSubSubcategories,
}: FilterSidebarProps) {
  const [collapsed, setCollapsed]         = useState(true)
  const [showAllBrands, setShowAllBrands] = useState(false)
  const router       = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback((key: string, value: string | null) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value) { p.set(key, value) } else { p.delete(key) }
    p.delete('page')
    router.push(`/shop?${p.toString()}`)
  }, [router, searchParams])

  const updateCategory = useCallback((value: string | null) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value) { p.set('category', value) } else { p.delete('category') }
    p.delete('subcategory'); p.delete('subsubcategory'); p.delete('page')
    router.push(`/shop?${p.toString()}`)
  }, [router, searchParams])

  const updateSubcategory = useCallback((catSlug: string, value: string | null) => {
    const p = new URLSearchParams(searchParams.toString())
    p.set('category', catSlug)
    if (value) { p.set('subcategory', value) } else { p.delete('subcategory') }
    p.delete('subsubcategory'); p.delete('page')
    router.push(`/shop?${p.toString()}`)
  }, [router, searchParams])

  const updateBrand = useCallback((value: string | null) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value) { p.set('brand', value) } else { p.delete('brand') }
    p.delete('series'); p.delete('page')
    router.push(`/shop?${p.toString()}`)
  }, [router, searchParams])

  const currentCategory    = searchParams.get('category')
  const currentSubcat      = searchParams.get('subcategory')
  const currentSubSub      = searchParams.get('subsubcategory')
  const currentBrand       = searchParams.get('brand')
  const currentSeries      = searchParams.get('series')
  const currentMinPrice    = searchParams.get('minPrice')
  const currentMaxPrice    = searchParams.get('maxPrice')
  const currentInStock     = searchParams.get('instock')

  const visibleSubcats  = allSubcategories.filter(s => s.category_slug === currentCategory)
  const visibleSubSubs  = allSubSubcategories.filter(s => s.subcategory_slug === currentSubcat)
  const visibleSeries   = allSeries.filter(s => s.brand_slug === currentBrand)

  const clearAll = () => {
    const q = searchParams.get('q')
    router.push(q ? `/shop?q=${q}` : '/shop')
  }

  const hasFilters = currentCategory || currentSubcat || currentSubSub || currentBrand || currentSeries || currentMinPrice || currentInStock

  if (collapsed) {
    return (
      <div className="w-10 flex-shrink-0">
        <div className="fixed top-1/2 -translate-y-1/2 left-3 z-40">
          <button onClick={() => setCollapsed(false)} title="Show Filters"
            className="flex flex-col items-center gap-2 px-2 py-3 bg-[var(--cms-color-primary)] text-white rounded-xl shadow-lg hover:bg-[var(--cms-color-primary-hover)] hover:shadow-xl active:scale-95 transition-all duration-200 group">
            <SlidersHorizontal size={15} className="flex-shrink-0" />
            <span className="text-[8px] font-black uppercase tracking-widest [writing-mode:vertical-lr] rotate-180 leading-none">Filters</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <ChevronRight size={11} />
            </div>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-6 bg-white border border-[#e5e8ec] rounded-lg p-4 w-60 max-h-[calc(100vh-3rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={14} className="text-[var(--cms-color-primary)]" />
          <h3 className="font-bold text-[#021523]">Filters</h3>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && <button onClick={clearAll} className="text-xs text-[var(--cms-color-accent)] hover:underline">Clear all</button>}
          {onClose && <button onClick={onClose} className="text-[#818ea0] hover:text-[#021523] lg:hidden"><X size={18} /></button>}
        </div>
      </div>
      <button onClick={() => setCollapsed(true)}
        className="w-full flex items-center justify-center gap-1.5 mb-4 py-1.5 rounded-md text-xs font-semibold text-[#818ea0] border border-dashed border-[#d1d9e0] hover:bg-[var(--cms-color-primary)] hover:text-white hover:border-[var(--cms-color-primary)] transition-all duration-200 group">
        <ChevronLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
        Hide Filters
      </button>

      {/* Category */}
      {categories.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#818ea0] mb-3">Category</h4>
          <ul className="space-y-1">
            {categories.map(opt => (
              <li key={opt.slug}>
                <button onClick={() => updateCategory(currentCategory === opt.slug ? null : opt.slug)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                    currentCategory === opt.slug ? 'bg-[var(--cms-color-primary)] text-white font-semibold' : 'text-[#021523] hover:bg-[#f2f3f5]'
                  }`}>
                  {opt.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Subcategory */}
      {currentCategory && visibleSubcats.length > 0 && (
        <div className="mb-4 ml-2 pl-3 border-l-2 border-[#e5e8ec]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#818ea0] mb-2">Subcategory</h4>
          <ul className="space-y-1">
            {visibleSubcats.map(opt => (
              <li key={opt.slug}>
                <button onClick={() => updateSubcategory(currentCategory, currentSubcat === opt.slug ? null : opt.slug)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                    currentSubcat === opt.slug ? 'bg-[var(--cms-color-primary)] text-white font-semibold' : 'text-[#021523] hover:bg-[#f2f3f5]'
                  }`}>
                  {opt.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sub-subcategory */}
      {currentSubcat && visibleSubSubs.length > 0 && (
        <div className="mb-4 ml-4 pl-3 border-l-2 border-[#e5e8ec]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#818ea0] mb-2">Type</h4>
          <ul className="space-y-1">
            {visibleSubSubs.map(opt => (
              <li key={opt.slug}>
                <button onClick={() => updateParam('subsubcategory', currentSubSub === opt.slug ? null : opt.slug)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                    currentSubSub === opt.slug ? 'bg-[var(--cms-color-primary)] text-white font-semibold' : 'text-[#021523] hover:bg-[#f2f3f5]'
                  }`}>
                  {opt.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Brand */}
      {brands.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#818ea0] mb-3">Brand</h4>
          <ul className="space-y-1">
            {(showAllBrands ? brands : brands.slice(0, 10)).map(opt => (
              <li key={opt.slug}>
                <button onClick={() => updateBrand(currentBrand === opt.slug ? null : opt.slug)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                    currentBrand === opt.slug ? 'bg-[var(--cms-color-primary)] text-white font-semibold' : 'text-[#021523] hover:bg-[#f2f3f5]'
                  }`}>
                  {opt.name}
                </button>
              </li>
            ))}
          </ul>
          {brands.length > 10 && (
            <button onClick={() => setShowAllBrands(v => !v)} className="mt-2 text-xs font-semibold text-[var(--cms-color-primary)] hover:underline">
              {showAllBrands ? '− Show less' : `+ Show all ${brands.length} brands`}
            </button>
          )}
        </div>
      )}

      {/* Series */}
      {currentBrand && visibleSeries.length > 0 && (
        <div className="mb-4 ml-2 pl-3 border-l-2 border-[#e5e8ec]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#818ea0] mb-2">Series</h4>
          <ul className="space-y-1">
            {visibleSeries.map(opt => (
              <li key={opt.slug}>
                <button onClick={() => updateParam('series', currentSeries === opt.slug ? null : opt.slug)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                    currentSeries === opt.slug ? 'bg-[var(--cms-color-primary)] text-white font-semibold' : 'text-[#021523] hover:bg-[#f2f3f5]'
                  }`}>
                  {opt.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price */}
      <div className="mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#818ea0] mb-3">Price Range</h4>
        <ul className="space-y-1">
          {priceRanges.map(range => {
            const isActive = currentMinPrice === String(range.min) && currentMaxPrice === String(range.max)
            return (
              <li key={range.label}>
                <button onClick={() => {
                    const p = new URLSearchParams(searchParams.toString())
                    if (isActive) { p.delete('minPrice'); p.delete('maxPrice') }
                    else { p.set('minPrice', String(range.min)); p.set('maxPrice', String(range.max)) }
                    router.push(`/shop?${p.toString()}`)
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                    isActive ? 'bg-[var(--cms-color-primary)] text-white font-semibold' : 'text-[#021523] hover:bg-[#f2f3f5]'
                  }`}>
                  {range.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={currentInStock === 'true'}
            onChange={e => updateParam('instock', e.target.checked ? 'true' : null)}
            className="w-4 h-4 accent-[var(--cms-color-primary)]" />
          <span className="text-sm text-[#021523]">In Stock Only</span>
        </label>
      </div>
    </div>
  )
}
