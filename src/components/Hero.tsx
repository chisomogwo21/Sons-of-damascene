import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { HeroImageItem } from '../lib/content'

interface HeroProps {
  images?: HeroImageItem[]
  overlayOpacity?: number | string
}

interface PanelSlot {
  currentIdx: number
  previousIdx: number | null
  transitionId: number
}

const MAX_PANELS = 3
const CYCLE_MS = 5000
const STAGGER_MS = 1700

function clampOpacity(value: number | string | undefined | null): number {
  if (value === undefined || value === null || value === '') return 35
  const parsed = typeof value === 'number' ? value : parseFloat(value)
  if (isNaN(parsed)) return 35
  return Math.min(60, Math.max(0, Math.round(parsed)))
}

function getPanelCount(): number {
  if (typeof window === 'undefined') return 3
  if (window.matchMedia('(min-width: 1024px)').matches) return 3
  if (window.matchMedia('(min-width: 768px)').matches) return 2
  return 1
}

function makeInitialSlots(count: number): PanelSlot[] {
  if (count === 0) return []
  return Array.from({ length: Math.min(MAX_PANELS, count) }, (_, i) => ({
    currentIdx: i % count,
    previousIdx: null,
    transitionId: 0,
  }))
}

/**
 * Full-bleed multi-panel photo hero.
 * Desktop: 3 panels, Tablet: 2 panels, Mobile: 1 panel.
 * Staggered crossfade (1.2s) + subtle slow zoom (1.00 -> 1.06), never duplicating
 * a photo across visible panels. Respects prefers-reduced-motion and pauses when tab is hidden.
 */
