import { cache } from 'react'
import { supabase } from '@/lib/supabase'
import {
  DEFAULT_SITE_SETTINGS,
  SITE_INFO_KEY,
  siteSettingsSchema,
  type SiteSettings,
} from '@/lib/site-settings-schema'

/**
 * Merge a stored value over the defaults one section at a time, so a single invalid
 * or missing section falls back to its default instead of breaking the storefront.
 */
export function mergeSiteSettings(stored: unknown): SiteSettings {
  const source = (stored && typeof stored === 'object' ? stored : {}) as Record<string, unknown>
  const shape = siteSettingsSchema.shape
  const result = { ...DEFAULT_SITE_SETTINGS } as Record<string, unknown>

  for (const key of Object.keys(shape) as (keyof SiteSettings)[]) {
    if (source[key] === undefined) continue
    const parsed = shape[key].safeParse(source[key])
    if (parsed.success) result[key] = parsed.data
    else console.error(`Site info "${key}" is invalid, using defaults:`, parsed.error.issues[0]?.message)
  }

  return result as SiteSettings
}

/** Storefront read: once per request, never throws. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const { data, error } = await supabase
    .from('cms_settings')
    .select('value')
    .eq('key', SITE_INFO_KEY)
    .maybeSingle()

  if (error) console.error('Site info fetch error:', error)
  return mergeSiteSettings(data?.value)
})
