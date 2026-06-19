-- ============================================================
-- Bulk assign subcategory_id based on real product names
-- Idempotent: only updates rows where subcategory_id IS NULL
-- Subcategory IDs confirmed from live DB:
--   1=Gaming Laptop, 2=Notebook Laptop
--   3=Desktop, 4=PC Build, 5=All-in-One
--   7=CPU, 8=Motherboard, 9=Graphic Card, 10=RAM
--   11=Storage, 12=Cooling, 13=Power Supply, 14=System Case
--   15=Monitor for Office, 16=Monitor for Gaming
--   17=Gaming Gear, 18=External Storage, 19=Enclosure
-- ============================================================


-- ── LAPTOP (category_id = 1) ─────────────────────────────────

-- Gaming Laptop
UPDATE products SET subcategory_id = 1
WHERE category_id = 1 AND subcategory_id IS NULL
  AND (
    name ILIKE '%ROG%'
    OR name ILIKE '%TUF Gaming%'
    OR name ILIKE '%Gaming V16%'
    OR name ILIKE '%Crosshair%'
    OR name ILIKE '%Cyborg%'
    OR name ILIKE '%Katana%'
    OR name ILIKE '%Raider%'
    OR name ILIKE '%Stealth%'
    OR name ILIKE '%Titan%'
    OR name ILIKE '%Vector%'
    OR name ILIKE '%Legion%'
    OR name ILIKE 'Lenovo LOQ%'
  );

-- Notebook Laptop
UPDATE products SET subcategory_id = 2
WHERE category_id = 1 AND subcategory_id IS NULL
  AND (
    name ILIKE '%Vivobook%'
    OR name ILIKE '%Zenbook%'
    OR name ILIKE '%ProArt%'
    OR name ILIKE 'MSI Modern%'
    OR name ILIKE 'MSI Prestige%'
    OR name ILIKE 'MSI Summit%'
    OR name ILIKE 'MSI Thin%'
    OR name ILIKE 'MSI Venture%'
    OR name ILIKE '%IdeaPad%'
    OR name ILIKE '%ThinkPad%'
    OR name ILIKE '%Yoga%'
  );


-- ── PC (category_id = 2) ─────────────────────────────────────

-- All-in-One (ASUS V400 AiO, Lenvo IdeaCentre AIO)
UPDATE products SET subcategory_id = 5
WHERE category_id = 2 AND subcategory_id IS NULL
  AND (name ILIKE '%AiO%' OR name ILIKE '%AIO%');

-- Desktop (Lenovo ThinkCentre)
UPDATE products SET subcategory_id = 3
WHERE category_id = 2 AND subcategory_id IS NULL
  AND (name ILIKE '%ThinkCentre%' OR name ILIKE '%IdeaCentre%');

-- PC Build (Budget / Mid Range / High End Custom)
UPDATE products SET subcategory_id = 4
WHERE category_id = 2 AND subcategory_id IS NULL
  AND name ILIKE '%PC Custom%';


-- ── COMPONENTS (category_id = 3) ─────────────────────────────

-- CPU (Intel Core series)
UPDATE products SET subcategory_id = 7
WHERE category_id = 3 AND subcategory_id IS NULL
  AND (
    name ILIKE '%Intel® Core™%'
    OR name ILIKE '%Intel Core%'
    OR name ILIKE 'AMD Ryzen%'
  );

-- Motherboard (chipset names: B560, B760, B860, H610, Z890)
UPDATE products SET subcategory_id = 8
WHERE category_id = 3 AND subcategory_id IS NULL
  AND (
    name ILIKE '%B560%'
    OR name ILIKE '%B760%'
    OR name ILIKE '%B860%'
    OR name ILIKE '%H610%'
    OR name ILIKE '%Z890%'
  );

-- Graphic Card (GeForce, Radeon, GT 710)
UPDATE products SET subcategory_id = 9
WHERE category_id = 3 AND subcategory_id IS NULL
  AND (
    name ILIKE '%GeForce%'
    OR name ILIKE '%GT 710%'
    OR name ILIKE '%Radeon%'
  );

-- RAM
UPDATE products SET subcategory_id = 10
WHERE category_id = 3 AND subcategory_id IS NULL
  AND name ILIKE 'RAM %';

-- Storage (NVMe M.2, SSD, SPATIUM, Addlink)
UPDATE products SET subcategory_id = 11
WHERE category_id = 3 AND subcategory_id IS NULL
  AND (
    name ILIKE '%NVMe%'
    OR name ILIKE '%M.2%'
    OR name ILIKE '%SPATIUM%'
    OR name ILIKE 'Addlink%'
  );

-- Cooling (AIO liquid coolers: LC 360, LC III, RYUO)
UPDATE products SET subcategory_id = 12
WHERE category_id = 3 AND subcategory_id IS NULL
  AND (
    name ILIKE '%LC 360%'
    OR name ILIKE '%LC III%'
    OR name ILIKE '%RYUO%'
  );

-- Power Supply
UPDATE products SET subcategory_id = 13
WHERE category_id = 3 AND subcategory_id IS NULL
  AND name ILIKE '%Power Supply%';

-- System Case (ROG Z11, GT502, GT302, AP202, A31 PLUS)
UPDATE products SET subcategory_id = 14
WHERE category_id = 3 AND subcategory_id IS NULL
  AND (
    name ILIKE '%CASE%'
    OR name ILIKE '%AP202%'
    OR name ILIKE '%A31 PLUS%'
    OR name ILIKE '%GT302%'
  );


-- ── LCD MONITOR (category_id = 4) ────────────────────────────

-- Monitor for Gaming (ROG, TUF Gaming, MSI MAG)
UPDATE products SET subcategory_id = 16
WHERE category_id = 4 AND subcategory_id IS NULL
  AND (
    name ILIKE '%ROG%'
    OR name ILIKE '%TUF Gaming%'
    OR name ILIKE 'MSI MAG%'
  );

-- Monitor for Office (ThinkVision, MSI PRO MP, MSI Modern, ASUS VA249)
UPDATE products SET subcategory_id = 15
WHERE category_id = 4 AND subcategory_id IS NULL
  AND (
    name ILIKE '%ThinkVision%'
    OR name ILIKE '%PRO MP%'
    OR name ILIKE 'MSI Modern%'
    OR name ILIKE '%VA249%'
  );


-- ── PERIPHERALS (category_id = 6) ────────────────────────────

-- Enclosure (ARION, Cobble SSD Enclosure)
UPDATE products SET subcategory_id = 19
WHERE category_id = 6 AND subcategory_id IS NULL
  AND (name ILIKE '%Enclosure%' OR name ILIKE '%ARION%');

-- Gaming Gear (ROG Gaming, TUF Gaming, MSI gaming peripherals, Akko, Aula, AOC KM100, Corsair K55)
UPDATE products SET subcategory_id = 17
WHERE category_id = 6 AND subcategory_id IS NULL
  AND (
    name ILIKE '%Gaming%'
    OR name ILIKE 'MSI CLUTCH%'
    OR name ILIKE 'MSI FORCE%'
    OR name ILIKE 'MSI FORGE%'
    OR name ILIKE 'MSI IMMERSE%'
    OR name ILIKE 'Akko%'
    OR name ILIKE 'Aula%'
    OR name ILIKE 'AULA%'
    OR name ILIKE '%Corsair K55%'
    OR name ILIKE '%AOC KM100%'
  );
