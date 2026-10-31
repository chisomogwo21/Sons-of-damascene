import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Category } from '../lib/content'
import CategoryIllustration from './CategoryIllustration'

interface CategoryGridProps {
  categories: Category[]
  isLoading?: boolean
}

/** Small inline SVG arrow – replaces the → text character */
function ArrowRight() {
  return (
    <svg
      className="arrow-icon"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 8h12M9 3l5 5-5 5" />
    </svg>
  )
}

export default function CategoryGrid({ categories, isLoading = false }: CategoryGridProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.slice(0, 2) as 'en' | 'rw' | 'fr'

  function getName(c: Category) {
    return (lang === 'rw' ? c.name_rw : lang === 'fr' ? c.name_fr : null) || c.name_en
  }

  const showAllPiecesCell = categories.length > 0 && categories.length % 3 !== 0
  const allPiecesText =
    lang === 'rw' ? 'Ibintu byose' : lang === 'fr' ? 'Toutes les pièces' : 'All pieces'

  return (
    <div className="w-full">
      {/* Visually hidden h2 for accessibility */}
      <h2 className="sr-only">{t('home.categories_heading')}</h2>

      {categories.length === 0 && !isLoading ? (
        <div className="py-12">
          <div className="p-8 text-center border border-[#E6DFCF] bg-[#FBF6EA]">
            <p className="text-base font-normal text-[#3B2418]">
              {t('home.no_categories', 'No categories available at the moment.')}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#E6DFCF] border-b border-[#E6DFCF] overflow-hidden">
          {categories.map((cat) => {
            const categoryName = getName(cat)
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col justify-between bg-[#FBF6EA] transition-colors aspect-[1/0.8]"
                aria-label={categoryName}
              >
                {/* Image area: centred with image/illustration at max 50% width */}
                <div className="relative flex-1 w-full flex items-center justify-center p-4">
                  {cat.cover_image_url ? (
                    <img
                      src={cat.cover_image_url}
                      alt={categoryName}
                      className="max-w-[50%] max-h-[75%] object-contain object-center transition-transform duration-300 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full max-w-[50%] flex items-center justify-center">
                      <CategoryIllustration
                        slug={cat.slug}
                        className="transition-transform duration-300 group-hover:scale-[1.04]"
                      />
                    </div>
                  )}
                </div>

                {/* Label: centred directly under image — Supreme 400 */}
                <div className="pb-5 px-4 text-center">
                  <span className="text-[17px] font-normal text-[#3B2418] group-hover:underline underline-offset-4 transition-all">
                    {categoryName}
                  </span>
                </div>
              </Link>
            )
          })}

          {/* 6th quiet link cell when category count doesn't fill row evenly (e.g. 5 categories) */}
          {showAllPiecesCell && (
            <Link
              to="/products"
              className="group flex flex-col items-center justify-center bg-[#FBF6EA] aspect-[1/0.8] p-6 text-center transition-colors"
              aria-label={t('home.all_pieces', allPiecesText)}
            >
              <span className="text-[17px] font-normal text-[#3B2418] group-hover:underline underline-offset-4 flex items-center gap-1.5 transition-all">
                {t('home.all_pieces', allPiecesText)}{' '}
                <ArrowRight />
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
