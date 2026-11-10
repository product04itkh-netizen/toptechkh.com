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
