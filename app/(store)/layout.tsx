import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<div className="h-[68px] w-full bg-white border-b border-[#e5e8ec] shadow-sm" />}>
        <Header />
      </Suspense>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
