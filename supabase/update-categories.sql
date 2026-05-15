-- Run this in Supabase SQL Editor to replace old electronics categories
-- with Top Tech Computer's actual product categories.

-- 1. Clear existing categories (products will have null category_id — fix by re-migrating)
DELETE FROM categories;

-- 2. Reset the sequence so IDs start from 1
ALTER SEQUENCE categories_id_seq RESTART WITH 1;

-- 3. Insert computer store categories
INSERT INTO categories (name, slug, description) VALUES
('Laptop',           'laptop',          'All laptop computers — gaming, business, ultrabooks'),
('PC',               'pc',              'Desktop computers — gaming PCs, office PCs, mini PCs'),
('Components',       'components',      'PC components — CPU, GPU, RAM, SSD, motherboard, PSU'),
('LCD Monitor',      'lcd-monitor',     'LCD & gaming monitors — 4K, curved, high refresh rate'),
('Gaming',           'gaming',          'Gaming handhelds, consoles, and gaming accessories'),
('Peripherals',      'peripherals',     'Keyboard, mouse, headset, webcam, gamepad'),
('Accessories',      'accessories',     'Laptop bags, mouse pads, USB hubs, cables, chargers'),
('Printer & Scanner','printer-scanner', 'Inkjet, laser printers, document scanners'),
('Speaker',          'speaker',         'Desktop speakers, bluetooth speakers, soundbars'),
('Network',          'network',         'Routers, switches, access points, WiFi adapters');
