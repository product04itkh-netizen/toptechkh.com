'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/lib/types'

interface BrandGroup {
  brand: { id: number; name: string; slug: string; logo_url: string | null } | null
  products: Product[]
}

interface CategoryLandingProps {
  category: { name: string; slug: string; image_url: string | null; description: string | null }
  brandGroups: BrandGroup[]
  totalProducts: number
  brandBanners?: Record<number, string>
}

const INITIAL_COUNT = 8 // 2 rows × 4 cols

export default function CategoryLanding({ category, brandGroups, totalProducts, brandBanners = {} }: CategoryLandingProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const bannerUrl = category.image_url?.includes('supabase') ? category.image_url : null

  return (
    <div>
      {/* Banner */}
      <div className="relative w-full h-32 sm:h-44 md:h-56 lg:h-64 rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-[#021523] to-[var(--cms-color-primary-hover)]">
        {bannerUrl && (
          <Image src={bannerUrl} alt={category.name} fill className="object-cover" priority />
        )}
        {!bannerUrl && (
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#021523]/90 via-[#021523]/50 to-transparent flex flex-col justify-center px-5 sm:px-8">
          <p className="text-[#ffbd27] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 sm:mb-2">Browse</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">{category.name}</h1>
          {category.description && (
            <p className="hidden sm:block text-white/60 text-sm mt-2 max-w-md">{category.description}</p>
          )}
          <p className="text-white/50 text-[10px] sm:text-xs mt-1 sm:mt-3">{totalProducts} products · {brandGroups.length} brands</p>
        </div>
      </div>

      {/* Brand sections */}
      <div className="space-y-12">
        {brandGroups.map(({ brand, products }, idx) => {
          if (!products.length) return null
          const key = brand?.slug ?? '__no_brand'
          const isExp = expanded.has(key)
          const shown = isExp ? products : products.slice(0, INITIAL_COUNT)
          const remaining = products.length - INITIAL_COUNT

          return (
            <section key={key}>
              {/* Brand banner */}
              {(() => {
                // Per-category banner takes priority; fall back to brand's global logo_url
                const perCategoryUrl = brand?.id && brandBanners[brand.id] ? brandBanners[brand.id] : null
                const fallbackUrl = brand?.logo_url?.includes('supabase') ? brand.logo_url : null
                const bannerUrl = perCategoryUrl ?? fallbackUrl
                return (
                  <div className="relative h-28 sm:h-40 md:h-56 rounded-xl overflow-hidden mb-4 bg-gradient-to-r from-[#021523] to-[var(--cms-color-primary-hover)]">
                    {bannerUrl && (
                      <Image src={bannerUrl} alt={brand?.name ?? ''} fill className="object-cover" priority={idx === 0} />
                    )}
                    {!bannerUrl && (
                      <div className="absolute inset-0 opacity-5"
                        style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6">
                      <div>
                        <p className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mb-0.5">Brand</p>
                        <h2 className="text-xl sm:text-2xl font-black text-white">{brand?.name ?? 'Other'}</h2>
                        <p className="text-white/50 text-xs mt-0.5">{products.length} products</p>
                      </div>
                      {brand && (
                        <Link
                          href={`/shop?category=${category.slug}&brand=${brand.slug}`}
                          className="flex items-center gap-1 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all backdrop-blur-sm whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">View all</span>
                          <ArrowRight size={13} />
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })()}

              {/* Product grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {shown.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* View more / less */}
              {remaining > 0 && (
                <button
                  onClick={() => toggle(key)}
                  className="mt-5 w-full py-3 rounded-xl text-sm font-semibold transition-all border border-dashed border-[#c5ccd5] text-[#818ea0] hover:border-[var(--cms-color-primary)] hover:text-[var(--cms-color-primary)] hover:bg-[#f8f9ff]"
                >
                  {isExp
                    ? 'Show less'
                    : `+ Show ${remaining} more ${brand?.name ?? ''} products`}
                </button>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
