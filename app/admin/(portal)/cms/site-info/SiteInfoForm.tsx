'use client'

import { useActionState, useState, type ReactNode } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  DEFAULT_SITE_SETTINGS,
  TRUST_ICON_KEYS,
  TRUST_ICON_LABELS,
  type SiteSettings,
  type TrustIconKey,
} from '@/lib/site-settings-schema'

type ActionFn = (prev: unknown, formData: FormData) => Promise<unknown>

const inputCls = 'w-full px-3 py-2.5 border border-[#e5e8ec] rounded-lg text-sm bg-white outline-none focus:border-[#041e42]'
const labelCls = 'block text-sm font-medium text-[#021523] mb-1.5'
const hintCls = 'text-xs text-[#5d6b7b] mt-1.5'
const ghostBtn = 'inline-flex items-center gap-1.5 text-sm font-semibold text-[#041e42] hover:underline'

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-[#e5e8ec]">
      <div className="px-5 py-4 border-b border-[#e5e8ec]">
        <h2 className="font-bold text-[#021523]">{title}</h2>
        {description && <p className="text-sm text-[#5d6b7b] mt-0.5">{description}</p>}
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </section>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className={hintCls}>{hint}</p>}
    </div>
  )
}

function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label}
      className="p-2 text-[#5d6b7b] hover:text-[#b91c1c] hover:bg-[#f2f3f5] rounded-md transition-colors flex-shrink-0">
      <Trash2 size={15} />
    </button>
  )
}

