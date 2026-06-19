import { createClient } from '@supabase/supabase-js'
import CmsSectionRenderer from './CmsSection'
import type { CmsSection } from '@/lib/cms-types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function HomeCmsSections() {
  const { data: page, error } = await supabase
    .from('cms_pages')
    .select('id')
    .eq('slug', 'home')
    .eq('status', 'published')
    .maybeSingle()

  if (error) console.error('Home page fetch error:', error)
  if (!page) return null

  const { data: sections } = await supabase
    .from('cms_sections')
    .select('*')
    .eq('page_id', page.id)
    .eq('visible', true)
    .order('order_index')

  const list: CmsSection[] = sections ?? []
  if (list.length === 0) return null

  return (
    <>
      {list.map((section) => (
        <CmsSectionRenderer key={section.id} section={section} />
      ))}
    </>
  )
}
