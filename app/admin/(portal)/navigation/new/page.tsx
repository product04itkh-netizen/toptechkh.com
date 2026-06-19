import NavItemForm from '../NavItemForm'
import { createNavItem } from '../actions'

export const metadata = { title: 'Add Navigation Item — Admin' }

export default async function NewNavItemPage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/navigation" className="hover:text-[#041e42]">Navigation</a> / Add Item
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Add Navigation Item</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">Create a new navigation item for the header.</p>
      </div>

      <NavItemForm action={createNavItem} mode="new" />
    </div>
  )
}
