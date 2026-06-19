import sanitize from 'sanitize-html'

export function sanitizeHtml(html: string): string {
  if (!html) return ''
  return sanitize(html, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img'],
    allowedAttributes: {
      'a': ['href', 'title', 'target'],
      'img': ['src', 'alt', 'width', 'height'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  })
}
