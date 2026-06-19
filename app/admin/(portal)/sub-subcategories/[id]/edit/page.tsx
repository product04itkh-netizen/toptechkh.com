'use client'

import { notFound } from 'next/navigation'
import { useActionState } from 'react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { updateSubSubcategory } from '../../actions'

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

interface Props { params: Promise<{ id: string }> }

export default async function EditSubSubcategoryPage({ params }: Props) {
  const { id } = await params
  const { data: s, error } = await supabaseAdmin.from('sub_subcategories').select('*').eq('id', parseInt(id)).maybeSingle()
  if (error) console.error('Sub-subcategory fetch error:', error)
  if (!s) notFound()

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/sub-subcategories" className="hover:text-[#041e42]">Sub-subcategories</a> / Edit
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Edit Sub-subcategory</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">{s.name}</p>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6 max-w-lg">
        <EditForm item={s} />
      </div>
    </div>
  )
}

function EditForm({ item }: { item: any }) {
  const [state, action, pending] = useActionState(updateSubSubcategory, null)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={item.id} />
      {state?.error && (
        <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">{state.error}</div>
      )}
      <div>
        <label className={labelCls}>Name *</label>
        <input type="text" name="name" defaultValue={item.name} required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Slug *</label>
        <input type="text" name="slug" defaultValue={item.slug} required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Subcategory ID * <span className="text-[#818ea0] font-normal text-xs">(see Subcategories list)</span></label>
        <input type="number" name="subcategory_id" defaultValue={item.subcategory_id} required className={inputCls} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending}
          className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
          {pending ? 'Saving…' : 'Update Sub-subcategory'}
        </button>
        <a href="/admin/sub-subcategories" className="text-sm text-[#818ea0] border border-[#e5e8ec] px-5 py-2.5 rounded-lg hover:border-[#041e42] transition-colors">
          Cancel
        </a>
      </div>
    </form>
  )
}
