import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import PCBuilder from '@/components/build/PCBuilder'

export const metadata = { title: 'Custom PC Builder — Top Tech Computer' }

export default async function BuildPCPage() {
  // Fetch components category ID
  const { data: compCat, error: compErr } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'components')
    .maybeSingle()

  // Also fetch PC category for cases/complete builds
  const { data: pcCat, error: pcErr } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'pc')
    .maybeSingle()

  if (compErr || pcErr) {
    console.error('Category fetch failed:', { compErr, pcErr })
  }

  const catIds = [compCat?.id, pcCat?.id].filter(Boolean) as number[]

  const limit = parseInt(process.env.NEXT_PUBLIC_MAX_PRODUCTS_GRID || '300')
  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), brand:brands(id,name,slug)')
    .in('category_id', catIds.length ? catIds : [-1])
    .eq('stock_status', 'instock')
    .order('price', { ascending: true })
    .limit(limit)

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Page header */}
      <div className="bg-[#021523] text-white">
        <div className="max-w-[1290px] mx-auto px-4 py-8 sm:py-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🖥️</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight">Custom PC Builder</h1>
              <p className="text-white/60 text-sm mt-0.5">Pick your parts, build your dream PC</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1290px] mx-auto px-4 py-6">
        <PCBuilder products={(products ?? []) as Product[]} />
      </div>
    </div>
  )
}
