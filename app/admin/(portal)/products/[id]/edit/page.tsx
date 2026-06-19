import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import ProductForm from '@/components/admin/ProductForm'
import { updateProduct } from '../../actions'

interface Props { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params

  const [
    { data: product, error: productError },
    { data: categories },
    { data: brands },
    { data: allSeries },
    { data: allSubcategories },
    { data: allSubSubcategories },
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*').eq('id', parseInt(id)).maybeSingle(),
    supabaseAdmin.from('categories').select('id, name').order('name'),
    supabaseAdmin.from('brands').select('id, name').order('name'),
    supabaseAdmin.from('series').select('id, name, brand_id').order('name'),
    supabaseAdmin.from('subcategories').select('id, name, category_id').order('name'),
    supabaseAdmin.from('sub_subcategories').select('id, name, subcategory_id').order('name'),
  ])

  if (productError) console.error('Product fetch error:', productError)
  if (!product) notFound()

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/products" className="hover:text-[#041e42]">Products</a> / Edit
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Edit Product</h1>
        <p className="text-sm text-[#818ea0] mt-0.5 truncate">{product.name}</p>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6">
        <ProductForm
          action={updateProduct}
          categories={categories ?? []}
          brands={brands ?? []}
          allSeries={allSeries ?? []}
          allSubcategories={allSubcategories ?? []}
          allSubSubcategories={allSubSubcategories ?? []}
          defaultValues={product}
        />
      </div>
    </div>
  )
}
