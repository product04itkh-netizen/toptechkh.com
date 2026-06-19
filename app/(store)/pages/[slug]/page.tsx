import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import CmsSectionRenderer from '@/components/cms/CmsSection'
import type { CmsSection } from '@/lib/cms-types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const { data: page, error } = await supabase
    .from('cms_pages')
    .select('title')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) console.error('Metadata fetch error:', error)
  return { title: page ? `${page.title} — Top Tech Computer` : 'Page Not Found' }
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params

  const { data: page, error } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) console.error('CMS page fetch error:', error)
  if (!page) notFound()

  const { data: sections } = await supabase
    .from('cms_sections')
    .select('*')
    .eq('page_id', page.id)
    .eq('visible', true)
    .order('order_index')

  const list: CmsSection[] = sections ?? []

  return (
    <main>
      {list.map((section) => (
        <CmsSectionRenderer key={section.id} section={section} />
      ))}
      {list.length === 0 && (
        <div className="max-w-[1290px] mx-auto px-4 py-20 text-center">
          <p className="text-[#818ea0]">This page has no content yet.</p>
        </div>
      )}
    </main>
  )
}
