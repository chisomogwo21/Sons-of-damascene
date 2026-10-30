import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import ProductGallery from '../components/ProductGallery'
import WhatsAppButton from '../components/WhatsAppButton'
import ProductCard from '../components/ProductCard'
import {
  fetchProductBySlug,
  fetchRelatedProducts,
  fetchSiteSettings,
  type Product,
  type SiteSettings,
} from '../lib/content'
import { formatPrice } from '../lib/price'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const lang = i18n.language.slice(0, 2) as 'en' | 'rw' | 'fr'

  const [product, setProduct] = useState<Product | null | undefined>(undefined)
  const [related, setRelated] = useState<Product[]>([])
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Promise.all([fetchProductBySlug(slug), fetchSiteSettings()]).then(
      ([p, s]) => {
        setProduct(p)
        setSettings(s)
        if (p?.category_id) {
          fetchRelatedProducts(p.category_id, p.id).then(setRelated)
        }
        setLoading(false)
      }
    )
  }, [slug])

  if (loading) {
    return (
      <div className="pt-[112px] md:pt-[128px] content-max section-gap">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="skeleton aspect-square w-full" />
          <div className="space-y-4">
            <div className="skeleton h-6 w-1/3 rounded" />
            <div className="skeleton h-8 w-2/3 rounded" />
            <div className="skeleton h-4 w-1/4 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (product === null) return <Navigate to="/products" replace />

  if (!product) return null

  const name =
    (lang === 'rw' ? product.name_rw : lang === 'fr' ? product.name_fr : null) ||
    product.name_en

  const desc =
    (lang === 'rw' ? product.description_rw : lang === 'fr' ? product.description_fr : null) ||
    product.description_en

  const catName = product.categories
    ? (lang === 'rw'
        ? product.categories.name_rw
        : lang === 'fr'
        ? product.categories.name_fr
        : null) || product.categories.name_en
    : null

  const priceLabel =
    product.price_amount !== null
      ? formatPrice(product.price_amount, product.currency, lang)
      : t('product.price_request')

  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const phone = settings.whatsapp_number || '+250783710430'

  const images = [...(product.product_images || [])].sort((a, b) => {
    if (a.is_cover) return -1
    if (b.is_cover) return 1
    return a.sort_order - b.sort_order
  })

  return (
    <>
      <SEO
        title={`${name} – Sons of Damascene`}
        description={desc?.slice(0, 160) || t('seo.products_desc')}
        ogImage={images[0]?.url}
      />
      <div className="pt-[112px] md:pt-[128px]">
        <div className="content-max section-gap">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Gallery */}
            <ProductGallery images={images} productName={name} />

            {/* Details */}
            <div className="flex flex-col gap-6">
              {catName && (
                <p className="text-xs text-[#8a7060] uppercase tracking-widest">{catName}</p>
              )}
              <h1 className="section-heading">{name}</h1>
              <p className="text-xl font-medium text-[#D9541E]">{priceLabel}</p>

              {desc && (
                <p className="text-sm leading-relaxed text-[#5c4434]">{desc}</p>
              )}

              {/* Details list */}
              <dl className="divide-y divide-[#E6DFCF] border-y border-[#E6DFCF] text-sm">
                {product.wood_type && (
                  <div className="flex justify-between py-3">
                    <dt className="text-[#8a7060]">{t('product.wood_type')}</dt>
                    <dd className="font-medium text-[#3B2418]">{product.wood_type}</dd>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between py-3">
                    <dt className="text-[#8a7060]">{t('product.dimensions')}</dt>
                    <dd className="font-medium text-[#3B2418]">{product.dimensions}</dd>
                  </div>
                )}
                {product.lead_time_text && (
                  <div className="flex justify-between py-3">
                    <dt className="text-[#8a7060]">{t('product.lead_time')}</dt>
                    <dd className="font-medium text-[#3B2418]">{product.lead_time_text}</dd>
                  </div>
                )}
              </dl>

              {/* WhatsApp button — ONLY here */}
              <div className="pt-2">
                <WhatsAppButton
                  phone={phone}
                  productName={name}
                  productUrl={pageUrl}
                />
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <section className="mt-16 md:mt-24 pt-10 border-t border-[#E6DFCF]">
              <h2 className="section-heading mb-6">{t('product.related')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}
