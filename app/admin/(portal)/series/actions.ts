'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { seriesSchema } from '@/lib/validation'

export async function createSeries(_: unknown, formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      brand_id: parseInt(formData.get('brand_id') as string),
    }
    const validated = seriesSchema.parse(data)
    const { error } = await supabaseAdmin.from('series').insert(validated)
    if (error) return { error: error.message }
    revalidatePath('/admin/series')
    revalidatePath('/shop')
    redirect('/admin/series?toast=success&msg=Series+created')
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Series validation failed'
    return { error: msg }
  }
}

export async function updateSeries(_: unknown, formData: FormData) {
  try {
    const id = parseInt(formData.get('id') as string)
    if (isNaN(id)) throw new Error('Invalid series ID')
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      brand_id: parseInt(formData.get('brand_id') as string),
    }
    const validated = seriesSchema.parse(data)
    const { error } = await supabaseAdmin.from('series').update(validated).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/series')
    revalidatePath('/shop')
    redirect('/admin/series?toast=success&msg=Series+updated')
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Series validation failed'
    return { error: msg }
  }
}

export async function deleteSeries(id: number) {
  const { error } = await supabaseAdmin.from('series').delete().eq('id', id)
  revalidatePath('/admin/series')
  revalidatePath('/shop')
  if (error) redirect('/admin/series?toast=error&msg=Failed+to+delete+series')
  redirect('/admin/series?toast=success&msg=Series+deleted')
}
