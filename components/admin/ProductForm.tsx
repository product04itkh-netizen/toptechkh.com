'use client'

import { useActionState } from 'react'
import RichTextEditor from './RichTextEditor'

interface Category { id: number; name: string }
interface Brand { id: number; name: string }

interface Props {
  action: (state: unknown, formData: FormData) => Promise<any>
  categories: Category[]
  brands: Brand[]
  defaultValues?: {
    id?: number; name?: string; slug?: string; price?: number; sale_price?: number | null
    sku?: string | null; stock_quantity?: number; stock_status?: string; featured?: boolean
    category_id?: number | null; brand_id?: number | null
    description?: string | null; excerpt?: string | null; images?: string[]
  }
}

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42] transition-colors bg-white'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

export default function ProductForm({ action, categories, brands, defaultValues = {} }: Props) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-6">
      {defaultValues.id && <input type="hidden" name="id" value={defaultValues.id} />}

      {state?.error && (
        <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Product Name *</label>
            <input type="text" name="name" defaultValue={defaultValues.name} required className={inputCls} placeholder="e.g. ASUS TUF Gaming A15" />
          </div>

          <div>
            <label className={labelCls}>Slug <span className="text-[#818ea0] font-normal text-xs">(auto-generated if empty)</span></label>
            <input type="text" name="slug" defaultValue={defaultValues.slug} className={inputCls} placeholder="asus-tuf-gaming-a15" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Price ($) *</label>
              <input type="number" name="price" defaultValue={defaultValues.price} required step="0.01" min="0" className={inputCls} placeholder="0.00" />
            </div>
            <div>
              <label className={labelCls}>Sale Price ($)</label>
              <input type="number" name="sale_price" defaultValue={defaultValues.sale_price ?? undefined} step="0.01" min="0" className={inputCls} placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>SKU</label>
              <input type="text" name="sku" defaultValue={defaultValues.sku ?? undefined} className={inputCls} placeholder="SKU-001" />
            </div>
            <div>
              <label className={labelCls}>Stock Qty</label>
              <input type="number" name="stock_quantity" defaultValue={defaultValues.stock_quantity ?? 0} min="0" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Stock Status</label>
              <select name="stock_status" defaultValue={defaultValues.stock_status ?? 'instock'} className={inputCls}>
                <option value="instock">In Stock</option>
                <option value="outofstock">Out of Stock</option>
                <option value="onbackorder">On Backorder</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select name="category_id" defaultValue={defaultValues.category_id ?? ''} className={inputCls}>
                <option value="">None</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Brand</label>
              <select name="brand_id" defaultValue={defaultValues.brand_id ?? ''} className={inputCls}>
                <option value="">None</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" name="featured" defaultChecked={defaultValues.featured} className="w-4 h-4 accent-[#041e42]" />
                <span className="text-sm font-medium text-[#021523]">Featured</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Image URLs <span className="text-[#818ea0] font-normal text-xs">(one per line)</span></label>
            <textarea name="images" defaultValue={defaultValues.images?.join('\n')} rows={4}
              className="w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42] font-mono resize-none"
              placeholder="https://example.com/image1.jpg" />
          </div>

          <div>
            <label className={labelCls}>Short Description / Specs</label>
            <RichTextEditor
              name="excerpt"
              defaultValue={defaultValues.excerpt}
              placeholder="Add specs as a bullet list — CPU, GPU, RAM, Storage…"
              rows={5}
            />
          </div>

          <div>
            <label className={labelCls}>Full Description</label>
            <RichTextEditor
              name="description"
              defaultValue={defaultValues.description}
              placeholder="Full product description…"
              rows={8}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-[#e5e8ec]">
        <button type="submit" disabled={pending}
          className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
          {pending ? 'Saving…' : defaultValues.id ? 'Update Product' : 'Create Product'}
        </button>
        <a href="/admin/products"
          className="text-sm text-[#818ea0] hover:text-[#021523] border border-[#e5e8ec] px-5 py-2.5 rounded-lg hover:border-[#041e42] transition-colors">
          Cancel
        </a>
      </div>
    </form>
  )
}
