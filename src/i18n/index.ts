import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './en.json'
import rw from './rw.json'
import fr from './fr.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      rw: { translation: rw },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'rw', 'fr'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'sod_lang',
    },
    interpolation: {
      escapeValue: false,
    },
  })

// Sync <html lang> attribute
i18n.on('languageChanged', (lng: string) => {
  document.documentElement.lang = lng
})
document.documentElement.lang = i18n.language

export default i18n
