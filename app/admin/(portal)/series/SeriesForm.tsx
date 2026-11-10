'use client'

import { useActionState } from 'react'

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm bg-white outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

type ActionFn = (prev: unknown, formData: FormData) => Promise<unknown>

interface Props {
  action: ActionFn
  brands: { id: number; name: string }[]
  series?: { id: number; name: string; slug: string; brand_id: number }
}

export default function SeriesForm({ action, brands, series }: Props) {
  const [state, formAction, pending] = useActionState(action, null)
  const error = (state as { error?: string } | null)?.error

  return (
    <form action={formAction} className="space-y-4">
      {series && <input type="hidden" name="id" value={series.id} />}

      {error && (
        <div role="alert" className="text-sm text-[#b91c1c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</div>
      )}

      <div>
        <label className={labelCls}>Name *</label>
        <input type="text" name="name" required defaultValue={series?.name ?? ''} className={inputCls} placeholder="e.g. ROG" />
      </div>

      <div>
        <label className={labelCls}>Slug *</label>
        <input type="text" name="slug" required defaultValue={series?.slug ?? ''} className={inputCls} placeholder="e.g. rog" />
      </div>

      <div>
        <label className={labelCls}>Brand *</label>
        <select name="brand_id" required defaultValue={series?.brand_id ?? ''} className={inputCls}>
          <option value="" disabled>Select a brand…</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending || brands.length === 0}
          className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
          {pending ? 'Saving…' : series ? 'Update Series' : 'Create Series'}
        </button>
        <a href="/admin/series" className="text-sm text-[#5d6b7b] border border-[#e5e8ec] px-5 py-2.5 rounded-lg hover:border-[#041e42] transition-colors">
          Cancel
        </a>
      </div>
    </form>
  )
}
