import Link from 'next/link'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { deleteCategory, toggleCategoryNav } from './actions'
import DeleteButton from '@/components/admin/DeleteButton'

export const metadata = { title: 'Categories — Admin' }

export default async function CategoriesPage() {
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('id, name, slug, description, show_in_nav, nav_order, icon_name')
    .order('nav_order')
    .order('name')

  const list = categories ?? []

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#021523]">Categories</h1>
          <p className="text-sm text-[#818ea0] mt-0.5">
            {list.length} categor{list.length !== 1 ? 'ies' : 'y'} —
            {' '}{list.filter(c => c.show_in_nav).length} visible in nav
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-[#041e42] hover:bg-[#0a3060] text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <Plus size={15} /> Add Category
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e8ec] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e5e8ec] bg-[#f7f8fa]">
              <th className="text-left px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Slug</th>
              <th className="text-left px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Icon</th>
              <th className="text-left px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Order</th>
              <th className="text-left px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Nav</th>
              <th className="text-right px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f3f5]">
            {list.map((cat) => (
              <tr key={cat.id} className={`hover:bg-[#f7f8fa] transition-colors ${!cat.show_in_nav ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 font-medium text-[#021523]">{cat.name}</td>
                <td className="px-4 py-3 text-[#818ea0] font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono bg-[#f2f3f5] text-[#3d4f61] px-2 py-1 rounded">
                    {cat.icon_name ?? 'Package'}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#818ea0] text-xs font-mono">{cat.nav_order}</td>
                <td className="px-4 py-3">
                  <form action={async () => { 'use server'; await toggleCategoryNav(cat.id, cat.show_in_nav) }}>
                    <button
                      type="submit"
                      title={cat.show_in_nav ? 'Hide from nav' : 'Show in nav'}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                        cat.show_in_nav
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                          : 'bg-[#f2f3f5] text-[#818ea0] border-[#e5e8ec] hover:border-[#041e42] hover:text-[#041e42]'
                      }`}
                    >
                      {cat.show_in_nav
                        ? <><Eye size={12} /> Visible</>
                        : <><EyeOff size={12} /> Hidden</>
                      }
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="p-1.5 text-[#818ea0] hover:text-[#041e42] hover:bg-[#f2f3f5] rounded-md transition-colors"
                    >
                      <Pencil size={14} />
                    </Link>
                    <DeleteButton action={deleteCategory.bind(null, cat.id)} label={cat.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <div className="text-center py-12 text-[#818ea0] text-sm">No categories yet</div>
        )}
      </div>

      <p className="text-xs text-[#818ea0] mt-3">
        Toggle <strong>Nav</strong> to show or hide a category from the header navigation and mobile menu.
        Use <strong>Edit</strong> to change the icon or display order.
      </p>
    </div>
  )
}
