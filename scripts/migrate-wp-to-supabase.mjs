/**
 * WordPress (wpwy_*) → Supabase Migration
 * Each SQL row is on one line, ending with ), or );
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const SQL_PATH = resolve(__dirname, '../toptechk_ttcweb.sql')
console.log('📂 Reading SQL...')
const lines = readFileSync(SQL_PATH, 'utf-8').split('\n')
console.log(`   ${lines.length.toLocaleString()} lines\n`)

// ── Row parser ────────────────────────────────────────────────────────────────

/** Split a raw row string (without outer parentheses) into column values */
function splitColumns(raw) {
  const cols = []
  let cur = ''
  let inStr = false
  let esc = false

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]
    if (esc) { cur += ch; esc = false; continue }
    if (ch === '\\') { cur += ch; esc = true; continue }
    if (ch === "'" && !inStr) { inStr = true; cur += ch; continue }
    if (ch === "'" && inStr) {
      if (raw[i + 1] === "'") { cur += "''"; i++; }
      else { inStr = false; cur += ch; }
      continue
    }
    if (ch === ',' && !inStr) { cols.push(cur.trim()); cur = ''; continue }
    cur += ch
  }
  cols.push(cur.trim())
  return cols
}

/** Strip surrounding single quotes and unescape MySQL escapes */
function unq(s) {
  s = s.trim()
  if (s === 'NULL' || s === '') return ''
  if (s === "''") return ''
  if (s.startsWith("'") && s.endsWith("'")) s = s.slice(1, -1)
  return s
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
}

/** Extract all rows for a given table name from the SQL lines */
function extractRows(tableName) {
  const header = `INSERT INTO \`${tableName}\``
  const rows = []
  let inBlock = false

  for (const line of lines) {
    const t = line.trim()

    if (!inBlock) {
      if (t.startsWith(header)) inBlock = true
      continue
    }

    // Data rows start with '('
    if (!t.startsWith('(')) {
      if (t.length > 0 && !t.startsWith('--')) inBlock = false
      continue
    }

    // Remove trailing ',' or ';'
    let row = t
    if (row.endsWith(';')) { row = row.slice(0, -1); inBlock = false }
    else if (row.endsWith(',')) row = row.slice(0, -1)

    // Extract content between outer parentheses (handle nested parens in content)
    let depth = 0, start = -1
    let inStr = false, esc = false
    for (let i = 0; i < row.length; i++) {
      const ch = row[i]
      if (esc) { esc = false; continue }
      if (ch === '\\') { esc = true; continue }
      if (ch === "'") { inStr = !inStr; continue }
      if (inStr) continue
      if (ch === '(') { if (depth++ === 0) start = i + 1 }
      else if (ch === ')' && --depth === 0) {
        rows.push(row.slice(start, i))
        break
      }
    }
  }

  return rows
}

// ── Parse tables ──────────────────────────────────────────────────────────────

console.log('📊 Parsing tables...')

const terms = new Map()
for (const r of extractRows('wpwy_terms')) {
  const c = splitColumns(r)
  if (c.length >= 3) terms.set(Number(c[0]), { name: unq(c[1]), slug: unq(c[2]) })
}
console.log(`   wpwy_terms:            ${terms.size}`)

const taxonomy = new Map()
for (const r of extractRows('wpwy_term_taxonomy')) {
  const c = splitColumns(r)
  if (c.length >= 5) taxonomy.set(Number(c[0]), { termId: Number(c[1]), taxonomy: unq(c[2]), parent: Number(c[4]) })
}
console.log(`   wpwy_term_taxonomy:    ${taxonomy.size}`)

const termRels = new Map()
for (const r of extractRows('wpwy_term_relationships')) {
  const c = splitColumns(r)
  if (c.length >= 2) {
    const pid = Number(c[0]), tid = Number(c[1])
    if (!termRels.has(pid)) termRels.set(pid, [])
    termRels.get(pid).push(tid)
  }
}
console.log(`   wpwy_term_relationships: ${termRels.size} posts`)

const postMeta = new Map()
for (const r of extractRows('wpwy_postmeta')) {
  const c = splitColumns(r)
  if (c.length >= 4) {
    const pid = Number(c[1]), key = unq(c[2]), val = unq(c[3])
    if (!postMeta.has(pid)) postMeta.set(pid, {})
    const obj = postMeta.get(pid)
    if (!(key in obj)) obj[key] = val
  }
}
console.log(`   wpwy_postmeta:         ${postMeta.size} posts`)

