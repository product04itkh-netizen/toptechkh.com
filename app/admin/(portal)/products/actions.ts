'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseForm(formData: FormData) {
  return {
    name: formData.get('name') as string,
    slug: (formData.get('slug') as string) || slugify(formData.get('name') as string),
    price: parseFloat(formData.get('price') as string),
    sale_price: formData.get('sale_price') ? parseFloat(formData.get('sale_price') as string) : null,
    sku: (formData.get('sku') as string) || null,
    stock_quantity: parseInt(formData.get('stock_quantity') as string) || 0,
    stock_status: formData.get('stock_status') as string,
    featured: formData.get('featured') === 'on',
    category_id: formData.get('category_id') ? parseInt(formData.get('category_id') as string) : null,
    brand_id: formData.get('brand_id') ? parseInt(formData.get('brand_id') as string) : null,
    description: (formData.get('description') as string) || null,
    excerpt: (formData.get('excerpt') as string) || null,
    images: ((formData.get('images') as string) || '').split('\n').map((u) => u.trim()).filter(Boolean),
  }
}

export async function createProduct(_: unknown, formData: FormData) {
  const payload = parseForm(formData)
  const { error } = await supabaseAdmin.from('products').insert(payload)
  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/')
  revalidatePath('/shop')
  redirect('/admin/products')
}

export async function updateProduct(_: unknown, formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const payload = parseForm(formData)
  const { error } = await supabaseAdmin.from('products').update(payload).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath(`/product/${payload.slug}`)
  revalidatePath('/')
  revalidatePath('/shop')
  redirect('/admin/products')
}

export async function deleteProduct(id: number) {
  await supabaseAdmin.from('products').delete().eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/')
  revalidatePath('/shop')
}
