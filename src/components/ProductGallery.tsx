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

  const activeImg = sorted[active] || sorted[0]

  return (
    <div className="flex flex-col gap-3">
      {/* Main image: uncropped, natural proportion, max-h-[80vh] with blurred cream-washed backdrop */}
      <div className="relative overflow-hidden w-full flex items-center justify-center bg-[#F5EDD8] border border-[#E6DFCF]">
        {/* Blurred background image filling empty space */}
        <img
          src={activeImg.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ filter: 'blur(24px)', transform: 'scale(1.35)' }}
        />
        {/* Light cream wash overlay */}
        <div className="absolute inset-0 bg-[#FBF6EA]/60 pointer-events-none" />

        {/* Sharp uncropped main photo */}
        <img
          src={activeImg.url}
          alt={activeImg.alt_text || productName}
          className="relative z-10 w-full max-h-[80vh] object-contain"
        />

        {sorted.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white text-[#3B2418] transition-colors shadow-sm"
              aria-label={t('product.gallery_prev')}
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white text-[#3B2418] transition-colors shadow-sm"
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
              className={`relative flex-none w-16 h-16 overflow-hidden border-2 transition-colors bg-[#F5EDD8] ${
                i === active ? 'border-[#D9541E]' : 'border-[#E6DFCF]'
              }`}
              aria-label={`Image ${i + 1}`}
              aria-pressed={i === active}
            >
              {/* Blurred background for thumbnail */}
              <img
                src={img.url}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                style={{ filter: 'blur(12px)', transform: 'scale(1.3)' }}
              />
              <div className="absolute inset-0 bg-[#FBF6EA]/50 pointer-events-none" />
              {/* Uncropped thumbnail */}
              <img
                src={img.url}
                alt={img.alt_text || `${productName} ${i + 1}`}
                className="relative z-10 w-full h-full object-contain"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
