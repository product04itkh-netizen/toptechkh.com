import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import ProductCard from '@/components/product/ProductCard'

async function getDeals(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), brand:brands(id,name,slug)')
    .not('sale_price', 'is', null)
    .eq('stock_status', 'instock')
    .order('created_at', { ascending: false })
    .limit(4)

  if (error || !data) return []
  return data as Product[]
}

export default async function DealsSection() {
  const deals = await getDeals()

  return (
    <section className="py-10">
      <div className="max-w-[1290px] mx-auto px-4">
        {/* Banner strip */}
        <div className="bg-gradient-to-r from-[var(--cms-color-accent)] to-[#c71f24] rounded-xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-wider text-red-200 mb-1">Limited Time Offer</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black">Hot Deals of the Week</h2>
            <p className="text-red-200 mt-1">Up to 50% off on selected items</p>
          </div>
          <Link
            href="/shop?sale=true"
            className="flex-shrink-0 bg-white text-[var(--cms-color-accent)] font-bold px-6 py-3 rounded-md hover:bg-red-50 transition-colors"
          >
            Shop Deals
          </Link>
        </div>

        {deals.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