const products = []
const attachments = new Map()
for (const r of extractRows('wpwy_posts')) {
  const c = splitColumns(r)
  if (c.length < 21) continue
  const id = Number(c[0])
  const postType = unq(c[20])
  const status = unq(c[7])
  const slug = unq(c[11])
  const guid = unq(c[18])
  const parent = Number(c[17])

  if (postType === 'attachment' && parent > 0 && /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(guid)) {
    if (!attachments.has(parent)) attachments.set(parent, [])
    attachments.get(parent).push(guid)
    continue
  }
  if (postType !== 'product' || status !== 'publish') continue
  products.push({ id, title: unq(c[5]), content: unq(c[4]), excerpt: unq(c[6]), slug })
}
console.log(`   wpwy_posts products:   ${products.length}`)
console.log(`   wpwy_posts attachments: ${attachments.size} parents\n`)

if (products.length === 0) {
  // Diagnostic
  console.error('❌ No products found. Showing first 3 wpwy_posts rows:')
  extractRows('wpwy_posts').slice(0, 3).forEach((r, i) => {
    const c = splitColumns(r)
    console.log(`  [${i}] cols=${c.length} id=${c[0]} type=${c[20]} status=${c[7]}`)
  })
  process.exit(1)
}

// ── Category / brand maps ─────────────────────────────────────────────────────

// Maps WooCommerce category slugs → Supabase category slugs (from update-categories.sql)
const CATEGORY_MAP = {
  // Laptops — all variants map to 'laptop'
  'laptop':'laptop','laptops':'laptop',
  'notebook':'laptop','gaming-laptop':'laptop',
  'asus-gaming-laptop':'laptop','msi-gaming-laptop':'laptop','lenovo-gaming-laptop':'laptop',
  'asus-notebook':'laptop','msi-notebook':'laptop','lenovo-notebook':'laptop',
  'asus-vivobook':'laptop','asus-zenbook':'laptop','asus-proart':'laptop',
  'asus-rog-series':'laptop','tuf-gaming-series':'laptop',
  'asus-rog-strix':'laptop','rog-flow':'laptop','rog-zephyrus':'laptop',
  'msi-modern':'laptop','msi-prestige':'laptop','msi-summit':'laptop',
  'msi-crosshair':'laptop','msi-vector':'laptop','msi-titan':'laptop',
  'msi-katana':'laptop','msi-cyborg':'laptop','msi-thin':'laptop','msi-stealth':'laptop',
  'lenovo-ideapad-slim':'laptop','lenovo-loq':'laptop','lenovo-yoga':'laptop','lenovo-legion':'laptop',
  // Desktops → 'pc'
  'desktop':'pc','desktops':'pc','desktop-all-in-one':'pc',
  'lenovo-desktop-think-centre':'pc',
  // Monitors → 'lcd-monitor'
  'monitor':'lcd-monitor',
  'monitor-gaming':'lcd-monitor','monitor-office':'lcd-monitor','monitor-notebook':'lcd-monitor',
  'asusgamingmnr':'lcd-monitor','msi-gaming-monitor':'lcd-monitor','lenovo-gaming-monitor':'lcd-monitor',
  'asus-monitor-office':'lcd-monitor','msi-monitor-office':'lcd-monitor','lenovo-monitor-office':'lcd-monitor',
  // Gaming handhelds → 'gaming'
  'gaming-hand-held':'gaming','rog-ally':'gaming','rog-gaming-handheld':'gaming',
  'video-games':'gaming','game-controller':'gaming','pc-gaming':'gaming',
  // PC components → 'components'
  'components':'components',
  'graphic_card':'components','gpu':'components',
  'cpu':'components','ram':'components',
  'power-supply':'components','motherboard':'components',
  'asus_graphic_card':'components','msi_graphic_card':'components',
  'asus-motherboard':'components','msi-motherboard':'components',
  'motherboard-asus':'components','motherboard-msi':'components',
  // Peripherals → 'peripherals'
  'keyboard':'peripherals','mouse':'peripherals','headphone':'peripherals','headphones':'peripherals',
  'bluetooth-headphones':'peripherals','premium-headphones':'peripherals',
  'computer-accessories':'peripherals','computers-accessories':'peripherals',
  'storage':'peripherals',
  // Speaker
  'wireless-speaker':'speaker','speaker':'speaker',
  // Networking → 'network'
  'networking':'network',
  // Accessories
  'accessories':'accessories','television-accessories':'accessories',
  'phone-cases':'accessories','phone-accessories':'accessories',
  // Other electronics (legacy)
  'smartphone':'accessories','cell-phones':'accessories','tablet':'accessories',
  'camera':'accessories','cameras':'accessories','watch':'accessories','watches':'accessories',
  'television':'accessories','televisions':'accessories','projectors':'accessories',
}

const BRAND_WORDS = {
  apple:'apple',samsung:'samsung',sony:'sony',dell:'dell',asus:'asus',acer:'acer',
  beats:'beats',razer:'razer',canon:'canon',lenovo:'lenovo',htc:'htc',
  oneplus:'oneplus',skullcandy:'skullcandy',philips:'philips',vizio:'vizio',
  rca:'rca',msi:'msi',microsoft:'microsoft',lg:'lg',motorola:'motorola',
  xiaomi:'xiaomi',nikon:'nikon',wacom:'wacom',logitech:'logitech',bose:'bose',jbl:'jbl',
}

