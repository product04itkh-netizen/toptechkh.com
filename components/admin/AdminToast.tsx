'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { CheckCircle2, XCircle, X } from 'lucide-react'

function ToastInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    const type = searchParams.get('toast') as 'success' | 'error' | null
    const msg = searchParams.get('msg')
    if (type && msg) {
      setToast({ type, msg })
      const params = new URLSearchParams(searchParams.toString())
      params.delete('toast')
      params.delete('msg')
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }
  }, [searchParams, pathname, router])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  if (!toast) return null

  const ok = toast.type === 'success'
  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-semibold max-w-xs transition-all ${
        ok ? 'bg-white border-green-200 text-green-800' : 'bg-white border-red-200 text-red-800'
      }`}
    >
      {ok
        ? <CheckCircle2 size={17} className="text-green-500 flex-shrink-0" />
        : <XCircle size={17} className="text-red-500 flex-shrink-0" />
      }
      <span className="flex-1 leading-snug">{toast.msg}</span>
      <button
        onClick={() => setToast(null)}
        className="opacity-40 hover:opacity-70 transition-opacity ml-1 flex-shrink-0"
      >
        <X size={13} />
      </button>
    </div>
  )
}

export default function AdminToast() {
  return (
    <Suspense>
      <ToastInner />
    </Suspense>
  )
}
