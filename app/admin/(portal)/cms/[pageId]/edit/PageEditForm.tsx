'use client'

import { useActionState, useState } from 'react'
import { slugify } from '@/lib/slug'

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

type ActionFn = (prev: unknown, formData: FormData) => Promise<unknown>

interface Props {
  action: ActionFn
  page: { id: number; title: string; slug: string; status: string }
}

export default function PageEditForm({ action, page }: Props) {
  const [state, formAction, pending] = useActionState(action, null)
  const [slug, setSlug] = useState(page.slug)
  const s = state as { error?: string } | null
  const normalised = slugify(slug)

  return (
    <form action={formAction} className="bg-white rounded-xl border border-[#e5e8ec] p-6 space-y-4">
      <input type="hidden" name="id" value={page.id} />

      {s?.error && (
        <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">{s.error}</div>
      )}

      <div>
        <label className={labelCls}>Page Title *</label>
        <input type="text" name="title" defaultValue={page.title} required className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>
          Slug *{' '}
          <span className="text-[#818ea0] font-normal text-xs">(URL path)</span>
        </label>
        <input
          type="text"
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className={inputCls}
        />
        <p className="text-xs text-[#818ea0] mt-1.5">
          Will be saved as <code className="font-mono text-[#021523]">{normalised || '—'}</code>
          {normalised && <> → <span className="font-mono">/pages/{normalised}</span></>}
        </p>
      </div>

      <div>
        <label className={labelCls}>Status</label>
        <select name="status" defaultValue={page.status} className={inputCls}>
          <option value="draft">Draft (hidden from public)</option>
          <option value="published">Published (live)</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          {pending ? 'Saving…' : 'Save Page'}
        </button>
        <a
          href={`/admin/cms/${page.id}`}
          className="text-sm text-[#818ea0] border border-[#e5e8ec] px-5 py-2.5 rounded-lg hover:border-[#041e42] transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
