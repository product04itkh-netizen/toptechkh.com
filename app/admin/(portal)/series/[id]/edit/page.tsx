import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { updateSeries } from '../../actions'
import SeriesForm from '../../SeriesForm'

interface Props { params: Promise<{ id: string }> }

export default async function EditSeriesPage({ params }: Props) {
  const { id } = await params

  const [{ data: s, error }, { data: brands, error: brandsError }] = await Promise.all([
    supabaseAdmin.from('series').select('id, name, slug, brand_id').eq('id', parseInt(id)).maybeSingle(),
    supabaseAdmin.from('brands').select('id, name').order('name'),
  ])
  if (error) console.error('Series fetch error:', error)
  if (brandsError) console.error('Brands fetch error:', brandsError)
  if (!s) notFound()

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/series" className="hover:text-[#041e42]">Series</a> / Edit
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Edit Series</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">{s.name}</p>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e8ec] p-6">
        <SeriesForm action={updateSeries} brands={brands ?? []} series={s} />
      </div>
    </div>
  )
}
