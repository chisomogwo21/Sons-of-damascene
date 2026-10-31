import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import { fetchSiteSettings, type SiteSettings } from '../lib/content'

export default function Contact() {
  const { t, i18n } = useTranslation()
  const [settings, setSettings] = useState<SiteSettings>({})
  const [form, setForm] = useState({ name: '', contact: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetchSiteSettings().then(setSettings)
  }, [])

  async function saveEnquiryToSupabase(data: { name: string; contact: string; message: string }) {
    try {
      const { sendEnquiry } = await import('../lib/enquiry')
      await sendEnquiry(data)
    } catch {
      // Ignore failure silently in the background
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const web3Key = import.meta.env.VITE_WEB3FORMS_KEY
    const lang = i18n.language.slice(0, 2) || 'en'

    if (web3Key) {
      // Fire background save with 3-second timeout, silently ignoring failure
      saveEnquiryToSupabase({ ...form })

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: web3Key,
            name: form.name,
            contact: form.contact,
            message: form.message,
            language: lang,
          }),
        })

        const data = await response.json()
        if (response.ok && data.success) {
          setStatus('success')
          setForm({ name: '', contact: '', message: '' })
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
    } else {
      console.warn('[Contact] VITE_WEB3FORMS_KEY is missing. Falling back to direct database insert.')
      try {
        const { sendEnquiry } = await import('../lib/enquiry')
        await sendEnquiry(form)
        setStatus('success')
        setForm({ name: '', contact: '', message: '' })
      } catch {
        setStatus('error')
      }
    }
  }

  const inputCls =
    'w-full border border-[#E6DFCF] bg-white px-4 py-3 text-sm text-[#3B2418] placeholder-[#b8a898] focus:outline-none focus:border-[#D9541E] transition-colors'

  return (
    <>
      <SEO title={t('seo.contact_title')} description={t('contact.heading')} />
      <div className="pt-[112px] md:pt-[128px]">
        <div className="content-max section-gap">
          <h1 className="section-heading font-display mb-10">{t('contact.heading')}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Info */}
            <div className="space-y-8">
              <InfoBlock heading={t('contact.address_heading')}>
                <p className="text-sm text-[#5c4434]">{settings.address || 'KG 12 Ave, Kigali, Rwanda'}</p>
                {/* Map placeholder */}
                <div className="mt-4 bg-[#E6DFCF] h-40 flex items-center justify-center text-xs text-[#8a7060]">
                  Map coming soon
                </div>
              </InfoBlock>

              <InfoBlock heading={t('contact.phone_heading')}>
                <p className="text-sm text-[#5c4434]">{settings.contact_phone || '+250 783 710 430'}</p>
              </InfoBlock>

              <InfoBlock heading={t('contact.email_heading')}>
                <p className="text-sm text-[#5c4434]">{settings.contact_email || 'hello@sonsofdamascene.com'}</p>
              </InfoBlock>

              <InfoBlock heading={t('contact.hours_heading')}>
                <p className="text-sm text-[#5c4434]">{settings.hours || 'Mon–Sat 8am–6pm'}</p>
              </InfoBlock>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-lg font-normal text-[#3B2418] mb-6">{t('contact.form_heading')}</h2>
              {status === 'success' ? (
                <div className="bg-[#9DAE8A] text-[#3B2418] p-6 text-sm font-normal">
                  {t('contact.success')}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                  <div>
                    <label htmlFor="contact-name" className="sr-only">{t('contact.name')}</label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder={t('contact.name')}
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-contact" className="sr-only">{t('contact.contact_field')}</label>
                    <input
                      id="contact-contact"
                      type="text"
                      placeholder={t('contact.contact_field')}
                      value={form.contact}
                      onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                      required
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="sr-only">{t('contact.message')}</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder={t('contact.message')}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      required
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  {status === 'error' && (
                    <p className="text-sm text-[#D9541E]">{t('contact.error')}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="self-start px-8 py-3 bg-[#3B2418] text-white text-sm font-normal hover:bg-[#D9541E] transition-colors disabled:opacity-50"
                  >
                    {status === 'loading' ? '…' : t('contact.submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function InfoBlock({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-[#E6DFCF] pt-5">
      <p className="text-xs text-[#8a7060] uppercase tracking-widest mb-2">{heading}</p>
      {children}
    </div>
  )
}
