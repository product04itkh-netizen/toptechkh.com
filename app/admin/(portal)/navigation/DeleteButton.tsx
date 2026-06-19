'use client'

import { Trash2 } from 'lucide-react'
import { deleteNavItem } from './actions'

export default function DeleteNavItemButton({ id }: { id: number }) {
  const handleDelete = async () => {
    if (!confirm('Delete this navigation item?')) return
    await deleteNavItem(id)
  }

  return (
    <button
      onClick={handleDelete}
      className="p-2 rounded-lg text-[#818ea0] hover:text-[#ef262c] hover:bg-red-50 transition-colors"
      title="Delete item"
    >
      <Trash2 size={16} />
    </button>
  )
}
