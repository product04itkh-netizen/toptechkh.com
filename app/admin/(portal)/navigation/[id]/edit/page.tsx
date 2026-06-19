import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import NavItemForm from '../../NavItemForm'
import { updateNavItem } from '../../actions'

interface Props { params: Promise<{ id: string }> }

export const metadata = { title: 'Edit Navigation Item — Admin' }

interface NavItem {
  id: number
  label: string
  url: string
  position: number
  type: string
  visible: boolean
}

export default async function EditNavItemPage({ params }: Props) {
  const { id } = await params
  const itemId = parseInt(id)

  const { data: item, error } = await supabaseAdmin
    .from('navigation_items')
    .select('*')
    .eq('id', itemId)
    .maybeSingle()

  if (error) console.error('Nav item fetch error:', error)
  if (!item) notFound()

  const navItem = item as NavItem

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/navigation" className="hover:text-[#041e42]">Navigation</a> / Edit Item
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Edit Navigation Item</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">Update the navigation item details.</p>
      </div>

      <NavItemForm action={updateNavItem} mode="edit" defaultValues={navItem} />
    </div>
  )
}
