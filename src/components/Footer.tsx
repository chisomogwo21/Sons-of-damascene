import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const NAV_LINKS = [
  { key: 'nav.about', to: '/about' },
  { key: 'nav.products', to: '/products' },
  { key: 'nav.craftsman', to: '/craftsman' },
  { key: 'nav.contact', to: '/contact' },
]

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

interface FooterProps {
  instagram?: string
  facebook?: string
}

export default function Footer({ instagram, facebook }: FooterProps) {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#FBF6EA] pt-12">
      <div className="content-max">
        {/* Main Footer Layout: 55% / 40% on desktop, single column on mobile */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-0">
          
          {/* Left Column: Wordmark (2 lines) -> Social Icons -> Tagline */}
          <div className="w-full md:w-[55%]">
            <h2 className="footer-wordmark font-wordmark">
              Sons of<br />Damascene
            </h2>

            {/* Social Icons (20px below wordmark, 16px apart) */}
            {(instagram || facebook) && (
              <div className="flex items-center gap-4 mt-5">
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-[#3B2418] hover:text-[#D9541E] transition-colors"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-[#3B2418] hover:text-[#D9541E] transition-colors"
                  >
                    <FacebookIcon />
                  </a>
                )}
              </div>
            )}

            {/* Tagline (16px below social icons) */}
            <p className="mt-4 text-[13.5px] leading-normal text-[#3B2418]/80 max-w-sm">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Right Column: Nav Link Rows (aligned with top of wordmark) */}
          <nav aria-label="Footer navigation" className="w-full md:w-[40%]">
            <ul className="border-b border-[#E6DFCF]">
              {NAV_LINKS.map((l) => (
                <li key={l.to} className="border-t border-[#E6DFCF]">
                  <Link
                    to={l.to}
                    className="group flex items-center justify-between h-[44px] text-[16px] font-normal text-[#3B2418] hover:text-[#D9541E] transition-colors"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {t(l.key)}
                    </span>
                    <ChevronRight />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom row: 1px divider, 24px padding above, 40px padding below */}
        <div className="mt-12 md:mt-16 pt-6 pb-10 border-t border-[#E6DFCF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[13px] text-[#3B2418]/70">
            {t('footer.copyright').replace('2025', String(year))}
          </p>
          <LanguageSwitcher light={false} />
        </div>
      </div>
    </footer>
  )
}
