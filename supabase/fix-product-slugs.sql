-- Normalise product slugs — collision-safe version
-- If the normalised slug already belongs to a different product, appends -<id> to make it unique

UPDATE products p
SET slug = (
  WITH candidate AS (
    SELECT lower(
      regexp_replace(
        regexp_replace(trim(p.name), '[^a-zA-Z0-9\s-]', '', 'g'),
        '[\s-]+', '-', 'g'
      )
    ) AS base_slug
  )
  SELECT
    CASE
      WHEN EXISTS (
        SELECT 1 FROM products p2
        WHERE p2.slug = c.base_slug AND p2.id <> p.id
      )
      THEN c.base_slug || '-' || p.id::text
      ELSE c.base_slug
    END
  FROM candidate c
)
WHERE p.slug ~ '[A-Z\s]'
   OR p.slug = ''
   OR p.slug IS NULL;

-- Verify
SELECT id, name, slug FROM products ORDER BY created_at DESC LIMIT 20;
