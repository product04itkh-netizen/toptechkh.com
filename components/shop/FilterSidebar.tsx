'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { X } from 'lucide-react'

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

  return (
    <div className="bg-white border border-[#e5e8ec] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#021523]">Filters</h3>
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
            {brands.map((opt) => (
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
