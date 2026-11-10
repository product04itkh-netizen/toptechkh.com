import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import CmsSectionRenderer from '@/components/cms/CmsSection'
import type { CmsSection } from '@/lib/cms-types'
import { slugify } from '@/lib/slug'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 60

/**
 * Find a published page by URL slug.
 * Exact match first. Pages saved before slugs were normalised (e.g. "PC Build in Cambodia")
 * are matched on their normalised form, so the URL the admin shows keeps working.
 */
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

async function resolvePage(rawSlug: string) {
  // The segment can arrive still percent-encoded ("PC%20Build…"); decode it before matching
  const slug = safeDecode(rawSlug)
  const { data: page, error } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) console.error('CMS page fetch error:', error)
  if (page) return page

  const target = slugify(slug)
  if (!target) return null

  const { data: published, error: listError } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('status', 'published')

  if (listError) console.error('CMS page list error:', listError)
  return published?.find((p) => slugify(p.slug) === target) ?? null
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const page = await resolvePage(slug)
  return { title: page ? `${page.title} — Top Tech Computer` : 'Page Not Found' }
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params

  const page = await resolvePage(slug)
  if (!page) notFound()

  const { data: sections, error: sectionsError } = await supabase
    .from('cms_sections')
    .select('*')
    .eq('page_id', page.id)
    .eq('visible', true)
    .order('order_index')

  if (sectionsError) console.error('CMS sections fetch error:', sectionsError)

  const list: CmsSection[] = sections ?? []

  return (
    <main>
      {list.map((section) => (
        <CmsSectionRenderer key={section.id} section={section} />
      ))}
      {list.length === 0 && (
        <div className="max-w-[1290px] mx-auto px-4 py-20 text-center">
          <p className="text-[#5d6b7b]">This page has no content yet.</p>
        </div>
      )}
    </main>
  )
}
