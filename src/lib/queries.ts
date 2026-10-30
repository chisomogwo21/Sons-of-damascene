import { supabase } from './supabase'

// ── Types ──────────────────────────────────────────────────────
export interface Category {
  id: string
  slug: string
  name_en: string
  name_rw: string | null
  name_fr: string | null
  cover_image_url: string | null
  sort_order: number
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text: string | null
  sort_order: number
  is_cover: boolean
}

export interface Product {
  id: string
  slug: string
  category_id: string | null
  name_en: string
  name_rw: string | null
  name_fr: string | null
  description_en: string | null
  description_rw: string | null
  description_fr: string | null
  wood_type: string | null
  dimensions: string | null
  lead_time_text: string | null
  price_amount: number | null
  currency: string
  is_published: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  product_images?: ProductImage[]
  categories?: Category | null
}

export interface Testimonial {
  id: string
  author_name: string
  author_location: string | null
  quote_en: string
  quote_rw: string | null
  quote_fr: string | null
  is_published: boolean
  sort_order: number
  created_at: string
}

export type SiteSettings = Record<string, string>

export interface Enquiry {
  id?: string
  name: string
  contact: string
  message: string
  created_at?: string
}

// ── Queries ────────────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
    console.log('[Supabase fetchCategories] Response:', { data, error })
    if (error) {
      console.error('[Supabase fetchCategories Error]:', error)
      return []
    }
    return (data || []) as Category[]
  } catch (err) {
    console.error('[Supabase fetchCategories Exception]:', err)
    return []
  }
}

export async function fetchPublishedProducts(categorySlug?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      product_images(*),
      categories(*)
    `)
    .eq('is_published', true)
    .order('sort_order')

  if (categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Product[]
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`*, product_images(*), categories(*)`)
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('sort_order')
      .limit(4)
    console.log('[Supabase fetchFeaturedProducts] Response:', { data, error })
    if (error) {
      console.error('[Supabase fetchFeaturedProducts Error]:', error)
      return []
    }
    return (data || []) as Product[]
  } catch (err) {
    console.error('[Supabase fetchFeaturedProducts Exception]:', err)
    return []
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`*, product_images(*), categories(*)`)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error) return null
  return data as Product
}

export async function fetchRelatedProducts(categoryId: string, excludeId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`*, product_images(*), categories(*)`)
    .eq('is_published', true)
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .order('sort_order')
    .limit(3)
  if (error) throw error
  return data as Product[]
}

export async function fetchPublishedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .order('sort_order')
  if (error) throw error
  return data as Testimonial[]
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from('site_settings').select('*')
  if (error) throw error
  const settings: SiteSettings = {}
  for (const row of data ?? []) {
    settings[row.key] = row.value
  }
  return settings
}

export async function insertEnquiry(enquiry: Enquiry): Promise<void> {
  const { error } = await supabase.from('enquiries').insert([enquiry])
  if (error) throw error
}

// ── Admin queries (authenticated) ─────────────────────────────

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`*, product_images(*), categories(*)`)
    .order('sort_order')
  if (error) throw error
  return data as Product[]
}

export async function upsertProduct(product: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .upsert([product])
    .select()
    .single()
  if (error) throw error
  return data as Product
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function fetchAllTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data as Testimonial[]
}

export async function upsertTestimonial(t: Partial<Testimonial>): Promise<Testimonial> {
  const { data, error } = await supabase
    .from('testimonials')
    .upsert([t])
    .select()
    .single()
  if (error) throw error
  return data as Testimonial
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw error
}

export async function upsertSetting(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('site_settings')
    .upsert([{ key, value }])
  if (error) throw error
}

export async function addProductImage(img: Partial<ProductImage>): Promise<ProductImage> {
  const { data, error } = await supabase
    .from('product_images')
    .insert([img])
    .select()
    .single()
  if (error) throw error
  return data as ProductImage
}

export async function deleteProductImage(id: string): Promise<void> {
  const { error } = await supabase.from('product_images').delete().eq('id', id)
  if (error) throw error
}

export async function updateProductImageOrder(images: { id: string; sort_order: number }[]): Promise<void> {
  for (const img of images) {
    await supabase.from('product_images').update({ sort_order: img.sort_order }).eq('id', img.id)
  }
}

export async function setCoverImage(productId: string, imageId: string): Promise<void> {
  // clear old cover
  await supabase
    .from('product_images')
    .update({ is_cover: false })
    .eq('product_id', productId)
  // set new
  await supabase.from('product_images').update({ is_cover: true }).eq('id', imageId)
}

export async function fetchAllEnquiries() {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
