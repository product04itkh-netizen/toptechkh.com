'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import Button from '@/components/ui/Button'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCartStore()
  const total = totalPrice()
  const count = totalItems()

  if (count === 0) {
    return (
      <div className="max-w-[1290px] mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-[#e5e8ec] mb-4" />
        <h1 className="text-2xl font-black text-[#021523] mb-2">Your cart is empty</h1>
        <p className="text-[#818ea0] mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop"><Button size="lg">Continue Shopping</Button></Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1290px] mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/shop" className="flex items-center gap-1 text-sm text-[#818ea0] hover:text-[#041e42]">
          <ArrowLeft size={14} /> Continue Shopping
        </Link>
        <h1 className="text-2xl font-black text-[#021523]">Shopping Cart ({count})</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => {
            const price = product.sale_price ?? product.price
            return (
              <div key={product.id} className="bg-white border border-[#e5e8ec] rounded-lg p-4 flex gap-4">
                <Link href={`/product/${product.slug}`} className="flex-shrink-0">
                  <div className="relative w-20 h-20 bg-[#f2f3f5] rounded-lg overflow-hidden">
                    <Image src="/top-tech-logo.png" alt={product.name} fill className="object-contain p-2" />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-sm font-semibold text-[#021523] hover:text-[#0070dc] line-clamp-2">{product.name}</h3>
                    </Link>
                    <button onClick={() => removeItem(product.id)} className="flex-shrink-0 text-[#818ea0] hover:text-[#ef262c]">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {product.brand && <p className="text-xs text-[#818ea0] mt-0.5">{product.brand.name}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#e5e8ec] rounded-md overflow-hidden">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2.5 py-1 hover:bg-[#f2f3f5] font-bold text-sm">−</button>
                      <span className="px-3 py-1 text-sm font-semibold border-x border-[#e5e8ec]">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2.5 py-1 hover:bg-[#f2f3f5] font-bold text-sm">+</button>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#021523]">${(price * quantity).toFixed(2)}</div>
                      {quantity > 1 && <div className="text-xs text-[#818ea0]">${price.toFixed(2)} each</div>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <button onClick={clearCart} className="text-sm text-[#818ea0] hover:text-[#ef262c]">Clear cart</button>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#e5e8ec] rounded-lg p-5 sticky top-24">
            <h2 className="font-bold text-[#021523] mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#818ea0]">Subtotal ({count} items)</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#818ea0]">Shipping</span>
                <span className="font-semibold text-[#00a046]">{total >= 50 ? 'Free' : '$5.00'}</span>
              </div>
            </div>
            <div className="border-t border-[#e5e8ec] mt-4 pt-4">
              <div className="flex justify-between font-black text-lg text-[#021523] mb-4">
                <span>Total</span>
                <span>${(total + (total >= 50 ? 0 : 5)).toFixed(2)}</span>
              </div>
              <Button fullWidth size="lg">Proceed to Checkout</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
