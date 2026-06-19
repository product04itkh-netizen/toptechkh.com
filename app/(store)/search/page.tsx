import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import ProductCard from '@/components/product/ProductCard'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

async function searchProducts(query: string, category?: string): Promise<Product[]> {
  if (!query.trim()) return []
  const limit = parseInt(process.env.NEXT_PUBLIC_SEARCH_RESULT_LIMIT || '24')
  let q = supabase
    .from('products')
    .select('*, category:categories(id,name,slug), brand:brands(id,name,slug)')
    .ilike('name', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (category) q = q.eq('categories.slug', category)
  const { data } = await q
  return (data as Product[]) || []
}

async function SearchResults({ query, category }: { query: string; category?: string }) {
  const products = await searchProducts(query, category)
  return (
    <div>
      <p className="text-sm text-[#818ea0] mb-6">
        {products.length > 0 ? `Found ${products.length} results for "${query}"` : `No results found for "${query}"`}
      </p>
      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-[#021523] mb-2">No products found</h2>
          <p className="text-[#818ea0]">Try different keywords or browse our categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '', category } = await searchParams
  return (
    <div className="max-w-[1290px] mx-auto px-4 py-6">
      <div className="text-xs text-[#818ea0] mb-4">
        <a href="/" className="hover:text-[#041e42]">Home</a>{' / '}
        <span className="text-[#021523]">Search</span>
      </div>
      <h1 className="text-2xl font-black text-[#021523] mb-6">
        {q ? `Search: "${q}"` : 'Search Products'}
      </h1>
      {q ? (
        <Suspense fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#e5e8ec] rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-[#f2f3f5]" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-[#f2f3f5] rounded" /><div className="h-4 bg-[#f2f3f5] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        }>
          <SearchResults query={q} category={category} />
        </Suspense>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-[#818ea0]">Type something in the search bar above to find products.</p>
        </div>
      )}
    </div>
  )
}
