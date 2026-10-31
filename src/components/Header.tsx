import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const NAV_LINKS = [
  { key: 'nav.about', to: '/about' },
  { key: 'nav.products', to: '/products' },
  { key: 'nav.craftsman', to: '/craftsman' },
  { key: 'nav.contact', to: '/contact' },
]

export default function Header({ heroHeight = 0 }: { heroHeight?: number }) {
  const { t } = useTranslation()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isHome) return
    function onScroll() {
      setScrolled(window.scrollY > (heroHeight ? heroHeight - 80 : 60))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [heroHeight, isHome])

  // close menu on route change
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // On non-home pages: always solid cream background with dark brown text and 1px bottom rule.
  // On home page: transparent over hero, turning solid cream when scrolled or menu open.
  const isLight = isHome && !scrolled && !open

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isLight
            ? 'bg-transparent'
            : 'bg-[#FBF6EA] border-b border-[#E6DFCF]'
        }`}
      >
        {/* thin white rule at bottom when transparent on hero */}
        {isLight && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 pointer-events-none" />
        )}

        <div className="content-max flex items-center justify-between h-16 md:h-20">
          {/* Wordmark – DM Sans, weight 600 */}
          <Link
            to="/"
            style={isLight ? { textShadow: '0 1px 24px rgba(0,0,0,0.25)' } : undefined}
            className={`font-wordmark text-sm md:text-base tracking-tight transition-colors leading-tight ${
              isLight ? 'text-white' : 'text-[#3B2418]'
            }`}
            aria-label="Sons of Damascene – home"
          >
            Sons of<br className="hidden xs:block" /> Damascene
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-6 lg:gap-8"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                style={isLight ? { textShadow: '0 1px 24px rgba(0,0,0,0.25)' } : undefined}
                className={({ isActive }: { isActive: boolean }) =>
                  /* Supreme 400, hierarchy via underline not weight */
                  `text-sm font-normal transition-colors border-b border-transparent ${
                    isLight
                      ? `text-white hover:text-white/80 ${isActive ? 'border-white' : ''}`
                      : `text-[#3B2418] hover:text-[#D9541E] ${isActive ? 'border-[#D9541E] text-[#D9541E]' : ''}`
                  }`
                }
              >
                {t(l.key)}
              </NavLink>
            ))}
            <LanguageSwitcher light={isLight} />
          </nav>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden flex flex-col gap-1.5 p-2 transition-colors ${
              isLight ? 'text-white' : 'text-[#3B2418]'
            }`}
            aria-label={open ? t('nav.close') : t('nav.menu')}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                open ? 'rotate-45 translate-y-2 bg-[#3B2418]' : isLight ? 'bg-white' : 'bg-[#3B2418]'
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                open ? 'opacity-0 bg-[#3B2418]' : isLight ? 'bg-white' : 'bg-[#3B2418]'
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                open ? '-rotate-45 -translate-y-2 bg-[#3B2418]' : isLight ? 'bg-white' : 'bg-[#3B2418]'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#FBF6EA] flex flex-col justify-center px-8 transition-all duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="text-3xl font-normal text-[#3B2418] hover:text-[#D9541E] transition-colors border-b border-[#E6DFCF] pb-4"
            >
              {t(l.key)}
            </Link>
          ))}
          <div className="mt-4">
            <LanguageSwitcher light={false} />
          </div>
        </nav>
      </div>
    </>
  )
}
