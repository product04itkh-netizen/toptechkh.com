import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default async function Footer() {
  const { data: categories } = await supabase
    .from('categories')
    .select('name, slug')
    .order('name')

  const shopLinks = (categories ?? []).map((c) => ({
    label: c.name,
    href: `/shop?category=${c.slug}`,
  }))

  return (
    <footer className="bg-[#021523] text-white mt-8 sm:mt-16">
      <div className="max-w-[1290px] mx-auto px-4 py-7 sm:py-9">

        {/*
          12-col grid (desktop):
          Brand(2) | Contact(2) | Address(2) | Shop(2) | Map(4)
          Each text column = ~195px | Map = ~390px
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 lg:items-stretch">

          {/* ── Brand ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/top-tech-logo.png" alt="Top Tech Computer" width={40} height={40} className="rounded-full" />
              <div>
                <div className="font-black text-white text-base leading-none">Top Tech</div>
                <div className="text-[10px] text-[#818ea0] leading-none font-medium tracking-wider uppercase">Computer</div>
              </div>
            </div>
            <p className="text-[#818ea0] text-xs leading-relaxed mb-3">
              Phnom Penh's leading electronics store. Quality tech at the best prices.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Facebook', href: 'https://www.facebook.com/toptechComputerStore' },
                { label: 'YouTube',  href: 'https://www.youtube.com/@TopTechComputer' },
                { label: 'Telegram', href: 'https://t.me/top_techcomputer' },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] text-[#818ea0] hover:text-[#ffbd27] border border-[var(--cms-color-primary-hover)] px-2 py-1 rounded transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Contact ── */}
          <div className="lg:col-span-2 text-center">
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Contact Us</h4>

            <p className="text-[#ffbd27] text-[10px] font-bold uppercase tracking-wider mb-1.5">Sale Showroom</p>
            <div className="space-y-1 mb-3">
              <a href="tel:092626092" className="flex items-center justify-center gap-1.5 text-xs text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                <Phone size={10} /> 092 626 092
              </a>
              <a href="tel:069800577" className="flex items-center justify-center gap-1.5 text-xs text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                <Phone size={10} /> 069 800 577
              </a>
              <p className="text-[10px] text-[#516070] uppercase tracking-wider flex items-center justify-center gap-1 pt-0.5">
                <Send size={9} /> Telegram
              </p>
              <a href="https://t.me/TopTechSale1" target="_blank" rel="noopener noreferrer" className="block text-xs text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                Top Tech Sale 1
              </a>
              <a href="https://t.me/TopTechSale2" target="_blank" rel="noopener noreferrer" className="block text-xs text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                Top Tech Sale 2
              </a>
            </div>

            <p className="text-[#ffbd27] text-[10px] font-bold uppercase tracking-wider mb-1.5">Top Tech Service</p>
            <div className="space-y-1">
              <a href="tel:092577092" className="flex items-center justify-center gap-1.5 text-xs text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                <Phone size={10} /> 092 577 092
              </a>
              <a href="tel:016808777" className="flex items-center justify-center gap-1.5 text-xs text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                <Phone size={10} /> 016 808 777
              </a>
              <p className="text-[10px] text-[#516070] uppercase tracking-wider flex items-center justify-center gap-1 pt-0.5">
                <Send size={9} /> Telegram
              </p>
              <a href="https://t.me/TopTechService" target="_blank" rel="noopener noreferrer" className="block text-xs text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                Top Tech Service
              </a>
            </div>
          </div>

          {/* ── Address ── */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider text-center">Address</h4>
            <div className="flex items-start gap-1.5 text-[#818ea0] mb-3">
              <MapPin size={11} className="mt-0.5 flex-shrink-0 text-[#ffbd27]" />
              <div className="space-y-1.5">
                <p className="leading-relaxed text-[11px]">
                  ផ្ទះលេខ 275, ផ្លូវ កម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ
                </p>
                <p className="leading-relaxed text-[11px]">
                  275Eo, Street 128, Kampuchea Krom Blvd, Phnom Penh.
                </p>
              </div>
            </div>
            <a href="mailto:toptechcomputerkh@gmail.com"
              className="flex items-center gap-1.5 text-xs text-[#818ea0] hover:text-[#ffbd27] transition-colors">
              <Mail size={10} className="flex-shrink-0" />
              <span className="truncate">toptechcomputerkh@gmail.com</span>
            </a>
          </div>

          {/* ── Shop ── */}
          <div className="lg:col-span-2 text-center">
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Shop</h4>
            <ul className="space-y-1.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-[#818ea0] hover:text-[#ffbd27] transition-colors whitespace-nowrap">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Map ── fills remaining height */}
          <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
              <MapPin size={11} className="text-[#ffbd27]" /> Our Location
            </h4>
            <div className="flex-1 min-h-[180px] w-full overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15635.088947169726!2d104.909357!3d11.568179!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951fcd5e39c4f%3A0x5a8d3c3163148eb!2sTop%20Tech%20Computer!5e0!3m2!1sen!2skh!4v1777507282046!5m2!1sen!2skh"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Top Tech Computer Location"
              />
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-[#0a2540]">
        <div className="max-w-[1290px] mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[#818ea0] text-xs">© 2024 Top Tech Computer. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-[#818ea0] hover:text-[#ffbd27]">Privacy</Link>
            <Link href="/terms" className="text-xs text-[#818ea0] hover:text-[#ffbd27]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
