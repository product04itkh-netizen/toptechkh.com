'use client'

import { useActionState } from 'react'
import { createBrand } from '../actions'
import ImageUpload from '@/components/admin/ImageUpload'

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

export default function NewBrandPage() {
  const [state, action, pending] = useActionState(createBrand, null)

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/brands" className="hover:text-[#041e42]">Brands</a> / New
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Add Brand</h1>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6 max-w-lg">
        <form action={action} className="space-y-4">
          {state?.error && <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">{state.error}</div>}
          <div>
            <label className={labelCls}>Name *</label>
            <input type="text" name="name" required className={inputCls} placeholder="e.g. ASUS" />
          </div>
          <div>
            <label className={labelCls}>Slug *</label>
            <input type="text" name="slug" required className={inputCls} placeholder="e.g. asus" />
          </div>
          <div>
            <label className={labelCls}>
              Brand Banner
              <span className="text-[#818ea0] font-normal text-xs ml-2">Shown in category brand sections</span>
            </label>
            <ImageUpload name="logo_url" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={pending}
              className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
              {pending ? 'Saving…' : 'Create Brand'}
            </button>
            <a href="/admin/brands" className="text-sm text-[#818ea0] border border-[#e5e8ec] px-5 py-2.5 rounded-lg hover:border-[#041e42] transition-colors">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
