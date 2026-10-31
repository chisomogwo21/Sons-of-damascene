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
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] img-zoom">
        {cover ? (
          <img
            src={cover}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-400"
          />
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
