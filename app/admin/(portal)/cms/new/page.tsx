'use client'

import { useActionState } from 'react'
import { createPage } from '../actions'

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

export default function NewCmsPagePage() {
  const [state, action, pending] = useActionState(createPage, null)

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/cms" className="hover:text-[#041e42]">CMS</a> / New Page
        </div>
        <h1 className="text-2xl font-black text-[#021523]">New Page</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">Create a new page. Add sections after saving.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6 max-w-lg">
        <form action={action} className="space-y-4">
          {state?.error && (
            <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {state.error}
            </div>
          )}

          <div>
            <label className={labelCls}>Page Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. About Us"
              required
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>
              Slug *{' '}
              <span className="text-[#818ea0] font-normal text-xs">
                (URL path — e.g. &quot;about-us&quot; → /pages/about-us)
              </span>
            </label>
            <input
              type="text"
              name="slug"
              placeholder="about-us"
              required
              pattern="[a-z0-9-]+"
              title="Lowercase letters, numbers, hyphens only"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Status</label>
            <select name="status" className={inputCls}>
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
              {pending ? 'Creating…' : 'Create Page'}
            </button>
            <a
              href="/admin/cms"
              className="text-sm text-[#818ea0] border border-[#e5e8ec] px-5 py-2.5 rounded-lg hover:border-[#041e42] transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
