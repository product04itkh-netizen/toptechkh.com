-- ============================================================
-- CMS Migration — Pages, Sections, Settings
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── PAGES ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms_pages (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order  INT  NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── SECTIONS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms_sections (
  id          SERIAL PRIMARY KEY,
  page_id     INT  NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('hero','banner','heading','rich_text','image','cta','spacer')),
  order_index INT  NOT NULL DEFAULT 0,
  content     JSONB NOT NULL DEFAULT '{}',
  styles      JSONB NOT NULL DEFAULT '{}',
  visible     BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── SETTINGS (key-value store for global style defaults) ─────
CREATE TABLE IF NOT EXISTS cms_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE cms_pages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_settings ENABLE ROW LEVEL SECURITY;

-- Public can read published pages and their visible sections
CREATE POLICY "Public read published pages"
  ON cms_pages FOR SELECT USING (status = 'published');

CREATE POLICY "Public read visible sections"
  ON cms_sections FOR SELECT
  USING (
    visible = true
    AND EXISTS (
      SELECT 1 FROM cms_pages p
      WHERE p.id = cms_sections.page_id AND p.status = 'published'
    )
  );

CREATE POLICY "Public read settings"
  ON cms_settings FOR SELECT USING (true);

-- Service role (admin) has full access — handled by service role key bypass
-- (Supabase service role bypasses RLS by default)

-- ── DEFAULT GLOBAL SETTINGS ──────────────────────────────────
INSERT INTO cms_settings (key, value) VALUES
  ('global_typography', '{
    "fontFamily": "Inter",
    "headingFontFamily": "Inter",
    "baseFontSize": "16",
    "headingColor": "#021523",
    "bodyColor": "#3d4f61",
    "primaryColor": "#041e42",
    "accentColor": "#ef262c"
  }')
ON CONFLICT (key) DO NOTHING;

-- ── SEED: Home page placeholder ───────────────────────────────
INSERT INTO cms_pages (title, slug, status, sort_order)
VALUES ('Home Page', 'home', 'published', 0)
ON CONFLICT (slug) DO NOTHING;
