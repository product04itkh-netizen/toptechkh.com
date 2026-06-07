import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import ProductCard from '@/components/product/ProductCard'

async function getNewArrivals(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), brand:brands(id,name,slug)')
    .eq('stock_status', 'instock')
    .order('created_at', { ascending: false })
    .limit(8)

  if (error || !data) return []
  return data as Product[]
}

export default async function NewArrivals() {
  const products = await getNewArrivals()

  if (products.length === 0) return null

  return (
    <section className="py-10">
      <div className="max-w-[1290px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#021523]">New Arrivals</h2>
            <p className="text-sm text-[#818ea0] mt-1">The latest tech just dropped</p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-[#0070dc] hover:text-[#041e42] transition-colors">
            View All →
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
