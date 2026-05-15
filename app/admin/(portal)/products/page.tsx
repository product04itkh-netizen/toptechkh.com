import Link from 'next/link'
import { Plus, Pencil, Search } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { deleteProduct } from './actions'
import DeleteButton from '@/components/admin/DeleteButton'

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { q = '', page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr)
  const perPage = 20
  const offset = (page - 1) * perPage

  let query = supabaseAdmin
    .from('products')
    .select('id, name, slug, sku, price, sale_price, stock_status, featured, brand:brands(name), category:categories(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (q) query = (query as any).ilike('name', `%${q}%`)

  const { data: products, count } = await query
  const totalPages = Math.ceil((count ?? 0) / perPage)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#021523]">Products</h1>
          <p className="text-sm text-[#818ea0]">{count ?? 0} total</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 bg-[#041e42] hover:bg-[#0a3060] text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Plus size={15} /> Add Product
        </Link>
      </div>

      <form className="mb-4">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#818ea0]" />
          <input type="text" name="q" defaultValue={q} placeholder="Search products…"
            className="w-full pl-9 pr-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]" />
        </div>
      </form>

      <div className="bg-white rounded-xl border border-[#e5e8ec] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-[#e5e8ec] bg-[#f7f8fa]">
                <th className="text-left px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">SKU</th>
                <th className="text-left px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f3f5]">
              {(products ?? []).map((p: any) => (
                <tr key={p.id} className="hover:bg-[#f7f8fa] transition-colors">
                  <td className="px-4 py-3 max-w-xs">
                    <div className="font-medium text-[#021523] truncate">{p.name}</div>
                    <div className="text-xs text-[#818ea0]">
                      {p.brand?.name ?? '—'} · {p.category?.name ?? 'Uncategorized'}
                      {p.featured && <span className="ml-1.5 text-yellow-600 font-semibold">★</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#818ea0] font-mono text-xs">{p.sku ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-[#021523]">${(p.sale_price ?? p.price).toFixed(2)}</span>
                    {p.sale_price && <span className="ml-1.5 text-xs text-[#818ea0] line-through">${p.price.toFixed(2)}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                      p.stock_status === 'instock' ? 'bg-green-100 text-green-700'
                      : p.stock_status === 'onbackorder' ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-600'
                    }`}>
                      {p.stock_status === 'instock' ? 'In Stock' : p.stock_status === 'outofstock' ? 'Out of Stock' : 'Backorder'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/products/${p.id}/edit`}
                        className="p-1.5 text-[#818ea0] hover:text-[#041e42] hover:bg-[#f2f3f5] rounded-md transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <DeleteButton action={deleteProduct.bind(null, p.id)} label={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(products ?? []).length === 0 && (
          <div className="text-center py-12 text-[#818ea0] text-sm">No products found</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a key={p} href={`/admin/products?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                p === page ? 'bg-[#041e42] text-white' : 'border border-[#e5e8ec] text-[#021523] hover:border-[#041e42]'
              }`}>
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
