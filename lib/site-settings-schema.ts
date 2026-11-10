import { z } from 'zod'

/**
 * Editable site information (Admin → Site Info), stored as one JSON row in
 * cms_settings under the key "site_info". Defaults below mirror what used to be
 * hardcoded, so the storefront looks identical until an admin changes something.
 * No server-only imports here: the admin form uses these types and constants too.
 */

export const SITE_INFO_KEY = 'site_info'

export const TRUST_ICON_KEYS = ['shield', 'truck', 'refresh', 'headset', 'badge', 'clock', 'gift', 'credit'] as const
export type TrustIconKey = (typeof TRUST_ICON_KEYS)[number]

export const TRUST_ICON_LABELS: Record<TrustIconKey, string> = {
  shield: 'Shield (warranty)',
  truck: 'Truck (shipping)',
  refresh: 'Circular arrow (returns)',
  headset: 'Headset (support)',
  badge: 'Check badge (genuine)',
  clock: 'Clock (fast delivery)',
  gift: 'Gift',
  credit: 'Credit card (payment)',
}

const httpUrl = z
  .string()
  .trim()
  .max(300)
  .refine((v) => /^https?:\/\/\S+$/i.test(v), 'Link must start with http:// or https://')

const siteLink = z
  .string()
  .trim()
  .max(300)
  .refine((v) => /^(\/\S*|https?:\/\/\S+)$/i.test(v), 'Link must start with / (this site) or http(s)://')

const phone = z
  .string()
  .trim()
  .min(3, 'Phone number is too short')
  .max(30)
  .regex(/^[0-9+()\-\s]+$/, 'Phone numbers can only contain digits, spaces, + ( ) and -')

const contactLink = z.object({
  label: z.string().trim().min(1, 'Label is required').max(60),
  short: z.string().trim().max(30).default(''),
  url: httpUrl,
})

const socialLink = z.object({
  label: z.string().trim().min(1, 'Label is required').max(40),
  url: httpUrl,
})

const contactGroup = z.object({
  title: z.string().trim().min(1, 'Group title is required').max(60),
  phones: z.array(phone).max(6),
  telegram: z.array(contactLink).max(6),
})

const brandSchema = z.object({
  tagline: z.string().trim().max(200),
  social: z.array(socialLink).max(8),
})

const contactSchema = z.object({
  groups: z.array(contactGroup).max(4),
  email: z
    .string()
    .trim()
    .max(120)
    .refine((v) => v === '' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), 'Enter a valid email address'),
  addressKm: z.string().trim().max(300),
  addressEn: z.string().trim().max(300),
  mapEmbedUrl: z
    .string()
    .trim()
    .max(1200)
    .refine(
      (v) => v === '' || /^https:\/\/www\.google\.com\/maps\/embed\?/.test(v),
      'Use the "Embed a map" link from Google Maps (it starts with https://www.google.com/maps/embed)'
    ),
})

const trustSignalSchema = z.object({
  icon: z.enum(TRUST_ICON_KEYS),
  title: z.string().trim().min(1, 'Title is required').max(40),
  subtitle: z.string().trim().max(60),
})

const shippingSchema = z.object({
  freeThreshold: z.number().min(0, 'Cannot be negative').max(100000),
  flatFee: z.number().min(0, 'Cannot be negative').max(1000),
})

const homeSchema = z.object({
  categoriesTitle: z.string().trim().min(1, 'Title is required').max(80),
  categoriesSubtitle: z.string().trim().max(160),
  orderStripLabel: z.string().trim().max(60),
})

const footerSchema = z.object({
  copyright: z.string().trim().max(120),
  legalLinks: z.array(z.object({ label: z.string().trim().min(1, 'Label is required').max(40), url: siteLink })).max(6),
})

export const siteSettingsSchema = z.object({
  brand: brandSchema,
  contact: contactSchema,
  trustSignals: z.array(trustSignalSchema).max(4),
  shipping: shippingSchema,
  home: homeSchema,
  footer: footerSchema,
})

export type SiteSettings = z.infer<typeof siteSettingsSchema>
export type ContactGroup = SiteSettings['contact']['groups'][number]
export type TrustSignal = SiteSettings['trustSignals'][number]

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brand: {
    tagline: "Phnom Penh's leading electronics store. Quality tech at the best prices.",
    social: [
      { label: 'Facebook', url: 'https://www.facebook.com/toptechComputerStore' },
      { label: 'YouTube', url: 'https://www.youtube.com/@TopTechComputer' },
      { label: 'Telegram', url: 'https://t.me/top_techcomputer' },
    ],
  },
  contact: {
    groups: [
      {
        title: 'Sale Showroom',
        phones: ['092 626 092', '069 800 577'],
        telegram: [
          { label: 'Top Tech Sale 1', short: 'Sale 1', url: 'https://t.me/TopTechSale1' },
          { label: 'Top Tech Sale 2', short: 'Sale 2', url: 'https://t.me/TopTechSale2' },
        ],
      },
      {
        title: 'Top Tech Service',
        phones: ['092 577 092', '016 808 777'],
        telegram: [{ label: 'Top Tech Service', short: '', url: 'https://t.me/TopTechService' }],
      },
    ],
    email: 'toptechcomputerkh@gmail.com',
    addressKm: 'ផ្ទះលេខ 275, ផ្លូវ កម្ពុជាក្រោម សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ',
    addressEn: '275Eo, Street 128, Kampuchea Krom Blvd, Phnom Penh.',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15635.088947169726!2d104.909357!3d11.568179!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951fcd5e39c4f%3A0x5a8d3c3163148eb!2sTop%20Tech%20Computer!5e0!3m2!1sen!2skh!4v1777507282046!5m2!1sen!2skh',
  },
  trustSignals: [
    { icon: 'shield', title: 'Warranty', subtitle: '1 Year Guarantee' },
    { icon: 'truck', title: 'Free Shipping', subtitle: 'Orders over $50' },
    { icon: 'refresh', title: 'Easy Returns', subtitle: '30-day return' },
  ],
  shipping: { freeThreshold: 50, flatFee: 5 },
  home: {
    categoriesTitle: 'Shop by Category',
    categoriesSubtitle: 'Find what you need in our full lineup',
    orderStripLabel: 'Order via Telegram:',
  },
  footer: {
    copyright: 'Top Tech Computer. All rights reserved.',
    // The old Privacy and Terms links pointed at pages that do not exist (404),
    // so they are not defaults. Add them in Admin → Site Info once those pages exist.
    legalLinks: [],
  },
}

/** Digits (and a leading +) only, for tel: links. */
export function telHref(phoneText: string): string {
  const cleaned = phoneText.replace(/[^\d+]/g, '')
  return `tel:${cleaned}`
}
