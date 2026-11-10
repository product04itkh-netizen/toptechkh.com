/**
 * Normalise free text into a URL-safe slug: lowercase ASCII letters and digits
 * separated by single hyphens. "PC Build in Cambodia" -> "pc-build-in-cambodia".
 * Returns '' when nothing usable remains (e.g. Khmer-only input).
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
