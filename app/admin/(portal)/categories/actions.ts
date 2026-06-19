'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { categorySchema } from '@/lib/validation'

export async function createCategory(_: unknown, formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: (formData.get('description') as string) || null,
      image_url: (formData.get('banner_url') as string)?.split('\n')[0]?.trim() || null,
      show_in_nav: formData.get('show_in_nav') === 'true',
      nav_order: parseInt(formData.get('nav_order') as string) || 99,
      icon_name: (formData.get('icon_name') as string) || 'Package',
    }

    const validated = categorySchema.parse(data)
    const { data: inserted, error } = await supabaseAdmin
      .from('categories')
      .insert(validated)
      .select('id')

    if (error) return { error: error.message }

    // If show_in_nav is true, add to navigation_items
    if (data.show_in_nav && inserted && inserted.length > 0) {
      const catId = inserted[0].id
      const { data: maxPos } = await supabaseAdmin
        .from('navigation_items')
        .select('position')
        .order('position', { ascending: false })
        .limit(1)

      const nextPos = (maxPos && maxPos.length > 0) ? (maxPos[0]?.position ?? 0) + 1 : 0

      const { error: navError } = await supabaseAdmin.from('navigation_items').insert({
        type: 'category',
        label: data.name,
        category_id: catId,
        position: nextPos,
        visible: true,
        url: null,
      })

      if (navError) throw new Error(`Failed to add to navigation: ${navError.message}`)
    }

    revalidatePath('/admin/categories')
    revalidatePath('/admin/navigation')
    revalidatePath('/')
    revalidatePath('/shop')
    redirect('/admin/categories?toast=success&msg=Category+created')
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Category validation failed'
    return { error: msg }
  }
}

export async function updateCategory(_: unknown, formData: FormData) {
  try {
    const id = parseInt(formData.get('id') as string)
    if (isNaN(id)) throw new Error('Invalid category ID')

    // Get current state to detect changes
    const { data: current } = await supabaseAdmin
      .from('categories')
      .select('show_in_nav, name')
      .eq('id', id)
      .maybeSingle()

    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: (formData.get('description') as string) || null,
      image_url: (formData.get('banner_url') as string)?.split('\n')[0]?.trim() || null,
      show_in_nav: formData.get('show_in_nav') === 'true',
      nav_order: parseInt(formData.get('nav_order') as string) || 99,
      icon_name: (formData.get('icon_name') as string) || 'Package',
    }

    const validated = categorySchema.parse(data)
    const { error } = await supabaseAdmin
      .from('categories')
      .update(validated)
      .eq('id', id)
    if (error) return { error: error.message }

    // Sync with navigation_items
    if (current) {
      const wasInNav = current.show_in_nav
      const isInNav = data.show_in_nav
      const nameChanged = current.name !== data.name

      if (wasInNav && !isInNav) {
        // Remove from nav
        const { error: delError } = await supabaseAdmin
          .from('navigation_items')
          .delete()
          .eq('category_id', id)
        if (delError) throw new Error(`Failed to remove from navigation: ${delError.message}`)
      } else if (!wasInNav && isInNav) {
        // Add to nav
        const { data: maxPos } = await supabaseAdmin
          .from('navigation_items')
          .select('position')
          .order('position', { ascending: false })
          .limit(1)

        const nextPos = (maxPos && maxPos.length > 0) ? (maxPos[0]?.position ?? 0) + 1 : 0

        const { error: insError } = await supabaseAdmin.from('navigation_items').insert({
          type: 'category',
          label: data.name,
          category_id: id,
          position: nextPos,
          visible: true,
          url: null,
        })
        if (insError) throw new Error(`Failed to add to navigation: ${insError.message}`)
      } else if (isInNav && nameChanged) {
        // Update label in nav if name changed
        const { error: updError } = await supabaseAdmin
          .from('navigation_items')
          .update({ label: data.name })
          .eq('category_id', id)
        if (updError) throw new Error(`Failed to update navigation label: ${updError.message}`)
      }
    }

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
    revalidatePath('/admin/navigation')
    revalidatePath('/')
    revalidatePath('/shop')
    redirect('/admin/categories?toast=success&msg=Category+updated')
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Validation failed' }
  }
}

export async function deleteCategory(id: number) {
  try {
    // Remove from navigation_items first (with error check)
    const { error: navError } = await supabaseAdmin
      .from('navigation_items')
      .delete()
      .eq('category_id', id)

    if (navError) throw new Error(`Failed to remove from navigation: ${navError.message}`)

    // Delete the category
    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id)

    revalidatePath('/admin/categories')
    revalidatePath('/admin/navigation')
    revalidatePath('/')
    revalidatePath('/shop')

    if (error) throw new Error(error.message)
    redirect('/admin/categories?toast=success&msg=Category+deleted')
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to delete category'
    redirect(`/admin/categories?toast=error&msg=${encodeURIComponent(msg)}`)
  }
}

export async function toggleCategoryNav(id: number, current: boolean) {
  try {
    // First, get the category name
    const { data: category, error: catError } = await supabaseAdmin
      .from('categories')
      .select('name')
      .eq('id', id)
      .maybeSingle()

    if (catError || !category) throw new Error('Category not found')

    const newValue = !current

    // Update category visibility
    const { error: updateError } = await supabaseAdmin
      .from('categories')
      .update({ show_in_nav: newValue })
      .eq('id', id)

    if (updateError) throw new Error(updateError.message)

    // Sync with navigation_items table
    if (newValue) {
      // Show in nav: check if exists in navigation_items, if not add it
      const { data: existing } = await supabaseAdmin
        .from('navigation_items')
        .select('id')
        .eq('category_id', id)
        .maybeSingle()

      if (!existing) {
        // Get next available position
        const { data: maxPos } = await supabaseAdmin
          .from('navigation_items')
          .select('position')
          .order('position', { ascending: false })
          .limit(1)

        const nextPos = (maxPos && maxPos.length > 0) ? (maxPos[0]?.position ?? 0) + 1 : 0

        const { error: insError } = await supabaseAdmin.from('navigation_items').insert({
          type: 'category',
          label: category.name,
          category_id: id,
          position: nextPos,
          visible: true,
          url: null,
        })
        if (insError) throw new Error(`Failed to add to navigation: ${insError.message}`)
      }
    } else {
      // Hide from nav: remove from navigation_items
      const { error: delError } = await supabaseAdmin
        .from('navigation_items')
        .delete()
        .eq('category_id', id)
      if (delError) throw new Error(`Failed to remove from navigation: ${delError.message}`)
    }

    revalidatePath('/admin/categories')
    revalidatePath('/admin/navigation')
    revalidatePath('/')
    revalidatePath('/shop')
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to update category'
    redirect(`/admin/categories?toast=error&msg=${encodeURIComponent(msg)}`)
  }
}
