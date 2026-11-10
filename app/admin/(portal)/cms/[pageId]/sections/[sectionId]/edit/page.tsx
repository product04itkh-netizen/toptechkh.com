import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import SectionEditor from '@/components/admin/cms/SectionEditor'
import type { PickedProduct } from '@/components/admin/cms/ProductPicker'
import { updateSection } from '../../../../actions'
import type { CmsSection, ProductGridContent } from '@/lib/cms-types'

interface Props { params: Promise<{ pageId: string; sectionId: string }> }

export default async function EditSectionPage({ params }: Props) {
  const { pageId, sectionId } = await params
  const pid = parseInt(pageId)
  const sid = parseInt(sectionId)

  const [{ data: page, error: pageError }, { data: section, error: sectionError }, { data: categories, error: catError }] =
    await Promise.all([
      supabaseAdmin.from('cms_pages').select('id, title').eq('id', pid).maybeSingle(),
      supabaseAdmin.from('cms_sections').select('*').eq('id', sid).maybeSingle(),
      supabaseAdmin.from('categories').select('slug, name').order('name'),
    ])

  if (pageError) console.error('CMS page fetch error:', pageError)
  if (sectionError) console.error('CMS section fetch error:', sectionError)
  if (catError) console.error('Categories fetch error:', catError)
  if (!page || !section) notFound()

  const s = section as CmsSection

  // Resolve saved product ids to names, keeping the saved order
  let selectedProducts: PickedProduct[] = []
  if (s.type === 'product_grid') {
    const ids = ((s.content as ProductGridContent).productIds ?? '')
      .split(',')
      .map((v) => parseInt(v))
      .filter((n) => Number.isInteger(n) && n > 0)

    if (ids.length > 0) {
      const { data: rows, error: rowsError } = await supabaseAdmin
        .from('products')
        .select('id, name, sku')
        .in('id', ids)
      if (rowsError) console.error('Selected products fetch error:', rowsError)
      const byId = new Map((rows ?? []).map((r) => [r.id, r as PickedProduct]))
      selectedProducts = ids.map((id) => byId.get(id)).filter((p): p is PickedProduct => Boolean(p))
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/cms" className="hover:text-[#041e42]">CMS</a>
          {' / '}
          <a href={`/admin/cms/${pid}`} className="hover:text-[#041e42]">{page.title}</a>
          {' / Edit Section'}
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Edit Section</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">Update content and typography for this section.</p>
      </div>

      <SectionEditor
        action={updateSection as any}
        pageId={pid}
        sectionId={sid}
        type={s.type}
        content={s.content as Record<string, string>}
        styles={s.styles}
        mode="edit"
        categories={categories ?? []}
        selectedProducts={selectedProducts}
      />
    </div>
  )
}
