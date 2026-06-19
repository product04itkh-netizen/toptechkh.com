'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'

export interface BannerSlide {
  id: number
  image_url: string
  link_url: string
}

export default function HeroBannerCarousel({ slides }: { slides: BannerSlide[] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(0)

  const count = slides.length
  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count])

  useEffect(() => {
    setCurrent(0)
  }, [count])

  useEffect(() => {
    if (paused || count < 2) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next, paused, count])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setPaused(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    setPaused(false)
  }

  if (slides.length === 0) return null

  return (
    <section className="w-full bg-[#021523]">
      <div className="sm:max-w-[1290px] sm:mx-auto sm:px-4 sm:pt-4">
        <div
          className="relative w-full h-[200px] sm:h-[320px] md:h-[400px] sm:rounded-xl overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, i) => (
            <Link
              key={slide.id}
              href={slide.link_url}
              className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              tabIndex={i === current ? 0 : -1}
            >
              <Image
                src={slide.image_url}
                alt={`Banner ${i + 1}`}
                fill
                className="object-cover object-center"
                priority={i === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1290px) 100vw, 1290px"
              />
            </Link>
          ))}

          {/* Arrows — only show when more than 1 slide */}
          {count > 1 && (
            <>
              <button
                onClick={(e) => { e.preventDefault(); prev() }}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white rounded-full p-1.5 sm:p-2.5 transition-colors backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} className="sm:hidden" />
                <ChevronLeft size={22} className="hidden sm:block" />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); next() }}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white rounded-full p-1.5 sm:p-2.5 transition-colors backdrop-blur-sm"
                aria-label="Next slide"
              >
                <ChevronRight size={16} className="sm:hidden" />
                <ChevronRight size={22} className="hidden sm:block" />
              </button>
            </>
          )}

          {/* Dots */}
          {count > 1 && (
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-5 sm:w-6 h-2 sm:h-2.5 bg-[#ffbd27]'
                      : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Telegram order strip */}
      <div className="mt-3 sm:mt-4 bg-[var(--cms-color-primary)] border-t border-white/10">
        <div className="max-w-[1290px] mx-auto px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-y-1 gap-x-3">
          <div className="flex items-center gap-2 text-xs text-[#b0bec5] flex-wrap">
            <Send size={11} className="text-[#ffbd27] flex-shrink-0" />
            <span className="text-[#818ea0]">Order via Telegram:</span>
            <a href="https://t.me/TopTechSale1" target="_blank" rel="noopener noreferrer"
              className="text-[#ffbd27] hover:underline font-medium">Sale 1</a>
            <span className="text-white/30">|</span>
            <a href="https://t.me/TopTechSale2" target="_blank" rel="noopener noreferrer"
              className="text-[#ffbd27] hover:underline font-medium">Sale 2</a>
          </div>
          <div className="text-xs text-[#818ea0] flex items-center gap-1">
            <span>📞</span>
            <span>092 626 092</span>
            <span className="text-white/30 mx-0.5">|</span>
            <span>069 800 577</span>
          </div>
        </div>
      </div>
    </section>
  )
}
