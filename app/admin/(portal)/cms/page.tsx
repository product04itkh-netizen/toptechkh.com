import Link from 'next/link'
import { Plus, Globe, FileText, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { deletePage, togglePageStatus } from './actions'
import type { CmsPage, CmsSection, CmsSectionType } from '@/lib/cms-types'
import { SECTION_TYPE_LABELS } from '@/lib/cms-types'

export const metadata = { title: 'CMS Pages — Admin' }

// Color per section type
const TYPE_COLORS: Record<CmsSectionType, string> = {
  hero:         'bg-blue-100 text-blue-700 border-blue-200',
  banner:       'bg-purple-100 text-purple-700 border-purple-200',
  heading:      'bg-emerald-100 text-emerald-700 border-emerald-200',
  rich_text:    'bg-amber-100 text-amber-700 border-amber-200',
  image:        'bg-pink-100 text-pink-700 border-pink-200',
  cta:          'bg-red-100 text-red-700 border-red-200',
  spacer:       'bg-gray-100 text-gray-500 border-gray-200',
  product_grid: 'bg-indigo-100 text-indigo-700 border-indigo-200',
}

const QUERY_TYPE_LABELS: Record<string, string> = {
  coming_soon:  'Coming Soon',
  new_arrivals: 'New Arrivals',
  on_sale:      'On Sale',
  featured:     'Featured',
  category:     'By Category',
}

function getSectionSnippet(section: CmsSection): string {
  const c = section.content as Record<string, string | undefined>
  switch (section.type) {
    case 'hero':         return c.title ?? ''
    case 'banner':       return c.title ?? c.badge ?? ''
    case 'heading':      return c.text ?? ''
    case 'rich_text':    return c.html ? c.html.replace(/<[^>]+>/g, '').slice(0, 60) : ''
    case 'image':        return c.altText ?? c.imageUrl ?? ''
    case 'cta':          return c.title ?? c.buttonText ?? ''
    case 'spacer':       return c.height ? `${c.height}px` : ''
    case 'product_grid': {
      const label = c.title ?? QUERY_TYPE_LABELS[c.queryType ?? ''] ?? 'Product Grid'
      const limit = c.limit ? `· ${c.limit} products` : ''
      const query = c.queryType ? `(${QUERY_TYPE_LABELS[c.queryType] ?? c.queryType})` : ''
      return c.title ? `${label} ${query} ${limit}`.trim() : label
    }
    default:             return ''
  }
}

type PageWithSections = CmsPage & { sections: CmsSection[] }

export default async function CmsPagesListPage() {
  const { data: pages } = await supabaseAdmin
    .from('cms_pages')
    .select('*, sections:cms_sections(id, type, order_index, content, visible)')
    .order('sort_order')
    .order('created_at')

  const list = (pages ?? []) as PageWithSections[]

  // Sort sections by order_index for each page
  for (const page of list) {
    page.sections = (page.sections ?? []).sort((a, b) => a.order_index - b.order_index)
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs text-[#818ea0] mb-1">Admin / CMS</div>
          <h1 className="text-2xl font-black text-[#021523]">Website Pages</h1>
          <p className="text-sm text-[#818ea0] mt-0.5">
            Build and manage content pages published to the front-end.
          </p>
        </div>
        <Link
          href="/admin/cms/new"
          className="flex items-center gap-1.5 bg-[#041e42] hover:bg-[#0a3060] text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={15} />
          New Page
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-[#c5ccd5] p-12 text-center">
          <FileText size={32} className="mx-auto mb-3 text-[#c5ccd5]" />
          <p className="text-[#818ea0] text-sm font-medium">No pages yet.</p>
          <Link
            href="/admin/cms/new"
            className="inline-flex items-center gap-1.5 mt-4 bg-[#041e42] hover:bg-[#0a3060] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={14} /> Create a Page
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((page) => {
            const frontendUrl = page.slug === 'home' ? '/' : `/pages/${page.slug}`
            const visibleSections  = page.sections.filter(s => s.visible)
            const hiddenSections   = page.sections.filter(s => !s.visible)

            return (
              <div key={page.id} className="bg-white rounded-xl border border-[#e5e8ec] overflow-hidden">

                {/* Page header row */}
                <div className="flex items-center gap-4 px-5 py-4 border-b border-[#f2f3f5]">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    page.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-[#f2f3f5] text-[#818ea0]'
                  }`}>
                    <Globe size={15} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#021523]">{page.title}</span>
                      {page.status === 'published' ? (
                        <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded flex-shrink-0">
                          Published
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-[#818ea0] bg-[#f2f3f5] border border-[#e5e8ec] px-2 py-0.5 rounded flex-shrink-0">
                          Draft
                        </span>
                      )}
                      <span className="text-xs text-[#818ea0]">
                        {page.sections.length} section{page.sections.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-[#818ea0] font-mono">{frontendUrl}</p>
                      {page.status === 'published' && (
                        <a
                          href={frontendUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#041e42] hover:underline"
                        >
                          ↗ View live
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <form action={async () => { 'use server'; await togglePageStatus(page.id, page.status) }}>
                      <button
                        type="submit"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#e5e8ec] text-[#818ea0] hover:border-[#041e42] hover:text-[#041e42] transition-colors"
                      >
                        {page.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                    </form>
                    <Link
                      href={`/admin/cms/${page.id}`}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#041e42] hover:bg-[#0a3060] text-white transition-colors"
                    >
                      Edit Sections <ChevronRight size={12} />
                    </Link>
                    {page.slug !== 'home' && (
                      <form action={async () => { 'use server'; await deletePage(page.id) }}>
                        <button
                          type="submit"
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#e5e8ec] text-[#ef262c] hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Sections preview */}
                {page.sections.length === 0 ? (
                  <div className="px-5 py-4 flex items-center gap-2 text-[#818ea0]">
                    <FileText size={14} className="opacity-40" />
                    <span className="text-xs">No sections yet —</span>
                    <Link href={`/admin/cms/${page.id}`} className="text-xs text-[#041e42] hover:underline font-medium">
                      add your first section
                    </Link>
                  </div>
                ) : (
                  <div className="px-5 py-3 space-y-1.5">
                    {visibleSections.map((section, i) => {
                      const snippet = getSectionSnippet(section)
                      const colorCls = TYPE_COLORS[section.type] ?? 'bg-gray-100 text-gray-600 border-gray-200'
                      return (
                        <div key={section.id} className="flex items-center gap-3 group">
                          {/* Order */}
                          <span className="text-[10px] font-mono text-[#c5ccd5] w-4 text-right flex-shrink-0">
                            {i + 1}
                          </span>
                          {/* Type badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${colorCls}`}>
                            {SECTION_TYPE_LABELS[section.type]}
                          </span>
                          {/* Content snippet */}
                          {snippet && (
                            <span className="text-xs text-[#818ea0] truncate flex-1">{snippet}</span>
                          )}
                          {/* Edit shortcut */}
                          <Link
                            href={`/admin/cms/${page.id}/sections/${section.id}/edit`}
                            className="text-[10px] text-[#818ea0] hover:text-[#041e42] transition-colors flex-shrink-0"
                          >
                            Edit
                          </Link>
                        </div>
                      )
                    })}

                    {/* Hidden sections summary */}
                    {hiddenSections.length > 0 && (
                      <div className="flex items-center gap-2 pt-1 border-t border-[#f2f3f5] mt-1">
                        <EyeOff size={11} className="text-[#c5ccd5]" />
                        <span className="text-[10px] text-[#c5ccd5]">
                          {hiddenSections.length} hidden section{hiddenSections.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )
          })}
        </div>
      )}

      <div className="mt-4">
        <Link
          href="/admin/cms/settings"
          className="text-sm text-[#818ea0] hover:text-[#041e42] transition-colors"
        >
          → Global Typography &amp; Colors
        </Link>
      </div>
    </div>
  )
}
