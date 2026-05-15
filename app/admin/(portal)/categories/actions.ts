'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function createCategory(_: unknown, formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = (formData.get('description') as string) || null
  const { error } = await supabaseAdmin.from('categories').insert({ name, slug, description })
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  revalidatePath('/')
  revalidatePath('/shop')
  redirect('/admin/categories')
}

export async function updateCategory(_: unknown, formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = (formData.get('description') as string) || null
  const { error } = await supabaseAdmin.from('categories').update({ name, slug, description }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  revalidatePath('/')
  revalidatePath('/shop')
  redirect('/admin/categories')
}

export async function deleteCategory(id: number) {
  await supabaseAdmin.from('categories').delete().eq('id', id)
  revalidatePath('/admin/categories')
  revalidatePath('/')
  revalidatePath('/shop')
}
