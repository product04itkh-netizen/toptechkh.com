'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { brandSchema } from '@/lib/validation'
import { requireAdmin } from '@/lib/admin-session'
import { rethrowFrameworkError, errorMessage } from '@/lib/action-errors'

export async function createBrand(_: unknown, formData: FormData) {
  await requireAdmin()
  try {
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      logo_url: (formData.get('logo_url') as string)?.split('\n')[0]?.trim() || null,
    }
    const validated = brandSchema.parse(data)
    const { error } = await supabaseAdmin.from('brands').insert(validated)
    if (error) return { error: error.message }
    revalidatePath('/admin/brands')
    revalidatePath('/')
    revalidatePath('/shop')
    redirect('/admin/brands?toast=success&msg=Brand+created')
  } catch (e) {
    rethrowFrameworkError(e)
    const msg = errorMessage(e, 'Brand validation failed')
    return { error: msg }
  }
}

export async function updateBrand(_: unknown, formData: FormData) {
  await requireAdmin()
  try {
    const id = parseInt(formData.get('id') as string)
    if (isNaN(id)) throw new Error('Invalid brand ID')
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      logo_url: (formData.get('logo_url') as string)?.split('\n')[0]?.trim() || null,
    }
    const validated = brandSchema.parse(data)
    const { error } = await supabaseAdmin.from('brands').update(validated).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/brands')
    revalidatePath('/')
    revalidatePath('/shop')
    redirect('/admin/brands?toast=success&msg=Brand+updated')
  } catch (e) {
    rethrowFrameworkError(e)
    const msg = errorMessage(e, 'Brand validation failed')
    return { error: msg }
  }
}

export async function deleteBrand(id: number) {
  await requireAdmin()
  const { error } = await supabaseAdmin.from('brands').delete().eq('id', id)
  revalidatePath('/admin/brands')
  revalidatePath('/')
  revalidatePath('/shop')
  if (error) redirect('/admin/brands?toast=error&msg=Failed+to+delete+brand')
  redirect('/admin/brands?toast=success&msg=Brand+deleted')
}
