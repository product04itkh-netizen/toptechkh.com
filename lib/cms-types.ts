export type CmsPageStatus = 'draft' | 'published'

export type CmsSectionType =
  | 'hero'
  | 'banner'
  | 'heading'
  | 'rich_text'
  | 'image'
  | 'cta'
  | 'spacer'
  | 'product_grid'

export interface CmsPage {
  id: number
  title: string
  slug: string
  status: CmsPageStatus
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CmsSection {
  id: number
  page_id: number
  type: CmsSectionType
  order_index: number
  content: CmsSectionContent
  styles: CmsSectionStyles
  visible: boolean
  created_at: string
}

// ── STYLES (typography + spacing + background) ──────────────
export interface CmsSectionStyles {
  fontFamily?: string
  fontSize?: string        // px number as string e.g. "16"
  fontWeight?: string      // "400" | "500" | "600" | "700" | "800" | "900"
  color?: string           // hex
  textAlign?: 'left' | 'center' | 'right'
  backgroundColor?: string // hex or transparent
  paddingTop?: string      // px number as string
  paddingBottom?: string
  paddingLeft?: string
  paddingRight?: string
}

// ── CONTENT per block type ───────────────────────────────────
export interface HeroContent {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaUrl?: string
  ctaColor?: string
  backgroundImage?: string
  backgroundColor?: string
  overlayOpacity?: string  // 0–100
  titleColor?: string
  subtitleColor?: string
}

export interface BannerContent {
  title?: string
  subtitle?: string
  imageUrl?: string
  linkUrl?: string
  imagePosition?: 'left' | 'right' | 'background'
  badge?: string
  titleColor?: string
  subtitleColor?: string
  backgroundColor?: string
}

export interface HeadingContent {
  text?: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4'
  subtext?: string
}

export interface RichTextContent {
  html?: string
}

export interface ImageContent {
  imageUrl?: string
  altText?: string
  caption?: string
  linkUrl?: string
  maxWidth?: string  // e.g. "800"
}

export interface CtaContent {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonUrl?: string
  buttonColor?: string
  buttonTextColor?: string
  backgroundColor?: string
  titleColor?: string
  subtitleColor?: string
}

export interface SpacerContent {
  height?: string  // px number as string
}

export interface ProductGridContent {
  title?: string
  subtitle?: string
  queryType?: 'coming_soon' | 'new_arrivals' | 'on_sale' | 'featured' | 'category'
  categorySlug?: string
  limit?: string
  viewAllUrl?: string
  viewAllLabel?: string
  badge?: string
}

export type CmsSectionContent =
  | HeroContent
  | BannerContent
  | HeadingContent
  | RichTextContent
  | ImageContent
  | CtaContent
  | SpacerContent
  | ProductGridContent

// ── GLOBAL SETTINGS ─────────────────────────────────────────
export interface CmsGlobalTypography {
  fontFamily: string
  headingFontFamily: string
  baseFontSize: string
  headingColor: string
  bodyColor: string
  primaryColor: string
  accentColor: string
}

export const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Nunito', value: 'Nunito' },
  { label: 'Source Sans 3', value: 'Source Sans 3' },
  { label: 'DM Sans', value: 'DM Sans' },
  { label: 'Geist', value: 'Geist' },
] as const

export const SECTION_TYPE_LABELS: Record<CmsSectionType, string> = {
  hero: 'Hero Banner',
  banner: 'Promo Banner',
  heading: 'Heading',
  rich_text: 'Rich Text',
  image: 'Image',
  cta: 'Call to Action',
  spacer: 'Spacer',
  product_grid: 'Product Grid',
}
