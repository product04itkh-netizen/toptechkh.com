import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronUp, ChevronDown, Eye, EyeOff, Trash2, Plus, Pencil, ExternalLink } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { deleteSection, toggleSectionVisible, moveSection } from '../actions'
import type { CmsPage, CmsSection } from '@/lib/cms-types'
import { SECTION_TYPE_LABELS } from '@/lib/cms-types'

interface Props { params: Promise<{ pageId: string }> }

export default async function CmsPageEditorPage({ params }: Props) {
  const { pageId } = await params
  const id = parseInt(pageId)

  const [{ data: page, error: pageError }, { data: sections }] = await Promise.all([
    supabaseAdmin.from('cms_pages').select('*').eq('id', id).maybeSingle(),
    supabaseAdmin.from('cms_sections').select('*').eq('page_id', id).order('order_index'),
  ])

  if (pageError) console.error('CMS page fetch error:', pageError)
  if (!page) notFound()

  const p = page as CmsPage
  const list: CmsSection[] = sections ?? []
  const frontendUrl = p.slug === 'home' ? '/' : `/pages/${p.slug}`

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs text-[#818ea0] mb-1">
            <a href="/admin/cms" className="hover:text-[#041e42]">CMS</a> / {p.title}
          </div>
          <h1 className="text-2xl font-black text-[#021523]">{p.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
              p.status === 'published'
                ? 'text-green-700 bg-green-50 border border-green-100'
                : 'text-[#818ea0] bg-[#f2f3f5] border border-[#e5e8ec]'
            }`}>
              {p.status === 'published' ? 'Published' : 'Draft'}
            </span>
            <a
              href={frontendUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#818ea0] hover:text-[#041e42] flex items-center gap-1 transition-colors"
            >
              View page <ExternalLink size={11} />
            </a>
          </div>
        </div>
        <Link
          href={`/admin/cms/${id}/sections/new`}
          className="flex items-center gap-1.5 bg-[#041e42] hover:bg-[#0a3060] text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={15} />
          Add Section
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-[#c5ccd5] p-12 text-center">
          <p className="text-[#818ea0] text-sm font-medium">No sections yet.</p>
          <p className="text-[#818ea0] text-xs mt-1">Add a Hero, Banner, Text block, or other section to build this page.</p>
          <Link
            href={`/admin/cms/${id}/sections/new`}
            className="inline-flex items-center gap-1.5 mt-4 bg-[#041e42] hover:bg-[#0a3060] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={14} />
            Add First Section
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e5e8ec] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e5e8ec] bg-[#f7f8fa] flex items-center justify-between">
            <span className="text-sm font-bold text-[#021523]">
              {list.length} Section{list.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-[#818ea0]">Use arrows to reorder</span>
          </div>
          <ul className="divide-y divide-[#f2f3f5]">
            {list.map((section, i) => {
              const label = SECTION_TYPE_LABELS[section.type]
              const preview = getSectionPreview(section)
              return (
                <li key={section.id} className={`flex items-center gap-4 px-5 py-4 ${!section.visible ? 'opacity-50' : ''}`}>
                  {/* Order badge */}
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#f2f3f5] flex items-center justify-center text-xs font-bold text-[#818ea0]">
                    {i + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#021523]">{label}</span>
                      {!section.visible && (
                        <span className="text-xs text-[#818ea0] bg-[#f2f3f5] px-2 py-0.5 rounded">Hidden</span>
                      )}
                    </div>
                    {preview && (
                      <p className="text-xs text-[#818ea0] truncate mt-0.5">{preview}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Move up */}
                    <form action={async () => { 'use server'; await moveSection(section.id, 'up', id) }}>
                      <button
                        type="submit"
                        disabled={i === 0}
                        title="Move up"
                        className="p-1.5 rounded-lg text-[#818ea0] hover:text-[#041e42] hover:bg-[#f2f3f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronUp size={16} />
                      </button>
                    </form>

                    {/* Move down */}
                    <form action={async () => { 'use server'; await moveSection(section.id, 'down', id) }}>
                      <button
                        type="submit"
                        disabled={i === list.length - 1}
                        title="Move down"
                        className="p-1.5 rounded-lg text-[#818ea0] hover:text-[#041e42] hover:bg-[#f2f3f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </form>

                    {/* Toggle visible */}
                    <form action={async () => { 'use server'; await toggleSectionVisible(section.id, section.visible, id) }}>
                      <button
                        type="submit"
                        title={section.visible ? 'Hide section' : 'Show section'}
                        className="p-1.5 rounded-lg text-[#818ea0] hover:text-[#041e42] hover:bg-[#f2f3f5] transition-colors"
                      >
                        {section.visible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </form>

                    {/* Edit */}
                    <Link
                      href={`/admin/cms/${id}/sections/${section.id}/edit`}
                      className="p-1.5 rounded-lg text-[#818ea0] hover:text-[#041e42] hover:bg-[#f2f3f5] transition-colors"
                      title="Edit section"
                    >
                      <Pencil size={16} />
                    </Link>

                    {/* Delete */}
                    <form action={async () => { 'use server'; await deleteSection(section.id, id) }}>
                      <button
                        type="submit"
                        title="Delete section"
                        className="p-1.5 rounded-lg text-[#818ea0] hover:text-[#ef262c] hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

function getSectionPreview(section: CmsSection): string {
  const c = section.content as Record<string, string | undefined>
  const QUERY_TYPE_LABELS: Record<string, string> = {
    coming_soon:  'Coming Soon',
    new_arrivals: 'New Arrivals',
    on_sale:      'On Sale',
    featured:     'Featured',
    category:     'By Category',
  }
  switch (section.type) {
    case 'hero':      return c.title ?? ''
    case 'banner':    return c.title ?? c.imageUrl ?? ''
    case 'heading':   return c.text ?? ''
    case 'rich_text': return c.html ? c.html.replace(/<[^>]+>/g, '').slice(0, 80) : ''
    case 'image':     return c.imageUrl ?? c.altText ?? ''
    case 'cta':       return c.title ?? c.buttonText ?? ''
    case 'spacer':    return c.height ? `${c.height}px height` : ''
    case 'product_grid': {
      const label = c.title ?? QUERY_TYPE_LABELS[c.queryType ?? ''] ?? 'Product Grid'
      const limit = c.limit ? `· ${c.limit} products` : ''
      return `${label} ${limit}`.trim()
    }
    default:          return ''
  }
}
