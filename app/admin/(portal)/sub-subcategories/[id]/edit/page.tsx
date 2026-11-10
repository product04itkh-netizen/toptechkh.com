import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { updateSubSubcategory } from '../../actions'
import SubSubcategoryForm from '../../SubSubcategoryForm'
import { subcategoryOptions } from '../../options'

interface Props { params: Promise<{ id: string }> }

export default async function EditSubSubcategoryPage({ params }: Props) {
  const { id } = await params
  const itemId = parseInt(id)

  const [{ data: s, error }, subcategories] = await Promise.all([
    supabaseAdmin.from('sub_subcategories').select('id, name, slug, subcategory_id').eq('id', itemId).maybeSingle(),
    subcategoryOptions(supabaseAdmin),
  ])
  if (error) console.error('Sub-subcategory fetch error:', error)
  if (!s) notFound()

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/sub-subcategories" className="hover:text-[#041e42]">Sub-subcategories</a> / Edit
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Edit Sub-subcategory</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">{s.name}</p>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6 max-w-lg">
        <SubSubcategoryForm action={updateSubSubcategory} subcategories={subcategories} item={s} />
      </div>
    </div>
  )
}
