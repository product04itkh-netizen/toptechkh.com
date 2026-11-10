import { supabaseAdmin } from '@/lib/supabase-admin'
import { createSubSubcategory } from '../actions'
import SubSubcategoryForm from '../SubSubcategoryForm'
import { subcategoryOptions } from '../options'

export default async function NewSubSubcategoryPage() {
  const subcategories = await subcategoryOptions(supabaseAdmin)

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/sub-subcategories" className="hover:text-[#041e42]">Sub-subcategories</a> / New
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Add Sub-subcategory</h1>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6 max-w-lg">
        <SubSubcategoryForm action={createSubSubcategory} subcategories={subcategories} />
      </div>
    </div>
  )
}
