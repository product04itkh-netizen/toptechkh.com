import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import SectionEditor from '@/components/admin/cms/SectionEditor'
import { createSection } from '../../../actions'

interface Props { params: Promise<{ pageId: string }> }

export default async function NewSectionPage({ params }: Props) {
  const { pageId } = await params
  const id = parseInt(pageId)

  const { data: page, error } = await supabaseAdmin
    .from('cms_pages')
    .select('id, title')
    .eq('id', id)
    .maybeSingle()

  if (error) console.error('CMS page fetch error:', error)
  if (!page) notFound()

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/cms" className="hover:text-[#041e42]">CMS</a>
          {' / '}
          <a href={`/admin/cms/${id}`} className="hover:text-[#041e42]">{page.title}</a>
          {' / New Section'}
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Add Section</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">Choose a block type, fill in the content, and set typography.</p>
      </div>

      <SectionEditor
        action={createSection as any}
        pageId={id}
        mode="new"
      />
    </div>
  )
}
