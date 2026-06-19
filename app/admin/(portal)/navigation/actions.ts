'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { z } from 'zod'

const navItemSchema = z.object({
  type: z.enum(['custom_link', 'category', 'build_pc', 'promotion']),
  label: z.string().trim().min(1, 'Label is required').max(100),
  url: z.string().nullable().optional(),
  category_id: z.number().nullable().optional(),
  position: z.number().int().min(0),
  visible: z.boolean().default(true),
})

export async function createNavItem(_: unknown, formData: FormData) {
  try {
    const type = formData.get('type') as string
    const data: any = {
      type,
      label: formData.get('label') as string,
      position: parseInt(formData.get('position') as string),
      visible: formData.get('visible') === 'on',
      url: type === 'custom_link' ? (formData.get('url') as string) : null,
      category_id: type === 'category' ? parseInt(formData.get('category_id') as string) : null,
    }

    const validated = navItemSchema.parse(data)
    const { error } = await supabaseAdmin.from('navigation_items').insert(validated)

    if (error) return { error: error.message }

    revalidatePath('/admin/navigation')
    revalidatePath('/')
    return { success: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Validation failed'
    return { error: msg }
  }
}

export async function updateNavItem(_: unknown, formData: FormData) {
  try {
    const id = parseInt(formData.get('id') as string)
    if (isNaN(id)) throw new Error('Invalid item ID')

    const type = formData.get('type') as string
    const data: any = {
      type,
      label: formData.get('label') as string,
      position: parseInt(formData.get('position') as string),
      visible: formData.get('visible') === 'on',
      url: type === 'custom_link' ? (formData.get('url') as string) : null,
      category_id: type === 'category' ? parseInt(formData.get('category_id') as string) : null,
    }

    const validated = navItemSchema.parse(data)
    const { error } = await supabaseAdmin
      .from('navigation_items')
      .update(validated)
      .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin/navigation')
    revalidatePath('/')
    return { success: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Validation failed'
    return { error: msg }
  }
}

export async function deleteNavItem(id: number) {
  const { error } = await supabaseAdmin.from('navigation_items').delete().eq('id', id)

  revalidatePath('/admin/navigation')
  revalidatePath('/')

  if (error) return { error: error.message }
  return { success: true }
}

export async function moveNavItem(id: number, direction: 'up' | 'down') {
  try {
    const { data: items, error: fetchError } = await supabaseAdmin
      .from('navigation_items')
      .select('id, position')
      .order('position')

    if (fetchError) throw new Error(fetchError.message)
    if (!items || items.length === 0) throw new Error('No items found')

    const currentIdx = items.findIndex(i => i.id === id)
    if (currentIdx === -1) throw new Error('Item not found')

    const swapIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1
    if (swapIdx < 0 || swapIdx >= items.length) return { success: true }

    const a = items[currentIdx]
    const b = items[swapIdx]

    const [r1, r2] = await Promise.all([
      supabaseAdmin.from('navigation_items').update({ position: b.position }).eq('id', a.id),
      supabaseAdmin.from('navigation_items').update({ position: a.position }).eq('id', b.id),
    ])

    if (r1.error || r2.error) throw new Error('Failed to update positions')

    revalidatePath('/admin/navigation')
    revalidatePath('/')
    return { success: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Reorder failed'
    return { error: msg }
  }
}
