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

export interface ContentData {
  products: Product[]
  categories: Category[]
  testimonials: Testimonial[]
  settings: SiteSettings
}

let cachedDataPromise: Promise<ContentData> | null = null

function resolveMediaUrl(url: string | null | undefined): string | null | undefined {
  if (!url || typeof url !== 'string') return url
  if (url.startsWith('media/')) {
    const base = import.meta.env.BASE_URL || '/'
    return `${base.endsWith('/') ? base : base + '/'}${url}`
  }
  return url
}

export async function loadContent(): Promise<ContentData> {
  if (!cachedDataPromise) {
    cachedDataPromise = (async () => {
      const base = import.meta.env.BASE_URL || '/'
      const jsonUrl = `${base.endsWith('/') ? base : base + '/'}content.json`
      const res = await fetch(jsonUrl)
      if (!res.ok) {
        throw new Error(`[content.ts] Failed to load content.json (${res.status} ${res.statusText})`)
      }
      const data: ContentData = await res.json()

      // Resolve all media URLs against import.meta.env.BASE_URL
      if (Array.isArray(data.products)) {
        for (const p of data.products) {
          if (Array.isArray(p.product_images)) {
            for (const img of p.product_images) {
              img.url = resolveMediaUrl(img.url) || ''
            }
          }
          if (p.categories && p.categories.cover_image_url) {
            p.categories.cover_image_url = resolveMediaUrl(p.categories.cover_image_url) || null
          }
        }
      }

      if (Array.isArray(data.categories)) {
        for (const c of data.categories) {
          if (c.cover_image_url) {
            c.cover_image_url = resolveMediaUrl(c.cover_image_url) || null
          }
        }
      }

      if (data.settings && typeof data.settings === 'object') {
        for (const [k, v] of Object.entries(data.settings)) {
          if (typeof v === 'string' && v.startsWith('media/')) {
            data.settings[k] = resolveMediaUrl(v) || ''
          }
        }
      }

      return data
    })()
  }
  return cachedDataPromise
}

export async function fetchCategories(): Promise<Category[]> {
  const data = await loadContent()
  return [...(data.categories || [])].sort((a, b) => a.sort_order - b.sort_order)
}

export async function fetchPublishedProducts(categorySlug?: string): Promise<Product[]> {
  const data = await loadContent()
  let list = (data.products || []).filter((p) => p.is_published)
  if (categorySlug) {
    const cat = data.categories?.find((c) => c.slug === categorySlug)
    if (cat) {
      list = list.filter((p) => p.category_id === cat.id)
    } else {
      return []
    }
  }
  return list.sort((a, b) => a.sort_order - b.sort_order)
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const data = await loadContent()
  return (data.products || [])
    .filter((p) => p.is_published && p.is_featured)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 4)
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const data = await loadContent()
  const prod = data.products?.find((p) => p.slug === slug && p.is_published)
  return prod || null
}

export async function fetchRelatedProducts(categoryId: string, excludeId: string): Promise<Product[]> {
  const data = await loadContent()
  return (data.products || [])
    .filter((p) => p.is_published && p.category_id === categoryId && p.id !== excludeId)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 3)
}

export async function fetchPublishedTestimonials(): Promise<Testimonial[]> {
  const data = await loadContent()
  return (data.testimonials || [])
    .filter((t) => t.is_published)
    .sort((a, b) => a.sort_order - b.sort_order)
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const data = await loadContent()
  return data.settings || {}
}
