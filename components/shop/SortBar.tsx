'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'

interface SortBarProps {
  total: number
  onFilterClick?: () => void
}

export default function SortBar({ total, onFilterClick }: SortBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'newest'

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between bg-white border border-[#e5e8ec] rounded-lg px-4 py-3 mb-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onFilterClick}
          className="lg:hidden flex items-center gap-1.5 text-sm text-[#021523] font-medium border border-[#e5e8ec] px-3 py-1.5 rounded-md hover:bg-[#f2f3f5]"
        >
          <SlidersHorizontal size={14} /> Filters
        </button>
        <span className="text-sm text-[#818ea0]">
          <span className="font-semibold text-[#021523]">{total}</span> products found
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-[#818ea0] hidden sm:block">Sort by:</span>
        <select
          value={currentSort}
          onChange={(e) => handleSort(e.target.value)}
          className="text-sm border border-[#e5e8ec] rounded-md px-3 py-1.5 text-[#021523] outline-none focus:border-[#041e42] cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Best Rated</option>
        </select>
      </div>
    </div>
  )
}
