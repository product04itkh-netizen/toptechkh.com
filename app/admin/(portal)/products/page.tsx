import Link from 'next/link'
import { Plus, Pencil, Search } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { deleteProduct } from './actions'
import DeleteButton from '@/components/admin/DeleteButton'

type SearchParams = {
  q?: string
  category?: string
  brand?: string
  stock?: string
  flag?: string
  sort?: string
  page?: string
  size?: string
}

const PAGE_SIZES = [20, 50, 100]

const SORTS: Record<string, { column: string; ascending: boolean; label: string }> = {
  newest: { column: 'created_at', ascending: false, label: 'Newest first' },
  name: { column: 'name', ascending: true, label: 'Name A–Z' },
  price_asc: { column: 'price', ascending: true, label: 'Price low → high' },
  price_desc: { column: 'price', ascending: false, label: 'Price high → low' },
}

const STOCK_LABEL: Record<string, string> = {
  instock: 'In stock',
  outofstock: 'Out of stock',
  onbackorder: 'Backorder',
}

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm bg-white outline-none focus:border-[#041e42]'

/** Page numbers with ellipses: 1 … 4 5 6 … 26 */
function pageWindow(current: number, total: number): (number | '…')[] {
  const keep = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total))
  const sorted = [...keep].sort((a, b) => a - b)
  const out: (number | '…')[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…')
    out.push(p)
  })
  return out
}

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const category = params.category ?? ''
  const brand = params.brand ?? ''
  const stock = params.stock ?? ''
  const flag = params.flag ?? ''
  const sortKey = SORTS[params.sort ?? ''] ? (params.sort as string) : 'newest'
  const size = PAGE_SIZES.includes(parseInt(params.size ?? '')) ? parseInt(params.size as string) : 20
  const page = Math.max(1, parseInt(params.page ?? '1') || 1)

  // Reference lists for the filter dropdowns
  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabaseAdmin.from('categories').select('id, name').order('name'),
    supabaseAdmin.from('brands').select('id, name').order('name'),
  ])

  let query = supabaseAdmin
    .from('products')
    .select('id, name, sku, price, sale_price, stock_status, featured, images, brand:brands(name), category:categories(name)', { count: 'exact' })

  // Multi-word search: every word must match the name or SKU, in any order
  const words = q.replace(/[%_,()*]/g, ' ').split(/\s+/).filter(Boolean)
  for (const w of words) query = query.or(`name.ilike.%${w}%,sku.ilike.%${w}%`)

  if (category) query = query.eq('category_id', parseInt(category))
  if (brand) query = query.eq('brand_id', parseInt(brand))
  if (stock && STOCK_LABEL[stock]) query = query.eq('stock_status', stock)
  if (flag === 'nophoto') query = query.or('images.is.null,images.eq.{}')
  if (flag === 'zeroprice') query = query.lte('price', 0)
  if (flag === 'featured') query = query.eq('featured', true)

  const sort = SORTS[sortKey]
  const from = (page - 1) * size
  const { data: products, count, error } = await query
    .order(sort.column, { ascending: sort.ascending })
    .order('id', { ascending: true }) // stable paging
    .range(from, from + size - 1)

  if (error) console.error('Admin products query error:', error)

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / size))
  const filtersActive = Boolean(q || category || brand || stock || flag)

  // Every link keeps the current filters and only changes what it names
  const hrefWith = (changes: Partial<SearchParams>) => {
    const next: Record<string, string> = {
      q, category, brand, stock, flag, sort: sortKey, size: String(size),
      ...Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, String(v ?? '')])),
    }
    const qs = Object.entries(next).filter(([k, v]) => v && !(k === 'sort' && v === 'newest') && !(k === 'size' && v === '20') && !(k === 'page' && v === '1'))
    return `/admin/products${qs.length ? '?' + new URLSearchParams(qs).toString() : ''}`
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-[#021523]">Products</h1>
          <p className="text-sm text-[#818ea0]">
            {total.toLocaleString()} {filtersActive ? 'matching' : 'total'}
          </p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 bg-[#041e42] hover:bg-[#0a3060] text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {/* Filters: a GET form, so every state is a shareable URL */}
      <form className="bg-white rounded-xl border border-[#e5e8ec] p-4 mb-4 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="relative md:col-span-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#818ea0]" />
          <input type="text" name="q" defaultValue={q} placeholder="Name, model or SKU"
            className={`${inputCls} pl-9`} />
        </div>
        <select name="category" defaultValue={category} className={`${inputCls} md:col-span-2`}>
          <option value="">All categories</option>
          {(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select name="brand" defaultValue={brand} className={`${inputCls} md:col-span-2`}>
          <option value="">All brands</option>
          {(brands ?? []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select name="stock" defaultValue={stock} className={`${inputCls} md:col-span-2`}>
          <option value="">Any stock</option>
          {Object.entries(STOCK_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select name="flag" defaultValue={flag} className={`${inputCls} md:col-span-2`}>
          <option value="">Any product</option>
          <option value="nophoto">No photo</option>
          <option value="zeroprice">Price is $0</option>
          <option value="featured">Featured</option>
        </select>
        <div className="md:col-span-12 flex flex-wrap items-center gap-3 pt-1">
          <select name="sort" defaultValue={sortKey} className="w-auto px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm bg-white outline-none focus:border-[#041e42]">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select name="size" defaultValue={String(size)} className="w-auto px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm bg-white outline-none focus:border-[#041e42]">
            {PAGE_SIZES.map((n) => <option key={n} value={n}>{n} per page</option>)}
          </select>
          <button type="submit" className="bg-[#041e42] hover:bg-[#0a3060] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            Apply
          </button>
          {filtersActive && (
            <Link href="/admin/products" className="text-sm text-[#5d6b7b] hover:text-[#041e42] underline underline-offset-2">
              Clear filters
            </Link>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl border border-[#e5e8ec] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead>
              <tr className="border-b border-[#e5e8ec] bg-[#f7f8fa] text-left">
                <th className="px-4 py-3 font-semibold text-[#5d6b7b] text-xs uppercase tracking-wide">Product</th>
                <th className="px-4 py-3 font-semibold text-[#5d6b7b] text-xs uppercase tracking-wide">Category</th>
                <th className="px-4 py-3 font-semibold text-[#5d6b7b] text-xs uppercase tracking-wide">SKU</th>
                <th className="px-4 py-3 font-semibold text-[#5d6b7b] text-xs uppercase tracking-wide text-right">Price</th>
                <th className="px-4 py-3 font-semibold text-[#5d6b7b] text-xs uppercase tracking-wide">Stock</th>
                <th className="px-4 py-3 font-semibold text-[#5d6b7b] text-xs uppercase tracking-wide">Photo</th>
                <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f3f5]">
              {(products ?? []).map((p: any) => {
                const hasPhoto = Array.isArray(p.images) ? p.images.length > 0 : Boolean(p.images)
                const zero = Number(p.price) <= 0
                return (
                  <tr key={p.id} className="hover:bg-[#f7f8fa] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#021523] max-w-[360px] truncate">
                        {p.name}
                        {p.featured && <span className="ml-1.5 text-[#b45309] font-semibold" title="Featured">★</span>}
                      </div>
                      <div className="text-xs text-[#5d6b7b]">{p.brand?.name ?? 'No brand'}</div>
                    </td>
                    <td className="px-4 py-3 text-[#021523] whitespace-nowrap">
                      {p.category?.name ?? <span className="text-[#5d6b7b]">Uncategorized</span>}
                    </td>
                    <td className="px-4 py-3 text-[#5d6b7b] font-mono text-xs whitespace-nowrap">{p.sku ?? '—'}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                      {zero ? (
                        <span className="font-semibold text-[#b91c1c]" title="Price is zero">$0.00</span>
                      ) : (
                        <>
                          <span className="font-semibold text-[#021523]">${(p.sale_price ?? p.price).toFixed(2)}</span>
                          {p.sale_price && <span className="ml-1.5 text-xs text-[#5d6b7b] line-through">${p.price.toFixed(2)}</span>}
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                        p.stock_status === 'instock' ? 'bg-green-100 text-green-800'
                        : p.stock_status === 'onbackorder' ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-700'
                      }`}>
                        {STOCK_LABEL[p.stock_status] ?? p.stock_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      {hasPhoto ? <span className="text-[#5d6b7b]">Yes</span> : <span className="font-semibold text-[#b45309]">Missing</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/products/${p.id}/edit`} aria-label={`Edit ${p.name}`}
                          className="p-2 text-[#5d6b7b] hover:text-[#041e42] hover:bg-[#f2f3f5] rounded-md transition-colors">
                          <Pencil size={15} />
                        </Link>
                        <DeleteButton action={deleteProduct.bind(null, p.id)} label={p.name} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {(products ?? []).length === 0 && (
          <div className="text-center py-12 text-[#5d6b7b] text-sm">
            No products match these filters.{' '}
            {filtersActive && <Link href="/admin/products" className="text-[#041e42] underline underline-offset-2">Clear filters</Link>}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <p className="text-sm text-[#5d6b7b]">
            Showing {total === 0 ? 0 : from + 1}–{Math.min(from + size, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <Link href={hrefWith({ page: String(Math.max(1, page - 1)) })} aria-disabled={page === 1}
              className={`px-3 h-9 flex items-center rounded-lg text-sm font-semibold border border-[#e5e8ec] ${page === 1 ? 'pointer-events-none opacity-40' : 'hover:border-[#041e42]'}`}>
              Previous
            </Link>
            {pageWindow(page, totalPages).map((p, i) =>
              p === '…' ? (
                <span key={`gap-${i}`} className="px-2 text-[#5d6b7b]">…</span>
              ) : (
                <Link key={p} href={hrefWith({ page: String(p) })} aria-current={p === page ? 'page' : undefined}
                  className={`min-w-9 h-9 px-2 flex items-center justify-center rounded-lg text-sm font-semibold tabular-nums ${
                    p === page ? 'bg-[#041e42] text-white' : 'border border-[#e5e8ec] text-[#021523] hover:border-[#041e42]'
                  }`}>
                  {p}
                </Link>
              )
            )}
            <Link href={hrefWith({ page: String(Math.min(totalPages, page + 1)) })} aria-disabled={page === totalPages}
              className={`px-3 h-9 flex items-center rounded-lg text-sm font-semibold border border-[#e5e8ec] ${page === totalPages ? 'pointer-events-none opacity-40' : 'hover:border-[#041e42]'}`}>
              Next
            </Link>
          </div>
        </nav>
      )}
    </div>
  )
}
