import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import BrandEditForm from './BrandEditForm'
import { updateBrand } from '../../actions'

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: brand, error } = await supabaseAdmin.from('brands').select('*').eq('id', parseInt(id)).maybeSingle()
  if (error) console.error('Brand fetch error:', error)
  if (!brand) notFound()
  return <BrandEditForm brand={brand} action={updateBrand} />
}
