import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { updateSubcategory } from '../../actions'
import SubcategoryForm from '../../SubcategoryForm'

interface Props { params: Promise<{ id: string }> }

export default async function EditSubcategoryPage({ params }: Props) {
  const { id } = await params
  const subId = parseInt(id)

  const [{ data: s, error }, { data: categories, error: catError }] = await Promise.all([
    supabaseAdmin.from('subcategories').select('id, name, slug, category_id').eq('id', subId).maybeSingle(),
    supabaseAdmin.from('categories').select('id, name').order('name'),
  ])
  if (error) console.error('Subcategory fetch error:', error)
  if (catError) console.error('Categories fetch error:', catError)
  if (!s) notFound()

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/subcategories" className="hover:text-[#041e42]">Subcategories</a> / Edit
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Edit Subcategory</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">{s.name}</p>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6">
        <SubcategoryForm action={updateSubcategory} categories={categories ?? []} subcategory={s} />
      </div>
    </div>
  )
}
