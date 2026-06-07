'use client'

import { useActionState } from 'react'
import { Plus } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import { addBanner } from './actions'

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

export default function BannerAddForm() {
  const [state, formAction, pending] = useActionState(addBanner, null as { error: string | null } | null)

  return (
    <div className="bg-white rounded-xl border border-[#e5e8ec] p-6">
      <h2 className="text-base font-bold text-[#021523] mb-4 flex items-center gap-2">
        <Plus size={16} /> Add New Banner
      </h2>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {state.error}
          </div>
        )}
        {state?.error === null && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
            Banner added successfully.
          </div>
        )}

        <div>
          <label className={labelCls}>
            Banner Image <span className="text-[#ef262c]">*</span>
            <span className="text-[#818ea0] font-normal text-xs ml-2">Recommended: 1290×400px</span>
          </label>
          <ImageUpload name="image_url" defaultImages={[]} />
        </div>

        <div>
          <label className={labelCls}>Link URL</label>
          <input
            type="text"
            name="link_url"
            placeholder="/shop or /shop?category=laptop"
            defaultValue="/shop"
            className={inputCls}
          />
          <p className="text-xs text-[#818ea0] mt-1">Where clicking the banner takes the user.</p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={14} />
          {pending ? 'Adding…' : 'Add Banner'}
        </button>
      </form>
    </div>
  )
}
