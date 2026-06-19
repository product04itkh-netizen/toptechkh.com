import React from 'react'
import type { CmsSection, CmsSectionStyles, HeroContent, BannerContent, HeadingContent, RichTextContent, ImageContent, CtaContent, SpacerContent, ProductGridContent } from '@/lib/cms-types'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { sanitizeHtml } from '@/lib/sanitize'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/lib/types'

interface Props {
  section: CmsSection
}

export default function CmsSectionRenderer({ section }: Props) {
  if (!section.visible) return null

  const sectionStyle = buildContainerStyle(section.styles)

  switch (section.type) {
    case 'hero':      return <HeroBlock content={section.content as HeroContent} styles={section.styles} containerStyle={sectionStyle} />
    case 'banner':    return <BannerBlock content={section.content as BannerContent} styles={section.styles} containerStyle={sectionStyle} />
    case 'heading':   return <HeadingBlock content={section.content as HeadingContent} styles={section.styles} containerStyle={sectionStyle} />
    case 'rich_text': return <RichTextBlock content={section.content as RichTextContent} styles={section.styles} containerStyle={sectionStyle} />
    case 'image':     return <ImageBlock content={section.content as ImageContent} styles={section.styles} containerStyle={sectionStyle} />
    case 'cta':          return <CtaBlock content={section.content as CtaContent} styles={section.styles} containerStyle={sectionStyle} />
    case 'spacer':       return <SpacerBlock content={section.content as SpacerContent} />
    case 'product_grid': return <ProductGridBlock content={section.content as ProductGridContent} styles={section.styles} containerStyle={sectionStyle} />
    default:             return null
  }
}

function buildContainerStyle(s: CmsSectionStyles): React.CSSProperties {
  const style: React.CSSProperties = {}
  if (s.backgroundColor) style.backgroundColor = s.backgroundColor
  if (s.paddingTop)    style.paddingTop    = `${s.paddingTop}px`
  if (s.paddingBottom) style.paddingBottom = `${s.paddingBottom}px`
  if (s.paddingLeft)   style.paddingLeft   = `${s.paddingLeft}px`
  if (s.paddingRight)  style.paddingRight  = `${s.paddingRight}px`
  return style
}

function buildTextStyle(s: CmsSectionStyles): React.CSSProperties {
  const style: React.CSSProperties = {}
  if (s.fontFamily)  style.fontFamily  = `'${s.fontFamily}', sans-serif`
  if (s.fontSize)    style.fontSize    = `${s.fontSize}px`
  if (s.fontWeight)  style.fontWeight  = s.fontWeight as React.CSSProperties['fontWeight']
  if (s.color)       style.color       = s.color
  if (s.textAlign)   style.textAlign   = s.textAlign
  return style
}

// ── BLOCKS ───────────────────────────────────────────────────

