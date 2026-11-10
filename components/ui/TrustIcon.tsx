import { ShieldCheck, Truck, RotateCcw, Headphones, BadgeCheck, Clock, Gift, CreditCard } from 'lucide-react'
import type { TrustIconKey } from '@/lib/site-settings-schema'

const ICONS = {
  shield: ShieldCheck,
  truck: Truck,
  refresh: RotateCcw,
  headset: Headphones,
  badge: BadgeCheck,
  clock: Clock,
  gift: Gift,
  credit: CreditCard,
} as const

export default function TrustIcon({ name, size = 18, className }: { name: TrustIconKey; size?: number; className?: string }) {
  const Icon = ICONS[name] ?? ShieldCheck
  return <Icon size={size} className={className} />
}
