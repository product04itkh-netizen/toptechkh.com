'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function createBrand(_: unknown, formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const { error } = await supabaseAdmin.from('brands').insert({ name, slug })
  if (error) return { error: error.message }
  revalidatePath('/admin/brands')
  revalidatePath('/')
  revalidatePath('/shop')
  redirect('/admin/brands')
}

export async function updateBrand(_: unknown, formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const { error } = await supabaseAdmin.from('brands').update({ name, slug }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/brands')
  revalidatePath('/')
  revalidatePath('/shop')
  redirect('/admin/brands')
}

export async function deleteBrand(id: number) {
  await supabaseAdmin.from('brands').delete().eq('id', id)
  revalidatePath('/admin/brands')
  revalidatePath('/')
  revalidatePath('/shop')
}
