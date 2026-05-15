import { supabaseAdmin } from '@/lib/supabase-admin'
import { Package, Tag, Building2, AlertTriangle, Star, TrendingUp } from 'lucide-react'

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

  const cards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'In Stock', value: stats.inStock, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Out of Stock', value: stats.outOfStock, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Featured', value: stats.featured, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Categories', value: stats.categories, icon: Tag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Brands', value: stats.brands, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#021523]">Dashboard</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e5e8ec] p-4">
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
              <Icon size={17} className={color} />
            </div>
            <div className="text-2xl font-black text-[#021523]">{value ?? 0}</div>
            <div className="text-xs text-[#818ea0] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

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
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
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
