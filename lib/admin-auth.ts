import { createClient } from '@supabase/supabase-js'

/** Cookie set by app/admin/login/actions.ts (value = Supabase access token). */
export const ADMIN_COOKIE = 'admin_session'

/**
 * Verify an admin access token with Supabase Auth.
 *
 * Presence of the cookie proves nothing: the token must be a live Supabase session.
 * Optional allowlist: ADMIN_EMAILS="a@x.com,b@y.com". When unset, any valid Supabase
 * session counts as admin (the project currently has a single auth user).
 *
 * Kept free of next/headers so proxy.ts can import it.
 */
export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false

  const auth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
  )

  const { data, error } = await auth.auth.getUser(token)
  if (error || !data.user) return false

  const allowlist = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  if (allowlist.length > 0 && !allowlist.includes((data.user.email ?? '').toLowerCase())) return false

  return true
}
