-- ============================================================
-- Seed: subcategories + sub_subcategories table + seed
-- Run AFTER add-series-subcategories.sql
-- ============================================================

-- ── 1. Seed subcategories ────────────────────────────────────

INSERT INTO subcategories (name, slug, category_id) VALUES
  -- Laptop
  ('Gaming Laptop',     'gaming-laptop',    (SELECT id FROM categories WHERE slug = 'laptop')),
  ('Notebook Laptop',   'notebook-laptop',  (SELECT id FROM categories WHERE slug = 'laptop')),

  -- PC
  ('Desktop',           'desktop',          (SELECT id FROM categories WHERE slug = 'pc')),
  ('PC Build',          'pc-build',         (SELECT id FROM categories WHERE slug = 'pc')),
  ('All-in-One',        'all-in-one',       (SELECT id FROM categories WHERE slug = 'pc')),
  ('Gaming Hand-Held',  'gaming-hand-held', (SELECT id FROM categories WHERE slug = 'pc')),

  -- Components
  ('CPU',               'cpu',              (SELECT id FROM categories WHERE slug = 'components')),
  ('Motherboard',       'motherboard',      (SELECT id FROM categories WHERE slug = 'components')),
  ('Graphic Card',      'graphic-card',     (SELECT id FROM categories WHERE slug = 'components')),
  ('RAM',               'ram',              (SELECT id FROM categories WHERE slug = 'components')),
  ('Storage',           'storage',          (SELECT id FROM categories WHERE slug = 'components')),
  ('Cooling',           'cooling',          (SELECT id FROM categories WHERE slug = 'components')),
  ('Power Supply',      'power-supply',     (SELECT id FROM categories WHERE slug = 'components')),
  ('System Case',       'system-case',      (SELECT id FROM categories WHERE slug = 'components')),

  -- LCD Monitor
  ('Monitor for Office','monitor-for-office',(SELECT id FROM categories WHERE slug = 'lcd-monitor')),
  ('Monitor for Gaming','monitor-for-gaming',(SELECT id FROM categories WHERE slug = 'lcd-monitor')),

  -- Peripherals
  ('Gaming Gear',       'gaming-gear',      (SELECT id FROM categories WHERE slug = 'peripherals')),
  ('External Storage',  'external-storage', (SELECT id FROM categories WHERE slug = 'peripherals')),
  ('Enclosure',         'enclosure',        (SELECT id FROM categories WHERE slug = 'peripherals'))

ON CONFLICT (slug) DO NOTHING;


-- ── 2. Create sub_subcategories table ───────────────────────

