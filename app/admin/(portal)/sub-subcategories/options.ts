import type { supabaseAdmin as Db } from '@/lib/supabase-admin'

/** Subcategory choices for the parent dropdown, labelled "Category › Subcategory". */
export async function subcategoryOptions(db: typeof Db): Promise<{ id: number; label: string }[]> {
  const { data, error } = await db
    .from('subcategories')
    .select('id, name, category:categories(name)')
    .order('name')

  if (error) {
    console.error('Subcategories fetch error:', error)
    return []
  }

  return (data ?? []).map((row) => {
    const cat = Array.isArray(row.category) ? row.category[0] : row.category
    return {
      id: row.id as number,
      label: cat?.name ? `${cat.name} › ${row.name}` : String(row.name),
    }
  })
}
