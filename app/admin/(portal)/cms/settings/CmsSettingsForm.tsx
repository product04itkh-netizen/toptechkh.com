'use client'

import { useActionState, useState } from 'react'
import { updateGlobalSettings } from '../actions'
import { FONT_OPTIONS } from '@/lib/cms-types'

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'

interface Props {
  saved: Record<string, string>
}

const FALLBACK = {
  fontFamily:        'Inter',
  headingFontFamily: 'Inter',
  baseFontSize:      '16',
  headingColor:      '#021523',
  bodyColor:         '#3d4f61',
  primaryColor:      '#041e42',
  accentColor:       '#ef262c',
}

function val(saved: Record<string, string>, key: string): string {
  return saved[key] || FALLBACK[key as keyof typeof FALLBACK] || ''
}

const COLOR_FIELDS = [
  { label: 'Heading Color',   name: 'headingColor'  as const },
  { label: 'Body Text Color', name: 'bodyColor'      as const },
  { label: 'Primary Color',   name: 'primaryColor'  as const },
  { label: 'Accent Color',    name: 'accentColor'   as const },
]

export default function CmsSettingsForm({ saved }: Props) {
  const [state, action, pending] = useActionState(updateGlobalSettings, null)
  const s = state as { error?: string } | null

  const [colors, setColors] = useState({
    headingColor:  val(saved, 'headingColor'),
    bodyColor:     val(saved, 'bodyColor'),
    primaryColor:  val(saved, 'primaryColor'),
    accentColor:   val(saved, 'accentColor'),
  })

  function updateColor(key: keyof typeof colors, value: string) {
    setColors(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <div className="text-xs text-[#818ea0] mb-1">
          <a href="/admin/cms" className="hover:text-[#041e42]">CMS</a> / Global Settings
        </div>
        <h1 className="text-2xl font-black text-[#021523]">Global Typography &amp; Colors</h1>
        <p className="text-sm text-[#818ea0] mt-0.5">
          These settings apply site-wide. Individual sections can override them.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e8ec] overflow-hidden">
        <form action={action}>
          {s?.error && (
            <div className="mx-6 mt-6 text-sm text-[#ef262c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {s.error}
            </div>
          )}

          {/* Typography */}
          <div className="px-6 pt-6 pb-4 border-b border-[#e5e8ec]">
            <h2 className="text-sm font-bold text-[#021523] mb-4">Typography</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Body Font Family</label>
                  <select name="fontFamily" defaultValue={val(saved, 'fontFamily')} className={inputCls}>
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Heading Font Family</label>
                  <select name="headingFontFamily" defaultValue={val(saved, 'headingFontFamily')} className={inputCls}>
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Base Font Size (px)</label>
                <input
                  type="number"
                  name="baseFontSize"
                  defaultValue={val(saved, 'baseFontSize')}
                  min={12}
                  max={24}
                  className={`${inputCls} max-w-[120px]`}
                />
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="px-6 py-6">
            <h2 className="text-sm font-bold text-[#021523] mb-4">Brand Colors</h2>
            <div className="grid grid-cols-2 gap-4">
              {COLOR_FIELDS.map(({ label, name }) => (
                <div key={name}>
                  <label className={labelCls}>{label}</label>
                  <div className="flex gap-3 items-center">
                    {/* Hidden field — this is what gets submitted */}
                    <input type="hidden" name={name} value={colors[name]} />
                    {/* Color picker — visual only, syncs to state */}
                    <input
                      type="color"
                      value={colors[name]}
                      onChange={(e) => updateColor(name, e.target.value)}
                      className="w-10 h-10 rounded-lg border border-[#e5e8ec] cursor-pointer p-0.5 bg-white flex-shrink-0"
                    />
                    {/* Hex text input — visual only, syncs to state on valid hex */}
                    <input
                      type="text"
                      value={colors[name]}
                      onChange={(e) => {
                        const v = e.target.value
                        setColors(prev => ({ ...prev, [name]: v }))
                      }}
                      onBlur={(e) => {
                        if (!/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                          setColors(prev => ({ ...prev, [name]: colors[name] }))
                        }
                      }}
                      className={`${inputCls} font-mono text-xs`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <button
              type="submit"
              disabled={pending}
              className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              {pending ? 'Saving…' : 'Save Settings'}
            </button>
            <a
              href="/admin/cms"
              className="text-sm text-[#818ea0] border border-[#e5e8ec] px-5 py-2.5 rounded-lg hover:border-[#041e42] transition-colors"
            >
              Back to Pages
            </a>
          </div>
        </form>
      </div>

      <div className="mt-4 bg-[#f7f8fa] rounded-xl border border-[#e5e8ec] p-4">
        <p className="text-xs text-[#818ea0] font-medium mb-1">How global settings work</p>
        <p className="text-xs text-[#818ea0]">
          These values are saved to{' '}
          <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#e5e8ec]">cms_settings</code>{' '}
          in the database and injected as CSS variables on the front-end. Individual CMS sections can override
          them with their own typography settings.
        </p>
      </div>
    </div>
  )
}
