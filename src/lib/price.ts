/**
 * Formats a price amount in RWF.
 * Returns "Price on request" (localised) when amount is null.
 */
export function formatPrice(
  amount: number | null,
  currency = 'RWF',
  locale = 'en'
): string {
  if (amount === null) return ''
  // Use locale-aware formatting
  const localeMap: Record<string, string> = {
    en: 'en-RW',
    rw: 'rw-RW',
    fr: 'fr-RW',
  }
  const l = localeMap[locale] || 'en-RW'
  try {
    return `${currency} ${new Intl.NumberFormat(l).format(amount)}`
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}
