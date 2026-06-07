'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AlertTriangle, Check, ShoppingCart, Trash2, Wrench } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCartStore } from '@/lib/cart-store'

// ─── Slot definitions ────────────────────────────────────────────────────────
// ORDER MATTERS: products are assigned to the first slot that matches (exclusive).
// Put the most specific slots first so broad terms don't steal products.

interface Slot {
  id: string
  label: string
  icon: string
  keywords: string[] // matched against product NAME only (lowercase)
}

const SLOTS: Slot[] = [
  {
    id: 'cpu',
    label: 'Processor (CPU)',
    icon: '⚡',
    keywords: [
      'intel core', 'core i3', 'core i5', 'core i7', 'core i9', 'core ultra',
      'i3-', 'i5-', 'i7-', 'i9-',
      'ryzen 3', 'ryzen 5', 'ryzen 7', 'ryzen 9', 'ryzen threadripper', 'threadripper',
      'athlon gold', 'athlon silver', 'celeron g', 'pentium gold',
    ],
  },
  {
    id: 'gpu',
    label: 'Graphics Card (GPU)',
    icon: '🎮',
    keywords: [
      // Branded GeForce lines
      'geforce rtx', 'geforce gtx', 'geforce gt',
      // NVIDIA model numbers
      'rtx 40', 'rtx 30', 'rtx 20',
      'gtx 16', 'gtx 10', 'gtx 9',
      // Low-end GT series (no "GeForce" prefix in some product names)
      'gt 710', 'gt 730', 'gt 1030', 'gt 1650',
      // AMD Radeon
      'radeon rx', 'radeon r9', 'radeon r7', 'radeon r5',
      'rx 9700', 'rx 9600',
      'rx 7900', 'rx 7800', 'rx 7700', 'rx 7600',
      'rx 6900', 'rx 6800', 'rx 6700', 'rx 6600', 'rx 6500', 'rx 6400',
      'rx 5700', 'rx 5600', 'rx 5500',
      // Intel Arc
      'arc a380', 'arc a580', 'arc a750', 'arc a770',
      // Generic
      'graphics card', 'video card',
    ],
  },
  {
    id: 'motherboard',
    label: 'Motherboard',
    icon: '🔲',
    keywords: [
      'motherboard', 'mainboard',
      // Intel chipsets (covers H310–H670, B360–B760, Z370–Z890)
      'h310', 'h370', 'h410', 'h470', 'h510', 'h570', 'h610', 'h670',
      'b360', 'b365', 'b460', 'b560', 'b660', 'b760',
      'z370', 'z390', 'z490', 'z590', 'z690', 'z790', 'z890',
      // AMD chipsets
      'a320', 'a520', 'a620',
      'b350', 'b450', 'b550', 'b650',
      'x370', 'x470', 'x570', 'x670', 'x870',
      // ASUS board series prefixes
      'prime h', 'prime b', 'prime x', 'prime z',
      'rog strix b', 'rog strix x', 'rog strix z',
      'proart b', 'proart z',
      // MSI board series
      'mag b', 'mag z', 'mag x',
      'mpg b', 'mpg z', 'mpg x',
      'meg z', 'meg x',
      'pro b', 'pro h', 'pro z',
      // Gigabyte
      'aorus elite', 'aorus pro', 'aorus master', 'aorus ultra',
      'ud b', 'ud h', 'ud z',
      // ASRock
      'fatal1ty', 'taichi', 'steel legend', 'phantom gaming',
    ],
  },
  {
    id: 'storage',
    label: 'Storage (SSD / HDD)',
    icon: '💿',
    keywords: [
      'nvme', 'm.2 ssd', 'pcie ssd', 'sata ssd',
      'hard disk', 'hard drive', ' hdd',
      // Samsung SSD lines
      '970 evo', '980 pro', '990 pro', '870 evo', '860 evo', '850 evo',
      // WD
      'wd blue', 'wd red', 'wd green', 'wd black', 'wd purple',
      // Seagate
      'barracuda', 'ironwolf', 'firecuda', 'skyhawk',
      // Crucial / ADATA
      'mx500', 'bx500', 'su800', 'su650',
      // Common size+type combos
      'tb ssd', 'gb ssd', 'tb hdd', 'tb nvme',
      // Catch generic "ssd" at end of name or with space
      ' ssd',
    ],
  },
  {
    id: 'psu',
    label: 'Power Supply (PSU)',
    icon: '🔌',
    keywords: [
      'power supply', 'psu',
      // Wattage in name
      '500w', '550w', '600w', '650w', '700w', '750w', '800w', '850w', '1000w', '1200w', '1600w',
      '500 watt', '550 watt', '600 watt', '650 watt', '750 watt', '850 watt',
      // Corsair RM / CX / TX
      'rm550', 'rm650', 'rm750', 'rm850', 'rm1000',
      'cx550', 'cx650', 'cx750', 'cx850',
      // Cooler Master
      'mwe gold', 'mwe bronze', 'mwe white',
      // Seasonic
      'focus gx', 'focus px', 'focus bm',
      // EVGA
      'evga 500', 'evga 600', 'evga 650', 'evga 750', 'evga 850',
    ],
  },
  {
    id: 'cooler',
    label: 'CPU Cooler',
    icon: '❄️',
    keywords: [
      'cpu cooler', 'cpu fan',
      'aio cooler', 'liquid cooler', 'air cooler', 'tower cooler',
      'heatsink',
      // Brand product lines (specific enough to only appear in cooler names)
      'hyper 212', 'hyper 620', 'hyper tx3',
      'noctua nh-',
      'arctic freezer', 'arctic liquid',
      'deepcool ak', 'deepcool ag', 'deepcool castle',
      'id-cooling se', 'id-cooling is', 'id-cooling dk',
      'thermalright peerless', 'thermalright assassin',
      'be quiet pure rock', 'be quiet dark rock',
      'corsair h60', 'corsair h100', 'corsair h150',
    ],
  },
  {
    id: 'ram',
    label: 'Memory (RAM)',
    icon: '💾',
    keywords: [
      // DDR generation with speed — precise enough to only match actual RAM product names
      'ddr4-', 'ddr5-', 'ddr3-',
      'ddr4 ', 'ddr5 ', 'ddr3 ',
      'lpddr4', 'lpddr5',
      'sodimm', 'so-dimm',
      // RAM brand product lines
      'vengeance ddr', 'vengeance lpx', 'vengeance rgb',
      'fury beast', 'fury renegade', 'fury impact',
      'trident z', 'ripjaws v', 'ripjaws 4', 'flare x',
      // Size+type combo (e.g. "16GB DDR4")
      ' gb ddr',
    ],
  },
  {
    id: 'case',
    label: 'PC Case',
    icon: '🖥️',
    keywords: [
      'pc case', 'atx case', 'matx case', 'micro-atx case', 'mini-itx case',
      'mid tower', 'full tower', 'mini tower',
      'gaming case', 'chassis',
      // Brand case product lines
      'darkflash', 'lancool', 'meshify', 'define r',
      'phanteks eclipse', 'fractal design',
      'lian li o11', 'lian li pc-o',
      'nzxt h510', 'nzxt h710',
    ],
  },
]

