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

export default function Craftsman() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<SiteSettings>({})

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch((err) => console.error('[Craftsman] settings load error:', err))
  }, [])

  return (
    <>
      <SEO title={t('seo.craftsman_title')} description={t('craftsman.intro').slice(0, 160)} />
      <div className="pt-[112px] md:pt-[128px]">
        {/* Hero intro */}
        <section className="section-gap border-b border-[#E6DFCF]">
          <div className="content-max grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Portrait */}
            <div className="relative overflow-hidden aspect-[3/4] max-w-sm mx-auto md:mx-0">
              {settings.craftsman_portrait_url ? (
                <img
                  src={settings.craftsman_portrait_url}
                  alt={settings.craftsman_portrait_alt || t('craftsman.heading')}
                  loading="lazy"
                  width={600}
                  height={800}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Placeholder label="Portrait" />
              )}
            </div>
            <div>
              <p className="text-xs text-[#8a7060] uppercase tracking-widest mb-3">
                {t('craftsman.title')}
              </p>
              <h1 className="section-heading font-display mb-4">{t('craftsman.heading')}</h1>
              <p className="text-[#5c4434] leading-relaxed mb-4">{t('craftsman.intro')}</p>
              <p className="text-sm font-normal text-[#D9541E]">{t('craftsman.experience')}</p>
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="section-gap bg-[#9DAE8A]">
          <div className="content-max max-w-2xl">
            <h2 className="section-heading font-display text-[#3B2418] mb-4">
              {t('craftsman.approach_heading')}
            </h2>
            <p className="text-[#3B2418]/80 leading-relaxed">
              {t('craftsman.approach_body')}
            </p>
          </div>
        </section>

        {/* Process photos */}
        <section className="section-gap">
          <div className="content-max">
            <h2 className="section-heading font-display mb-8">{t('craftsman.tools_heading')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="relative overflow-hidden aspect-[4/3]">
                {settings.craftsman_process_url ? (
                  <img
                    src={settings.craftsman_process_url}
                    alt={settings.craftsman_process_alt || 'Craftsman workshop'}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Placeholder label="Workshop" />
                )}
              </div>
              <div className="space-y-6">
                <p className="text-[#5c4434] leading-relaxed">
                  {t('craftsman.tools_body')}
                </p>
                <div className="relative overflow-hidden aspect-[4/3]">
                  {settings.craftsman_tools_url ? (
                    <img
                      src={settings.craftsman_tools_url}
                      alt={settings.craftsman_tools_alt || 'Woodworking tools'}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Placeholder label="Tools" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-gap bg-[#3B2418]">
          <div className="content-max text-center">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 px-10 py-4 border border-white text-white text-sm font-normal hover:bg-white hover:text-[#3B2418] transition-colors"
            >
              {t('craftsman.link')} <ArrowRight />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
