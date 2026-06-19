'use client'

import { useActionState, useState } from 'react'
import dynamic from 'next/dynamic'
import TypographyPanel from './TypographyPanel'
import type { CmsSectionType, CmsSectionStyles } from '@/lib/cms-types'
import { SECTION_TYPE_LABELS } from '@/lib/cms-types'

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false })

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'
const hintCls  = 'text-xs text-[#818ea0] font-normal ml-1'

type ActionFn = (prev: unknown, formData: FormData) => Promise<unknown>

interface Props {
  action: ActionFn
  pageId: number
  sectionId?: number
  type?: CmsSectionType
  content?: Record<string, string>
  styles?: CmsSectionStyles
  mode: 'new' | 'edit'
}

export default function SectionEditor({ action, pageId, sectionId, type: defaultType, content = {}, styles = {}, mode }: Props) {
  const [state, formAction, pending] = useActionState(action, null)
  const [type, setType] = useState<CmsSectionType>(defaultType ?? 'hero')

  const s = state as { error?: string } | null

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields */}
      <input type="hidden" name="page_id" value={pageId} />
      {sectionId && <input type="hidden" name="id" value={sectionId} />}
      <input type="hidden" name="type" value={type} />

      {s?.error && (
        <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {s.error}
        </div>
      )}

      {/* Section Type (only for new) */}
      {mode === 'new' && (
        <div>
          <label className={labelCls}>Section Type *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.entries(SECTION_TYPE_LABELS) as [CmsSectionType, string][]).map(([t, label]) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-3 px-2 text-xs font-bold rounded-xl border-2 transition-colors text-center ${
                  type === t
                    ? 'border-[#041e42] bg-[#041e42] text-white'
                    : 'border-[#e5e8ec] text-[#818ea0] hover:border-[#041e42] hover:text-[#041e42]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content fields based on type */}
      <div className="border border-[#e5e8ec] rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-[#f7f8fa] border-b border-[#e5e8ec]">
          <h3 className="text-sm font-bold text-[#021523]">Content — {SECTION_TYPE_LABELS[type]}</h3>
        </div>
        <div className="p-4 space-y-4">
          {type === 'hero' && <HeroFields content={content} />}
          {type === 'banner' && <BannerFields content={content} />}
          {type === 'heading' && <HeadingFields content={content} />}
          {type === 'rich_text' && <RichTextFields content={content} RTE={RichTextEditor} />}
          {type === 'image' && <ImageFields content={content} />}
          {type === 'cta' && <CtaFields content={content} />}
          {type === 'spacer' && <SpacerFields content={content} />}
          {type === 'product_grid' && <ProductGridFields content={content} />}
        </div>
      </div>

      {/* Typography panel */}
      <TypographyPanel defaults={styles} />

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          {pending ? 'Saving…' : mode === 'new' ? 'Add Section' : 'Save Changes'}
        </button>
        <a
          href={`/admin/cms/${pageId}`}
          className="text-sm text-[#818ea0] border border-[#e5e8ec] px-5 py-2.5 rounded-lg hover:border-[#041e42] transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}

// ── CONTENT FIELD COMPONENTS ─────────────────────────────────

function HeroFields({ content: c }: { content: Record<string, string> }) {
  return (
    <>
      <Field label="Title" name="c_title" defaultValue={c.title} placeholder="Welcome to Top Tech" />
      <Field label="Subtitle" name="c_subtitle" defaultValue={c.subtitle} placeholder="Cambodia's trusted IT retailer" />
      <Row>
        <Field label="CTA Button Text" name="c_ctaText" defaultValue={c.ctaText} placeholder="Shop Now" />
        <Field label="CTA Button URL" name="c_ctaUrl" defaultValue={c.ctaUrl} placeholder="/shop" />
      </Row>
      <Row>
        <ColorField label="CTA Button Color" name="c_ctaColor" defaultValue={c.ctaColor ?? '#ef262c'} />
        <ColorField label="Title Color" name="c_titleColor" defaultValue={c.titleColor ?? '#ffffff'} />
        <ColorField label="Subtitle Color" name="c_subtitleColor" defaultValue={c.subtitleColor ?? '#ffffffcc'} />
      </Row>
      <Field label="Background Image URL" name="c_backgroundImage" defaultValue={c.backgroundImage} placeholder="/banner-main.png" hint="Leave blank to use background color only" />
      <Row>
        <ColorField label="Background Color" name="c_backgroundColor" defaultValue={c.backgroundColor ?? '#041e42'} />
        <div>
          <label className={labelCls}>Overlay Opacity <span className={hintCls}>(0–100, only if background image set)</span></label>
          <input type="number" name="c_overlayOpacity" defaultValue={c.overlayOpacity ?? '40'} min={0} max={100} className={inputCls} />
        </div>
      </Row>
    </>
  )
}

function BannerFields({ content: c }: { content: Record<string, string> }) {
  return (
    <>
      <Row>
        <Field label="Title" name="c_title" defaultValue={c.title} placeholder="Hot Deals" />
        <Field label="Badge" name="c_badge" defaultValue={c.badge} placeholder="SALE" hint="optional small badge chip" />
      </Row>
      <Field label="Subtitle" name="c_subtitle" defaultValue={c.subtitle} placeholder="Up to 30% off gaming laptops" />
      <Row>
        <Field label="Image URL" name="c_imageUrl" defaultValue={c.imageUrl} placeholder="/banner-asus-aio.png" />
        <Field label="Link URL" name="c_linkUrl" defaultValue={c.linkUrl} placeholder="/shop?category=laptop" />
      </Row>
      <div>
        <label className={labelCls}>Image Position</label>
        <select name="c_imagePosition" defaultValue={c.imagePosition ?? 'right'} className={inputCls}>
          <option value="right">Right</option>
          <option value="left">Left</option>
          <option value="background">Background (full-bleed)</option>
        </select>
      </div>
      <Row>
        <ColorField label="Title Color" name="c_titleColor" defaultValue={c.titleColor ?? '#021523'} />
        <ColorField label="Subtitle Color" name="c_subtitleColor" defaultValue={c.subtitleColor ?? '#3d4f61'} />
        <ColorField label="Background Color" name="c_backgroundColor" defaultValue={c.backgroundColor ?? '#f2f3f5'} />
      </Row>
    </>
  )
}

function HeadingFields({ content: c }: { content: Record<string, string> }) {
  return (
    <>
      <Field label="Heading Text" name="c_text" defaultValue={c.text} placeholder="Featured Products" />
      <Row>
        <div>
          <label className={labelCls}>Heading Tag</label>
          <select name="c_tag" defaultValue={c.tag ?? 'h2'} className={inputCls}>
            <option value="h1">H1 — Page Title</option>
            <option value="h2">H2 — Section Title</option>
            <option value="h3">H3 — Subsection</option>
            <option value="h4">H4 — Minor heading</option>
          </select>
        </div>
        <Field label="Subtext" name="c_subtext" defaultValue={c.subtext} placeholder="Browse our curated selection" />
      </Row>
    </>
  )
}

function RichTextFields({
  content: c,
  RTE,
}: {
  content: Record<string, string>
  RTE: React.ComponentType<{ name: string; defaultValue?: string | null; placeholder?: string; rows?: number }>
}) {
  return (
    <div>
      <label className={labelCls}>Content</label>
      <RTE name="c_html" defaultValue={c.html} placeholder="Start typing…" rows={8} />
    </div>
  )
}

function ImageFields({ content: c }: { content: Record<string, string> }) {
  return (
    <>
      <Field label="Image URL" name="c_imageUrl" defaultValue={c.imageUrl} placeholder="/banner-main.png" />
      <Row>
        <Field label="Alt Text" name="c_altText" defaultValue={c.altText} placeholder="Description of image" />
        <Field label="Link URL" name="c_linkUrl" defaultValue={c.linkUrl} placeholder="/shop" hint="optional" />
      </Row>
      <Row>
        <Field label="Caption" name="c_caption" defaultValue={c.caption} placeholder="optional caption" />
        <Field label="Max Width (px)" name="c_maxWidth" defaultValue={c.maxWidth} placeholder="800" hint="leave blank for full width" />
      </Row>
    </>
  )
}

function CtaFields({ content: c }: { content: Record<string, string> }) {
  return (
    <>
      <Field label="Title" name="c_title" defaultValue={c.title} placeholder="Ready to upgrade your setup?" />
      <Field label="Subtitle" name="c_subtitle" defaultValue={c.subtitle} placeholder="Shop the latest laptops and components." />
      <Row>
        <Field label="Button Text" name="c_buttonText" defaultValue={c.buttonText} placeholder="Shop Now" />
        <Field label="Button URL" name="c_buttonUrl" defaultValue={c.buttonUrl} placeholder="/shop" />
      </Row>
      <Row>
        <ColorField label="Button Color" name="c_buttonColor" defaultValue={c.buttonColor ?? '#ef262c'} />
        <ColorField label="Button Text Color" name="c_buttonTextColor" defaultValue={c.buttonTextColor ?? '#ffffff'} />
        <ColorField label="Background Color" name="c_backgroundColor" defaultValue={c.backgroundColor ?? '#f2f3f5'} />
      </Row>
      <Row>
        <ColorField label="Title Color" name="c_titleColor" defaultValue={c.titleColor ?? '#021523'} />
        <ColorField label="Subtitle Color" name="c_subtitleColor" defaultValue={c.subtitleColor ?? '#3d4f61'} />
      </Row>
    </>
  )
}

function SpacerFields({ content: c }: { content: Record<string, string> }) {
  return (
    <div>
      <label className={labelCls}>Height (px)</label>
      <input type="number" name="c_height" defaultValue={c.height ?? '40'} min={4} max={400} className={inputCls} />
      <p className="text-xs text-[#818ea0] mt-1">Creates vertical whitespace between sections.</p>
    </div>
  )
}

function ProductGridFields({ content: c }: { content: Record<string, string> }) {
  return (
    <>
      <Field label="Section Title" name="c_title" defaultValue={c.title} placeholder="Featured Products" />
      <Field label="Badge" name="c_badge" defaultValue={c.badge} placeholder="Featured" hint="optional small badge chip" />
      <Field label="Subtitle" name="c_subtitle" defaultValue={c.subtitle} placeholder="Browse our curated selection" hint="optional" />
      <div>
        <label className={labelCls}>Query Type *</label>
        <select name="c_queryType" defaultValue={c.queryType ?? 'featured'} className={inputCls}>
          <option value="featured">Featured Products</option>
          <option value="coming_soon">Coming Soon</option>
          <option value="on_sale">On Sale</option>
          <option value="new_arrivals">New Arrivals</option>
          <option value="category">By Category</option>
        </select>
      </div>
      {c.queryType === 'category' && (
        <Field label="Category Slug" name="c_categorySlug" defaultValue={c.categorySlug} placeholder="laptops" hint="only used for 'By Category' query type" />
      )}
      <Row>
        <Field label="Product Limit" name="c_limit" defaultValue={c.limit ?? '8'} placeholder="8" hint="max 24" />
        <Field label="View All URL" name="c_viewAllUrl" defaultValue={c.viewAllUrl} placeholder="/shop" hint="optional" />
      </Row>
      <Field label="View All Label" name="c_viewAllLabel" defaultValue={c.viewAllLabel} placeholder="View All →" hint="optional" />
    </>
  )
}

// ── HELPERS ──────────────────────────────────────────────────

function Field({
  label, name, defaultValue, placeholder, hint,
}: {
  label: string
  name: string
  defaultValue?: string
  placeholder?: string
  hint?: string
}) {
  return (
    <div>
      <label className={labelCls}>
        {label}
        {hint && <span className={hintCls}>— {hint}</span>}
      </label>
      <input type="text" name={name} defaultValue={defaultValue ?? ''} placeholder={placeholder} className={inputCls} />
    </div>
  )
}

function ColorField({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2 items-center">
        <input type="color" name={name} defaultValue={defaultValue}
          className="w-9 h-9 rounded-lg border border-[#e5e8ec] cursor-pointer p-0.5 bg-white flex-shrink-0" />
        <span className="text-xs text-[#818ea0] font-mono">{defaultValue}</span>
      </div>
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{children}</div>
}
