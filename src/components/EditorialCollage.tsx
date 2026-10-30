import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Placeholder from './Placeholder'
import type { SiteSettings } from '../lib/content'

interface EditorialCollageProps {
  settings?: SiteSettings
}

export default function EditorialCollage({ settings }: EditorialCollageProps) {
  const { t } = useTranslation()

  return (
    <section className="collage-section">
      <div className="content-max">
        {/* 3-column grid, gap clamp(12px, 1.2vw, 20px) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(12px,1.2vw,20px)] items-start">
          
          {/* Column 1 (LEFT - Sage) */}
          <div className="flex flex-col w-full">
            {/* Section heading on 1 line with at least 32px clear space below */}
            <div className="pb-8 md:pb-0 md:h-[80px] lg:h-[88px] flex items-start">
              <h2 className="collage-heading">
                {t('home.collage_section_heading')}
              </h2>
            </div>

            {/* Oak solid block: height ~1.7x width (capped at 880px) */}
            <div className="collage-panel--oak relative w-full aspect-[1/1.7] max-h-[880px] overflow-hidden flex flex-col justify-between">
              {/* Text at top: 28px left/right padding, 44px top padding */}
              <div className="relative z-10 px-[28px] pt-[44px] flex flex-col gap-2.5">
                <h3 className="collage-panel-title">
                  {t('home.collage_materials_heading')}
                </h3>
                <p className="collage-panel-body">
                  {t('home.collage_materials_body')}
                </p>
              </div>

              {/* Photo anchored to bottom & right edges, left inset ~9%, height 56% */}
              <div className="absolute bottom-0 right-0 left-[9%] h-[56%] overflow-hidden z-0">
                {settings?.collage_materials_url ? (
                  <img
                    src={settings.collage_materials_url}
                    alt={settings.collage_materials_alt || t('home.collage_materials_heading')}
                    loading="lazy"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Placeholder label={t('placeholder.photo')} variant="cream" className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          </div>

          {/* Column 2 (MIDDLE - Butter) */}
          <div className="flex flex-col w-full">
            {/* Butter column starts level with Section Heading top at md */}
            <div className="relative w-full aspect-[1/1.7] max-h-[880px] overflow-hidden flex flex-col">
              {/* Photo on TOP: full width, ~57% height */}
              <div className="w-full h-[57%] relative overflow-hidden">
                {settings?.collage_workshop_url ? (
                  <img
                    src={settings.collage_workshop_url}
                    alt={settings.collage_workshop_alt || t('home.collage_cta_heading')}
                    loading="lazy"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Placeholder label={t('placeholder.photo')} className="w-full h-full object-cover" />
                )}
              </div>

              {/* Ink panel below: ~43% height, same padding: 28px px, 44px pt */}
              <div className="collage-panel--ink w-full h-[43%] px-[28px] pt-[44px] pb-6 flex flex-col justify-between">
                <div className="flex flex-col gap-2.5">
                  <h3 className="collage-panel-title">
                    {t('home.collage_cta_heading')}
                  </h3>
                  <p className="collage-panel-body">
                    {t('home.collage_cta_body')}
                  </p>
                </div>
                <div>
                  <Link
                    to="/products"
                    className="collage-panel-link mt-2"
                  >
                    {t('home.collage_cta_link')} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 (RIGHT - Walnut) */}
          <div className="flex flex-col w-full">
            {/* Top spacer matching Column 1 to align top of Walnut panel with Oak panel */}
            <div className="hidden md:block md:h-[80px] lg:h-[88px]" />

            {/* Walnut solid block: height ~1.7x width (capped at 880px) */}
            <div className="collage-panel--walnut relative w-full aspect-[1/1.7] max-h-[880px] overflow-hidden flex flex-col justify-between">
              {/* Text at top: 28px left/right padding, 44px top padding */}
              <div className="relative z-10 px-[28px] pt-[44px] flex flex-col gap-2.5">
                <h3 className="collage-panel-title">
                  {t('home.collage_process_heading')}
                </h3>
                <p className="collage-panel-body">
                  {t('home.collage_process_body')}
                </p>
              </div>

              {/* Photo anchored to bottom & right edges, left inset ~9%, height 56% */}
              <div className="absolute bottom-0 right-0 left-[9%] h-[56%] overflow-hidden z-0">
                {settings?.collage_finish_url ? (
                  <img
                    src={settings.collage_finish_url}
                    alt={settings.collage_finish_alt || t('home.collage_process_heading')}
                    loading="lazy"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Placeholder label={t('placeholder.photo')} className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
