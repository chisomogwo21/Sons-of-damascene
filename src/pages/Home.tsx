import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import CategoryGrid from '../components/CategoryGrid'
import EditorialCollage from '../components/EditorialCollage'
import Testimonials from '../components/Testimonials'
import {
  fetchCategories,
  fetchPublishedTestimonials,
  fetchSiteSettings,
  type Category,
  type Testimonial,
  type SiteSettings,
} from '../lib/content'

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function Home() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loadingCats, setLoadingCats] = useState(true)

  useScrollReveal()

  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        setCategories(cats)
      })
      .catch((err) => {
        console.error('[Home] fetchCategories error:', err)
      })
      .finally(() => setLoadingCats(false))

    fetchPublishedTestimonials()
      .then(setTestimonials)
      .catch((err) => console.error('[Home] fetchPublishedTestimonials error:', err))

    fetchSiteSettings()
      .then(setSettings)
      .catch((err) => console.error('[Home] fetchSiteSettings error:', err))
  }, [])

  return (
    <>
      <SEO title={t('seo.home_title')} description={t('seo.home_desc')} />

      {/* Hero */}
      <Hero
        videoUrl={settings.hero_video_url}
        posterUrl={settings.hero_poster_url}
        overlayOpacity={settings.hero_overlay_opacity}
      />

      {/* Intro Section Wrapper */}
      <section className="intro-section">
        <div className="content-max">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-0">
            {/* Left Column (Heading - about 30% width) */}
            <div className="w-full md:w-[30%] reveal">
              <h2 className="intro-heading-text">
                {t('home.intro_heading')}
              </h2>
            </div>

            {/* Right Column (Text - starts at 35% from left, 65% width, 4px gap between paragraphs) */}
            <div
              className="w-full md:w-[65%] reveal intro-body-text"
              style={{ transitionDelay: '80ms' }}
            >
              <p>{t('home.intro_body1')}</p>
              <p>{t('home.intro_body2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid directly under the intro section divider */}
      <div className="bg-[#FBF6EA]">
        <div className="content-max">
          <CategoryGrid categories={categories} isLoading={loadingCats} />
        </div>
      </div>

      {/* Editorial collage */}
      <EditorialCollage settings={settings} />

      {/* Testimonials */}
      <Testimonials testimonials={testimonials} />

      {/* Banner Section (inside max-width container) */}
      <section className="bg-[#FBF6EA]">
        <div className="content-max">
          {/* 1px --line divider spanning the container width */}
          <div className="border-t border-[#E6DFCF]" />

          {/* clamp(48px, 6vw, 88px) of cream space above banner */}
          <div className="pt-[clamp(48px,6vw,88px)]">
            <div className="relative w-full overflow-hidden home-banner bg-[#3B2418]">
              {/* Image or Warm Gradient Placeholder (No text) */}
              {settings.banner_image_url ? (
                <img
                  src={settings.banner_image_url}
                  alt={settings.banner_image_alt || t('home.banner_headline') || 'Sons of Damascene'}
                  loading="lazy"
                  width={1200}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    background:
                      'linear-gradient(135deg, #f0e8d5 0%, #e8dcc5 50%, #d9ccaa 100%)',
                  }}
                >
                  {/* Subtle grain overlay */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
                      backgroundSize: '200px',
                    }}
                  />
                </div>
              )}

              {/* Dark-to-transparent gradient on the right half (~55% opacity at right edge) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.1) 45%, transparent 60%)',
                }}
              />

              {/* Headline */}
              <div className="absolute inset-0 flex items-end md:items-center justify-end p-6 md:p-0 md:pr-[6%]">
                <h2 className="home-banner-headline text-white text-right">
                  {t('home.banner_headline')}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
