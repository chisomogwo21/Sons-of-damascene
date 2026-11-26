import { categories as rawCategories, type Category } from '../content/categories'
import { testimonials as rawTestimonials, type Testimonial } from '../content/testimonials'
import {
  settings as rawSettings,
  heroImages as rawHeroImages,
  type SiteSettings,
  type HeroImageItem,
} from '../content/settings'
import { products as rawProducts, type ProductItem } from '../content/products'

export type { Category } from '../content/categories'
export type { Testimonial } from '../content/testimonials'
export type { SiteSettings, HeroImageItem } from '../content/settings'

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
  created_at?: string
  product_images?: ProductImage[]
  categories?: Category | null
}

export interface ContentData {
  products: Product[]
  categories: Category[]
  testimonials: Testimonial[]
  settings: SiteSettings
}

function resolveMediaUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = import.meta.env.BASE_URL || '/'
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url
  return `${base.endsWith('/') ? base : base + '/'}${cleanUrl}`
}

function mapProduct(p: ProductItem): Product {
  const categoryObj = rawCategories.find((c) => c.slug === p.category) || null
  const product_images: ProductImage[] = (p.images || []).map((img, idx) => {
    const rawUrl = typeof img === 'string' ? img : img.url
    const alt = typeof img === 'string' ? p.name_en : (img.alt_text ?? p.name_en)
    return {
      id: `${p.slug}-${idx + 1}`,
      product_id: p.slug,
      url: resolveMediaUrl(rawUrl),
      alt_text: alt,
      sort_order: idx,
      is_cover: idx === 0,
    }
  })

  return {
    id: p.slug,
    slug: p.slug,
    category_id: categoryObj ? categoryObj.id : p.category,
    name_en: p.name_en,
    name_rw: p.name_rw,
    name_fr: p.name_fr,
    description_en: p.description_en,
    description_rw: p.description_rw,
    description_fr: p.description_fr,
    wood_type: p.wood_type,
    dimensions: p.dimensions,
    lead_time_text: p.lead_time_text,
    price_amount: p.price_amount,
    currency: p.currency,
    is_published: p.published,
    is_featured: p.featured,
    sort_order: p.sortOrder,
    product_images,
    categories: categoryObj,
  }
}

function getResolvedSettings(): SiteSettings {
  const resolved: SiteSettings = { ...rawSettings }
  const mediaKeys = [
    'collage_workshop_url',
    'collage_materials_url',
    'collage_finish_url',
    'banner_image_url',
    'about_banner_url',
    'craftsman_portrait_url',
    'craftsman_process_url',
    'about_process_1_url',
    'about_process_2_url',
    'about_process_3_url',
    'about_process_4_url',
    'craftsman_tools_url',
  ]
  for (const k of mediaKeys) {
    const val = resolved[k]
    if (typeof val === 'string' && val) {
      resolved[k] = resolveMediaUrl(val)
    }
  }
  return resolved
}

export function getHeroImages(): HeroImageItem[] {
  return rawHeroImages.map((img) => ({
    ...img,
    url: resolveMediaUrl(img.url),
  }))
}

export async function loadContent(): Promise<ContentData> {
  const mappedProducts = rawProducts.map(mapProduct)
  return {
    products: mappedProducts,
    categories: await fetchCategories(),
    testimonials: [...rawTestimonials],
    settings: getResolvedSettings(),
  }
}

function getFirstProductCoverForCategory(categorySlug: string): string | null {
  const match = [...rawProducts]
    .filter((p) => p.published && p.category === categorySlug && p.images.length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder)[0]
  if (!match) return null
  const firstImg = match.images[0]
  const rawUrl = typeof firstImg === 'string' ? firstImg : firstImg?.url
  return rawUrl ? resolveMediaUrl(rawUrl) : null
}

export async function fetchCategories(): Promise<Category[]> {
  const activeCategorySlugs = new Set(
    rawProducts.filter((p) => p.published).map((p) => p.category)
  )
  return rawCategories
    .filter((c) => activeCategorySlugs.has(c.slug))
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => {
      const explicitCover = c.coverImage || c.cover_image_url
      const resolvedCover = explicitCover
        ? resolveMediaUrl(explicitCover)
        : getFirstProductCoverForCategory(c.slug)
      return {
        ...c,
        cover_image_url: resolvedCover,
      }
    })
}

export async function fetchPublishedProducts(categorySlug?: string): Promise<Product[]> {
  let list = rawProducts.filter((p) => p.published).map(mapProduct)
  if (categorySlug) {
    list = list.filter((p) => p.categories?.slug === categorySlug || p.category_id === categorySlug)
  }
  return list.sort((a, b) => a.sort_order - b.sort_order)
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  return rawProducts
    .filter((p) => p.published && p.featured)
    .map(mapProduct)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 4)
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const p = rawProducts.find((item) => item.slug === slug && item.published)
  if (!p) return null
  return mapProduct(p)
}

export async function fetchRelatedProducts(categoryId: string, excludeId: string): Promise<Product[]> {
  return rawProducts
    .filter(
      (p) =>
        p.published &&
        (p.category === categoryId || p.category === rawCategories.find((c) => c.id === categoryId)?.slug) &&
        p.slug !== excludeId
    )
    .map(mapProduct)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 3)
}

export async function fetchPublishedTestimonials(): Promise<Testimonial[]> {
  return [...rawTestimonials]
    .filter((t) => t.is_published)
    .sort((a, b) => a.sort_order - b.sort_order)
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  return getResolvedSettings()
}
