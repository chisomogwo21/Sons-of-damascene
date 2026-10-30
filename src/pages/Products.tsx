import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import ProductCard from '../components/ProductCard'
import {
  fetchCategories,
  fetchPublishedProducts,
  type Category,
  type Product,
} from '../lib/content'

function SkeletonCard() {
  return (
    <div className="border border-[#E6DFCF] bg-[#FBF6EA]">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-3 w-1/4 rounded" />
      </div>
    </div>
  )
}

export default function Products() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.slice(0, 2) as 'en' | 'rw' | 'fr'
  const [params, setParams] = useSearchParams()
  const categoryParam = params.get('category') || ''

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchPublishedProducts(categoryParam || undefined)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [categoryParam])

  function getCatName(c: Category) {
    return (lang === 'rw' ? c.name_rw : lang === 'fr' ? c.name_fr : null) || c.name_en
  }

  function setCategory(slug: string) {
    if (slug) setParams({ category: slug })
    else setParams({})
  }

  return (
    <>
      <SEO title={t('seo.products_title')} description={t('seo.products_desc')} />
      {/* Top spacing = header height + 48px (112px mobile, 128px desktop) */}
      <div className="pt-[112px] md:pt-[128px] pb-16">
        <div className="content-max">
          {/* Page Heading (32px space below heading to filter chips) */}
          <h1 className="section-heading mb-8">{t('products.heading')}</h1>

          {/* Category Filter Chips (Padding 8px 16px, gap 8px, 1px --line border, sentence case) */}
          {/* 32px space between chips and grid */}
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by category">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-2 text-sm border transition-colors ${
                !categoryParam
                  ? 'bg-[#3B2418] text-white border-[#3B2418]'
                  : 'bg-[#FBF6EA] text-[#3B2418] border-[#E6DFCF] hover:border-[#3B2418]'
              }`}
            >
              {t('products.filter_all', 'All')}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.slug)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  categoryParam === c.slug
                    ? 'bg-[#3B2418] text-white border-[#3B2418]'
                    : 'bg-[#FBF6EA] text-[#3B2418] border-[#E6DFCF] hover:border-[#3B2418]'
                }`}
              >
                {getCatName(c)}
              </button>
            ))}
          </div>

          {/* Product Grid: 3 cols desktop, 2 tablet, 1-2 mobile, 24px gaps (gap-6) */}
          {/* Fixed column width grid ensures 1-2 items do not stretch */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center text-[#8a7060] bg-[#FBF6EA] border border-[#E6DFCF]">
              {t('products.empty')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
