import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const categoryStyle: Record<string, { emoji: string; bg: string; border: string; hover: string }> = {
  'laptop':          { emoji: '💻', bg: 'bg-blue-50',   border: 'border-blue-100',   hover: 'hover:border-blue-400' },
  'pc':              { emoji: '🖥️', bg: 'bg-indigo-50', border: 'border-indigo-100', hover: 'hover:border-indigo-400' },
  'components':      { emoji: '⚙️', bg: 'bg-purple-50', border: 'border-purple-100', hover: 'hover:border-purple-400' },
  'lcd-monitor':     { emoji: '🖥️', bg: 'bg-cyan-50',   border: 'border-cyan-100',   hover: 'hover:border-cyan-400' },
  'gaming':          { emoji: '🎮', bg: 'bg-red-50',    border: 'border-red-100',    hover: 'hover:border-red-400' },
  'peripherals':     { emoji: '🖱️', bg: 'bg-green-50',  border: 'border-green-100',  hover: 'hover:border-green-400' },
  'accessories':     { emoji: '🔌', bg: 'bg-yellow-50', border: 'border-yellow-100', hover: 'hover:border-yellow-400' },
  'printer-scanner': { emoji: '🖨️', bg: 'bg-orange-50', border: 'border-orange-100', hover: 'hover:border-orange-400' },
  'speaker':         { emoji: '🔊', bg: 'bg-pink-50',   border: 'border-pink-100',   hover: 'hover:border-pink-400' },
  'network':         { emoji: '📡', bg: 'bg-teal-50',   border: 'border-teal-100',   hover: 'hover:border-teal-400' },
}

export default async function FeaturedCategories() {
  // Fetch only categories that have products
  const { data: productCats } = await supabase
    .from('products')
    .select('category_id')
    .not('category_id', 'is', null)

  const activeCatIds = [...new Set((productCats ?? []).map((p) => p.category_id))]

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .in('id', activeCatIds.length ? activeCatIds : [-1])
    .order('name')

  return (
    <section className="py-10 bg-[#f7f8fa]">
      <div className="max-w-[1290px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#021523]">Shop by Category</h2>
            <p className="text-sm text-[#818ea0] mt-1">Find what you need in our full lineup</p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-[#0070dc] hover:text-[#041e42] transition-colors">
            View All →
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {(categories ?? []).map((cat) => {
            const style = categoryStyle[cat.slug] ?? {
              emoji: '📦',
              bg: 'bg-gray-50',
              border: 'border-gray-100',
              hover: 'hover:border-gray-400',
            }
            return (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className={`${style.bg} border ${style.border} ${style.hover} rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md group w-[calc(50%-6px)] sm:w-36`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{style.emoji}</span>
                <div className="text-xs font-bold text-[#021523] leading-tight">{cat.name}</div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
