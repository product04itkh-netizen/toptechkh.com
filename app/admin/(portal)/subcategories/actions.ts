'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { subcategorySchema } from '@/lib/validation'

export async function createSubcategory(_: unknown, formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      category_id: parseInt(formData.get('category_id') as string),
    }
    const validated = subcategorySchema.parse(data)
    const { error } = await supabaseAdmin.from('subcategories').insert(validated)
    if (error) return { error: error.message }
    revalidatePath('/admin/subcategories')
    revalidatePath('/shop')
    redirect('/admin/subcategories?toast=success&msg=Subcategory+created')
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Subcategory validation failed'
    return { error: msg }
  }
}

export async function updateSubcategory(_: unknown, formData: FormData) {
  try {
    const id = parseInt(formData.get('id') as string)
    if (isNaN(id)) throw new Error('Invalid subcategory ID')
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      category_id: parseInt(formData.get('category_id') as string),
    }
    const validated = subcategorySchema.parse(data)
    const { error } = await supabaseAdmin.from('subcategories').update(validated).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/subcategories')
    revalidatePath('/shop')
    redirect('/admin/subcategories?toast=success&msg=Subcategory+updated')
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Subcategory validation failed'
    return { error: msg }
  }
}

export async function deleteSubcategory(id: number) {
  const { error } = await supabaseAdmin.from('subcategories').delete().eq('id', id)
  revalidatePath('/admin/subcategories')
  revalidatePath('/shop')
  if (error) redirect('/admin/subcategories?toast=error&msg=Failed+to+delete+subcategory')
  redirect('/admin/subcategories?toast=success&msg=Subcategory+deleted')
}
