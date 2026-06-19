-- ============================================================
-- Migration: Add series and subcategories
-- Run this in Supabase SQL Editor
-- ============================================================

-- Series: product lines within a brand (e.g. ROG, TUF, Vivobook under ASUS)
CREATE TABLE IF NOT EXISTS series (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand_id INT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subcategories: specific types under a category (e.g. Gaming Laptop, PSU, GPU)
CREATE TABLE IF NOT EXISTS subcategories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new FK columns to products (nullable — no existing data is broken)
ALTER TABLE products ADD COLUMN IF NOT EXISTS series_id INT REFERENCES series(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory_id INT REFERENCES subcategories(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_series_brand        ON series(brand_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_cat   ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_products_series     ON products(series_id);
CREATE INDEX IF NOT EXISTS idx_products_subcat     ON products(subcategory_id);

-- Row Level Security (public read, same pattern as brands/categories)
ALTER TABLE series        ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read series"        ON series        FOR SELECT USING (true);
CREATE POLICY "Public read subcategories" ON subcategories FOR SELECT USING (true);
