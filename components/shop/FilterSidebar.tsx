'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'

const priceRanges = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $200', min: 50, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: '$500 - $1000', min: 500, max: 1000 },
  { label: 'Over $1000', min: 1000, max: 99999 },
]

interface FilterOption { name: string; slug: string }

interface FilterSidebarProps {
  onClose?: () => void
  categories: FilterOption[]
  brands: FilterOption[]
}

export default function FilterSidebar({ onClose, categories, brands }: FilterSidebarProps) {
  const [collapsed, setCollapsed] = useState(true)
  const [showAllBrands, setShowAllBrands] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
  }, [router, searchParams])

  const currentCategory = searchParams.get('category')
  const currentBrand = searchParams.get('brand')
  const currentMinPrice = searchParams.get('minPrice')
  const currentMaxPrice = searchParams.get('maxPrice')
  const currentInStock = searchParams.get('instock')

  const clearAll = () => {
    const q = searchParams.get('q')
    router.push(q ? `/shop?q=${q}` : '/shop')
  }

  const hasFilters = currentCategory || currentBrand || currentMinPrice || currentInStock

  if (collapsed) {
    return (
      <div className="sticky top-1/2 -translate-y-1/2">
        <button
          onClick={() => setCollapsed(false)}
          title="Show Filters"
          className="flex flex-col items-center gap-2 px-2 py-3 bg-[#041e42] text-white rounded-xl shadow-lg hover:bg-[#0a3060] hover:shadow-xl active:scale-95 transition-all duration-200 group"
        >
          <SlidersHorizontal size={15} className="flex-shrink-0" />
          <span className="text-[8px] font-black uppercase tracking-widest [writing-mode:vertical-lr] rotate-180 leading-none">
            Filters
          </span>
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <ChevronRight size={11} />
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="sticky top-6 bg-white border border-[#e5e8ec] rounded-lg p-4 w-60 max-h-[calc(100vh-3rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={14} className="text-[#041e42]" />
          <h3 className="font-bold text-[#021523]">Filters</h3>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-[#ef262c] hover:underline">
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-[#818ea0] hover:text-[#021523] lg:hidden">
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      {/* Hide toggle */}
      <button
        onClick={() => setCollapsed(true)}
        title="Hide Filters"
        className="w-full flex items-center justify-center gap-1.5 mb-4 py-1.5 rounded-md text-xs font-semibold text-[#818ea0] border border-dashed border-[#d1d9e0] hover:bg-[#041e42] hover:text-white hover:border-[#041e42] transition-all duration-200 group"
      >
        <ChevronLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
        Hide Filters
      </button>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#818ea0] mb-3">Category</h4>
          <ul className="space-y-1">
            {categories.map((opt) => (
              <li key={opt.slug}>
                <button
                  onClick={() => updateParam('category', currentCategory === opt.slug ? null : opt.slug)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                    currentCategory === opt.slug
                      ? 'bg-[#041e42] text-white font-semibold'
                      : 'text-[#021523] hover:bg-[#f2f3f5]'
                  }`}
                >
                  {opt.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#818ea0] mb-3">Brand</h4>
          <ul className="space-y-1">
            {(showAllBrands ? brands : brands.slice(0, 10)).map((opt) => (
              <li key={opt.slug}>
                <button
                  onClick={() => updateParam('brand', currentBrand === opt.slug ? null : opt.slug)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                    currentBrand === opt.slug
                      ? 'bg-[#041e42] text-white font-semibold'
                      : 'text-[#021523] hover:bg-[#f2f3f5]'
                  }`}
                >
                  {opt.name}
                </button>
              </li>
            ))}
          </ul>
          {brands.length > 10 && (
            <button
              onClick={() => setShowAllBrands((v) => !v)}
              className="mt-2 text-xs font-semibold text-[#041e42] hover:underline flex items-center gap-1"
            >
              {showAllBrands ? `− Show less` : `+ Show all ${brands.length} brands`}
            </button>
          )}
        </div>
      )}

      {/* Price */}
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#818ea0] mb-3">Price Range</h4>
        <ul className="space-y-1">
          {priceRanges.map((range) => {
            const isActive = currentMinPrice === String(range.min) && currentMaxPrice === String(range.max)
            return (
              <li key={range.label}>
                <button
                  onClick={() => {
                    if (isActive) {
                      const p = new URLSearchParams(searchParams.toString())
                      p.delete('minPrice')
                      p.delete('maxPrice')
                      router.push(`/shop?${p.toString()}`)
                    } else {
                      const p = new URLSearchParams(searchParams.toString())
                      p.set('minPrice', String(range.min))
                      p.set('maxPrice', String(range.max))
                      router.push(`/shop?${p.toString()}`)
                    }
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                    isActive
                      ? 'bg-[#041e42] text-white font-semibold'
                      : 'text-[#021523] hover:bg-[#f2f3f5]'
                  }`}
                >
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
          <input
            type="checkbox"
            checked={currentInStock === 'true'}
            onChange={(e) => updateParam('instock', e.target.checked ? 'true' : null)}
            className="w-4 h-4 accent-[#041e42]"
          />
          <span className="text-sm text-[#021523]">In Stock Only</span>
        </label>
      </div>
    </div>
  )
}
