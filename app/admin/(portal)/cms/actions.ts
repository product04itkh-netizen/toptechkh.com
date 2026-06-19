'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { CmsSectionType, CmsSectionStyles } from '@/lib/cms-types'

// ── PAGES ────────────────────────────────────────────────────

export async function createPage(_: unknown, formData: FormData) {
  const title = (formData.get('title') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const status = formData.get('status') as 'draft' | 'published'

  if (!title || !slug) return { error: 'Title and slug are required.' }

  const { error } = await supabaseAdmin
    .from('cms_pages')
    .insert({ title, slug, status: status ?? 'draft' })

  if (error) return { error: error.message }

  revalidatePath('/admin/cms')
  revalidatePath('/')
  redirect('/admin/cms?toast=success&msg=Page+created')
}

export async function updatePage(_: unknown, formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const title = (formData.get('title') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const status = formData.get('status') as 'draft' | 'published'

  if (!title || !slug) return { error: 'Title and slug are required.' }

  const { error } = await supabaseAdmin
    .from('cms_pages')
    .update({ title, slug, status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/cms')
  revalidatePath('/')
  redirect('/admin/cms?toast=success&msg=Page+updated')
}

export async function deletePage(id: number) {
  const { error } = await supabaseAdmin.from('cms_pages').delete().eq('id', id)
  revalidatePath('/admin/cms')
  revalidatePath('/')
  if (error) redirect('/admin/cms?toast=error&msg=Failed+to+delete+page')
  redirect('/admin/cms?toast=success&msg=Page+deleted')
}

export async function togglePageStatus(id: number, currentStatus: string) {
  const next = currentStatus === 'published' ? 'draft' : 'published'
  const { error } = await supabaseAdmin
    .from('cms_pages')
    .update({ status: next, updated_at: new Date().toISOString() })
    .eq('id', id)
  revalidatePath('/admin/cms')
  revalidatePath('/')
  if (error) redirect('/admin/cms?toast=error&msg=Failed+to+update+page+status')
}

// ── SECTIONS ─────────────────────────────────────────────────

function parseStyles(formData: FormData): CmsSectionStyles {
  const get = (k: string) => (formData.get(k) as string | null) ?? undefined
  return {
    fontFamily:      get('style_fontFamily'),
    fontSize:        get('style_fontSize'),
    fontWeight:      get('style_fontWeight'),
    color:           get('style_color'),
    textAlign:       get('style_textAlign') as CmsSectionStyles['textAlign'],
    backgroundColor: get('style_backgroundColor'),
    paddingTop:      get('style_paddingTop'),
    paddingBottom:   get('style_paddingBottom'),
    paddingLeft:     get('style_paddingLeft'),
    paddingRight:    get('style_paddingRight'),
  }
}

function parseContent(type: CmsSectionType, formData: FormData): Record<string, unknown> {
  const get = (k: string) => (formData.get(k) as string | null) ?? undefined

  switch (type) {
    case 'hero':
      return {
        title:           get('c_title'),
        subtitle:        get('c_subtitle'),
        ctaText:         get('c_ctaText'),
        ctaUrl:          get('c_ctaUrl'),
        ctaColor:        get('c_ctaColor'),
        backgroundImage: get('c_backgroundImage'),
        backgroundColor: get('c_backgroundColor'),
        overlayOpacity:  get('c_overlayOpacity'),
        titleColor:      get('c_titleColor'),
        subtitleColor:   get('c_subtitleColor'),
      }
    case 'banner':
      return {
        title:         get('c_title'),
        subtitle:      get('c_subtitle'),
        imageUrl:      get('c_imageUrl'),
        linkUrl:       get('c_linkUrl'),
        imagePosition: get('c_imagePosition'),
        badge:         get('c_badge'),
        titleColor:    get('c_titleColor'),
        subtitleColor: get('c_subtitleColor'),
        backgroundColor: get('c_backgroundColor'),
      }
    case 'heading':
      return {
        text:    get('c_text'),
        tag:     get('c_tag'),
        subtext: get('c_subtext'),
      }
    case 'rich_text':
      return { html: get('c_html') }
    case 'image':
      return {
        imageUrl: get('c_imageUrl'),
        altText:  get('c_altText'),
        caption:  get('c_caption'),
        linkUrl:  get('c_linkUrl'),
        maxWidth: get('c_maxWidth'),
      }
    case 'cta':
      return {
        title:           get('c_title'),
        subtitle:        get('c_subtitle'),
        buttonText:      get('c_buttonText'),
        buttonUrl:       get('c_buttonUrl'),
        buttonColor:     get('c_buttonColor'),
        buttonTextColor: get('c_buttonTextColor'),
        backgroundColor: get('c_backgroundColor'),
        titleColor:      get('c_titleColor'),
        subtitleColor:   get('c_subtitleColor'),
      }
    case 'spacer':
      return { height: get('c_height') }
    case 'product_grid':
      return {
        title:        get('c_title'),
        badge:        get('c_badge'),
        subtitle:     get('c_subtitle'),
        queryType:    get('c_queryType'),
        categorySlug: get('c_categorySlug'),
        limit:        get('c_limit'),
        viewAllUrl:   get('c_viewAllUrl'),
        viewAllLabel: get('c_viewAllLabel'),
      }
    default:
      return {}
  }
}

export async function createSection(_: unknown, formData: FormData) {
  const page_id = parseInt(formData.get('page_id') as string)
  const type = formData.get('type') as CmsSectionType

  if (!page_id || !type) return { error: 'page_id and type are required.' }

  const { data: last, error: orderError } = await supabaseAdmin
    .from('cms_sections')
    .select('order_index')
    .eq('page_id', page_id)
    .order('order_index', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (orderError) console.error('Order index fetch error:', orderError)
  const order_index = (last?.order_index ?? -1) + 1
  const content = parseContent(type, formData)
  const styles  = parseStyles(formData)

  const { error } = await supabaseAdmin
    .from('cms_sections')
    .insert({ page_id, type, order_index, content, styles })

  if (error) return { error: error.message }

  revalidatePath(`/admin/cms/${page_id}`)
  revalidatePath('/')
  redirect(`/admin/cms/${page_id}?toast=success&msg=Section+added`)
}

export async function updateSection(_: unknown, formData: FormData) {
  const id      = parseInt(formData.get('id') as string)
  const page_id = parseInt(formData.get('page_id') as string)
  const type    = formData.get('type') as CmsSectionType

  const content = parseContent(type, formData)
  const styles  = parseStyles(formData)

  const { error } = await supabaseAdmin
    .from('cms_sections')
    .update({ content, styles })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/admin/cms/${page_id}`)
  revalidatePath('/')
  redirect(`/admin/cms/${page_id}?toast=success&msg=Section+updated`)
}

export async function deleteSection(id: number, pageId: number) {
  const { error } = await supabaseAdmin.from('cms_sections').delete().eq('id', id)
  revalidatePath(`/admin/cms/${pageId}`)
  revalidatePath('/')
  if (error) redirect(`/admin/cms/${pageId}?toast=error&msg=Failed+to+delete+section`)
  redirect(`/admin/cms/${pageId}?toast=success&msg=Section+deleted`)
}

export async function toggleSectionVisible(id: number, current: boolean, pageId: number) {
  const { error } = await supabaseAdmin.from('cms_sections').update({ visible: !current }).eq('id', id)
  revalidatePath(`/admin/cms/${pageId}`)
  revalidatePath('/')
  if (error) redirect(`/admin/cms/${pageId}?toast=error&msg=Failed+to+update+section`)
}

export async function moveSection(id: number, direction: 'up' | 'down', pageId: number) {
  const { data: sections } = await supabaseAdmin
    .from('cms_sections')
    .select('id, order_index')
    .eq('page_id', pageId)
    .order('order_index')

  if (!sections) return

  const idx = sections.findIndex((s) => s.id === id)
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= sections.length) return

  const a = sections[idx]
  const b = sections[swapIdx]

  const [r1, r2] = await Promise.all([
    supabaseAdmin.from('cms_sections').update({ order_index: b.order_index }).eq('id', a.id),
    supabaseAdmin.from('cms_sections').update({ order_index: a.order_index }).eq('id', b.id),
  ])

  revalidatePath(`/admin/cms/${pageId}`)
  if (r1.error || r2.error) redirect(`/admin/cms/${pageId}?toast=error&msg=Failed+to+reorder+sections`)
}

// ── GLOBAL SETTINGS ──────────────────────────────────────────

export async function updateGlobalSettings(_: unknown, formData: FormData) {
  const get = (k: string) => (formData.get(k) as string) || ''

  const value = {
    fontFamily:        get('fontFamily'),
    headingFontFamily: get('headingFontFamily'),
    baseFontSize:      get('baseFontSize'),
    headingColor:      get('headingColor'),
    bodyColor:         get('bodyColor'),
    primaryColor:      get('primaryColor'),
    accentColor:       get('accentColor'),
  }

  const { error } = await supabaseAdmin
    .from('cms_settings')
    .upsert({ key: 'global_typography', value, updated_at: new Date().toISOString() })

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/cms/settings')
  redirect('/admin/cms/settings?toast=success&msg=Settings+saved')
}
