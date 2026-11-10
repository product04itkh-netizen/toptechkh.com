import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin-auth'

/**
 * Guard for server actions and admin server components.
 * Redirects to login unless the admin_session cookie is a valid Supabase session.
 * Call it first in every exported action: server actions can be POSTed to any route,
 * so the proxy matcher alone does not protect them.
 */
export async function requireAdmin(): Promise<void> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!(await verifyAdminToken(token))) redirect('/admin/login')
}
