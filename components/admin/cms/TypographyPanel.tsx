'use client'

import { FONT_OPTIONS } from '@/lib/cms-types'
import type { CmsSectionStyles } from '@/lib/cms-types'

interface Props {
  defaults?: CmsSectionStyles
}

const inputCls = 'w-full px-2.5 py-2 border border-[#e5e8ec] rounded-lg text-sm outline-none focus:border-[#041e42]'
const labelCls = 'block text-xs font-medium text-[#818ea0] mb-1'

export default function TypographyPanel({ defaults = {} }: Props) {
  return (
    <div className="border border-[#e5e8ec] rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-[#f7f8fa] border-b border-[#e5e8ec]">
        <h3 className="text-sm font-bold text-[#021523]">Typography &amp; Style</h3>
        <p className="text-xs text-[#818ea0] mt-0.5">Overrides global defaults for this section only.</p>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4">
        {/* Font Family */}
        <div className="col-span-2">
          <label className={labelCls}>Font Family</label>
          <select name="style_fontFamily" defaultValue={defaults.fontFamily ?? ''} className={inputCls}>
            <option value="">— Use global default —</option>
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className={labelCls}>Font Size (px)</label>
          <input
            type="number"
            name="style_fontSize"
            defaultValue={defaults.fontSize ?? ''}
            placeholder="16"
            min={8}
            max={120}
            className={inputCls}
          />
        </div>

        {/* Font Weight */}
        <div>
          <label className={labelCls}>Font Weight</label>
          <select name="style_fontWeight" defaultValue={defaults.fontWeight ?? ''} className={inputCls}>
            <option value="">— Default —</option>
            <option value="300">300 — Light</option>
            <option value="400">400 — Regular</option>
            <option value="500">500 — Medium</option>
            <option value="600">600 — Semibold</option>
            <option value="700">700 — Bold</option>
            <option value="800">800 — Extrabold</option>
            <option value="900">900 — Black</option>
          </select>
        </div>

        {/* Text Color */}
        <div>
          <label className={labelCls}>Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              name="style_color"
              defaultValue={defaults.color ?? '#021523'}
              className="w-9 h-9 rounded-lg border border-[#e5e8ec] cursor-pointer p-0.5 bg-white"
            />
            <input
              type="text"
              defaultValue={defaults.color ?? '#021523'}
              placeholder="#021523"
              className={`${inputCls} flex-1`}
              onChange={(e) => {
                const colorInput = e.currentTarget.previousElementSibling as HTMLInputElement
                if (/^#[0-9A-Fa-f]{6}$/.test(e.currentTarget.value)) {
                  colorInput.value = e.currentTarget.value
                  // sync hidden color input name
                  colorInput.dispatchEvent(new Event('input', { bubbles: true }))
                }
              }}
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className={labelCls}>Background Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              name="style_backgroundColor"
              defaultValue={defaults.backgroundColor ?? '#ffffff'}
              className="w-9 h-9 rounded-lg border border-[#e5e8ec] cursor-pointer p-0.5 bg-white"
            />
            <input
              type="text"
              defaultValue={defaults.backgroundColor ?? '#ffffff'}
              placeholder="#ffffff"
              className={`${inputCls} flex-1`}
              onChange={(e) => {
                const colorInput = e.currentTarget.previousElementSibling as HTMLInputElement
                if (/^#[0-9A-Fa-f]{6}$/.test(e.currentTarget.value)) colorInput.value = e.currentTarget.value
              }}
            />
          </div>
        </div>

        {/* Text Alignment */}
        <div className="col-span-2">
          <label className={labelCls}>Text Alignment</label>
          <div className="flex gap-2">
            {(['left', 'center', 'right'] as const).map((align) => (
              <label key={align} className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="style_textAlign"
                  value={align}
                  defaultChecked={defaults.textAlign === align || (!defaults.textAlign && align === 'left')}
                  className="sr-only peer"
                />
                <div className="text-center text-xs font-medium py-2 border border-[#e5e8ec] rounded-lg peer-checked:border-[#041e42] peer-checked:bg-[#041e42] peer-checked:text-white text-[#818ea0] capitalize transition-colors">
                  {align}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Padding */}
        <div className="col-span-2">
          <label className={labelCls}>Padding (px) — Top / Bottom / Left / Right</label>
          <div className="grid grid-cols-4 gap-2">
            {(['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] as const).map((side) => (
              <input
                key={side}
                type="number"
                name={`style_${side}`}
                defaultValue={defaults[side] ?? ''}
                placeholder={side === 'paddingTop' || side === 'paddingBottom' ? '40' : '20'}
                min={0}
                max={200}
                className={inputCls}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
