import Link from 'next/link'
import { Plus, Edit2, ChevronUp, ChevronDown } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import DeleteNavItemButton from './DeleteButton'
import { moveNavItem } from './actions'

export const metadata = { title: 'Navigation — Admin' }

interface NavItem {
  id: number
  type: 'custom_link' | 'category' | 'build_pc' | 'promotion'
  label: string
  url: string | null
  category_id: number | null
  position: number
  visible: boolean
}

const TYPE_COLORS: Record<string, string> = {
  custom_link: 'bg-blue-100 text-blue-700',
  category: 'bg-purple-100 text-purple-700',
  build_pc: 'bg-green-100 text-green-700',
  promotion: 'bg-red-100 text-red-700',
}

const TYPE_LABELS: Record<string, string> = {
  custom_link: 'Custom Link',
  category: 'Category',
  build_pc: 'Build PC',
  promotion: 'Promotion',
}

export default async function NavigationPage() {
  const { data: items, error } = await supabaseAdmin
    .from('navigation_items')
    .select('*')
    .order('position')

  if (error) console.error('Navigation fetch error:', error)

  const list: NavItem[] = items ?? []

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs text-[#818ea0] mb-1">Admin / Navigation</div>
          <h1 className="text-2xl font-black text-[#021523]">Navigation Manager</h1>
          <p className="text-sm text-[#818ea0] mt-0.5">
            Manage all header navigation items. Includes categories, custom links, and features.
          </p>
        </div>
        <Link
          href="/admin/navigation/new"
          className="flex items-center gap-1.5 bg-[#041e42] hover:bg-[#0a3060] text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={15} />
          Add Item
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-[#c5ccd5] p-12 text-center">
          <p className="text-[#818ea0] text-sm font-medium">No navigation items found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e5e8ec] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e5e8ec] bg-[#f7f8fa] grid grid-cols-12 gap-4 text-sm font-bold text-[#021523]">
            <div className="col-span-1">Pos</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-4">Label</div>
            <div className="col-span-3">URL/Info</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          <ul className="divide-y divide-[#f2f3f5]">
            {list.map((item, idx) => (
              <li key={item.id} className="px-5 py-4 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1">
                  <span className="text-sm font-semibold text-[#021523]">{item.position}</span>
                </div>
                <div className="col-span-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${TYPE_COLORS[item.type] || 'bg-gray-100'}`}>
                    {TYPE_LABELS[item.type]}
                  </span>
                </div>
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#021523]">{item.label}</span>
                    {!item.visible && (
                      <span className="text-xs text-[#818ea0] bg-[#f2f3f5] px-2 py-0.5 rounded">Hidden</span>
                    )}
                  </div>
                </div>
                <div className="col-span-3">
                  {item.type === 'custom_link' && (
                    <span className="text-xs text-[#818ea0] font-mono truncate">{item.url}</span>
                  )}
                  {item.type === 'category' && (
                    <span className="text-xs text-[#818ea0]">Category ID: {item.category_id}</span>
                  )}
                  {item.type === 'build_pc' && (
                    <span className="text-xs text-[#818ea0]">/build-pc</span>
                  )}
                  {item.type === 'promotion' && (
                    <span className="text-xs text-[#818ea0]">/shop?sale=true</span>
                  )}
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  {/* Move up */}
                  <form
                    action={async () => {
                      'use server'
                      await moveNavItem(item.id, 'up')
                    }}
                  >
                    <button
                      type="submit"
                      disabled={idx === 0}
                      title="Move up"
                      className="p-1.5 rounded-lg text-[#818ea0] hover:text-[#041e42] hover:bg-[#f2f3f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronUp size={16} />
                    </button>
                  </form>

                  {/* Move down */}
                  <form
                    action={async () => {
                      'use server'
                      await moveNavItem(item.id, 'down')
                    }}
                  >
                    <button
                      type="submit"
                      disabled={idx === list.length - 1}
                      title="Move down"
                      className="p-1.5 rounded-lg text-[#818ea0] hover:text-[#041e42] hover:bg-[#f2f3f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </form>

                  {/* Edit - only for custom links */}
                  {item.type === 'custom_link' && (
                    <Link
                      href={`/admin/navigation/${item.id}/edit`}
                      className="p-1.5 rounded-lg text-[#818ea0] hover:text-[#041e42] hover:bg-[#f2f3f5] transition-colors"
                      title="Edit item"
                    >
                      <Edit2 size={16} />
                    </Link>
                  )}

                  {/* Delete - only for custom links */}
                  {item.type === 'custom_link' && <DeleteNavItemButton id={item.id} />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
