import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Placeholder from '../components/Placeholder'
import { fetchSiteSettings, type SiteSettings } from '../lib/content'

/** Small inline SVG arrow – replaces → text character */
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

export default function About() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<SiteSettings>({})

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch((err) => console.error('[About] settings load error:', err))
  }, [])

  const values = [
    {
      num: '01',
      key: 'craft',
      heading: t('about.value_craft'),
      body: t('about.value_craft_body'),
      modifier: 'values-panel--oak',
    },
    {
      num: '02',
      key: 'durability',
      heading: t('about.value_durability'),
      body: t('about.value_durability_body'),
      modifier: 'values-panel--ink',
    },
    {
      num: '03',
      key: 'local',
      heading: t('about.value_local'),
      body: t('about.value_local_body'),
      modifier: 'values-panel--walnut',
    },
  ]

  return (
    <>
      <SEO title={t('seo.about_title')} description={t('about.body1').slice(0, 160)} />
      <div className="pt-[112px] md:pt-[128px]">
        {/* Intro */}
        <section className="section-gap border-b border-[#E6DFCF]">
          <div className="content-max grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            <div>
              <p className="text-xs text-[#8a7060] uppercase tracking-widest mb-3">
                {t('about.title')}
              </p>
              <h1 className="section-heading font-display">{t('about.heading')}</h1>
            </div>
            <div className="space-y-4 text-[#5c4434]">
              <p>{t('about.body1')}</p>
              <p>{t('about.body2')}</p>
            </div>
          </div>
        </section>

        {/* Banner image */}
        <div className="relative overflow-hidden" style={{ height: 320 }}>
          {settings.about_banner_url ? (
            <img
              src={settings.about_banner_url}
              alt={settings.about_banner_alt || t('about.title') || 'About Sons of Damascene'}
              loading="lazy"
              width={1440}
              height={320}
              className="w-full h-full object-cover"
            />
          ) : (
            <Placeholder label="" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#3B2418]/60 to-transparent pointer-events-none" />
        </div>

        {/* Values */}
        <section className="values-section">
          <div className="content-max">
            <h2 className="values-heading font-display">{t('about.values_heading')}</h2>
            <div className="values-grid">
              {values.map((v) => (
                <div key={v.key} className={`values-panel ${v.modifier}`}>
                  <span className="values-panel-number">{v.num}</span>
                  <div>
                    <h3 className="values-panel-title font-display">{v.heading}</h3>
                    <p className="values-panel-body">{v.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-gap bg-[#4F7568]">
          <div className="content-max">
            <h2 className="section-heading font-display text-white mb-8">{t('about.process_heading')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Design', 'Craft', 'Finish', 'Deliver'].map((step, i) => {
                const stepNum = i + 1
                const urlKey = `about_process_${stepNum}_url`
                const altKey = `about_process_${stepNum}_alt`
                const imgUrl = settings[urlKey]
                const imgAlt = settings[altKey] || step

                return (
                  <div key={step} className="flex flex-col gap-3">
                    <div className="relative overflow-hidden aspect-square">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={imgAlt}
                          loading="lazy"
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Placeholder label={step} />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-0.5">0{stepNum}</p>
                      <p className="text-sm font-normal text-white">{step}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="section-gap border-t border-[#E6DFCF]">
          <div className="content-max flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="text-xl font-normal text-[#3B2418]">{t('about.closing')}</p>
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 px-8 py-3 bg-[#3B2418] text-white text-sm font-normal hover:bg-[#D9541E] transition-colors"
            >
              {t('about.closing_cta')} <ArrowRight />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
