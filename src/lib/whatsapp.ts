/**
 * Generates a WhatsApp deep-link URL with a pre-filled message.
 * The phone number is sourced from site_settings at runtime.
 */
export function buildWhatsAppUrl(
  phone: string,
  productName: string,
  productUrl: string,
  lang: string
): string {
  const messages: Record<string, string> = {
    en: `Hello, I'm interested in the ${productName}. Here is the page: ${productUrl}. I'd like to discuss a custom piece.`,
    rw: `Muraho, ndashaka ${productName}. Uyu ni urupapuro: ${productUrl}. Ndashaka ikiganiro ku gice gikorwa.`,
    fr: `Bonjour, je suis intéressé(e) par ${productName}. Voici la page : ${productUrl}. J'aimerais discuter d'une pièce sur mesure.`,
  }
  const message = messages[lang] || messages.en
  const base = phone.replace(/\D/g, '') // strip non-digits
  return `https://wa.me/${base}?text=${encodeURIComponent(message)}`
}
