'use client'

import { useActionState, useState } from 'react'
import RichTextEditor from './RichTextEditor'
import ImageUpload from './ImageUpload'

interface Category       { id: number; name: string }
interface Brand          { id: number; name: string }
interface Series         { id: number; name: string; brand_id: number }
interface Subcategory    { id: number; name: string; category_id: number }
interface SubSubcategory { id: number; name: string; subcategory_id: number }

interface Props {
  action: (state: unknown, formData: FormData) => Promise<any>
  categories: Category[]
  brands: Brand[]
  allSeries: Series[]
  allSubcategories: Subcategory[]
  allSubSubcategories: SubSubcategory[]
  defaultValues?: {
    id?: number; name?: string; slug?: string; price?: number; sale_price?: number | null
    sku?: string | null; stock_quantity?: number; stock_status?: string; featured?: boolean; coming_soon?: boolean
    category_id?: number | null; brand_id?: number | null
    series_id?: number | null; subcategory_id?: number | null; sub_subcategory_id?: number | null
    description?: string | null; excerpt?: string | null; images?: string[]
  }
}

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42] transition-colors bg-white'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

export default function ProductForm({
  action, categories, brands, allSeries, allSubcategories, allSubSubcategories, defaultValues = {},
}: Props) {
  const [state, formAction, pending] = useActionState(action, null)
  const [selectedBrandId, setSelectedBrandId]           = useState(String(defaultValues.brand_id ?? ''))
  const [selectedCategoryId, setSelectedCategoryId]     = useState(String(defaultValues.category_id ?? ''))
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(String(defaultValues.subcategory_id ?? ''))

  const filteredSeries        = allSeries.filter(s => String(s.brand_id) === selectedBrandId)
  const filteredSubcategories = allSubcategories.filter(s => String(s.category_id) === selectedCategoryId)
  const filteredSubSubs       = allSubSubcategories.filter(s => String(s.subcategory_id) === selectedSubcategoryId)

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

          <div>
            <label className={labelCls}>Stock Status</label>
            <select name="stock_status" defaultValue={defaultValues.stock_status ?? 'instock'} className={inputCls}>
              <option value="instock">In Stock</option>
              <option value="outofstock">Out of Stock</option>
              <option value="onbackorder">On Backorder</option>
            </select>
          </div>

          {/* Brand → Series */}
          <div className="rounded-lg border border-[#e5e8ec] p-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#818ea0]">Brand</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Brand</label>
                <select name="brand_id" value={selectedBrandId} onChange={e => setSelectedBrandId(e.target.value)} className={inputCls}>
                  <option value="">None</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Series <span className="text-[#818ea0] font-normal text-xs">(select brand first)</span></label>
                <select name="series_id" defaultValue={defaultValues.series_id ?? ''} className={inputCls}
                  disabled={!selectedBrandId || filteredSeries.length === 0}>
                  <option value="">None</option>
                  {filteredSeries.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Category → Subcategory → Sub-subcategory */}
          <div className="rounded-lg border border-[#e5e8ec] p-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#818ea0]">Category</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Category</label>
                <select name="category_id" value={selectedCategoryId}
                  onChange={e => { setSelectedCategoryId(e.target.value); setSelectedSubcategoryId('') }}
                  className={inputCls}>
                  <option value="">None</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Subcategory <span className="text-[#818ea0] font-normal text-xs">(select category first)</span></label>
                <select name="subcategory_id" value={selectedSubcategoryId}
                  onChange={e => setSelectedSubcategoryId(e.target.value)}
                  className={inputCls}
                  disabled={!selectedCategoryId || filteredSubcategories.length === 0}>
                  <option value="">None</option>
                  {filteredSubcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            {selectedSubcategoryId && filteredSubSubs.length > 0 && (
              <div>
                <label className={labelCls}>Type <span className="text-[#818ea0] font-normal text-xs">(sub-subcategory)</span></label>
                <select name="sub_subcategory_id" defaultValue={defaultValues.sub_subcategory_id ?? ''} className={inputCls}>
                  <option value="">None</option>
                  {filteredSubSubs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" name="featured" defaultChecked={defaultValues.featured} className="w-4 h-4 accent-[#041e42]" />
              <span className="text-sm font-medium text-[#021523]">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" name="coming_soon" defaultChecked={defaultValues.coming_soon} className="w-4 h-4 accent-[#041e42]" />
              <span className="text-sm font-medium text-[#021523]">Coming Soon</span>
            </label>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Product Images</label>
            <ImageUpload defaultImages={defaultValues.images ?? []} />
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
