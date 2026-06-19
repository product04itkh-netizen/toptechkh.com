-- ============================================================
-- Step 1: Add nav columns to categories table
-- ============================================================
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS show_in_nav BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS nav_order   INT     NOT NULL DEFAULT 99,
  ADD COLUMN IF NOT EXISTS icon_name   TEXT    NOT NULL DEFAULT 'Package';

-- ============================================================
-- Step 2: Insert the 9 standard categories (skip if already exist)
-- ============================================================
INSERT INTO categories (name, slug, show_in_nav, nav_order, icon_name) VALUES
  ('Laptop',            'laptop',          true,  1, 'Laptop'),
  ('PC',                'pc',              true,  2, 'Monitor'),
  ('Components',        'components',      true,  3, 'Cpu'),
  ('LCD Monitor',       'lcd-monitor',     true,  4, 'Monitor'),
  ('Peripherals',       'peripherals',     true,  5, 'Mouse'),
  ('Accessories',       'accessories',     true,  6, 'Package'),
  ('Printer & Scanner', 'printer-scanner', true,  7, 'Printer'),
  ('Speaker',           'speaker',         true,  8, 'Volume2'),
  ('Network',           'network',         true,  9, 'Wifi')
ON CONFLICT (slug) DO UPDATE SET
  show_in_nav = EXCLUDED.show_in_nav,
  nav_order   = EXCLUDED.nav_order,
  icon_name   = EXCLUDED.icon_name;
