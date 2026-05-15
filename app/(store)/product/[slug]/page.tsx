import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import ProductDetailClient from '@/components/product/ProductDetailClient'
import ProductCard from '@/components/product/ProductCard'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), brand:brands(id,name,slug)')
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return data as Product
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), brand:brands(id,name,slug)')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4)
  return (data as Product[]) || []
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  const related = await getRelatedProducts(product)

  return (
    <div className="max-w-[1290px] mx-auto px-4 py-6">
      <div className="text-xs text-[#818ea0] mb-6">
        <a href="/" className="hover:text-[#041e42]">Home</a>{' / '}
        <a href="/shop" className="hover:text-[#041e42]">Shop</a>
        {product.category && (
          <>{' / '}<a href={`/shop?category=${product.category.slug}`} className="hover:text-[#041e42]">{product.category.name}</a></>
        )}
        {' / '}<span className="text-[#021523]">{product.name}</span>
      </div>
      <ProductDetailClient product={product} />
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-black text-[#021523] mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
