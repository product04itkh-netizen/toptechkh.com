import { supabaseAdmin } from '@/lib/supabase-admin'
import { createSeries } from '../actions'
import SeriesForm from '../SeriesForm'

export default async function NewSeriesPage() {
  const { data: brands, error } = await supabaseAdmin.from('brands').select('id, name').order('name')
  if (error) console.error('Brands fetch error:', error)

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/series" className="hover:text-[#041e42]">Series</a> / New
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Add Series</h1>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6">
        <SeriesForm action={createSeries} brands={brands ?? []} />
      </div>
    </div>
  )
}
