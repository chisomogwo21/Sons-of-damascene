import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProductImage } from '../lib/content'
import Placeholder from './Placeholder'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square">
        <Placeholder />
      </div>
    )
  }

  const sorted = [...images].sort((a, b) => {
    if (a.is_cover) return -1
    if (b.is_cover) return 1
    return a.sort_order - b.sort_order
  })

  function prev() {
    setActive((i) => (i - 1 + sorted.length) % sorted.length)
  }
  function next() {
    setActive((i) => (i + 1) % sorted.length)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative overflow-hidden aspect-square bg-[#F5EDD8]">
        <img
          src={sorted[active].url}
          alt={sorted[active].alt_text || productName}
          className="w-full h-full object-cover"
        />
        {sorted.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white transition-colors"
              aria-label={t('product.gallery_prev')}
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white transition-colors"
              aria-label={t('product.gallery_next')}
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`flex-none w-16 h-16 overflow-hidden border-2 transition-colors ${
                i === active ? 'border-[#D9541E]' : 'border-transparent'
              }`}
              aria-label={`Image ${i + 1}`}
              aria-pressed={i === active}
            >
              <img
                src={img.url}
                alt={img.alt_text || `${productName} ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
