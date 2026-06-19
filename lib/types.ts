export interface Category {
  id: number
  name: string
  slug: string
  parent_id: number | null
  image_url: string | null
  description: string | null
  product_count?: number
}

export interface Brand {
  id: number
  name: string
  slug: string
  logo_url: string | null
}

export interface Series {
  id: number
  name: string
  slug: string
  brand_id: number
  brand?: Brand
}

export interface Subcategory {
  id: number
  name: string
  slug: string
  category_id: number
  category?: Category
}

export interface SubSubcategory {
  id: number
  name: string
  slug: string
  subcategory_id: number
  subcategory?: Subcategory
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  excerpt: string | null
  price: number
  sale_price: number | null
  sku: string | null
  stock_quantity: number
  stock_status: 'instock' | 'outofstock' | 'onbackorder'
  coming_soon: boolean
  featured: boolean
  category_id: number | null
  brand_id: number | null
  series_id: number | null
  subcategory_id: number | null
  sub_subcategory_id: number | null
  images: string[]
  rating: number | null
  review_count: number | null
  created_at: string
  category?: Category
  brand?: Brand
  series?: Series
  subcategory?: Subcategory
  sub_subcategory?: SubSubcategory
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedStorage?: string
}

export interface FilterState {
  category: string | null
  subcategory: string | null
  sub_subcategory: string | null
  brand: string | null
  series: string | null
  minPrice: number
  maxPrice: number
  inStock: boolean
  sort: 'newest' | 'price_asc' | 'price_desc' | 'rating'
}
