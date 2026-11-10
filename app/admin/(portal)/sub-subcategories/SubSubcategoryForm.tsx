'use client'

import { useActionState } from 'react'

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

type ActionFn = (prev: unknown, formData: FormData) => Promise<unknown>

interface Props {
  action: ActionFn
  subcategories: { id: number; label: string }[]  // label = "Category › Subcategory"
  item?: { id: number; name: string; slug: string; subcategory_id: number }
}

export default function SubSubcategoryForm({ action, subcategories, item }: Props) {
  const [state, formAction, pending] = useActionState(action, null)
  const s = state as { error?: string } | null

  return (
    <form action={formAction} className="space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}

      {s?.error && (
        <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">{s.error}</div>
      )}

      <div>
        <label className={labelCls}>Name *</label>
        <input type="text" name="name" required defaultValue={item?.name ?? ''}
          className={inputCls} placeholder='e.g. 16" Gaming' />
      </div>

      <div>
        <label className={labelCls}>Slug *</label>
        <input type="text" name="slug" required defaultValue={item?.slug ?? ''}
          className={inputCls} placeholder="e.g. gaming-16in" />
      </div>

      <div>
        <label className={labelCls}>Subcategory *</label>
        <select
          name="subcategory_id"
          required
          defaultValue={item?.subcategory_id ?? ''}
          className={inputCls}
        >
          <option value="" disabled>Select a subcategory…</option>
          {subcategories.map((sc) => (
            <option key={sc.id} value={sc.id}>{sc.label}</option>
          ))}
        </select>
        {subcategories.length === 0 && (
          <p className="text-xs text-[#ef262c] mt-1.5">No subcategories exist yet. Create a subcategory first.</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending || subcategories.length === 0}
          className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          {pending ? 'Saving…' : item ? 'Update Sub-subcategory' : 'Create Sub-subcategory'}
        </button>
        <a
          href="/admin/sub-subcategories"
          className="text-sm text-[#818ea0] border border-[#e5e8ec] px-5 py-2.5 rounded-lg hover:border-[#041e42] transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
