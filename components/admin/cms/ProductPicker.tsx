'use client'

import { useEffect, useState } from 'react'
import { searchProducts } from '@/app/admin/(portal)/cms/actions'

export interface PickedProduct {
  id: number
  name: string
  sku: string | null
}

interface Props {
  selected: PickedProduct[]
  onChange: (next: PickedProduct[]) => void
  max?: number
}

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'

export default function ProductPicker({ selected, onChange, max = 24 }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PickedProduct[]>([])
  const [searching, setSearching] = useState(false)

  // Debounced search against the products table (name or SKU, which carries the model)
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([])
        setSearching(false)
        return
      }
      setSearching(true)
      const rows = await searchProducts(query)
      if (!cancelled) {
        setResults(rows)
        setSearching(false)
      }
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  const isPicked = (id: number) => selected.some((p) => p.id === id)

  const add = (p: PickedProduct) => {
    if (isPicked(p.id) || selected.length >= max) return
    onChange([...selected, p])
  }

  const remove = (id: number) => onChange(selected.filter((p) => p.id !== id))

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir
    if (j < 0 || j >= selected.length) return
    const next = [...selected]
    ;[next[idx], next[j]] = [next[j], next[idx]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, model or SKU, e.g. TUF A15"
          className={inputCls}
        />
        {query.trim().length >= 2 && (
          <div className="mt-2 border border-[#e5e8ec] rounded-lg max-h-56 overflow-y-auto bg-white">
            {searching && <p className="px-3 py-2 text-xs text-[#818ea0]">Searching…</p>}
            {!searching && results.length === 0 && (
              <p className="px-3 py-2 text-xs text-[#818ea0]">No products match “{query.trim()}”.</p>
            )}
            {!searching && results.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => add(p)}
                disabled={isPicked(p.id) || selected.length >= max}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[#f2f3f5] disabled:text-[#c5ccd5] disabled:hover:bg-white flex justify-between gap-3"
              >
                <span className="truncate">{p.name}</span>
                <span className="text-xs text-[#818ea0] flex-shrink-0">
                  {isPicked(p.id) ? 'Added' : p.sku ?? ''}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-[#021523] mb-1.5">
          Selected products ({selected.length}/{max})
        </p>
        {selected.length === 0 ? (
          <p className="text-xs text-[#818ea0]">None yet. Search above and click a product to add it.</p>
        ) : (
          <ul className="border border-[#e5e8ec] rounded-lg divide-y divide-[#e5e8ec] bg-white">
            {selected.map((p, idx) => (
              <li key={p.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                <span className="text-xs text-[#818ea0] w-5">{idx + 1}.</span>
                <span className="flex-1 truncate">{p.name}</span>
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0}
                  className="text-xs text-[#818ea0] hover:text-[#041e42] disabled:opacity-30 px-1">↑</button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === selected.length - 1}
                  className="text-xs text-[#818ea0] hover:text-[#041e42] disabled:opacity-30 px-1">↓</button>
                <button type="button" onClick={() => remove(p.id)}
                  className="text-xs text-[#ef262c] hover:underline px-1">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
