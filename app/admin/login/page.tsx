'use client'

import { useActionState } from 'react'
import Image from 'next/image'
import { loginAction } from './actions'

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, null)

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image src="/top-tech-logo.png" alt="Top Tech" width={72} height={72} className="rounded-full mb-3" />
          <h1 className="text-xl font-black text-[#041e42]">Top Tech Computer</h1>
          <p className="text-sm text-[#818ea0]">Admin Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e8ec] p-8">
          <h2 className="text-lg font-bold text-[#021523] mb-6">Sign In</h2>
          <form action={action} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#021523] mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42] transition-colors"
                placeholder="admin@toptech.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#021523] mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42] transition-colors"
                placeholder="••••••••"
              />
            </div>
            {state?.error && (
              <div className="text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {state.error}
              </div>
            )}
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
            >
              {pending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#818ea0] mt-6">Top Tech Computer — Admin Access Only</p>
      </div>
    </div>
  )
}
