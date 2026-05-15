'use client'

import { useActionState } from 'react'

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'

export default function CategoryEditForm({ category, action }: { category: any; action: any }) {
  const [state, formAction, pending] = useActionState(action, null as { error?: string } | null)

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/categories" className="hover:text-[#041e42]">Categories</a> / Edit
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Edit Category</h1>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6 max-w-lg">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={category.id} />
          {state?.error && <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">{state.error}</div>}
          <div>
            <label className="block text-sm font-medium text-[#021523] mb-1.5">Name *</label>
            <input type="text" name="name" defaultValue={category.name} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#021523] mb-1.5">Slug *</label>
            <input type="text" name="slug" defaultValue={category.slug} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#021523] mb-1.5">Description</label>
            <textarea name="description" defaultValue={category.description ?? ''} rows={3} className={inputCls + ' resize-none'} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={pending}
              className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
              {pending ? 'Saving…' : 'Update Category'}
            </button>
            <a href="/admin/categories" className="text-sm text-[#818ea0] border border-[#e5e8ec] px-5 py-2.5 rounded-lg hover:border-[#041e42] transition-colors">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
