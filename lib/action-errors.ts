/**
 * Use inside `catch (e)` blocks of server actions that also call redirect() or notFound().
 *
 * Next.js implements redirect() by throwing an error whose `digest` starts with "NEXT_".
 * A broad catch that returns `{ error: e.message }` swallows that throw, so the user sees
 * "NEXT_REDIRECT" instead of being navigated to the success page.
 */
export function rethrowFrameworkError(e: unknown): void {
  const digest = (e as { digest?: unknown } | null)?.digest
  if (typeof digest === 'string' && digest.startsWith('NEXT_')) throw e
}

/**
 * A message a person can read. Zod errors carry a JSON array of issues in `.message`;
 * show the first issue's text instead. Other errors keep their own message.
 */
export function errorMessage(e: unknown, fallback: string): string {
  const issues = (e as { issues?: { message?: unknown }[] } | null)?.issues
  if (Array.isArray(issues) && typeof issues[0]?.message === 'string') return issues[0].message
  return e instanceof Error && e.message ? e.message : fallback
}