// ─── Matching: name only, exclusive (first match wins) ───────────────────────

function matchSlot(name: string, slot: Slot): boolean {
  const lower = name.toLowerCase()
  return slot.keywords.some((kw) => lower.includes(kw))
}

function buildSlotGroups(products: Product[]): Record<string, Product[]> {
  const groups: Record<string, Product[]> = {}
  for (const slot of SLOTS) groups[slot.id] = []

  for (const product of products) {
    // Find the FIRST slot that matches the product NAME (exclusive)
    for (const slot of SLOTS) {
      if (matchSlot(product.name, slot)) {
        groups[slot.id].push(product)
        break
      }
    }
    // Products that match nothing are silently ignored
  }
  return groups
}

// ─── Compatibility checking ──────────────────────────────────────────────────

interface CompatIssue {
  slots: string[]
  message: string
}

function checkCompatibility(selected: Record<string, Product | null>): CompatIssue[] {
  const issues: CompatIssue[] = []
  const cpu = selected.cpu
  const mb = selected.motherboard
  const ram = selected.ram

  if (cpu && mb) {
    const cpuN = cpu.name
    const mbN = mb.name

    const isIntelCpu = /\b(intel|core\s+i[3579]|i[3579]-\d|core\s+ultra|celeron|pentium)\b/i.test(cpuN)
    const isAmdCpu   = /\b(ryzen|athlon|threadripper)\b/i.test(cpuN)
    const isIntelMb  = /\b(h[34][17]0|h[45][17]0|h[56][17]0|h[67][17]0|b[3456][56]0|b[67][56]0|z[3-9]\d0)\b/i.test(mbN)
    const isAmdMb    = /\b([abx][3-8][0257]0)\b/i.test(mbN)

    if (isIntelCpu && isAmdMb) {
      issues.push({ slots: ['cpu', 'motherboard'], message: 'Intel CPU + AMD chipset — incompatible sockets' })
    } else if (isAmdCpu && isIntelMb) {
      issues.push({ slots: ['cpu', 'motherboard'], message: 'AMD CPU + Intel chipset — incompatible sockets' })
    } else if (isAmdCpu && isAmdMb) {
      // AM4 vs AM5
      const isRyzen7000 = /ryzen\s+[3579]\s+[789]\d{3}/i.test(cpuN)
      const isRyzen5000andBelow = /ryzen\s+[3579]\s+[1-6]\d{3}/i.test(cpuN)
      const isAm5Mb = /\b(b6[56]0|x6[57]0|a6[02]0|x8[57]0|b8[56]0)\b/i.test(mbN)
      const isAm4Mb = /\b([abx][3-5][057]0)\b/i.test(mbN)

      if (isRyzen7000 && isAm4Mb) {
        issues.push({ slots: ['cpu', 'motherboard'], message: 'Ryzen 7000+ requires AM5 — choose a B650 or X670 board' })
      } else if (isRyzen5000andBelow && isAm5Mb) {
        issues.push({ slots: ['cpu', 'motherboard'], message: 'Ryzen 5000 and below require AM4 — choose a B450, B550, or X570 board' })
      }
    } else if (isIntelCpu && isIntelMb) {
      // LGA1700 (12th–14th gen) vs LGA1200 (10th–11th gen)
      const is12to14Gen = /i[3579]-1[2-4]\d{3}|core\s+ultra/i.test(cpuN)
      const is10to11Gen = /i[3579]-1[01]\d{3}/i.test(cpuN)
      const isLga1700 = /\b(h6[17]0|b6[56]0|b7[56]0|z6[89]0|z7[89]0|h7[17]0)\b/i.test(mbN)
      const isLga1200 = /\b(h[45][17]0|b[45][56]0|z[45][89]0)\b/i.test(mbN)

      if (is12to14Gen && isLga1200) {
        issues.push({ slots: ['cpu', 'motherboard'], message: '12th–14th gen Intel requires LGA1700 (B660, Z690, B760, Z790)' })
      } else if (is10to11Gen && isLga1700) {
        issues.push({ slots: ['cpu', 'motherboard'], message: '10th–11th gen Intel requires LGA1200 (B460, Z490, B560, Z590)' })
      }
    }
  }

  if (ram && mb) {
    const ramN = ram.name
    const mbN  = mb.name
    const isDdr4Ram = /ddr4/i.test(ramN)
    const isDdr5Ram = /ddr5/i.test(ramN)
    // Board name suffix: D4 = DDR4, D5 = DDR5
    const isMbDdr4 = /\bd4\b/i.test(mbN) && !/\bd5\b/i.test(mbN)
    const isMbDdr5 = /\bd5\b/i.test(mbN)

    if (isDdr4Ram && isMbDdr5) {
      issues.push({ slots: ['ram', 'motherboard'], message: 'DDR4 RAM is not compatible with this DDR5 motherboard' })
    } else if (isDdr5Ram && isMbDdr4) {
      issues.push({ slots: ['ram', 'motherboard'], message: 'DDR5 RAM is not compatible with this DDR4 motherboard' })
    }
  }

  return issues
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PCBuilder({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Record<string, Product | null>>({})
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  const slotProducts = useMemo(() => buildSlotGroups(products), [products])

  const compatIssues = useMemo(() => checkCompatibility(selected), [selected])

  const totalPrice = useMemo(
    () => Object.values(selected).reduce((sum, p) => sum + (p ? (p.sale_price ?? p.price) : 0), 0),
    [selected],
  )

  const selectedParts = Object.values(selected).filter(Boolean) as Product[]

  const issueSlots = useMemo(() => {
    const s = new Set<string>()
    compatIssues.forEach((i) => i.slots.forEach((id) => s.add(id)))
    return s
  }, [compatIssues])

  const selectPart = (slotId: string, product: Product) =>
    setSelected((prev) => ({ ...prev, [slotId]: prev[slotId]?.id === product.id ? null : product }))

  const clearSlot = (slotId: string) => setSelected((prev) => ({ ...prev, [slotId]: null }))

  const handleAddAllToCart = () => {
    selectedParts.forEach((p) => addItem(p))
    setAdded(true)
    setTimeout(() => setAdded(false), 3000)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">

      {/* ── Left: component slots ── */}
      <div className="flex-1 min-w-0 space-y-8">
        {SLOTS.map((slot) => {
          const parts = slotProducts[slot.id]
          const chosenPart = selected[slot.id]
          const hasIssue = issueSlots.has(slot.id)

          return (
            <section key={slot.id} id={`slot-${slot.id}`}>
              {/* Slot header */}
              <div className={`flex items-center gap-2.5 mb-3 pb-2 border-b-2 ${hasIssue ? 'border-amber-400' : 'border-[#e5e8ec]'}`}>
                <span className="text-xl">{slot.icon}</span>
                <div className="flex-1">
                  <h2 className="text-base font-black text-[#021523] flex items-center gap-1.5">
                    {slot.label}
                    {hasIssue && <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />}
                  </h2>
                  {chosenPart && (
                    <p className="text-[11px] text-green-600 font-semibold flex items-center gap-1">
                      <Check size={10} /> {chosenPart.name}
                    </p>
                  )}
                </div>
                {chosenPart && (
                  <button onClick={() => clearSlot(slot.id)} className="text-[#818ea0] hover:text-[#ef262c] transition-colors p-1" title="Remove">
                    <Trash2 size={14} />
                  </button>
                )}
                {parts.length === 0 && (
                  <span className="text-xs text-[#c5ccd5] italic">No parts in stock</span>
                )}
              </div>

              {/* Horizontal scroll of product cards */}
              {parts.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                  {parts.map((product) => {
                    const isSelected = chosenPart?.id === product.id
                    const imageUrl = product.images?.find((u) => u.includes('supabase')) ?? null
                    const price = product.sale_price ?? product.price

                    return (
                      <button
                        key={product.id}
                        onClick={() => selectPart(slot.id, product)}
                        className={`snap-start flex-shrink-0 w-40 sm:w-44 rounded-xl border-2 p-2.5 text-left transition-all duration-150 ${
                          isSelected
                            ? 'border-[#041e42] bg-[#eef2ff] shadow-md ring-1 ring-[#041e42]/20'
                            : 'border-[#e5e8ec] bg-white hover:border-[#9aacbe] hover:shadow-sm'
                        }`}
                      >
                        {/* Image */}
                        <div className="relative h-24 sm:h-28 bg-[#f5f6f8] rounded-lg mb-2 overflow-hidden">
                          {imageUrl ? (
                            <Image src={imageUrl} alt={product.name} fill className="object-contain p-2" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#d1d9e0]">
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-[#041e42] rounded-full p-0.5">
                              <Check size={9} className="text-white" />
                            </div>
                          )}
                        </div>

                        {product.brand && (
                          <p className="text-[9px] font-bold text-[#041e42] uppercase tracking-wide mb-0.5 truncate">
                            {(product.brand as any).name}
                          </p>
                        )}
                        <p className="text-[11px] font-semibold text-[#021523] line-clamp-2 leading-snug mb-1.5 min-h-[2.5em]">
                          {product.name}
                        </p>

                        <div className="flex items-center justify-between gap-1">
                          <p className="text-sm font-black text-[#041e42]">${price.toFixed(2)}</p>
                          {product.sale_price && (
                            <p className="text-[10px] text-[#818ea0] line-through">${product.price.toFixed(2)}</p>
                          )}
                        </div>

                        <div className={`mt-1.5 text-center text-[10px] font-bold rounded-md py-1 transition-colors ${
                          isSelected
                            ? 'bg-[#041e42] text-white'
                            : 'bg-[#f2f3f5] text-[#818ea0]'
                        }`}>
                          {isSelected ? '✓ Selected' : 'Select'}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </section>
          )
        })}

        {products.length === 0 && (
          <div className="text-center py-16 text-[#818ea0]">
            <Wrench size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No components found.</p>
            <p className="text-sm mt-1">Add products to the &quot;Components&quot; category to build a PC.</p>
            <Link href="/shop?category=components" className="inline-block mt-4 text-sm text-[#0070dc] hover:underline">
              Browse Components →
            </Link>
          </div>
        )}
      </div>

      {/* ── Right: build summary (sticky) ── */}
      <div className="w-full lg:w-72 flex-shrink-0 order-first lg:order-last">
        <div className="lg:sticky lg:top-6 bg-white border border-[#e5e8ec] rounded-2xl overflow-hidden shadow-sm">

          {/* Header */}
          <div className="bg-[#041e42] px-4 py-3.5">
            <h3 className="font-black text-white flex items-center gap-2">
              <Wrench size={15} /> Your Build
            </h3>
            <p className="text-white/50 text-xs mt-0.5">
              {selectedParts.length} / {SLOTS.length} parts selected
            </p>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-[#f2f3f5]">
            <div
              className="h-full bg-[#ffbd27] transition-all duration-500"
              style={{ width: `${(selectedParts.length / SLOTS.length) * 100}%` }}
            />
          </div>

          {/* Parts list */}
          <div className="divide-y divide-[#f2f3f5]">
            {SLOTS.map((slot) => {
              const part = selected[slot.id]
              const hasIssue = issueSlots.has(slot.id) && !!part
              return (
                <div key={slot.id} className={`flex items-center gap-2.5 px-4 py-2.5 ${hasIssue ? 'bg-amber-50' : ''}`}>
                  <span className="text-base flex-shrink-0">{slot.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#818ea0] font-semibold uppercase tracking-wider">{slot.label}</p>
                    {part ? (
                      <div className="flex items-start justify-between gap-1 mt-0.5">
                        <p className={`text-[11px] font-semibold line-clamp-1 flex-1 ${hasIssue ? 'text-amber-700' : 'text-[#021523]'}`}>
                          {part.name}
                        </p>
                        <p className="text-[11px] font-black text-[#041e42] flex-shrink-0 ml-1">
                          ${(part.sale_price ?? part.price).toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#c5ccd5] mt-0.5">Not selected</p>
                    )}
                  </div>
                  {part && (
                    <button onClick={() => clearSlot(slot.id)} className="text-[#c5ccd5] hover:text-[#ef262c] flex-shrink-0 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Compatibility warnings */}
          {compatIssues.length > 0 && (
            <div className="border-t border-amber-200 bg-amber-50 px-4 py-3 space-y-2">
              <p className="text-[11px] font-bold text-amber-700 flex items-center gap-1.5">
                <AlertTriangle size={11} /> Compatibility Issues
              </p>
              {compatIssues.map((issue, i) => (
                <p key={i} className="text-[10px] text-amber-700 leading-snug">
                  ⚠ {issue.message}
                </p>
              ))}
            </div>
          )}

          {compatIssues.length === 0 && selectedParts.length >= 2 && (
            <div className="border-t border-green-100 bg-green-50 px-4 py-2.5">
              <p className="text-[11px] font-semibold text-green-700 flex items-center gap-1.5">
                <Check size={11} /> Parts look compatible
              </p>
            </div>
          )}

          {/* Total + CTA */}
          <div className="border-t border-[#e5e8ec] px-4 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#021523]">Estimated Total</span>
              <span className="text-xl font-black text-[#041e42]">
                {totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : '—'}
              </span>
            </div>

            <button
              onClick={handleAddAllToCart}
              disabled={selectedParts.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all"
            >
              {added ? (
                <><Check size={15} /> Added to Cart!</>
              ) : (
                <><ShoppingCart size={15} />
                  {selectedParts.length === 0 ? 'Select Parts to Continue' : `Add ${selectedParts.length} Parts to Cart`}
                </>
              )}
            </button>

            {selectedParts.length > 0 && (
              <button
                onClick={() => setSelected({})}
                className="w-full text-xs text-[#818ea0] hover:text-[#ef262c] transition-colors"
              >
                Clear build
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
