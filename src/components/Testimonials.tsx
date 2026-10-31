import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pause, Play } from 'lucide-react'
import type { Testimonial } from '../lib/content'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.slice(0, 2) as 'en' | 'rw' | 'fr'

  const [hasEntered, setHasEntered] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)

  // 1. Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mq.matches)
    const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [])

  // 2. IntersectionObserver for ~25% visibility trigger (plays once)
  useEffect(() => {
    if (isReducedMotion) {
      setHasEntered(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    // Safety fallback: guarantee visible if observer does not fire within 1s
    const timer = setTimeout(() => {
      setHasEntered(true)
    }, 1000)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [isReducedMotion])

  if (!testimonials || testimonials.length === 0) return null

  function getQuote(item: Testimonial) {
    return (lang === 'rw' ? item.quote_rw : lang === 'fr' ? item.quote_fr : null) || item.quote_en
  }

  // Ensure at least 6 cards in base set for a full track width
  let baseList = [...testimonials]
  while (baseList.length < 6) {
    baseList = [...baseList, ...testimonials]
  }

  // Double the list for seamless infinite loop (Set 1 + Set 2)
  const fullTrackList = [...baseList, ...baseList]

  return (
    <section
      ref={sectionRef}
      className="section-gap bg-[#4F7568] relative overflow-hidden text-white"
      aria-labelledby="testimonials-heading"
    >
      {/* Heading (Always white and fully opaque once entered) */}
      <div className="content-max mb-8 md:mb-10">
        <h2
          id="testimonials-heading"
          className="section-heading font-display transition-opacity duration-500"
          style={{ color: 'var(--white)', opacity: isReducedMotion || hasEntered ? 1 : 0 }}
        >
          {t('home.testimonials_heading')}
        </h2>
      </div>

      {/* Reduced Motion / No-JS Fallback: Static horizontal scroll-snap row */}
      {isReducedMotion ? (
        <div className="content-max">
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none">
            {baseList.map((item, index) => (
              <figure
                key={`static-${item.id}-${index}`}
                className="w-[80vw] max-w-[320px] sm:w-[380px] md:w-[400px] flex-shrink-0 snap-start bg-white/10 hover:bg-white/20 transition-colors duration-250 p-6 md:p-8 flex flex-col justify-between"
              >
                <blockquote className="text-white text-sm md:text-[15px] leading-relaxed mb-6 font-normal">
                  "{getQuote(item)}"
                </blockquote>
                <figcaption className="text-white/80 text-xs md:text-sm">
                  <cite className="not-italic font-normal text-white block">
                    {item.author_name}
                  </cite>
                  {item.author_location && (
                    <span className="text-white/70 text-xs">{item.author_location}</span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : (
        /* Outer Entrance Wrapper: Handles fade & 16px rise entrance for whole track */
        <div
          className="testimonials-wrapper relative w-full overflow-hidden testimonials-mask py-2"
          style={{
            opacity: hasEntered ? 1 : 0,
            transform: hasEntered ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 600ms ease-out, transform 600ms ease-out',
          }}
        >
          {/* Inner Marquee Track: Handles infinite horizontal translateX marquee */}
          <div
            className={`testimonials-marquee-track ${isPaused ? 'paused' : ''}`}
            style={{
              animationDuration: `${baseList.length * 8}s`,
            }}
          >
            {fullTrackList.map((item, index) => {
              const isSecondSet = index >= baseList.length

              return (
                <figure
                  key={`card-${item.id}-${index}`}
                  aria-hidden={isSecondSet ? 'true' : undefined}
                  className="w-[80vw] max-w-[320px] sm:w-[380px] md:w-[400px] flex-shrink-0 bg-white/10 hover:bg-white/20 transition-colors duration-250 p-6 md:p-8 flex flex-col justify-between"
                >
                  <blockquote className="text-white text-sm md:text-[15px] leading-relaxed mb-6 font-normal select-text">
                    "{getQuote(item)}"
                  </blockquote>
                  <figcaption className="text-white/80 text-xs md:text-sm">
                    <cite className="not-italic font-normal text-white block">
                      {item.author_name}
                    </cite>
                    {item.author_location && (
                      <span className="text-white/70 text-xs">{item.author_location}</span>
                    )}
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </div>
      )}

      {/* Pause / Play Control Button (Placed BELOW track, right-aligned to container edge with 24px space) */}
      {!isReducedMotion && (
        <div className="content-max mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={
              isPaused
                ? t('testimonials.play', 'Play testimonials')
                : t('testimonials.pause', 'Pause testimonials')
            }
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {isPaused ? <Play className="w-4 h-4 fill-white ml-0.5" /> : <Pause className="w-4 h-4 fill-white" />}
          </button>
        </div>
      )}
    </section>
  )
}
