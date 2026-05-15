import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Send } from 'lucide-react'

const shopLinks = [
  { label: 'Laptop', href: '/shop?category=laptop' },
  { label: 'PC', href: '/shop?category=pc' },
  { label: 'Components', href: '/shop?category=components' },
  { label: 'LCD Monitor', href: '/shop?category=lcd-monitor' },
  { label: 'Peripherals', href: '/shop?category=peripherals' },
  { label: 'Accessories', href: '/shop?category=accessories' },
  { label: 'Network', href: '/shop?category=network' },
]

const helpLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Return Policy', href: '/returns' },
  { label: 'Privacy Policy', href: '/privacy' },
]

export default function Footer() {
  return (
    <footer className="bg-[#021523] text-white mt-16">
      <div className="max-w-[1290px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Top Tech Computer" width={52} height={52} className="rounded-full" />
              <div>
                <div className="font-black text-white text-lg leading-none">Top Tech</div>
                <div className="text-[10px] text-[#818ea0] leading-none font-medium tracking-wider uppercase">Computer</div>
              </div>
            </div>
            <p className="text-[#818ea0] text-sm leading-relaxed mb-5">
              Phnom Penh's leading electronics store. Quality tech products at the best prices.
            </p>
            <div className="flex gap-2">
              {['Facebook', 'YouTube', 'Telegram'].map((platform) => (
                <a key={platform} href="#" className="text-xs text-[#818ea0] hover:text-[#ffbd27] border border-[#0a3060] px-2 py-1 rounded transition-colors">
                  {platform}
                </a>
              ))}
            </div>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>

            <div className="mb-5">
              <p className="text-[#ffbd27] text-xs font-bold uppercase tracking-wider mb-2">Sale Showroom</p>
              <div className="space-y-1.5">
                <a href="tel:092626092" className="flex items-center gap-2 text-sm text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                  <Phone size={13} /> 092 626 092
                </a>
                <a href="tel:069800577" className="flex items-center gap-2 text-sm text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                  <Phone size={13} /> 069 800 577
                </a>
                <div className="pt-1 space-y-1">
                  <p className="text-xs text-[#516070] uppercase tracking-wider flex items-center gap-1"><Send size={11} /> Telegram</p>
                  <a href="https://t.me/TopTechSale1" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#818ea0] hover:text-[#ffbd27] transition-colors pl-4">
                    Top Tech Sale 1
                  </a>
                  <a href="https://t.me/TopTechSale2" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#818ea0] hover:text-[#ffbd27] transition-colors pl-4">
                    Top Tech Sale 2
                  </a>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[#ffbd27] text-xs font-bold uppercase tracking-wider mb-2">Top Tech Service</p>
              <div className="space-y-1.5">
                <a href="tel:092577092" className="flex items-center gap-2 text-sm text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                  <Phone size={13} /> 092 577 092
                </a>
                <a href="tel:016808777" className="flex items-center gap-2 text-sm text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                  <Phone size={13} /> 016 808 777
                </a>
                <div className="pt-1 space-y-1">
                  <p className="text-xs text-[#516070] uppercase tracking-wider flex items-center gap-1"><Send size={11} /> Telegram</p>
                  <a href="https://t.me/TopTechService" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#818ea0] hover:text-[#ffbd27] transition-colors pl-4">
                    Top Tech Service
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Address column */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Address</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-sm text-[#818ea0]">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-[#ffbd27]" />
                <div className="space-y-2">
                  <p className="leading-relaxed text-xs">
                    អាស័យដ្ឋាន៖ ផ្ទះលេខ 275, ផ្លូវ កម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ នៅចន្លោះស្តុបណាន់ជីង និង ស្តុបដេអិន
                  </p>
                  <p className="leading-relaxed text-xs">
                    275Eo, Street 128, Kampuchea Krom Blvd (128), Phnom Penh.
                  </p>
                </div>
              </div>
              <a href="mailto:toptechcomputerkh@gmail.com" className="flex items-center gap-2 text-sm text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                <Mail size={13} className="flex-shrink-0" /> toptechcomputerkh@gmail.com
              </a>
            </div>
          </div>

          {/* Shop + Help column */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Shop</h4>
              <ul className="space-y-2">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Help</h4>
              <ul className="space-y-2">
                {helpLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#818ea0] hover:text-[#ffbd27] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Map */}
        <div className="mt-10">
          <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
            <MapPin size={14} className="text-[#ffbd27]" /> Our Location
          </h4>
          <div className="w-full overflow-hidden rounded-lg" style={{ height: '300px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15635.088947169726!2d104.909357!3d11.568179!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951fcd5e39c4f%3A0x5a8d3c3163148eb!2sTop%20Tech%20Computer!5e0!3m2!1sen!2skh!4v1777507282046!5m2!1sen!2skh"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Top Tech Computer Location"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-[#0a2540]">
        <div className="max-w-[1290px] mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
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
