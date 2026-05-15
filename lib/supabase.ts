import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          parent_id: number | null
          image_url: string | null
          description: string | null
        }
      }
      brands: {
        Row: {
          id: number
          name: string
          slug: string
          logo_url: string | null
        }
      }
      products: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          excerpt: string | null
          price: number
          sale_price: number | null
          sku: string | null
          stock_quantity: number
          stock_status: string
          featured: boolean
          category_id: number | null
          brand_id: number | null
          images: string[]
          rating: number
          review_count: number
          created_at: string
        }
      }
    }
  }
}
