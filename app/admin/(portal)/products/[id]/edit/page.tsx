import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import ProductForm from '@/components/admin/ProductForm'
import { updateProduct } from '../../actions'

interface Props { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params

  const [{ data: product }, { data: categories }, { data: brands }] = await Promise.all([
    supabaseAdmin.from('products').select('*').eq('id', parseInt(id)).single(),
    supabaseAdmin.from('categories').select('id, name').order('name'),
    supabaseAdmin.from('brands').select('id, name').order('name'),
  ])

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
        <ProductForm action={updateProduct} categories={categories ?? []} brands={brands ?? []} defaultValues={product} />
      </div>
    </div>
  )
}
