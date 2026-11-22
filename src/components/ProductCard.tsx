import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Product } from '../lib/content'
import { formatPrice } from '../lib/price'
import Placeholder from './Placeholder'

interface ProductCardProps {
  product: Product
  /** When true, shows "Sample price" marker (admin only) */
  showSampleMarker?: boolean
}

function getCoverImage(product: Product): string | undefined {
  const imgs = product.product_images || []
  const cover = imgs.find((i) => i.is_cover)
  return cover?.url || imgs[0]?.url
}

export default function ProductCard({ product, showSampleMarker = false }: ProductCardProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.slice(0, 2) as 'en' | 'rw' | 'fr'

  const name =
    (lang === 'rw' ? product.name_rw : lang === 'fr' ? product.name_fr : null) ||
    product.name_en

  const priceLabel =
    product.price_amount !== null
      ? formatPrice(product.price_amount, product.currency, lang)
      : t('products.price_request')

  const cover = getCoverImage(product)
  const cat = product.categories

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block bg-[#FBF6EA] border border-[#E6DFCF] hover:border-[#D9541E] transition-colors"
      aria-label={name}
    >
      {/* Image: uniform 4/3 ratio, uncropped centered foreground + blurred cream-washed backdrop */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[#F5EDD8] img-zoom">
        {cover ? (
          <>
            {/* Blurred background image filling empty space */}
            <img
              src={cover}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover img-blur-bg pointer-events-none select-none"
              style={{ filter: 'blur(24px)', transform: 'scale(1.35)' }}
            />
            {/* Light cream wash overlay */}
            <div className="absolute inset-0 bg-[#FBF6EA]/60 pointer-events-none" />

            {/* Sharp uncropped main photo */}
            <img
              src={cover}
              alt={name}
              loading="lazy"
              className="relative z-10 w-full h-full object-contain img-zoom-target"
            />
          </>
        ) : (
          <Placeholder />
        )}
      </div>

      {/* Details */}
      <div className="p-4 md:p-5">
        {cat && (
          <p className="text-xs text-[#8a7060] mb-1 uppercase tracking-wide">
            {(lang === 'rw' ? cat.name_rw : lang === 'fr' ? cat.name_fr : null) || cat.name_en}
          </p>
        )}
        <h3 className="font-normal text-[#3B2418] text-base leading-snug mb-1">{name}</h3>
        <p className="text-sm text-[#8a7060]">
          {priceLabel}
          {showSampleMarker && product.price_amount !== null && (
            <span className="ml-2 text-xs bg-[#FDEBB0] text-[#8a7060] px-1.5 py-0.5 rounded">
              {t('products.sample_price')}
            </span>
          )}
        </p>
      </div>
    </Link>
  )
}
