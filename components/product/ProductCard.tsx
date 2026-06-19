'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { useCartStore } from '@/lib/cart-store'
import Badge from '@/components/ui/Badge'

interface ProductCardProps {
  product: Product
}

/** Extract plain-text bullet points from WooCommerce HTML excerpt */
function extractBullets(html: string | null): string[] {
  if (!html) return []
  const items = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) ?? []
  return items
    .slice(0, 4)
    .map((li) => li.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)

  const discount = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0
  const displayPrice = product.sale_price ?? product.price

  // Handle images as string (JSON) or array
  const imageArray = typeof product.images === 'string'
    ? JSON.parse(product.images ?? '[]').filter(Boolean)
    : (product.images ?? []).filter(Boolean)
  const imageUrl = Array.isArray(imageArray) && imageArray.length > 0 ? imageArray[0] : null

  const bullets = extractBullets(product.excerpt)
  const outOfStock = product.stock_status === 'outofstock'

  return (
    <div className="group relative bg-white border border-[#e5e8ec] rounded-xl overflow-hidden hover:shadow-lg hover:border-[var(--cms-color-primary)] transition-all duration-200 flex flex-col">

      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
        {product.featured && <Badge variant="new">Featured</Badge>}
        {outOfStock && <Badge variant="outofstock">Sold Out</Badge>}
      </div>

      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-[#f5f6f8] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#d1d9e0]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">

        {/* Brand */}
        {product.brand && (
          <p className="text-[10px] font-bold text-[var(--cms-color-primary)] uppercase tracking-wider mb-1">
            {product.brand.name}
          </p>
        )}

        {/* Model name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-[#021523] line-clamp-2 hover:text-[var(--cms-color-primary)] transition-colors leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Specs bullets */}
        {bullets.length > 0 && (
          <ul className="flex-1 mb-3 space-y-0.5">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px] text-[#555] leading-snug">
                <span className="mt-[3px] w-1 h-1 rounded-full bg-[var(--cms-color-primary)] flex-shrink-0" />
                <span className="line-clamp-1">{b}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Spacer pushes button to bottom */}
        {bullets.length === 0 && <div className="flex-1" />}

        {/* Sale original price */}
        {product.sale_price && (
          <p className="text-[11px] text-[#818ea0] line-through mb-1">
            ${product.price.toFixed(2)}
          </p>
        )}

        {/* Add to Cart button with price */}
        <button
          onClick={() => addItem(product)}
          disabled={outOfStock}
          className="w-full flex items-center justify-center bg-[var(--cms-color-primary)] hover:bg-[var(--cms-color-primary-hover)] disabled:bg-[#c8cdd5] disabled:cursor-not-allowed text-white font-black text-base px-3 py-2.5 rounded-lg transition-colors"
        >
          {outOfStock ? 'Out of Stock' : `$${displayPrice.toFixed(2)}`}
        </button>
      </div>
    </div>
  )
}
