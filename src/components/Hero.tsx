import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface HeroProps {
  videoUrl?: string
  posterUrl?: string
  overlayOpacity?: number | string
}

function clampOpacity(value: number | string | undefined | null): number {
  if (value === undefined || value === null || value === '') return 25
  const parsed = typeof value === 'number' ? value : parseFloat(value)
  if (isNaN(parsed)) return 25
  return Math.min(60, Math.max(0, Math.round(parsed)))
}

/**
 * Full-bleed video hero (Team7 treatment).
 * Falls back to a warm gradient when no video is configured.
 * Respects prefers-reduced-motion.
 */
export default function Hero({ videoUrl, posterUrl, overlayOpacity }: HeroProps) {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const opacity = clampOpacity(overlayOpacity)

  // Pause video when reduced motion is preferred
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches && videoRef.current) {
      videoRef.current.pause()
    }
  }, [])

  return (
    <section
      className="hero overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Background ── */}
      {videoUrl ? (
        <video
          ref={videoRef}
          className="hero-media absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          poster={posterUrl || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ) : posterUrl ? (
        <img
          src={posterUrl}
          alt=""
          aria-hidden="true"
          className="hero-media absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        /* Warm gradient fallback */
        <div
          className="hero-media absolute inset-0 w-full h-full"
          style={{
            background:
              'linear-gradient(120deg, #3B2418 0%, #6b3c22 35%, #a0622a 65%, #c8833a 100%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Flat overlay over video or poster only (no gradient, no colour tint) */}
      {(videoUrl || posterUrl) && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${opacity / 100})`,
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Content ── */}
      <div className="relative content-max h-full flex flex-col justify-end hero-content-inner">
        <h1 className="hero-headline font-display max-w-2xl">
          {t('hero.line1')}<br />
          {t('hero.line2')}<br />
          {t('hero.line3')}
        </h1>
      </div>
    </section>
  )
}
