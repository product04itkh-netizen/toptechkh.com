'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight, Copy, Check, Send } from 'lucide-react'
import { Product } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400')
  }

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`, '_blank')
  }

  const images = ['/top-tech-logo.png']
  const discount = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0
  const displayPrice = product.sale_price ?? product.price

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Images */}
      <div>
        <div className="relative aspect-square bg-[#f2f3f5] rounded-xl overflow-hidden mb-3">
          <Image
            src={images[activeImage]}
            alt={product.name}
            fill
            className="object-contain p-8"
            priority
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = '/top-tech-logo.png'
            }}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImage((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-1.5 hover:bg-[#f2f3f5]"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-1.5 hover:bg-[#f2f3f5]"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  activeImage === idx ? 'border-[#041e42]' : 'border-[#e5e8ec]'
                }`}
              >
                <Image src={img} alt="" width={64} height={64} className="object-contain p-1 w-full h-full" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        {/* Brand & badges */}
        <div className="flex items-center gap-2 mb-2">
          {product.brand && (
            <a
              href={`/shop?brand=${product.brand.slug}`}
              className="text-xs font-bold text-[#0070dc] uppercase tracking-wider hover:underline"
            >
              {product.brand.name}
            </a>
          )}
          <div className="flex gap-1">
            {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
            {product.featured && <Badge variant="new">Featured</Badge>}
            {product.stock_status === 'outofstock' && <Badge variant="outofstock">Out of Stock</Badge>}
          </div>
        </div>

        <h1 className="text-2xl font-black text-[#021523] leading-tight mb-3">{product.name}</h1>

        {product.sku && (
          <div className="mb-4">
            <span className="text-xs text-[#818ea0]">SKU: {product.sku}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#e5e8ec]">
          <span className="text-3xl font-black text-[#021523]">${displayPrice.toFixed(2)}</span>
          {product.sale_price && (
            <span className="text-lg text-[#818ea0] line-through">${product.price.toFixed(2)}</span>
          )}
          {discount > 0 && (
            <span className="text-sm font-bold text-[#ef262c]">Save {discount}%</span>
          )}
        </div>

        {/* Short description */}
        {product.excerpt && (
          <div
            className="text-sm text-[#818ea0] leading-relaxed mb-6 prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-0.5"
            dangerouslySetInnerHTML={{ __html: product.excerpt }}
          />
        )}

        {/* Share buttons */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleFacebook}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1877f2] hover:bg-[#166fe5] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
            Facebook
          </button>
          <button
            onClick={handleTelegram}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#229ed9] hover:bg-[#1a8bc2] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Send size={16} />
            Telegram
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f2f3f5] hover:bg-[#e5e8ec] text-[#021523] text-sm font-semibold rounded-lg border border-[#e5e8ec] transition-colors"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#e5e8ec]">
          {[
            { icon: ShieldCheck, label: 'Warranty', sub: '1 Year Guarantee' },
            { icon: Truck, label: 'Free Shipping', sub: 'Orders over $50' },
            { icon: RotateCcw, label: 'Easy Returns', sub: '30-day return' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center gap-1 p-3 bg-[#f2f3f5] rounded-lg">
              <Icon size={20} className="text-[#041e42]" />
              <span className="text-xs font-bold text-[#021523]">{label}</span>
              <span className="text-[10px] text-[#818ea0]">{sub}</span>
            </div>
          ))}
        </div>

        {/* Category */}
        {product.category && (
          <div className="mt-4 text-sm text-[#818ea0]">
            Category:{' '}
            <a href={`/shop?category=${product.category.slug}`} className="text-[#0070dc] hover:underline">
              {product.category.name}
            </a>
          </div>
        )}
      </div>

      {/* Full description */}
      {product.description && (
        <div className="lg:col-span-2 mt-4">
          <h2 className="text-lg font-bold text-[#021523] mb-4">Product Description</h2>
          <div
            className="prose prose-sm max-w-none text-[#021523] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:text-[#818ea0]"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}
    </div>
  )
}
