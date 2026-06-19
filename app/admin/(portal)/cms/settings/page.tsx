import { supabaseAdmin } from '@/lib/supabase-admin'
import CmsSettingsForm from './CmsSettingsForm'

export const metadata = { title: 'Site Style — Admin' }

export default async function CmsSettingsPage() {
  const { data, error } = await supabaseAdmin
    .from('cms_settings')
    .select('value')
    .eq('key', 'global_typography')
    .maybeSingle()

  if (error) console.error('CMS settings fetch error:', error)
  const saved = (data?.value ?? {}) as Record<string, string>

  return <CmsSettingsForm saved={saved} />
}
