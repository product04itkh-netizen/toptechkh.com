import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getSiteSettings } from '@/lib/site-settings'
import { telHref } from '@/lib/site-settings-schema'

export default async function Footer() {
  const [{ data: categories }, site] = await Promise.all([
    supabase.from('categories').select('name, slug').order('name'),
    getSiteSettings(),
  ])

  const { brand, contact, footer } = site

  const shopLinks = (categories ?? []).map((c) => ({
    label: c.name,
    href: `/shop?category=${c.slug}`,
  }))

  const hasAddress = Boolean(contact.addressKm || contact.addressEn)

  return (
    <footer className="bg-[#021523] text-white mt-8 sm:mt-16">
      <div className="max-w-[1290px] mx-auto px-4 py-7 sm:py-9">

        {/*
          12-col grid (desktop):
          Brand(2) | Contact(2) | Address(3) | Shop(2) | Map(3)
          Everything in the text columns is editable in Admin → Site Info.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 lg:items-stretch">

          {/* ── Brand ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/top-tech-logo.png" alt="Top Tech Computer" width={40} height={40} className="rounded-full" />
              <div>
                <div className="font-black text-white text-base leading-none">Top Tech</div>
                <div className="text-[11px] text-[#9aa6b4] leading-none font-medium tracking-wider uppercase">Computer</div>
              </div>
            </div>
            {brand.tagline && (
              <p className="text-[#9aa6b4] text-xs leading-relaxed mb-3">{brand.tagline}</p>
            )}
            {brand.social.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {brand.social.map(({ label, url }) => (
                  <a key={`${label}-${url}`} href={url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[#9aa6b4] hover:text-[#ffbd27] border border-[var(--cms-color-primary-hover)] px-2 py-1 rounded transition-colors">
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── Contact ── */}
          <div className="lg:col-span-2 text-center">
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Contact Us</h4>

            {contact.groups.map((group, gi) => (
              <div key={`${group.title}-${gi}`} className={gi < contact.groups.length - 1 ? 'mb-3' : ''}>
                <p className="text-[#ffbd27] text-[11px] font-bold uppercase tracking-wider mb-1.5">{group.title}</p>
                <div className="space-y-1">
                  {group.phones.map((phone) => (
                    <a key={phone} href={telHref(phone)} className="flex items-center justify-center gap-1.5 text-xs text-[#9aa6b4] hover:text-[#ffbd27] transition-colors">
                      <Phone size={10} /> {phone}
                    </a>
                  ))}
                  {group.telegram.length > 0 && (
                    <p className="text-[11px] text-[#8d9aab] uppercase tracking-wider flex items-center justify-center gap-1 pt-0.5">
                      <Send size={9} /> Telegram
                    </p>
                  )}
                  {group.telegram.map((t) => (
                    <a key={t.url} href={t.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-[#9aa6b4] hover:text-[#ffbd27] transition-colors">
                      {t.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Address ── */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider text-center">Address</h4>
            {hasAddress && (
              <div className="flex items-start gap-1.5 text-[#9aa6b4] mb-3">
                <MapPin size={11} className="mt-0.5 flex-shrink-0 text-[#ffbd27]" />
                <div className="space-y-1.5">
                  {contact.addressKm && <p className="leading-relaxed text-xs">{contact.addressKm}</p>}
                  {contact.addressEn && <p className="leading-relaxed text-xs">{contact.addressEn}</p>}
                </div>
              </div>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 text-xs text-[#9aa6b4] hover:text-[#ffbd27] transition-colors">
                <Mail size={10} className="flex-shrink-0" />
                <span className="truncate">{contact.email}</span>
              </a>
            )}
          </div>

          {/* ── Shop ── */}
          <div className="lg:col-span-2 text-center">
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Shop</h4>
            <ul className="space-y-1.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-[#9aa6b4] hover:text-[#ffbd27] transition-colors whitespace-nowrap">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Map ── fills remaining height */}
          {contact.mapEmbedUrl && (
            <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
              <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
                <MapPin size={11} className="text-[#ffbd27]" /> Our Location
              </h4>
              <div className="flex-1 min-h-[180px] w-full overflow-hidden rounded-lg">
                <iframe
                  src={contact.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store location"
                />
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="border-t border-[#0a2540]">
        <div className="max-w-[1290px] mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[#9aa6b4] text-xs">
            © {new Date().getFullYear()} {footer.copyright}
          </p>
          {footer.legalLinks.length > 0 && (
            <div className="flex gap-4">
              {footer.legalLinks.map(({ label, url }) =>
                url.startsWith('/') ? (
                  <Link key={`${label}-${url}`} href={url} className="text-xs text-[#9aa6b4] hover:text-[#ffbd27]">{label}</Link>
                ) : (
                  <a key={`${label}-${url}`} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#9aa6b4] hover:text-[#ffbd27]">{label}</a>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