// Taxonomies WooCommerce uses for brand data in this store
const BRAND_TAXONOMIES = new Set(['product_brand', 'pa_brands', 'product_tag'])

// ── Supabase lookup ───────────────────────────────────────────────────────────

console.log('🗄️  Loading Supabase data...')
const { data: dbCats } = await supabase.from('categories').select('id,slug')
const { data: dbBrands } = await supabase.from('brands').select('id,slug')
const catMap = new Map(dbCats?.map(c => [c.slug, c.id]) || [])
const brandMap = new Map(dbBrands?.map(b => [b.slug, b.id]) || [])
console.log(`   ${catMap.size} categories, ${brandMap.size} brands\n`)

function getCategoryId(postId) {
  for (const tid of termRels.get(postId) || []) {
    const tax = taxonomy.get(tid)
    if (!tax || tax.taxonomy !== 'product_cat') continue
    const term = terms.get(tax.termId)
    if (!term) continue
    const mapped = CATEGORY_MAP[term.slug] || CATEGORY_MAP[term.name.toLowerCase()]
    if (mapped && catMap.has(mapped)) return catMap.get(mapped)
    if (catMap.has(term.slug)) return catMap.get(term.slug)
  }
  return null
}

function getBrandId(postId, title) {
  for (const tid of termRels.get(postId) || []) {
    const tax = taxonomy.get(tid)
    if (!tax || !BRAND_TAXONOMIES.has(tax.taxonomy)) continue
    const term = terms.get(tax.termId)
    if (!term) continue
    const slug = BRAND_WORDS[term.name.toLowerCase()] || BRAND_WORDS[term.slug]
    if (slug && brandMap.has(slug)) return brandMap.get(slug)
  }
  const lower = title.toLowerCase()
  for (const [word, slug] of Object.entries(BRAND_WORDS)) {
    if (lower.includes(word) && brandMap.has(slug)) return brandMap.get(slug)
  }
  return null
}

// ── Transform & insert ────────────────────────────────────────────────────────

const slugSet = new Set()
const rows = []

for (const raw of products) {
  const meta = postMeta.get(raw.id) || {}
  const price = parseFloat(meta._regular_price || meta._price || '0') || 0
  const salePriceRaw = parseFloat(meta._sale_price || '0')
  const salePrice = salePriceRaw > 0 && salePriceRaw < price ? salePriceRaw : null

  let base = raw.slug || raw.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (!base) continue
  let slug = base, n = 1
  while (slugSet.has(slug)) slug = `${base}-${n++}`
  slugSet.add(slug)

  const ss = meta._stock_status || 'instock'
  rows.push({
    name: raw.title,
    slug,
    description: raw.content || null,
    excerpt: raw.excerpt || null,
    price,
    sale_price: salePrice,
    sku: meta._sku || null,
    stock_quantity: parseInt(meta._stock || '0') || 0,
    stock_status: ['instock','outofstock','onbackorder'].includes(ss) ? ss : 'instock',
    featured: meta._featured === 'yes',
    category_id: getCategoryId(raw.id),
    brand_id: getBrandId(raw.id, raw.title),
    images: attachments.get(raw.id) || [],
    rating: parseFloat(meta._wc_average_rating || '0') || 0,
    review_count: parseInt(meta._wc_review_count || '0') || 0,
  })
}

console.log(`🔄 ${rows.length} products ready. Sample:`)
if (rows[0]) {
  const s = rows[0]
  console.log(`   "${s.name}"`)
  console.log(`   $${s.price} → sale $${s.sale_price ?? 'none'} | cat:${s.category_id} brand:${s.brand_id} imgs:${s.images.length}`)
}
console.log()

// Upsert in batches of 50
const BATCH = 50
let ok = 0, fail = 0
for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH)
  const { error } = await supabase.from('products').upsert(batch, { onConflict: 'slug' })
  if (error) { console.error(`\n❌ Batch error:`, error.message); fail += batch.length }
  else { ok += batch.length; process.stdout.write(`\r⬆️  ${ok}/${rows.length}...`) }
}

console.log(`\n\n🎉 Migration complete!`)
console.log(`   ✅ ${ok} inserted  ❌ ${fail} failed`)
console.log(`   📸 With images:   ${rows.filter(r=>r.images.length>0).length}/${rows.length}`)
console.log(`   📂 With category: ${rows.filter(r=>r.category_id).length}/${rows.length}`)
console.log(`   🏷️  With brand:    ${rows.filter(r=>r.brand_id).length}/${rows.length}`)
console.log(`   🔥 On sale:       ${rows.filter(r=>r.sale_price).length}/${rows.length}`)
