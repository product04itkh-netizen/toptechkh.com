import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import CategoryEditForm from './CategoryEditForm'
import { updateCategory } from '../../actions'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: category } = await supabaseAdmin.from('categories').select('*').eq('id', parseInt(id)).single()
  if (!category) notFound()
  return <CategoryEditForm category={category} action={updateCategory} />
}
