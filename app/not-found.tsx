import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-[1290px] mx-auto px-4 py-20 text-center">
      <div className="text-8xl font-black text-[#e5e8ec] mb-4">404</div>
      <h1 className="text-3xl font-black text-[#021523] mb-3">Page Not Found</h1>
      <p className="text-[#818ea0] mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/"
          className="bg-[#041e42] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#0a3060] transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/shop"
          className="border-2 border-[#041e42] text-[#041e42] font-semibold px-6 py-3 rounded-md hover:bg-[#041e42] hover:text-white transition-colors"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  )
}
