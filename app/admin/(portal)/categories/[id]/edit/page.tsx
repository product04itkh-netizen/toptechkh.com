import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import CategoryEditForm from './CategoryEditForm'
import { updateCategory } from '../../actions'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const catId = parseInt(id)

  const { data: category, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('id', catId)
    .maybeSingle()

  if (error) console.error('Category fetch error:', error)
  if (!category) notFound()

  // Brands that have products in this category
  const { data: productRows } = await supabaseAdmin
    .from('products')
    .select('brand_id, brand:brands(id, name, slug)')
    .eq('category_id', catId)
    .not('brand_id', 'is', null)

  const seenIds = new Set<number>()
  const brands: { id: number; name: string; slug: string }[] = []
  for (const row of productRows ?? []) {
    const b = (row as any).brand
    if (b && !seenIds.has(b.id)) {
      seenIds.add(b.id)
      brands.push(b)
    }
  }
  brands.sort((a, b) => a.name.localeCompare(b.name))

  // Existing per-category brand banners
  const { data: bannerRows } = await supabaseAdmin
    .from('brand_category_banners')
    .select('brand_id, banner_url')
    .eq('category_id', catId)

  const existingBrandBanners: Record<number, string> = {}
  for (const row of bannerRows ?? []) {
    existingBrandBanners[row.brand_id] = row.banner_url
  }

  return (
    <CategoryEditForm
      category={category}
      action={updateCategory}
      categoryId={catId}
      brands={brands}
      existingBrandBanners={existingBrandBanners}
    />
  )
}
