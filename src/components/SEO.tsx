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

declare const __SITE_URL__: string

const SITE_URL =
  typeof __SITE_URL__ !== 'undefined'
    ? __SITE_URL__
    : 'https://chisomogwo21.github.io/Sons-of-damascene'

function toAbsoluteUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = import.meta.env.BASE_URL || '/'
  let rel = url
  if (base !== '/' && rel.startsWith(base)) {
    rel = rel.slice(base.length)
  }
  rel = rel.replace(/^\/+/, '')
  return `${SITE_URL}/${rel}`
}

/**
 * Per-page SEO: title, meta description, Open Graph, hreflang.
 * Requires react-helmet-async at app root.
 */
export default function SEO({ title, description, canonical, ogImage }: SEOProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language.slice(0, 2)
  const resolvedOgImage = ogImage ? toAbsoluteUrl(ogImage) : `${SITE_URL}/og-image.png`
  const resolvedUrl = canonical ? toAbsoluteUrl(canonical) : `${SITE_URL}/`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={resolvedUrl} />}
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Sons of Damascene" />
      <meta property="og:url" content={resolvedUrl} />
      <meta property="og:image" content={resolvedOgImage} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />
      {/* hreflang – simplified, same URL with lang param */}
      <link rel="alternate" hrefLang="en" href={resolvedUrl} />
      <link rel="alternate" hrefLang="rw" href={resolvedUrl} />
      <link rel="alternate" hrefLang="fr" href={resolvedUrl} />
      <link rel="alternate" hrefLang="x-default" href={resolvedUrl} />
      <html lang={lang} />
    </Helmet>
  )
}
