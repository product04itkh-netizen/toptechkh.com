import { supabaseAdmin } from '@/lib/supabase-admin'
import { createSubcategory } from '../actions'
import SubcategoryForm from '../SubcategoryForm'

export default async function NewSubcategoryPage() {
  const { data: categories, error } = await supabaseAdmin
    .from('categories')
    .select('id, name')
    .order('name')
  if (error) console.error('Categories fetch error:', error)

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/subcategories" className="hover:text-[#041e42]">Subcategories</a> / New
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Add Subcategory</h1>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6">
        <SubcategoryForm action={createSubcategory} categories={categories ?? []} />
      </div>
    </div>
  )
}
