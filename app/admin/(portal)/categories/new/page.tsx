'use client'

import { useActionState } from 'react'
import { createCategory } from '../actions'
import ImageUpload from '@/components/admin/ImageUpload'

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

const ICON_OPTIONS = [
  'Package', 'Laptop', 'Monitor', 'Cpu', 'Mouse', 'Printer',
  'Volume2', 'Wifi', 'Tag', 'HardDrive', 'Headphones', 'Gamepad2',
  'Smartphone', 'Server', 'Cable', 'Keyboard', 'Camera', 'Wrench',
]

export default function NewCategoryPage() {
  const [state, action, pending] = useActionState(createCategory, null)

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/categories" className="hover:text-[#041e42]">Categories</a> / New
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Add Category</h1>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6 max-w-2xl">
        <form action={action} className="space-y-4">
          {state?.error && (
            <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">{state.error}</div>
          )}
          <div>
            <label className={labelCls}>Name *</label>
            <input type="text" name="name" required className={inputCls} placeholder="e.g. Smart Home" />
          </div>
          <div>
            <label className={labelCls}>Slug *</label>
            <input type="text" name="slug" required className={inputCls} placeholder="e.g. smart-home" />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea name="description" rows={3} className={inputCls + ' resize-none'} placeholder="Optional description" />
          </div>

          {/* ── Nav settings ── */}
          <div className="border border-[#e5e8ec] rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-[#021523]">Header Navigation</h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#021523]">Show in Nav</p>
                <p className="text-xs text-[#818ea0]">Displays this category in the header and mobile menu</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="hidden" name="show_in_nav" value="false" />
                <input
                  type="checkbox"
                  name="show_in_nav"
                  value="true"
                  defaultChecked={true}
                  className="sr-only peer"
                  onChange={(e) => {
                    const hidden = e.currentTarget.previousElementSibling as HTMLInputElement
                    hidden.disabled = e.currentTarget.checked
                  }}
                />
                <div className="w-11 h-6 bg-[#e5e8ec] peer-checked:bg-[#041e42] rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>

            <div>
              <label className={labelCls}>
                Display Order
                <span className="text-[#818ea0] font-normal text-xs ml-2">Lower number = appears first</span>
              </label>
              <input
                type="number"
                name="nav_order"
                defaultValue={99}
                min={1}
                max={999}
                className={`${inputCls} max-w-[120px]`}
              />
            </div>

            <div>
              <label className={labelCls}>
                Icon
                <span className="text-[#818ea0] font-normal text-xs ml-2">Lucide icon shown in the mobile menu</span>
              </label>
              <select name="icon_name" defaultValue="Package" className={inputCls}>
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>
              Category Banner
              <span className="text-[#818ea0] font-normal text-xs ml-2">Shown at the top of the category page</span>
            </label>
            <ImageUpload name="banner_url" />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              {pending ? 'Saving…' : 'Create Category'}
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
