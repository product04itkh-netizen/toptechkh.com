import { supabaseAdmin } from '@/lib/supabase-admin'
import ProductForm from '@/components/admin/ProductForm'
import { createProduct } from '../actions'

export default async function NewProductPage() {
  const [
    { data: categories },
    { data: brands },
    { data: allSeries },
    { data: allSubcategories },
    { data: allSubSubcategories },
  ] = await Promise.all([
    supabaseAdmin.from('categories').select('id, name').order('name'),
    supabaseAdmin.from('brands').select('id, name').order('name'),
    supabaseAdmin.from('series').select('id, name, brand_id').order('name'),
    supabaseAdmin.from('subcategories').select('id, name, category_id').order('name'),
    supabaseAdmin.from('sub_subcategories').select('id, name, subcategory_id').order('name'),
  ])

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/products" className="hover:text-[#041e42]">Products</a> / New
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Add New Product</h1>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6">
        <ProductForm
          action={createProduct}
          categories={categories ?? []}
          brands={brands ?? []}
          allSeries={allSeries ?? []}
          allSubcategories={allSubcategories ?? []}
          allSubSubcategories={allSubSubcategories ?? []}
        />
      </div>
    </div>
  )
}
