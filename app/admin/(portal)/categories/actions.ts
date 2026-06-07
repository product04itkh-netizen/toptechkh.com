'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function createCategory(_: unknown, formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = (formData.get('description') as string) || null
  const image_url = (formData.get('banner_url') as string)?.split('\n')[0]?.trim() || null
  const { error } = await supabaseAdmin.from('categories').insert({ name, slug, description, image_url })
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
  const image_url = (formData.get('banner_url') as string)?.split('\n')[0]?.trim() || null

  const { error } = await supabaseAdmin.from('categories').update({ name, slug, description, image_url }).eq('id', id)
  if (error) return { error: error.message }

  // Save per-brand banners for this category
  const upserts: { category_id: number; brand_id: number; banner_url: string }[] = []
  const deletes: number[] = []

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('brand_banner_')) continue
    const brandId = parseInt(key.replace('brand_banner_', ''))
    if (isNaN(brandId)) continue
    const url = (value as string).split('\n')[0]?.trim()
    if (url) {
      upserts.push({ category_id: id, brand_id: brandId, banner_url: url })
    } else {
      deletes.push(brandId)
    }
  }

  if (upserts.length > 0) {
    await supabaseAdmin
      .from('brand_category_banners')
      .upsert(upserts, { onConflict: 'brand_id,category_id' })
  }
  if (deletes.length > 0) {
    await supabaseAdmin
      .from('brand_category_banners')
      .delete()
      .eq('category_id', id)
      .in('brand_id', deletes)
  }

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