export default function Hero({ images = [], overlayOpacity }: HeroProps) {
  const { t } = useTranslation()
  const opacity = clampOpacity(overlayOpacity)

  const [panelCount, setPanelCount] = useState<number>(getPanelCount)
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )
  const [isPaused, setIsPaused] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.visibilityState === 'hidden' : false
  )
  const [slots, setSlots] = useState<PanelSlot[]>(() => makeInitialSlots(images.length))

  const cursorRef = useRef<number>(Math.min(MAX_PANELS, images.length))
  const slotsRef = useRef<PanelSlot[]>(slots)
  slotsRef.current = slots

  // Reset slots if image list length changes
  useEffect(() => {
    setSlots(makeInitialSlots(images.length))
    cursorRef.current = Math.min(MAX_PANELS, images.length)
  }, [images.length])

  // Track responsive panel count (desktop=3, tablet=2, mobile=1)
  useEffect(() => {
    const mqDesktop = window.matchMedia('(min-width: 1024px)')
    const mqTablet = window.matchMedia('(min-width: 768px)')
    const update = () => setPanelCount(getPanelCount())
    mqDesktop.addEventListener('change', update)
    mqTablet.addEventListener('change', update)
    return () => {
      mqDesktop.removeEventListener('change', update)
      mqTablet.removeEventListener('change', update)
    }
  }, [])

  // Track prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Pause animation & timers when browser tab is hidden
  useEffect(() => {
    const onVisibility = () => setIsPaused(document.visibilityState === 'hidden')
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Preload first 3 images eagerly; lazily warm the rest after initial paint
  useEffect(() => {
    if (images.length === 0) return
    const links: HTMLLinkElement[] = []
    images.slice(0, 3).forEach((img) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = img.url
      document.head.appendChild(link)
      links.push(link)
    })

    const lazyTimer = window.setTimeout(() => {
      images.slice(3).forEach((img) => {
        const pre = new Image()
        pre.loading = 'lazy'
        pre.src = img.url
      })
    }, 2200)

    return () => {
      window.clearTimeout(lazyTimer)
      links.forEach((l) => l.remove())
    }
  }, [images])

  // Staggered panel cycling (offset ~1.7s apart, ~5s per panel)
  useEffect(() => {
    const total = images.length
    const activeCount = Math.min(panelCount, total)
    if (reducedMotion || isPaused || total <= activeCount) return

    const timeouts: number[] = []
    const intervals: number[] = []

    const advancePanel = (panelIdx: number) => {
      const targetTransitionId = (slotsRef.current[panelIdx]?.transitionId ?? 0) + 1
      setSlots((prev) => {
        if (!prev[panelIdx]) return prev
        const used = new Set<number>()
        for (let i = 0; i < activeCount; i++) {
          used.add(prev[i].currentIdx)
          if (prev[i].previousIdx !== null) {
            used.add(prev[i].previousIdx as number)
          }
        }

        let nextIdx = -1
        for (let offset = 0; offset < total; offset++) {
          const candidate = (cursorRef.current + offset) % total
          if (!used.has(candidate)) {
            nextIdx = candidate
            cursorRef.current = (candidate + 1) % total
            break
          }
        }
        if (nextIdx === -1) return prev

        const next = [...prev]
        next[panelIdx] = {
          previousIdx: prev[panelIdx].currentIdx,
          currentIdx: nextIdx,
          transitionId: targetTransitionId,
        }
        return next
      })

      // Clear outgoing crossfade layer once the 1.2s fade finishes so its photo returns to the pool
      const clearId = window.setTimeout(() => {
        setSlots((prev) => {
          if (!prev[panelIdx] || prev[panelIdx].transitionId !== targetTransitionId) return prev
          const next = [...prev]
          next[panelIdx] = { ...prev[panelIdx], previousIdx: null }
          return next
        })
      }, 1300)
      timeouts.push(clearId)
    }

    for (let p = 0; p < activeCount; p++) {
      const initialDelay = CYCLE_MS + p * STAGGER_MS
      const tId = window.setTimeout(() => {
        advancePanel(p)
        const iId = window.setInterval(() => advancePanel(p), CYCLE_MS)
        intervals.push(iId)
      }, initialDelay)
      timeouts.push(tId)
    }

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id))
      intervals.forEach((id) => window.clearInterval(id))
    }
  }, [images.length, panelCount, reducedMotion, isPaused])

  const visibleSlots = slots.slice(0, Math.min(panelCount, slots.length))

  return (
    <section
      className={`hero overflow-hidden ${isPaused ? 'hero-paused' : ''} ${
        reducedMotion ? 'hero-static' : ''
      }`}
      aria-label="Hero section"
    >
      {/* ── Background photo panels ── */}
      {visibleSlots.length > 0 ? (
        <div
          className={`absolute inset-0 grid w-full h-full bg-[#FBF6EA] ${
            panelCount === 3
              ? 'grid-cols-3 gap-[2px]'
              : panelCount === 2
              ? 'grid-cols-2 gap-[2px]'
              : 'grid-cols-1'
          }`}
          aria-hidden="true"
        >
          {visibleSlots.map((slot, panelIdx) => {
            const curr = images[slot.currentIdx]
            const prev = slot.previousIdx !== null ? images[slot.previousIdx] : null
            if (!curr) return null

            return (
              <div
                key={panelIdx}
                className="relative w-full h-full overflow-hidden bg-[#3B2418]"
              >
                {prev && !reducedMotion && (
                  <img
                    key={`prev-${panelIdx}-${slot.transitionId - 1}`}
                    src={prev.url}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    style={{ objectPosition: prev.position || '50% 50%' }}
                    className="hero-panel-img hero-panel-img--prev"
                  />
                )}
                <img
                  key={`curr-${panelIdx}-${slot.transitionId}`}
                  src={curr.url}
                  alt={curr.alt}
                  loading={slot.transitionId === 0 ? 'eager' : 'lazy'}
                  fetchPriority={slot.transitionId === 0 ? 'high' : 'auto'}
                  decoding="async"
                  style={{ objectPosition: curr.position || '50% 50%' }}
                  className={`hero-panel-img ${
                    reducedMotion
                      ? ''
                      : slot.transitionId > 0
                      ? 'hero-panel-img--enter'
                      : 'hero-panel-img--initial'
                  }`}
                />
              </div>
            )
          })}
        </div>
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

      {/* Flat dark overlay (no gradient, no colour tint) */}
      {visibleSlots.length > 0 && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${opacity / 100})`,
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Content ── */}
      <div className="relative z-20 content-max h-full flex flex-col justify-end hero-content-inner">
        <h1 className="hero-headline font-display max-w-2xl">
          {t('hero.line1')}<br />
          {t('hero.line2')}<br />
          {t('hero.line3')}
        </h1>
      </div>
    </section>
  )
}
