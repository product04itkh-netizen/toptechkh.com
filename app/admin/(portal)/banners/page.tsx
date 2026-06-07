import Image from 'next/image'
import { ChevronUp, ChevronDown, Trash2, Eye, EyeOff } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import BannerAddForm from './BannerAddForm'
import { deleteBanner, moveBanner, toggleBannerActive } from './actions'

export const metadata = { title: 'Manage Banners — Admin' }

export default async function BannersPage() {
  const { data: banners } = await supabaseAdmin
    .from('banners')
    .select('*')
    .order('sort_order')

  let list = banners ?? []

  // Auto-seed the 3 built-in static banners so they're manageable from the admin
  if (list.length === 0) {
    await supabaseAdmin.from('banners').insert([
      { image_url: '/banner-main.png',     link_url: '/shop',                        sort_order: 0 },
      { image_url: '/banner-asus-aio.png', link_url: '/shop?category=pc&q=all-in-one', sort_order: 1 },
      { image_url: '/banner-pc-build.jpg', link_url: '/shop?category=pc',            sort_order: 2 },
    ])
    const { data: seeded } = await supabaseAdmin.from('banners').select('*').order('sort_order')
    list = seeded ?? []
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">Admin / Banners</div>
        <h1 className="text-2xl font-black text-[#021523]">Hero Banners</h1>
        <p className="text-sm text-[#818ea0] mt-1">Manage the carousel banners shown on the homepage.</p>
      </div>

      {/* Existing banners */}
      {list.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e5e8ec] mb-6 overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e5e8ec] bg-[#f7f8fa]">
            <span className="text-sm font-bold text-[#021523]">{list.length} Banner{list.length !== 1 ? 's' : ''}</span>
          </div>

          <ul className="divide-y divide-[#f2f3f5]">
            {list.map((banner, i) => (
              <li key={banner.id} className={`flex items-center gap-4 px-5 py-4 ${!banner.active ? 'opacity-50' : ''}`}>
                {/* Thumbnail */}
                <div className="relative w-36 h-20 rounded-lg overflow-hidden bg-[#f2f3f5] flex-shrink-0">
                  <Image src={banner.image_url} alt="Banner" fill className="object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#041e42] bg-[#eef2ff] px-2 py-0.5 rounded">
                      #{i + 1}
                    </span>
                    {banner.active ? (
                      <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded">Active</span>
                    ) : (
                      <span className="text-xs font-semibold text-[#818ea0] bg-[#f2f3f5] border border-[#e5e8ec] px-2 py-0.5 rounded">Hidden</span>
                    )}
                  </div>
                  <p className="text-xs text-[#818ea0] truncate">Link: <span className="text-[#021523]">{banner.link_url}</span></p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Move up */}
                  <form action={async () => { 'use server'; await moveBanner(banner.id, 'up') }}>
                    <button
                      type="submit"
                      disabled={i === 0}
                      title="Move up"
                      className="p-1.5 rounded-lg text-[#818ea0] hover:text-[#041e42] hover:bg-[#f2f3f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronUp size={16} />
                    </button>
                  </form>

                  {/* Move down */}
                  <form action={async () => { 'use server'; await moveBanner(banner.id, 'down') }}>
                    <button
                      type="submit"
                      disabled={i === list.length - 1}
                      title="Move down"
                      className="p-1.5 rounded-lg text-[#818ea0] hover:text-[#041e42] hover:bg-[#f2f3f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </form>

                  {/* Toggle active */}
                  <form action={async () => { 'use server'; await toggleBannerActive(banner.id, !banner.active) }}>
                    <button
                      type="submit"
                      title={banner.active ? 'Hide banner' : 'Show banner'}
                      className="p-1.5 rounded-lg text-[#818ea0] hover:text-[#041e42] hover:bg-[#f2f3f5] transition-colors"
                    >
                      {banner.active ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </form>

                  {/* Delete */}
                  <form action={async () => { 'use server'; await deleteBanner(banner.id) }}>
                    <button
                      type="submit"
                      title="Delete banner"
                      className="p-1.5 rounded-lg text-[#818ea0] hover:text-[#ef262c] hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {list.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-[#c5ccd5] p-10 text-center mb-6">
          <p className="text-[#818ea0] text-sm">No banners yet. Add your first banner below.</p>
        </div>
      )}

      {/* Add form */}
      <BannerAddForm />
    </div>
  )
}
