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
  featured: boolean
  category_id: number | null
  brand_id: number | null
  images: string[]
  rating: number | null
  review_count: number | null
  created_at: string
  category?: Category
  brand?: Brand
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedStorage?: string
}

export interface FilterState {
  category: string | null
  brand: string | null
  minPrice: number
  maxPrice: number
  inStock: boolean
  sort: 'newest' | 'price_asc' | 'price_desc' | 'rating'
}
