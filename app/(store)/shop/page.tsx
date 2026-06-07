import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import ProductCard from '@/components/product/ProductCard'
import FilterSidebar from '@/components/shop/FilterSidebar'
import SortBar from '@/components/shop/SortBar'
import CategoryLanding from '@/components/shop/CategoryLanding'

interface ShopPageProps {
  searchParams: Promise<{
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    instock?: string
    sort?: string
    featured?: string
    sale?: string
    q?: string
    page?: string
  }>
}

async function getProducts(params: Awaited<ShopPageProps['searchParams']>) {
  // Resolve slug → id for accurate filtering (can't filter aliased joined columns directly)
  let categoryId: number | null = null
  let categoryName: string | null = null
  let brandId: number | null = null
  let brandName: string | null = null

  await Promise.all([
    params.category
      ? supabase.from('categories').select('id, name').eq('slug', params.category).single()
          .then(({ data }) => { if (data) { categoryId = data.id; categoryName = data.name } })
      : Promise.resolve(),
    params.brand
      ? supabase.from('brands').select('id, name').eq('slug', params.brand).single()
          .then(({ data }) => { if (data) { brandId = data.id; brandName = data.name } })
      : Promise.resolve(),
  ])

  let query = supabase
    .from('products')
    .select('*, category:categories(id,name,slug), brand:brands(id,name,slug)', { count: 'exact' })

  if (params.q) query = query.ilike('name', `%${params.q}%`)
  if (categoryId !== null) query = query.eq('category_id', categoryId)
  if (brandId !== null) query = query.eq('brand_id', brandId)
  if (params.minPrice) query = query.gte('price', Number(params.minPrice))
  if (params.maxPrice) query = query.lte('price', Number(params.maxPrice))
  if (params.instock === 'true') query = query.eq('stock_status', 'instock')
  if (params.featured === 'true') query = query.eq('featured', true)
  if (params.sale === 'true') query = query.not('sale_price', 'is', null)

  const sort = params.sort || 'newest'
  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else if (sort === 'rating') query = query.order('rating', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const page = Math.max(1, Number(params.page || 1))
  const perPage = 24
  query = query.range((page - 1) * perPage, page * perPage - 1)

  const { data, count } = await query
  return { products: (data as Product[]) || [], total: count || 0, page, perPage, categoryName, brandName }
}

function getPageTitle(
  params: Awaited<ShopPageProps['searchParams']>,
  categoryName: string | null,
  brandName: string | null,
) {
  if (params.q) return `Search: "${params.q}"`
  if (params.featured === 'true') return 'Featured Products'
  if (params.sale === 'true') return 'Hot Deals'
  if (params.category) return categoryName ?? params.category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  if (params.brand) return brandName ?? params.brand.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return 'All Products'
}

async function ShopContent({ searchParams }: { searchParams: Awaited<ShopPageProps['searchParams']> }) {
  const { products, total, page, perPage, categoryName, brandName } = await getProducts(searchParams)
  const totalPages = Math.ceil(total / perPage)
  const title = getPageTitle(searchParams, categoryName, brandName)

  return (
    <div className="flex-1 min-w-0">
      <div className="mb-2">
        <h1 className="text-xl font-black text-[#021523]">{title}</h1>
      </div>
      <Suspense fallback={<div className="h-12 bg-[#f2f3f5] rounded animate-pulse mb-4" />}>
        <SortBar total={total} />
      </Suspense>
      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-[#021523] mb-2">No products found</h2>
          <p className="text-[#818ea0]">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/shop?${new URLSearchParams({ ...searchParams, page: String(p) }).toString()}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-semibold transition-colors ${
                    p === page ? 'bg-[#041e42] text-white' : 'border border-[#e5e8ec] text-[#021523] hover:border-[#041e42]'
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

async function getCategoryLandingData(slug: string) {
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug, image_url, description')
    .eq('slug', slug)
    .single()

  if (!category) return null

  const [{ data: products }, { data: bannerRows }] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(id,name,slug), brand:brands(id,name,slug,logo_url)')
      .eq('category_id', category.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('brand_category_banners')
      .select('brand_id, banner_url')
      .eq('category_id', category.id),
  ])

  // brand_id → per-category banner URL
  const brandBanners: Record<number, string> = {}
  for (const row of (bannerRows ?? [])) {
    brandBanners[row.brand_id] = row.banner_url
  }

  const brandMap = new Map<string, { brand: any; products: Product[] }>()
  for (const product of (products ?? []) as Product[]) {
    const key = (product as any).brand?.slug ?? '__no_brand'
    if (!brandMap.has(key)) brandMap.set(key, { brand: (product as any).brand ?? null, products: [] })
    brandMap.get(key)!.products.push(product)
  }

  const brandGroups = [...brandMap.values()].sort((a, b) => b.products.length - a.products.length)
  return { category, brandGroups, total: products?.length ?? 0, brandBanners }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams

  // Category landing — no extra filters applied
  const isCategoryLanding = params.category && !params.brand && !params.q && !params.featured && !params.sale && !params.minPrice

  if (isCategoryLanding) {
    const data = await getCategoryLandingData(params.category!)
    if (data) {
      return (
        <div className="max-w-[1290px] mx-auto px-4 py-6">
          <div className="text-xs text-[#818ea0] mb-6">
            <a href="/" className="hover:text-[#041e42]">Home</a>{' / '}
            <a href="/shop" className="hover:text-[#041e42]">Shop</a>{' / '}
            <span className="text-[#021523]">{data.category.name}</span>
          </div>
          <CategoryLanding
            category={data.category}
            brandGroups={data.brandGroups}
            totalProducts={data.total}
            brandBanners={data.brandBanners}
          />
        </div>
      )
    }
  }

  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from('categories').select('name, slug').order('name'),
    supabase.from('brands').select('name, slug').order('name'),
  ])

  return (
    <div className="max-w-[1290px] mx-auto px-4 py-6">
      <div className="text-xs text-[#818ea0] mb-4">
        <a href="/" className="hover:text-[#041e42]">Home</a>{' / '}
        <span className="text-[#021523]">Shop</span>
      </div>
      <div className="flex gap-6">
        <aside className="hidden lg:block flex-shrink-0">
          <Suspense fallback={<div className="h-96 bg-[#f2f3f5] rounded animate-pulse" />}>
            <FilterSidebar categories={categories ?? []} brands={brands ?? []} />
          </Suspense>
        </aside>
        <Suspense
          fallback={
            <div className="flex-1">
              <div className="h-12 bg-[#f2f3f5] rounded animate-pulse mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white border border-[#e5e8ec] rounded-lg overflow-hidden animate-pulse">
                    <div className="aspect-square bg-[#f2f3f5]" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-[#f2f3f5] rounded" />
                      <div className="h-4 bg-[#f2f3f5] rounded w-2/3" />
                      <div className="h-8 bg-[#f2f3f5] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <ShopContent searchParams={params} />
        </Suspense>
      </div>
    </div>
  )
}
