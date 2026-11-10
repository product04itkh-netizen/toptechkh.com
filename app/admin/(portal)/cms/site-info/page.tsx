import { supabaseAdmin } from '@/lib/supabase-admin'
import { mergeSiteSettings } from '@/lib/site-settings'
import { SITE_INFO_KEY } from '@/lib/site-settings-schema'
import { updateSiteSettings } from '../actions'
import SiteInfoForm from './SiteInfoForm'

export default async function SiteInfoPage() {
  const { data, error } = await supabaseAdmin
    .from('cms_settings')
    .select('value')
    .eq('key', SITE_INFO_KEY)
    .maybeSingle()

  if (error) console.error('Site info fetch error:', error)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#021523]">Site Info</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">
          Contact details, footer, product-page trust badges, shipping rule and homepage wording. Changes appear on the storefront after saving.
        </p>
      </div>
      <SiteInfoForm action={updateSiteSettings} initial={mergeSiteSettings(data?.value)} />
    </div>
  )
}
