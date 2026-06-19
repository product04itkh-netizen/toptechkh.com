'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function addBanner(_: unknown, formData: FormData) {
  const image_url = (formData.get('image_url') as string)?.split('\n')[0]?.trim()
  const link_url = (formData.get('link_url') as string)?.trim() || '/shop'

  if (!image_url) return { error: 'Please upload a banner image.' }

  const { data: last, error: orderError } = await supabaseAdmin
    .from('banners')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (orderError) console.error('Banner order fetch error:', orderError)
  const sort_order = (last?.sort_order ?? -1) + 1

  const { error } = await supabaseAdmin.from('banners').insert({ image_url, link_url, sort_order })
  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/banners')
  return { error: null }
}

export async function deleteBanner(id: number) {
  const { error } = await supabaseAdmin.from('banners').delete().eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin/banners')
  if (error) redirect('/admin/banners?toast=error&msg=Failed+to+delete+banner')
  redirect('/admin/banners?toast=success&msg=Banner+deleted')
}

export async function moveBanner(id: number, direction: 'up' | 'down') {
  const { data: all } = await supabaseAdmin
    .from('banners')
    .select('id, sort_order')
    .order('sort_order')

  if (!all) return
  const idx = all.findIndex((b) => b.id === id)
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= all.length) return

  const a = all[idx]
  const b = all[swapIdx]

  const [r1, r2] = await Promise.all([
    supabaseAdmin.from('banners').update({ sort_order: b.sort_order }).eq('id', a.id),
    supabaseAdmin.from('banners').update({ sort_order: a.sort_order }).eq('id', b.id),
  ])

  revalidatePath('/')
  revalidatePath('/admin/banners')
  if (r1.error || r2.error) redirect('/admin/banners?toast=error&msg=Failed+to+reorder+banners')
}

export async function toggleBannerActive(id: number, active: boolean) {
  const { error } = await supabaseAdmin.from('banners').update({ active }).eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin/banners')
  if (error) redirect('/admin/banners?toast=error&msg=Failed+to+update+banner')
}

export async function updateBannerLink(id: number, link_url: string) {
  const { error } = await supabaseAdmin.from('banners').update({ link_url }).eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin/banners')
  if (error) redirect('/admin/banners?toast=error&msg=Failed+to+update+banner+link')
}
