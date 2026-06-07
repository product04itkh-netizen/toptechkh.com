import { supabase } from '@/lib/supabase'
import HeroBannerCarousel, { BannerSlide } from './HeroBannerCarousel'

const STATIC_FALLBACK: BannerSlide[] = [
  { id: -1, image_url: '/banner-main.png',     link_url: '/shop' },
  { id: -2, image_url: '/banner-asus-aio.png', link_url: '/shop?category=pc&q=all-in-one' },
  { id: -3, image_url: '/banner-pc-build.jpg', link_url: '/shop?category=pc' },
]

export default async function HeroBanner() {
  const { data } = await supabase
    .from('banners')
    .select('id, image_url, link_url')
    .eq('active', true)
    .order('sort_order')

  const slides: BannerSlide[] =
    data && data.length > 0
      ? data.map((b) => ({ id: b.id, image_url: b.image_url, link_url: b.link_url }))
      : STATIC_FALLBACK

  return <HeroBannerCarousel slides={slides} />
}
