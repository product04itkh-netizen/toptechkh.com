import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { deleteSubcategory } from './actions'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function SubcategoriesPage() {
  const { data: subcategories } = await supabaseAdmin
    .from('subcategories')
    .select('id, name, slug, category:categories(name)')
    .order('name')

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#021523]">Subcategories</h1>
          <p className="text-sm text-[#818ea0]">{subcategories?.length ?? 0} subcategories</p>
        </div>
        <Link href="/admin/subcategories/new"
          className="flex items-center gap-2 bg-[#041e42] hover:bg-[#0a3060] text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Plus size={15} /> Add Subcategory
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e8ec] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e5e8ec] bg-[#f7f8fa]">
              <th className="text-left px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Slug</th>
              <th className="text-left px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Category</th>
              <th className="text-right px-4 py-3 font-semibold text-[#818ea0] text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f3f5]">
            {(subcategories ?? []).map((s: any) => (
              <tr key={s.id} className="hover:bg-[#f7f8fa] transition-colors">
                <td className="px-4 py-3 font-medium text-[#021523]">{s.name}</td>
                <td className="px-4 py-3 text-[#818ea0] font-mono text-xs">{s.slug}</td>
                <td className="px-4 py-3 text-[#818ea0] text-xs">{s.category?.name ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/subcategories/${s.id}/edit`}
                      className="p-1.5 text-[#818ea0] hover:text-[#041e42] hover:bg-[#f2f3f5] rounded-md transition-colors">
                      <Pencil size={14} />
                    </Link>
                    <DeleteButton action={deleteSubcategory.bind(null, s.id)} label={s.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(subcategories ?? []).length === 0 && (
          <div className="text-center py-12 text-[#818ea0] text-sm">No subcategories yet</div>
        )}
      </div>
    </div>
  )
}
