'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'

const slides = [
  {
    id: 1,
    image: '/banner-main.png',
    alt: 'Top Tech Computer — Quality Products, Best Prices',
    href: '/shop',
  },
  {
    id: 2,
    image: '/banner-asus-aio.png',
    alt: 'ASUS V400 AiO — Minimalist Aesthetic, Thoughtful Functionality',
    href: '/shop?category=pc&q=all-in-one',
  },
  {
    id: 3,
    image: '/banner-pc-build.jpg',
    alt: 'PC Build — Best Quality, Best Price',
    href: '/shop?category=pc',
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next, paused])

  return (
    <section
      className="w-full bg-[#021523]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="max-w-[1290px] mx-auto px-4 pt-4">
        <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] rounded-xl overflow-hidden">
          {slides.map((slide, i) => (
            <Link
              key={slide.id}
              href={slide.href}
              className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              tabIndex={i === current ? 0 : -1}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="(max-width: 1290px) 100vw, 1290px"
              />
            </Link>
          ))}

          {/* Prev / Next arrows */}
          <button
            onClick={(e) => { e.preventDefault(); prev() }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white rounded-full p-2.5 transition-colors backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white rounded-full p-2.5 transition-colors backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2.5 bg-[#ffbd27]' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Telegram order strip */}
      <div className="mt-4 bg-[#041e42] border-t border-white/10">
        <div className="max-w-[1290px] mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs text-[#b0bec5]">
            <Send size={13} className="text-[#ffbd27] flex-shrink-0" />
            <span className="hidden sm:inline">Order via Telegram:</span>
            <a href="https://t.me/TopTechSale1" target="_blank" rel="noopener noreferrer"
              className="text-[#ffbd27] hover:underline font-medium">Top Tech Sale 1</a>
            <span className="text-white/30">|</span>
            <a href="https://t.me/TopTechSale2" target="_blank" rel="noopener noreferrer"
              className="text-[#ffbd27] hover:underline font-medium">Top Tech Sale 2</a>
          </div>
          <div className="text-xs text-[#818ea0]">
            📞 092 626 092 &nbsp;|&nbsp; 069 800 577
          </div>
        </div>
      </div>
    </section>
  )
}