export default function SiteInfoForm({ action, initial }: { action: ActionFn; initial: SiteSettings }) {
  const [state, formAction, pending] = useActionState(action, null)
  const [s, setS] = useState<SiteSettings>(initial)
  const error = (state as { error?: string } | null)?.error

  // Edit a deep copy so React sees a new object every time
  const edit = (fn: (draft: SiteSettings) => void) =>
    setS((prev) => {
      const next = structuredClone(prev)
      fn(next)
      return next
    })

  const num = (v: string) => (v === '' || Number.isNaN(Number(v)) ? 0 : Number(v))

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="settings" value={JSON.stringify(s)} />

      {error && (
        <div role="alert" className="text-sm text-[#b91c1c] bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* ── Trust signals ── */}
      <Section
        title="Product page badges"
        description="The small icon boxes under the Add to Cart button (warranty, shipping, returns). Up to 4. Leave empty to hide the row."
      >
        {s.trustSignals.map((t, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-3">
              <label className={labelCls}>Icon</label>
              <select value={t.icon} className={inputCls}
                onChange={(e) => edit((d) => { d.trustSignals[i].icon = e.target.value as TrustIconKey })}>
                {TRUST_ICON_KEYS.map((k) => <option key={k} value={k}>{TRUST_ICON_LABELS[k]}</option>)}
              </select>
            </div>
            <div className="md:col-span-4">
              <label className={labelCls}>Title</label>
              <input value={t.title} maxLength={40} className={inputCls} placeholder="Warranty"
                onChange={(e) => edit((d) => { d.trustSignals[i].title = e.target.value })} />
            </div>
            <div className="md:col-span-4">
              <label className={labelCls}>Subtitle</label>
              <input value={t.subtitle} maxLength={60} className={inputCls} placeholder="1 Year Guarantee"
                onChange={(e) => edit((d) => { d.trustSignals[i].subtitle = e.target.value })} />
            </div>
            <div className="md:col-span-1 flex md:justify-end">
              <RemoveButton label={`Remove badge ${i + 1}`} onClick={() => edit((d) => { d.trustSignals.splice(i, 1) })} />
            </div>
          </div>
        ))}
        {s.trustSignals.length < 4 && (
          <button type="button" className={ghostBtn}
            onClick={() => edit((d) => { d.trustSignals.push({ icon: 'shield', title: '', subtitle: '' }) })}>
            <Plus size={15} /> Add badge
          </button>
        )}
      </Section>

      {/* ── Shipping ── */}
      <Section title="Cart shipping" description="Used by the cart summary. Keep the Free Shipping badge text above in step with these numbers.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <Field label="Free shipping on orders from ($)" hint="Set to 0 to make shipping always free.">
            <input type="number" min={0} step="0.01" value={s.shipping.freeThreshold} className={inputCls}
              onChange={(e) => edit((d) => { d.shipping.freeThreshold = num(e.target.value) })} />
          </Field>
          <Field label="Shipping fee below that ($)">
            <input type="number" min={0} step="0.01" value={s.shipping.flatFee} className={inputCls}
              onChange={(e) => edit((d) => { d.shipping.flatFee = num(e.target.value) })} />
          </Field>
        </div>
      </Section>

      {/* ── Contact ── */}
      <Section title="Contact details" description="Shown in the footer. The first group also feeds the Telegram and phone strip under the homepage banner.">
        {s.contact.groups.map((g, gi) => (
          <div key={gi} className="border border-[#e5e8ec] rounded-lg p-4 space-y-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className={labelCls}>Group name {gi === 0 && <span className="text-xs text-[#5d6b7b] font-normal">(also used by the homepage strip)</span>}</label>
                <input value={g.title} maxLength={60} className={inputCls} placeholder="Sale Showroom"
                  onChange={(e) => edit((d) => { d.contact.groups[gi].title = e.target.value })} />
              </div>
              <RemoveButton label={`Remove group ${g.title || gi + 1}`} onClick={() => edit((d) => { d.contact.groups.splice(gi, 1) })} />
            </div>

            <div>
              <label className={labelCls}>Phone numbers</label>
              <div className="space-y-2">
                {g.phones.map((p, pi) => (
                  <div key={pi} className="flex items-center gap-2">
                    <input value={p} maxLength={30} className={inputCls} placeholder="092 626 092" inputMode="tel"
                      onChange={(e) => edit((d) => { d.contact.groups[gi].phones[pi] = e.target.value })} />
                    <RemoveButton label="Remove phone number" onClick={() => edit((d) => { d.contact.groups[gi].phones.splice(pi, 1) })} />
                  </div>
                ))}
              </div>
              {g.phones.length < 6 && (
                <button type="button" className={`${ghostBtn} mt-2`}
                  onClick={() => edit((d) => { d.contact.groups[gi].phones.push('') })}>
                  <Plus size={15} /> Add phone number
                </button>
              )}
            </div>

            <div>
              <label className={labelCls}>Telegram links</label>
              <div className="space-y-2">
                {g.telegram.map((t, ti) => (
                  <div key={ti} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    <input value={t.label} maxLength={60} className={`${inputCls} md:col-span-4`} placeholder="Name shown in footer"
                      onChange={(e) => edit((d) => { d.contact.groups[gi].telegram[ti].label = e.target.value })} />
                    <input value={t.short} maxLength={30} className={`${inputCls} md:col-span-2`} placeholder="Short name"
                      title="Shown in the homepage strip. Leave empty to use the full name."
                      onChange={(e) => edit((d) => { d.contact.groups[gi].telegram[ti].short = e.target.value })} />
                    <input value={t.url} maxLength={300} className={`${inputCls} md:col-span-5`} placeholder="https://t.me/…" inputMode="url"
                      onChange={(e) => edit((d) => { d.contact.groups[gi].telegram[ti].url = e.target.value })} />
                    <div className="md:col-span-1 flex md:justify-end">
                      <RemoveButton label="Remove Telegram link" onClick={() => edit((d) => { d.contact.groups[gi].telegram.splice(ti, 1) })} />
                    </div>
                  </div>
                ))}
              </div>
              {g.telegram.length < 6 && (
                <button type="button" className={`${ghostBtn} mt-2`}
                  onClick={() => edit((d) => { d.contact.groups[gi].telegram.push({ label: '', short: '', url: 'https://t.me/' }) })}>
                  <Plus size={15} /> Add Telegram link
                </button>
              )}
            </div>
          </div>
        ))}
        {s.contact.groups.length < 4 && (
          <button type="button" className={ghostBtn}
            onClick={() => edit((d) => { d.contact.groups.push({ title: '', phones: [], telegram: [] }) })}>
            <Plus size={15} /> Add contact group
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Field label="Email">
            <input type="email" value={s.contact.email} maxLength={120} className={inputCls} placeholder="hello@example.com"
              onChange={(e) => edit((d) => { d.contact.email = e.target.value })} />
          </Field>
          <Field label="Map link" hint='In Google Maps choose Share → Embed a map, then paste the address from src="…".'>
            <input value={s.contact.mapEmbedUrl} maxLength={1200} className={inputCls} placeholder="https://www.google.com/maps/embed?pb=…" inputMode="url"
              onChange={(e) => edit((d) => { d.contact.mapEmbedUrl = e.target.value })} />
          </Field>
          <Field label="Address (Khmer)">
            <textarea value={s.contact.addressKm} maxLength={300} rows={3} className={inputCls}
              onChange={(e) => edit((d) => { d.contact.addressKm = e.target.value })} />
          </Field>
          <Field label="Address (English)">
            <textarea value={s.contact.addressEn} maxLength={300} rows={3} className={inputCls}
              onChange={(e) => edit((d) => { d.contact.addressEn = e.target.value })} />
          </Field>
        </div>
      </Section>

      {/* ── Brand ── */}
      <Section title="Footer brand" description="The short description and social links under the logo.">
        <Field label="Tagline">
          <textarea value={s.brand.tagline} maxLength={200} rows={2} className={inputCls}
            onChange={(e) => edit((d) => { d.brand.tagline = e.target.value })} />
        </Field>
        <div>
          <label className={labelCls}>Social links</label>
          <div className="space-y-2">
            {s.brand.social.map((l, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                <input value={l.label} maxLength={40} className={`${inputCls} md:col-span-3`} placeholder="Facebook"
                  onChange={(e) => edit((d) => { d.brand.social[i].label = e.target.value })} />
                <input value={l.url} maxLength={300} className={`${inputCls} md:col-span-8`} placeholder="https://…" inputMode="url"
                  onChange={(e) => edit((d) => { d.brand.social[i].url = e.target.value })} />
                <div className="md:col-span-1 flex md:justify-end">
                  <RemoveButton label="Remove social link" onClick={() => edit((d) => { d.brand.social.splice(i, 1) })} />
                </div>
              </div>
            ))}
          </div>
          {s.brand.social.length < 8 && (
            <button type="button" className={`${ghostBtn} mt-2`}
              onClick={() => edit((d) => { d.brand.social.push({ label: '', url: 'https://' }) })}>
              <Plus size={15} /> Add social link
            </button>
          )}
        </div>
      </Section>

      {/* ── Homepage ── */}
      <Section title="Homepage wording">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Category section title">
            <input value={s.home.categoriesTitle} maxLength={80} className={inputCls}
              onChange={(e) => edit((d) => { d.home.categoriesTitle = e.target.value })} />
          </Field>
          <Field label="Category section subtitle">
            <input value={s.home.categoriesSubtitle} maxLength={160} className={inputCls}
              onChange={(e) => edit((d) => { d.home.categoriesSubtitle = e.target.value })} />
          </Field>
          <Field label="Banner strip label" hint="Text before the Telegram links under the banner. Leave empty to show only the links.">
            <input value={s.home.orderStripLabel} maxLength={60} className={inputCls}
              onChange={(e) => edit((d) => { d.home.orderStripLabel = e.target.value })} />
          </Field>
        </div>
      </Section>

      {/* ── Footer ── */}
      <Section title="Footer bottom bar" description="Pages like Privacy or Terms can be linked here once they exist, for example /pages/privacy.">
        <Field label="Copyright text" hint="The © symbol and the current year are added automatically.">
          <input value={s.footer.copyright} maxLength={120} className={inputCls}
            onChange={(e) => edit((d) => { d.footer.copyright = e.target.value })} />
        </Field>
        <div>
          <label className={labelCls}>Links</label>
          <div className="space-y-2">
            {s.footer.legalLinks.map((l, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                <input value={l.label} maxLength={40} className={`${inputCls} md:col-span-3`} placeholder="Privacy"
                  onChange={(e) => edit((d) => { d.footer.legalLinks[i].label = e.target.value })} />
                <input value={l.url} maxLength={300} className={`${inputCls} md:col-span-8`} placeholder="/pages/privacy"
                  onChange={(e) => edit((d) => { d.footer.legalLinks[i].url = e.target.value })} />
                <div className="md:col-span-1 flex md:justify-end">
                  <RemoveButton label="Remove footer link" onClick={() => edit((d) => { d.footer.legalLinks.splice(i, 1) })} />
                </div>
              </div>
            ))}
          </div>
          {s.footer.legalLinks.length < 6 && (
            <button type="button" className={`${ghostBtn} mt-2`}
              onClick={() => edit((d) => { d.footer.legalLinks.push({ label: '', url: '/pages/' }) })}>
              <Plus size={15} /> Add link
            </button>
          )}
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending}
          className="bg-[#041e42] hover:bg-[#0a3060] disabled:bg-[#c8cdd5] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
          {pending ? 'Saving…' : 'Save Site Info'}
        </button>
        <button type="button" disabled={pending}
          onClick={() => { if (window.confirm('Load the original values into the form? Nothing is saved until you press Save.')) setS(structuredClone(DEFAULT_SITE_SETTINGS)) }}
          className="text-sm text-[#5d6b7b] hover:text-[#041e42] underline underline-offset-2">
          Reset form to original values
        </button>
      </div>
    </form>
  )
}
