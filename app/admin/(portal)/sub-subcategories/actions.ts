'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { subSubcategorySchema } from '@/lib/validation'

export async function createSubSubcategory(_: unknown, formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      subcategory_id: parseInt(formData.get('subcategory_id') as string),
    }
    const validated = subSubcategorySchema.parse(data)
    const { error } = await supabaseAdmin.from('sub_subcategories').insert(validated)
    if (error) return { error: error.message }
    revalidatePath('/admin/sub-subcategories')
    revalidatePath('/shop')
    redirect('/admin/sub-subcategories?toast=success&msg=Type+created')
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Type validation failed'
    return { error: msg }
  }
}

export async function updateSubSubcategory(_: unknown, formData: FormData) {
  try {
    const id = parseInt(formData.get('id') as string)
    if (isNaN(id)) throw new Error('Invalid type ID')
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      subcategory_id: parseInt(formData.get('subcategory_id') as string),
    }
    const validated = subSubcategorySchema.parse(data)
    const { error } = await supabaseAdmin.from('sub_subcategories').update(validated).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/sub-subcategories')
    revalidatePath('/shop')
    redirect('/admin/sub-subcategories?toast=success&msg=Type+updated')
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Type validation failed'
    return { error: msg }
  }
}

export async function deleteSubSubcategory(id: number) {
  const { error } = await supabaseAdmin.from('sub_subcategories').delete().eq('id', id)
  revalidatePath('/admin/sub-subcategories')
  revalidatePath('/shop')
  if (error) redirect('/admin/sub-subcategories?toast=error&msg=Failed+to+delete')
  redirect('/admin/sub-subcategories?toast=success&msg=Type+deleted')
}
