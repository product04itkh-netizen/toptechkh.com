import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import ProductCard from '@/components/product/ProductCard'

async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), brand:brands(id,name,slug)')
    .eq('featured', true)
    .eq('stock_status', 'instock')
    .order('created_at', { ascending: false })
    .limit(8)

  if (error || !data) return []
  return data as Product[]
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  if (products.length === 0) return null

  return (
    <section className="py-10 bg-[#f2f3f5]">
      <div className="max-w-[1290px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#021523]">Featured Products</h2>
            <p className="text-sm text-[#818ea0] mt-1">Hand-picked top deals just for you</p>
          </div>
          <Link href="/shop?featured=true" className="text-sm font-semibold text-[#0070dc] hover:text-[#041e42] transition-colors">
            See All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
