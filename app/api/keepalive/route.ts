import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Never cache: every call must reach the database.
export const dynamic = 'force-dynamic'

/**
 * Keep-alive for the Supabase project.
 *
 * Supabase pauses Free-plan projects that see no database activity for a week.
 * Vercel Cron (see vercel.json) calls this once a day; it makes two small reads,
 * which counts as activity. It returns 503 if the database does not answer, so a
 * paused or unreachable project shows up as a failed cron run in the Vercel logs.
 *
 * Optional: set CRON_SECRET in Vercel and only requests carrying it are accepted
 * (Vercel Cron sends it automatically as a Bearer token).
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const [categories, settings] = await Promise.all([
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('cms_settings').select('key').limit(1),
  ])

  const failure = categories.error ?? settings.error
  if (failure) {
    console.error('Keep-alive failed:', failure.message)
    return NextResponse.json({ ok: false, error: failure.message }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }

  return NextResponse.json(
    { ok: true, categories: categories.count, checkedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
