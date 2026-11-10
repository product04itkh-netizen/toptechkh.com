import { supabaseAdmin } from '@/lib/supabase-admin'

async function getStats() {
  const [
    { count: totalProducts },
    { count: inStock },
    { count: outOfStock },
    { count: featured },
    { count: categories },
    { count: brands },
    { data: recentProducts },
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('stock_status', 'instock'),
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('stock_status', 'outofstock'),
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('featured', true),
    supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('brands').select('*', { count: 'exact', head: true }),
    supabaseAdmin
      .from('products')
      .select('id, name, price, sale_price, stock_status, created_at, brand:brands(name)')
      .order('created_at', { ascending: false })
      .limit(10),
  ])
  return { totalProducts, inStock, outOfStock, featured, categories, brands, recentProducts: recentProducts ?? [] }
}

export default async function DashboardPage() {
  const stats = await getStats()

  // One hairline-divided strip of counts: no icon tiles, no per-card colour
  const counts = [
    { label: 'Products', value: stats.totalProducts },
    { label: 'In stock', value: stats.inStock },
    { label: 'Out of stock', value: stats.outOfStock },
    { label: 'Featured', value: stats.featured },
    { label: 'Categories', value: stats.categories },
    { label: 'Brands', value: stats.brands },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#021523]">Dashboard</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">Welcome back, Admin</p>
      </div>

      <dl className="grid grid-cols-2 lg:grid-cols-6 bg-white rounded-xl border border-[#e5e8ec] divide-x divide-y lg:divide-y-0 divide-[#e5e8ec] mb-8">
        {counts.map(({ label, value }) => (
          <div key={label} className="px-5 py-4">
            <dt className="text-xs text-[#5d6b7b]">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-[#021523]">{value ?? 0}</dd>
          </div>
        ))}
      </dl>

      <div className="bg-white rounded-xl border border-[#e5e8ec]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e8ec]">
          <h2 className="font-bold text-[#021523]">Recently Added</h2>
          <a href="/admin/products" className="text-sm text-[#0070dc] hover:underline">View all →</a>
        </div>
        <div className="divide-y divide-[#f2f3f5]">
          {stats.recentProducts.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-3">
              <div className="min-w-0 flex-1 mr-4">
                <p className="text-sm font-medium text-[#021523] truncate">{p.name}</p>
                <p className="text-xs text-[#818ea0]">{(p.brand as any)?.name ?? '—'}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-[#021523]">${(p.sale_price ?? p.price).toFixed(2)}</p>
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                  p.stock_status === 'instock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {p.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
