import { useTranslation } from 'react-i18next'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'rw', label: 'RW' },
  { code: 'fr', label: 'FR' },
]

export default function LanguageSwitcher({ light = false }: { light?: boolean }) {
  const { i18n, t } = useTranslation()
  const current = i18n.language.slice(0, 2)

  function switchLang(code: string) {
    i18n.changeLanguage(code)
    const msg = t('lang.changed', { lang: t(`lang.${code}`) })
    const el = document.getElementById('lang-announce')
    if (el) el.textContent = msg
  }

  const textColor = light ? 'text-white' : 'text-[#3B2418]'
  const hoverColor = light ? 'hover:opacity-100' : 'hover:text-[#D9541E]'
  const sepColor = light ? 'text-white/40' : 'text-[#8a7060]/30'

  return (
    <div className="inline-flex items-center gap-3" role="group" aria-label="Language switcher">
      <span id="lang-announce" className="sr-only" aria-live="polite" aria-atomic="true" />
      {LANGS.map((l, i) => (
        <div key={l.code} className="inline-flex items-center gap-3">
          <button
            onClick={() => switchLang(l.code)}
            style={light ? { textShadow: '0 1px 24px rgba(0,0,0,0.25)' } : undefined}
            className={`text-xs font-normal tracking-wider transition-all relative pb-0.5 ${textColor} ${hoverColor} ${
              current === l.code
                ? 'opacity-100 font-normal'
                : light
                ? 'opacity-80 text-white'
                : 'opacity-50'
            }`}
            aria-current={current === l.code ? 'true' : undefined}
            aria-label={t(`lang.${l.code}`)}
          >
            {l.label}
            {current === l.code && (
              <span
                className={`absolute bottom-0 left-0 right-0 h-[1.5px] ${
                  light ? 'bg-white' : 'bg-[#D9541E]'
                }`}
              />
            )}
          </button>
          {i < LANGS.length - 1 && (
            <span className={`text-[10px] select-none ${sepColor}`} aria-hidden="true">
              /
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
