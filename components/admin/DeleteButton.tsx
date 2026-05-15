'use client'

import { Trash2 } from 'lucide-react'

interface Props {
  action: (formData: FormData) => void
  label: string
}

export default function DeleteButton({ action, label }: Props) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="p-1.5 text-[#818ea0] hover:text-[#ef262c] hover:bg-red-50 rounded-md transition-colors"
        onClick={(e) => {
          if (!confirm(`Delete "${label}"?`)) e.preventDefault()
        }}
      >
        <Trash2 size={14} />
      </button>
    </form>
  )
}
