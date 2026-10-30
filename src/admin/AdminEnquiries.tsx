import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchAllEnquiries } from '../lib/queries'

export default function AdminEnquiries() {
  const { t } = useTranslation()
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllEnquiries()
      .then(setEnquiries)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-xl font-medium text-[#3B2418] mb-6">{t('admin.enquiries')}</h1>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded" />)}
        </div>
      ) : enquiries.length === 0 ? (
        <p className="text-sm text-[#8a7060]">{t('admin.no_enquiries')}</p>
      ) : (
        <div className="divide-y divide-[#E6DFCF] border border-[#E6DFCF] bg-white">
          {enquiries.map((e) => (
            <div key={e.id} className="px-5 py-4 space-y-1">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-[#3B2418]">{e.name}</p>
                <p className="text-xs text-[#8a7060]">
                  {new Date(e.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="text-xs text-[#8a7060]">{e.contact}</p>
              <p className="text-sm text-[#5c4434] mt-1">{e.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
