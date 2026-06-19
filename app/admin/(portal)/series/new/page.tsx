'use client'

import { useActionState } from 'react'
import { createSeries } from '../actions'

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

export default function NewSeriesPage() {
  const [state, action, pending] = useActionState(createSeries, null)

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/series" className="hover:text-[#041e42]">Series</a> / New
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Add Series</h1>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6 max-w-lg">
        <form action={action} className="space-y-4">
          {state?.error && <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">{state.error}</div>}
          <div>
            <label className={labelCls}>Name *</label>
            <input type="text" name="name" required className={inputCls} placeholder="e.g. ROG" />
          </div>
          <div>
            <label className={labelCls}>Slug *</label>
            <input type="text" name="slug" required className={inputCls} placeholder="e.g. rog" />
          </div>
          <div>
            <label className={labelCls}>Brand ID *</label>
            <input type="number" name="brand_id" required className={inputCls} placeholder="Brand ID (from Brands list)" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={pending}
              className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
              {pending ? 'Saving…' : 'Create Series'}
            </button>
            <a href="/admin/series" className="text-sm text-[#818ea0] border border-[#e5e8ec] px-5 py-2.5 rounded-lg hover:border-[#041e42] transition-colors">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
