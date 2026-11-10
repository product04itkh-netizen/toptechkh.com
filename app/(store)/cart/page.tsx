import CartClient from '@/components/cart/CartClient'
import { getSiteSettings } from '@/lib/site-settings'

export default async function CartPage() {
  const site = await getSiteSettings()
  return <CartClient shipping={site.shipping} />
}
