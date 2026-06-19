import { z } from 'zod'

// ── PRODUCTS ─────────────────────────────────────────────────
export const productSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required').max(255),
  slug: z.string().trim().optional(),
  description: z.string().nullable().optional(),
  excerpt: z.string().nullable().optional(),
  price: z.number().min(0, 'Price must be positive').finite(),
  sale_price: z.number().min(0, 'Sale price must be positive').finite().nullable().optional(),
  sku: z.string().nullable().optional(),
  stock_quantity: z.number().int().min(0, 'Stock must be non-negative'),
  stock_status: z.enum(['instock', 'outofstock', 'onbackorder']),
  featured: z.boolean().optional().default(false),
  coming_soon: z.boolean().optional().default(false),
  category_id: z.number().positive().nullable().optional(),
  brand_id: z.number().positive().nullable().optional(),
  series_id: z.number().positive().nullable().optional(),
  subcategory_id: z.number().positive().nullable().optional(),
  sub_subcategory_id: z.number().positive().nullable().optional(),
  images: z.array(z.string().url()).optional().default([]),
})

export type ProductInput = z.infer<typeof productSchema>

// ── CATEGORIES ───────────────────────────────────────────────
export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required').max(255),
  slug: z.string().trim().min(1, 'Slug is required').max(255),
  description: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  show_in_nav: z.boolean().optional().default(false),
  nav_order: z.number().int().min(0, 'Nav order must be non-negative'),
  icon_name: z.string().default('Package'),
})

export type CategoryInput = z.infer<typeof categorySchema>

// ── SUBCATEGORIES ────────────────────────────────────────────
export const subcategorySchema = z.object({
  name: z.string().trim().min(1, 'Subcategory name is required').max(255),
  slug: z.string().trim().min(1, 'Slug is required').max(255),
  category_id: z.number().positive('Invalid category'),
})

export type SubcategoryInput = z.infer<typeof subcategorySchema>

// ── SUB-SUBCATEGORIES ────────────────────────────────────────
export const subSubcategorySchema = z.object({
  name: z.string().trim().min(1, 'Type name is required').max(255),
  slug: z.string().trim().min(1, 'Slug is required').max(255),
  subcategory_id: z.number().positive('Invalid subcategory'),
})

export type SubSubcategoryInput = z.infer<typeof subSubcategorySchema>

// ── BRANDS ───────────────────────────────────────────────────
export const brandSchema = z.object({
  name: z.string().trim().min(1, 'Brand name is required').max(255),
  slug: z.string().trim().min(1, 'Slug is required').max(255),
  logo_url: z.string().url().nullable().optional(),
})

export type BrandInput = z.infer<typeof brandSchema>

// ── SERIES ───────────────────────────────────────────────────
export const seriesSchema = z.object({
  name: z.string().trim().min(1, 'Series name is required').max(255),
  slug: z.string().trim().min(1, 'Slug is required').max(255),
  brand_id: z.number().positive('Invalid brand'),
})

export type SeriesInput = z.infer<typeof seriesSchema>

// ── BANNERS ──────────────────────────────────────────────────
export const bannerSchema = z.object({
  image_url: z.string().url('Banner image URL is required'),
  link_url: z.string().url().default('/shop'),
})

export type BannerInput = z.infer<typeof bannerSchema>

// ── CMS PAGES ────────────────────────────────────────────────
export const cmsPageSchema = z.object({
  title: z.string().trim().min(1, 'Page title is required').max(255),
  slug: z.string().trim().min(1, 'Slug is required').max(255),
  status: z.enum(['draft', 'published']).default('draft'),
})

export type CmsPageInput = z.infer<typeof cmsPageSchema>

// ── ADMIN LOGIN ──────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>
