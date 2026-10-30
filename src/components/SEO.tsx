import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

interface SEOProps {
  title: string
  description: string
  /** Canonical URL for this page */
  canonical?: string
  /** Open Graph image URL */
  ogImage?: string
}

/**
 * Per-page SEO: title, meta description, Open Graph, hreflang.
 * Requires react-helmet-async at app root.
 */
export default function SEO({ title, description, canonical, ogImage }: SEOProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language.slice(0, 2)

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {/* hreflang – simplified, same URL with lang param */}
      <link rel="alternate" hrefLang="en" href={canonical || ''} />
      <link rel="alternate" hrefLang="rw" href={canonical || ''} />
      <link rel="alternate" hrefLang="fr" href={canonical || ''} />
      <link rel="alternate" hrefLang="x-default" href={canonical || ''} />
      <html lang={lang} />
    </Helmet>
  )
}
