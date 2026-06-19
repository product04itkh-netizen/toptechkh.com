'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight, Copy, Check, Send } from 'lucide-react'
import { Product } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [copied, setCopied] = useState(false)
  const [paused, setPaused] = useState(false)
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // Handle images - can be string (JSON), array, or null
  let images: string[] = []
  if (product.images) {
    if (typeof product.images === 'string') {
      try {
        images = JSON.parse(product.images).filter(Boolean)
      } catch {
        images = []
      }
    } else if (Array.isArray(product.images)) {
      images = product.images.filter(Boolean)
    }
  }

  useEffect(() => {
    if (images.length <= 1 || paused) return
    const id = setInterval(() => setActiveImage((p) => (p + 1) % images.length), 3500)
    return () => clearInterval(id)
  }, [images.length, paused])

  const goTo = (idx: number) => {
    setActiveImage(idx)
    setPaused(true)
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = setTimeout(() => setPaused(false), 6000)
  }
  const discount = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0
  const displayPrice = product.sale_price ?? product.price

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Images */}
      <div className="lg:sticky lg:top-6 flex gap-3 self-start"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Vertical thumbnail strip */}
        {images.length > 1 && (
          <div className="hidden sm:flex flex-col gap-2 w-[68px] flex-shrink-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`relative w-[68px] h-[68px] rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-150 ${
                  activeImage === idx
                    ? 'border-[var(--cms-color-primary)] shadow-sm'
                    : 'border-[#e5e8ec] hover:border-[#9aacbe]'
                }`}
              >
                <Image src={img} alt={`${product.name} image ${idx + 1}`} fill className="object-contain p-1.5" />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div className="flex-1 min-w-0">
          <div className="relative aspect-[4/3] bg-[#f5f6f8] rounded-xl overflow-hidden group">
            {images.length > 0 ? (
              <>
                <Image
                  src={images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-3 sm:p-6 transition-transform duration-300 group-hover:scale-[1.03]"
                  priority
                />
                {images.length > 1 && (
                  <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-full pointer-events-none">
                    {activeImage + 1} / {images.length}
                  </span>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => goTo((activeImage - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-md rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-150"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      onClick={() => goTo((activeImage + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-md rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-150"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#c5ccd5]">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span className="text-sm text-[#b0bec5]">No image</span>
              </div>
            )}
          </div>

          {/* Mobile-only dot indicators */}
          {images.length > 1 && (
            <div className="flex sm:hidden justify-center gap-1.5 mt-3">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeImage === idx ? 'bg-[var(--cms-color-primary)] w-4' : 'bg-[#c5ccd5]'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
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

        <h1 className="text-xl sm:text-2xl font-black text-[#021523] leading-tight mb-3">{product.name}</h1>

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
            <span className="text-sm font-bold text-[var(--cms-color-accent)]">Save {discount}%</span>
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
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleFacebook}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#1877f2] hover:bg-[#166fe5] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
            Facebook
          </button>
          <button
            onClick={handleTelegram}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#229ed9] hover:bg-[#1a8bc2] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Send size={15} />
            Telegram
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#f2f3f5] hover:bg-[#e5e8ec] text-[#021523] text-sm font-semibold rounded-lg border border-[#e5e8ec] transition-colors"
          >
            {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 pt-6 border-t border-[#e5e8ec]">
          {[
            { icon: ShieldCheck, label: 'Warranty', sub: '1 Year Guarantee' },
            { icon: Truck, label: 'Free Shipping', sub: 'Orders over $50' },
            { icon: RotateCcw, label: 'Easy Returns', sub: '30-day return' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center gap-1 p-2 sm:p-3 bg-[#f2f3f5] rounded-lg">
              <Icon size={18} className="text-[var(--cms-color-primary)]" />
              <span className="text-[10px] sm:text-xs font-bold text-[#021523]">{label}</span>
              <span className="text-[9px] sm:text-[10px] text-[#818ea0] leading-tight">{sub}</span>
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

    </div>

      {/* Full description — outside the 2-col grid so sticky gallery never overlaps */}
      {product.description && (
        <div className="mt-8 pt-8 border-t border-[#e5e8ec]">
          <h2 className="text-lg font-bold text-[#021523] mb-4">Product Description</h2>
          <div
            className="prose prose-sm max-w-none text-[#021523] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:text-[#818ea0]"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}
    </>
  )
}
