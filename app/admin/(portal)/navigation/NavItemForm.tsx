'use client'

import { useActionState } from 'react'
import Link from 'next/link'

type ActionFn = (prev: unknown, formData: FormData) => Promise<unknown>

interface NavItemFormProps {
  action: ActionFn
  mode: 'new' | 'edit'
  defaultValues?: { id: number; label: string; url: string; position: number; type: string; visible: boolean }
}

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

export default function NavItemForm({ action, mode, defaultValues }: NavItemFormProps) {
  const [state, formAction, pending] = useActionState(action, null)
  const s = state as { error?: string } | null

  return (
    <form action={formAction} className="space-y-6">
      {mode === 'edit' && defaultValues && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      {s?.error && (
        <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {s.error}
        </div>
      )}

      <div>
        <label className={labelCls}>Label *</label>
        <input
          type="text"
          name="label"
          defaultValue={defaultValues?.label ?? ''}
          placeholder="e.g., About Us, Contact"
          className={inputCls}
          required
        />
      </div>

      <div>
        <label className={labelCls}>URL</label>
        <input
          type="text"
          name="url"
          defaultValue={defaultValues?.url ?? ''}
          placeholder="e.g., /pages/about-us or https://example.com"
          className={inputCls}
        />
        <p className="text-xs text-[#818ea0] mt-1">Use /pages/slug for CMS pages or full URL for external links (optional)</p>
      </div>

      <div>
        <label className={labelCls}>Position *</label>
        <input
          type="number"
          name="position"
          defaultValue={defaultValues?.position ?? 0}
          min={0}
          className={inputCls}
          required
        />
        <p className="text-xs text-[#818ea0] mt-1">Order in the navigation (0 = first)</p>
      </div>

      {/* Type is always custom_link for this form */}
      <input type="hidden" name="type" value="custom_link" />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="visible"
          id="visible"
          defaultChecked={defaultValues?.visible ?? true}
          className="w-4 h-4 accent-[#041e42]"
        />
        <label htmlFor="visible" className="text-sm text-[#021523] font-medium">
          Visible in navigation
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          {pending ? 'Saving…' : mode === 'new' ? 'Add Item' : 'Save Changes'}
        </button>
        <Link
          href="/admin/navigation"
          className="text-sm text-[#818ea0] border border-[#e5e8ec] px-5 py-2.5 rounded-lg hover:border-[#041e42] transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