CREATE TABLE IF NOT EXISTS sub_subcategories (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  subcategory_id INT NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sub_subcategory_id INT
  REFERENCES sub_subcategories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_subsub_subcat    ON sub_subcategories(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_subsub  ON products(sub_subcategory_id);

ALTER TABLE sub_subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sub_subcategories"
  ON sub_subcategories FOR SELECT USING (true);


-- ── 3. Seed sub_subcategories ────────────────────────────────

INSERT INTO sub_subcategories (name, slug, subcategory_id) VALUES

  -- Gaming Laptop
  ('14" Gaming',        'gaming-14in',        (SELECT id FROM subcategories WHERE slug = 'gaming-laptop')),
  ('15.6" Gaming',      'gaming-156in',       (SELECT id FROM subcategories WHERE slug = 'gaming-laptop')),
  ('16" Gaming',        'gaming-16in',        (SELECT id FROM subcategories WHERE slug = 'gaming-laptop')),
  ('17" Gaming',        'gaming-17in',        (SELECT id FROM subcategories WHERE slug = 'gaming-laptop')),

  -- Notebook Laptop
  ('Ultrabook',         'ultrabook',          (SELECT id FROM subcategories WHERE slug = 'notebook-laptop')),
  ('Business Laptop',   'business-laptop',    (SELECT id FROM subcategories WHERE slug = 'notebook-laptop')),
  ('Budget Laptop',     'budget-laptop',      (SELECT id FROM subcategories WHERE slug = 'notebook-laptop')),

  -- CPU
  ('Intel',             'cpu-intel',          (SELECT id FROM subcategories WHERE slug = 'cpu')),
  ('AMD',               'cpu-amd',            (SELECT id FROM subcategories WHERE slug = 'cpu')),

  -- Motherboard
  ('Intel Platform',    'mobo-intel',         (SELECT id FROM subcategories WHERE slug = 'motherboard')),
  ('AMD Platform',      'mobo-amd',           (SELECT id FROM subcategories WHERE slug = 'motherboard')),

  -- Graphic Card
  ('NVIDIA GeForce',    'gpu-nvidia',         (SELECT id FROM subcategories WHERE slug = 'graphic-card')),
  ('AMD Radeon',        'gpu-amd',            (SELECT id FROM subcategories WHERE slug = 'graphic-card')),
  ('Intel Arc',         'gpu-intel',          (SELECT id FROM subcategories WHERE slug = 'graphic-card')),

  -- RAM
  ('DDR4',              'ram-ddr4',           (SELECT id FROM subcategories WHERE slug = 'ram')),
  ('DDR5',              'ram-ddr5',           (SELECT id FROM subcategories WHERE slug = 'ram')),

  -- Storage
  ('NVMe M.2',          'storage-nvme',       (SELECT id FROM subcategories WHERE slug = 'storage')),
  ('SSD',               'storage-ssd',        (SELECT id FROM subcategories WHERE slug = 'storage')),
  ('HDD',               'storage-hdd',        (SELECT id FROM subcategories WHERE slug = 'storage')),

  -- Cooling
  ('Air Cooler',        'cooling-air',        (SELECT id FROM subcategories WHERE slug = 'cooling')),
  ('Liquid Cooler',     'cooling-liquid',     (SELECT id FROM subcategories WHERE slug = 'cooling')),
  ('Case Fan',          'cooling-fan',        (SELECT id FROM subcategories WHERE slug = 'cooling')),

  -- Monitor for Office
  ('24"',               'monitor-office-24',  (SELECT id FROM subcategories WHERE slug = 'monitor-for-office')),
  ('27"',               'monitor-office-27',  (SELECT id FROM subcategories WHERE slug = 'monitor-for-office')),
  ('32"+',              'monitor-office-32',  (SELECT id FROM subcategories WHERE slug = 'monitor-for-office')),

  -- Monitor for Gaming
  ('24" 144Hz+',        'monitor-gaming-24',  (SELECT id FROM subcategories WHERE slug = 'monitor-for-gaming')),
  ('27" 144Hz+',        'monitor-gaming-27',  (SELECT id FROM subcategories WHERE slug = 'monitor-for-gaming')),
  ('4K Gaming',         'monitor-gaming-4k',  (SELECT id FROM subcategories WHERE slug = 'monitor-for-gaming')),

  -- Gaming Gear
  ('Gaming Mouse',      'gear-mouse',         (SELECT id FROM subcategories WHERE slug = 'gaming-gear')),
  ('Mechanical Keyboard','gear-keyboard',     (SELECT id FROM subcategories WHERE slug = 'gaming-gear')),
  ('Gaming Headset',    'gear-headset',       (SELECT id FROM subcategories WHERE slug = 'gaming-gear')),
  ('Mousepad',          'gear-mousepad',      (SELECT id FROM subcategories WHERE slug = 'gaming-gear')),

  -- External Storage
  ('External SSD',      'ext-ssd',            (SELECT id FROM subcategories WHERE slug = 'external-storage')),
  ('External HDD',      'ext-hdd',            (SELECT id FROM subcategories WHERE slug = 'external-storage')),
  ('USB Flash Drive',   'ext-usb',            (SELECT id FROM subcategories WHERE slug = 'external-storage'))

ON CONFLICT (slug) DO NOTHING;
