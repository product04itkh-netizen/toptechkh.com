'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { productSchema } from '@/lib/validation'

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseForm(formData: FormData) {
  const images = ((formData.get('images') as string) || '').split('\n').map((u) => u.trim()).filter(Boolean)

  const data = {
    name: formData.get('name') as string,
    slug: (formData.get('slug') as string) || slugify(formData.get('name') as string),
    price: parseFloat(formData.get('price') as string),
    sale_price: formData.get('sale_price') ? parseFloat(formData.get('sale_price') as string) : null,
    sku: (formData.get('sku') as string) || null,
    stock_quantity: parseInt(formData.get('stock_quantity') as string),
    stock_status: formData.get('stock_status') as string,
    featured: formData.get('featured') === 'on',
    coming_soon: formData.get('coming_soon') === 'on',
    category_id: formData.get('category_id') ? parseInt(formData.get('category_id') as string) : null,
    brand_id: formData.get('brand_id') ? parseInt(formData.get('brand_id') as string) : null,
    series_id: formData.get('series_id') ? parseInt(formData.get('series_id') as string) : null,
    subcategory_id: formData.get('subcategory_id') ? parseInt(formData.get('subcategory_id') as string) : null,
    sub_subcategory_id: formData.get('sub_subcategory_id') ? parseInt(formData.get('sub_subcategory_id') as string) : null,
    description: (formData.get('description') as string) || null,
    excerpt: (formData.get('excerpt') as string) || null,
    images,
  }

  const validated = productSchema.parse(data)
  return validated
}

export async function createProduct(_: unknown, formData: FormData) {
  try {
    const payload = parseForm(formData)
    const { error } = await supabaseAdmin.from('products').insert(payload)
    if (error) return { error: error.message }
    revalidatePath('/admin/products')
    revalidatePath('/')
    revalidatePath('/shop')
    redirect('/admin/products?toast=success&msg=Product+created')
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e
    const msg = e instanceof Error ? e.message : 'Product validation failed'
    return { error: msg }
  }
}

export async function updateProduct(_: unknown, formData: FormData) {
  try {
    const id = parseInt(formData.get('id') as string)
    if (isNaN(id)) throw new Error('Invalid product ID')
    const payload = parseForm(formData) // Already validated by schema in parseForm
    const { error } = await supabaseAdmin.from('products').update(payload).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/products')
    revalidatePath(`/product/${payload.slug}`)
    revalidatePath('/')
    revalidatePath('/shop')
    redirect('/admin/products?toast=success&msg=Product+updated')
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e
    return { error: e instanceof Error ? e.message : 'Validation failed' }
  }
}

export async function deleteProduct(id: number) {
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/')
  revalidatePath('/shop')
  if (error) redirect('/admin/products?toast=error&msg=Failed+to+delete+product')
  redirect('/admin/products?toast=success&msg=Product+deleted')
}
