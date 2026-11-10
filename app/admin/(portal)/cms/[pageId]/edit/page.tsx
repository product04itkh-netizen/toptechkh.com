import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { updatePage } from '../../actions'
import PageEditForm from './PageEditForm'

interface Props { params: Promise<{ pageId: string }> }

export default async function EditCmsPagePage({ params }: Props) {
  const { pageId } = await params
  const id = parseInt(pageId)

  const { data: page, error } = await supabaseAdmin
    .from('cms_pages')
    .select('id, title, slug, status')
    .eq('id', id)
    .maybeSingle()

  if (error) console.error('CMS page fetch error:', error)
  if (!page) notFound()

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/cms" className="hover:text-[#041e42]">CMS</a>
          {' / '}
          <a href={`/admin/cms/${id}`} className="hover:text-[#041e42]">{page.title}</a>
          {' / Edit'}
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Edit Page</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">Changing the slug changes the page URL.</p>
      </div>

      <PageEditForm action={updatePage} page={page} />
    </div>
  )
}
