'use client'

import { useActionState } from 'react'

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

type ActionFn = (prev: unknown, formData: FormData) => Promise<unknown>

interface Props {
  action: ActionFn
  categories: { id: number; name: string }[]
  subcategory?: { id: number; name: string; slug: string; category_id: number }
}

export default function SubcategoryForm({ action, categories, subcategory }: Props) {
  const [state, formAction, pending] = useActionState(action, null)
  const s = state as { error?: string } | null

  return (
    <form action={formAction} className="space-y-4">
      {subcategory && <input type="hidden" name="id" value={subcategory.id} />}

      {s?.error && (
        <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">{s.error}</div>
      )}

      <div>
        <label className={labelCls}>Name *</label>
        <input type="text" name="name" required defaultValue={subcategory?.name ?? ''}
          className={inputCls} placeholder="e.g. Gaming Laptop" />
      </div>

      <div>
        <label className={labelCls}>Slug *</label>
        <input type="text" name="slug" required defaultValue={subcategory?.slug ?? ''}
          className={inputCls} placeholder="e.g. gaming-laptop" />
      </div>

      <div>
        <label className={labelCls}>Category *</label>
        <select
          name="category_id"
          required
          defaultValue={subcategory?.category_id ?? ''}
          className={inputCls}
        >
          <option value="" disabled>Select a category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {categories.length === 0 && (
          <p className="text-xs text-[#ef262c] mt-1.5">No categories exist yet. Create a category first.</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending || categories.length === 0}
          className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          {pending ? 'Saving…' : subcategory ? 'Update Subcategory' : 'Create Subcategory'}
        </button>
        <a
          href="/admin/subcategories"
          className="text-sm text-[#818ea0] border border-[#e5e8ec] px-5 py-2.5 rounded-lg hover:border-[#041e42] transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
