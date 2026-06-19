'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export async function loginAction(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Email and password are required' }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return { error: 'Invalid email or password' }
  }

  const cookieStore = await cookies()
  const sessionHours = parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT_HOURS || '8')
  cookieStore.set('admin_session', data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * sessionHours,
    path: '/',
  })

  redirect('/admin/dashboard')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}
