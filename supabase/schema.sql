-- ============================================================
-- TopTech Cambodia - Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id INT REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed main categories
INSERT INTO categories (name, slug, description) VALUES
  ('Smartphones', 'smartphones', 'Latest smartphones from top brands'),
  ('Tablets', 'tablets', 'iPads, Android tablets and more'),
  ('Laptops', 'laptops', 'Thin & light laptops and gaming notebooks'),
  ('Desktops', 'desktops', 'Desktop computers and all-in-ones'),
  ('Cameras', 'cameras', 'DSLR, mirrorless and point-and-shoot cameras'),
  ('Headphones', 'headphones', 'Wireless, noise-cancelling and gaming headphones'),
  ('Watches', 'watches', 'Smartwatches and classic timepieces'),
  ('Televisions', 'televisions', '4K, QLED and OLED smart TVs'),
  ('Gaming', 'gaming', 'Gaming consoles, controllers and accessories'),
  ('Accessories', 'accessories', 'Chargers, cases, cables and more'),
  ('Computer Accessories', 'computer-accessories', 'Keyboards, mice, monitors and more'),
  ('Networking', 'networking', 'Routers, switches and network equipment')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- BRANDS
-- ============================================================
CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO brands (name, slug) VALUES
  ('Apple', 'apple'),
  ('Samsung', 'samsung'),
  ('Sony', 'sony'),
  ('Dell', 'dell'),
  ('ASUS', 'asus'),
  ('Acer', 'acer'),
  ('Beats', 'beats'),
  ('Razer', 'razer'),
  ('Canon', 'canon'),
  ('Lenovo', 'lenovo'),
  ('HTC', 'htc'),
  ('OnePlus', 'oneplus'),
  ('Skullcandy', 'skullcandy'),
  ('Philips', 'philips'),
  ('VIZIO', 'vizio'),
  ('RCA', 'rca'),
  ('MSI', 'msi'),
  ('Microsoft', 'microsoft'),
  ('LG', 'lg'),
  ('Motorola', 'motorola'),
  ('Xiaomi', 'xiaomi'),
  ('Oppo', 'oppo'),
  ('Nokia', 'nokia'),
  ('Huawei', 'huawei')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  excerpt TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sale_price DECIMAL(10, 2),
  sku TEXT,
  stock_quantity INT NOT NULL DEFAULT 0,
  stock_status TEXT NOT NULL DEFAULT 'instock' CHECK (stock_status IN ('instock', 'outofstock', 'onbackorder')),
  featured BOOLEAN NOT NULL DEFAULT false,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  brand_id INT REFERENCES brands(id) ON DELETE SET NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  rating DECIMAL(3, 2) NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  weight DECIMAL(8, 3),
  dimensions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRODUCT ATTRIBUTES (color, storage, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_attributes (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  attribute_name TEXT NOT NULL,
  attribute_value TEXT NOT NULL
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_stock_status ON products(stock_status);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING GIN(to_tsvector('english', name));

-- ============================================================
-- ROW LEVEL SECURITY (public read)
-- ============================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_attributes" ON product_attributes FOR SELECT USING (true);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
