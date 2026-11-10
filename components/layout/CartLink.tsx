'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

// "Has hydrated" without an effect: false on the server, true in the browser.
// The cart lives in localStorage, so the count must not render before hydration.
const subscribeNever = () => () => {}

export default function CartLink() {
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false)
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const shown = mounted ? count : 0

  return (
    <Link
      href="/cart"
      aria-label={shown > 0 ? `Cart, ${shown} ${shown === 1 ? 'item' : 'items'}` : 'Cart'}
      className="relative ml-auto sm:ml-0 flex-shrink-0 p-2 text-[#041e42] hover:bg-[#f2f3f5] rounded-full transition-colors"
    >
      <ShoppingCart size={22} />
      {shown > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#c81e25] text-white text-[11px] font-bold leading-[18px] text-center tabular-nums">
          {shown > 99 ? '99+' : shown}
        </span>
      )}
    </Link>
  )
}