function HeroBlock({ content: c, styles: s, containerStyle }: { content: HeroContent; styles: CmsSectionStyles; containerStyle: React.CSSProperties }) {
  const bg = c.backgroundColor ?? '#041e42'
  const overlayOpacity = c.overlayOpacity ? parseInt(c.overlayOpacity) / 100 : 0.4

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: bg, ...containerStyle, paddingTop: undefined, paddingBottom: undefined }}
    >
      {/* Background image */}
      {c.backgroundImage && (
        <>
          <div className="absolute inset-0">
            <Image src={c.backgroundImage} alt="" fill className="object-cover" priority />
          </div>
          <div
            className="absolute inset-0"
            style={{ backgroundColor: bg, opacity: overlayOpacity }}
          />
        </>
      )}

      <div
        className="relative max-w-[1290px] mx-auto px-4"
        style={{
          paddingTop:    containerStyle.paddingTop    ?? '80px',
          paddingBottom: containerStyle.paddingBottom ?? '80px',
        }}
      >
        <div style={{ textAlign: s.textAlign ?? 'left' }}>
          {c.title && (
            <h1
              className="text-4xl sm:text-5xl font-black leading-tight mb-4"
              style={{
                color:       c.titleColor ?? '#ffffff',
                fontFamily:  s.fontFamily ? `'${s.fontFamily}', sans-serif` : undefined,
                fontSize:    s.fontSize ? `${s.fontSize}px` : undefined,
                fontWeight:  s.fontWeight ?? '900',
              }}
            >
              {c.title}
            </h1>
          )}
          {c.subtitle && (
            <p
              className="text-lg sm:text-xl mb-8 max-w-xl"
              style={{
                color:      c.subtitleColor ?? 'rgba(255,255,255,0.8)',
                fontFamily: s.fontFamily ? `'${s.fontFamily}', sans-serif` : undefined,
              }}
            >
              {c.subtitle}
            </p>
          )}
          {c.ctaText && c.ctaUrl && (
            <Link
              href={c.ctaUrl}
              className="inline-block font-bold px-8 py-3.5 rounded-lg text-base transition-opacity hover:opacity-90"
              style={{
                backgroundColor: c.ctaColor ?? '#ef262c',
                color: '#ffffff',
              }}
            >
              {c.ctaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

function BannerBlock({ content: c, styles: s, containerStyle }: { content: BannerContent; styles: CmsSectionStyles; containerStyle: React.CSSProperties }) {
  const isBackground = c.imagePosition === 'background'

  const inner = (
    <div
      className={`relative max-w-[1290px] mx-auto px-4 ${!isBackground ? 'flex items-center gap-8' : 'relative'}`}
      style={{ textAlign: s.textAlign ?? 'left' }}
    >
      {c.imagePosition === 'left' && c.imageUrl && (
        <div className="relative w-64 h-40 rounded-xl overflow-hidden flex-shrink-0">
          <Image src={c.imageUrl} alt={c.title ?? ''} fill className="object-cover" />
        </div>
      )}

      <div className={isBackground ? 'relative z-10' : 'flex-1'}>
        {c.badge && (
          <span
            className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3"
            style={{ backgroundColor: '#ef262c', color: '#fff' }}
          >
            {c.badge}
          </span>
        )}
        {c.title && (
          <h2
            className="text-2xl sm:text-3xl font-black mb-2"
            style={{ color: c.titleColor ?? '#021523', ...buildTextStyle(s) }}
          >
            {c.title}
          </h2>
        )}
        {c.subtitle && (
          <p className="text-base mb-4" style={{ color: c.subtitleColor ?? '#3d4f61' }}>
            {c.subtitle}
          </p>
        )}
        {c.linkUrl && (
          <Link
            href={c.linkUrl}
            className="inline-block font-bold text-sm px-5 py-2.5 rounded-lg bg-[var(--cms-color-primary)] text-white hover:bg-[var(--cms-color-primary-hover)] transition-colors"
          >
            Shop Now
          </Link>
        )}
      </div>

      {c.imagePosition === 'right' && c.imageUrl && (
        <div className="relative w-64 h-40 rounded-xl overflow-hidden flex-shrink-0">
          <Image src={c.imageUrl} alt={c.title ?? ''} fill className="object-cover" />
        </div>
      )}

      {isBackground && c.imageUrl && (
        <div className="absolute inset-0 rounded-xl overflow-hidden -z-10">
          <Image src={c.imageUrl} alt="" fill className="object-cover" />
        </div>
      )}
    </div>
  )

  const bannerBg = c.backgroundColor ?? '#f2f3f5'
  return (
    <section className="py-10" style={{ ...containerStyle, backgroundColor: containerStyle.backgroundColor ?? bannerBg }}>
      <div className="max-w-[1290px] mx-auto px-4">
        <div className="rounded-2xl overflow-hidden p-8" style={{ backgroundColor: bannerBg }}>
          {inner}
        </div>
      </div>
    </section>
  )
}

function HeadingBlock({ content: c, styles: s, containerStyle }: { content: HeadingContent; styles: CmsSectionStyles; containerStyle: React.CSSProperties }) {
  const tag = c.tag ?? 'h2'
  const textStyle = buildTextStyle(s)
  const headingStyle = { color: s.color ?? '#021523', ...textStyle }

  return (
    <section className="py-6" style={containerStyle}>
      <div className="max-w-[1290px] mx-auto px-4" style={{ textAlign: s.textAlign ?? 'left' }}>
        {tag === 'h1' && <h1 className="text-2xl font-black" style={headingStyle}>{c.text}</h1>}
        {tag === 'h2' && <h2 className="text-2xl font-black" style={headingStyle}>{c.text}</h2>}
        {tag === 'h3' && <h3 className="text-xl font-black" style={headingStyle}>{c.text}</h3>}
        {tag === 'h4' && <h4 className="text-lg font-bold" style={headingStyle}>{c.text}</h4>}
        {c.subtext && (
          <p className="text-sm text-[#818ea0] mt-1" style={{ color: undefined, ...textStyle, fontSize: undefined }}>
            {c.subtext}
          </p>
        )}
      </div>
    </section>
  )
}

function RichTextBlock({ content: c, styles: s, containerStyle }: { content: RichTextContent; styles: CmsSectionStyles; containerStyle: React.CSSProperties }) {
  if (!c.html) return null
  const safeHtml = sanitizeHtml(c.html)
  return (
    <section className="py-8" style={containerStyle}>
      <div
        className="max-w-[1290px] mx-auto px-4 prose prose-sm max-w-none"
        style={buildTextStyle(s)}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </section>
  )
}

function ImageBlock({ content: c, styles: s, containerStyle }: { content: ImageContent; styles: CmsSectionStyles; containerStyle: React.CSSProperties }) {
  if (!c.imageUrl) return null

  const maxW = c.maxWidth ? `${c.maxWidth}px` : '100%'
  const img = (
    <figure className="mx-auto" style={{ maxWidth: maxW, textAlign: s.textAlign ?? 'left' }}>
      <div className="relative w-full aspect-video overflow-hidden rounded-xl">
        <Image src={c.imageUrl} alt={c.altText ?? ''} fill className="object-cover" />
      </div>
      {c.caption && (
        <figcaption className="text-xs text-[#818ea0] mt-2 text-center">{c.caption}</figcaption>
      )}
    </figure>
  )

  return (
    <section className="py-8" style={containerStyle}>
      <div className="max-w-[1290px] mx-auto px-4">
        {c.linkUrl ? <Link href={c.linkUrl}>{img}</Link> : img}
      </div>
    </section>
  )
}

function CtaBlock({ content: c, styles: s, containerStyle }: { content: CtaContent; styles: CmsSectionStyles; containerStyle: React.CSSProperties }) {
  return (
    <section
      className="py-16"
      style={{ ...containerStyle, backgroundColor: containerStyle.backgroundColor ?? (c.backgroundColor ?? '#f2f3f5') }}
    >
      <div className="max-w-[1290px] mx-auto px-4 text-center">
        {c.title && (
          <h2
            className="text-3xl font-black mb-3"
            style={{ color: c.titleColor ?? '#021523', ...buildTextStyle(s) }}
          >
            {c.title}
          </h2>
        )}
        {c.subtitle && (
          <p className="text-base mb-8" style={{ color: c.subtitleColor ?? '#3d4f61' }}>
            {c.subtitle}
          </p>
        )}
        {c.buttonText && c.buttonUrl && (
          <Link
            href={c.buttonUrl}
            className="inline-block font-bold px-8 py-3.5 rounded-lg text-base transition-opacity hover:opacity-90"
            style={{
              backgroundColor: c.buttonColor ?? '#041e42',
              color: c.buttonTextColor ?? '#ffffff',
            }}
          >
            {c.buttonText}
          </Link>
        )}
      </div>
    </section>
  )
}

function SpacerBlock({ content: c }: { content: SpacerContent }) {
  return <div style={{ height: `${c.height ?? 40}px` }} aria-hidden="true" />
}

async function ProductGridBlock({ content: c, styles: s, containerStyle }: {
  content: ProductGridContent
  styles: CmsSectionStyles
  containerStyle: React.CSSProperties
}) {
  const defaultLimit = parseInt(process.env.NEXT_PUBLIC_DEFAULT_CMS_GRID_LIMIT || '8')
  const limit = Math.min(parseInt(c.limit ?? String(defaultLimit)) || defaultLimit, 24)

  let query = supabase
    .from('products')
    .select('*, category:categories(id,name,slug), brand:brands(id,name,slug)')

  switch (c.queryType) {
    case 'coming_soon':
      query = query.eq('coming_soon', true)
      break
    case 'on_sale':
      query = query.not('sale_price', 'is', null).eq('stock_status', 'instock')
      break
    case 'category':
      if (c.categorySlug) {
        const { data: cat, error } = await supabase
          .from('categories').select('id').eq('slug', c.categorySlug).maybeSingle()
        if (error) console.error('Category lookup error:', error)
        if (cat) query = query.eq('category_id', cat.id).eq('stock_status', 'instock')
      }
      query = query.eq('stock_status', 'instock')
      break
    case 'new_arrivals':
      query = query.eq('stock_status', 'instock').order('created_at', { ascending: false })
      break
    case 'featured':
      query = query.eq('featured', true).eq('stock_status', 'instock')
      break
    default:
      // fallback: latest instock
      query = query.eq('stock_status', 'instock').order('created_at', { ascending: false })
  }

  const { data } = await query.limit(limit)
  const products: Product[] = (data ?? []) as Product[]

  if (products.length === 0) return null

  const viewAllUrl   = c.viewAllUrl   ?? '/shop'
  const viewAllLabel = c.viewAllLabel ?? 'View All →'

  return (
    <section className="py-10" style={containerStyle}>
      <div className="max-w-[1290px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            {c.title && (
              <h2
                className="text-xl sm:text-2xl font-black text-[#021523]"
                style={{
                  color:      s.color      ?? undefined,
                  fontFamily: s.fontFamily ? `'${s.fontFamily}', sans-serif` : undefined,
                  fontWeight: s.fontWeight ?? undefined,
                }}
              >
                {c.badge && (
                  <span className="mr-2 text-xs font-bold bg-[var(--cms-color-primary)] text-white px-2 py-0.5 rounded align-middle">
                    {c.badge}
                  </span>
                )}
                {c.title}
              </h2>
            )}
            {c.subtitle && (
              <p className="text-sm text-[#818ea0] mt-1">{c.subtitle}</p>
            )}
          </div>
          <Link
            href={viewAllUrl}
            className="text-sm font-semibold text-[#0070dc] hover:text-[var(--cms-color-primary)] transition-colors"
          >
            {viewAllLabel}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
