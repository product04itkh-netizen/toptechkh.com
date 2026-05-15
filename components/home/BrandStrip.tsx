import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const brandEmoji: Record<string, string> = {
  'asus':      '🖥️',
  'msi':       '🎮',
  'lenovo':    '💻',
  'dell':      '🖱️',
  'acer':      '💻',
  'razer':     '🎮',
  'apple':     '🍎',
  'samsung':   '📱',
  'sony':      '🎧',
  'microsoft': '🪟',
  'lg':        '📺',
  'xiaomi':    '📱',
  'logitech':  '🖱️',
  'intel':     '⚡',
  'amd':       '⚡',
}

export default async function BrandStrip() {
  // Fetch only brands that have products
  const { data: productBrands } = await supabase
    .from('products')
    .select('brand_id')
    .not('brand_id', 'is', null)

  const activeBrandIds = [...new Set((productBrands ?? []).map((p) => p.brand_id))]

  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, slug')
    .in('id', activeBrandIds.length ? activeBrandIds : [-1])
    .order('name')

  if (!brands?.length) return null

  return (
    <section className="py-8 border-y border-[#e5e8ec]">
      <div className="max-w-[1290px] mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#818ea0] uppercase tracking-wider">Top Brands</h3>
          <Link href="/shop" className="text-xs text-[#0070dc] hover:text-[#041e42]">
            View all brands →
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/shop?brand=${brand.slug}`}
              className="flex flex-col items-center gap-1.5 p-3 bg-white border border-[#e5e8ec] rounded-lg hover:border-[#041e42] hover:shadow-sm transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {brandEmoji[brand.slug] ?? '🏷️'}
              </span>
              <span className="text-xs font-semibold text-[#021523] group-hover:text-[#0070dc] text-center">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
