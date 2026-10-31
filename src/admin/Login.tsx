import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  const inputCls =
    'w-full border border-[#E6DFCF] bg-white px-4 py-3 text-sm text-[#3B2418] placeholder-[#b8a898] focus:outline-none focus:border-[#D9541E] transition-colors'

  return (
    <div className="min-h-screen bg-[#FBF6EA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-normal text-[#3B2418] mb-8">{t('admin.login_heading')}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="admin-email" className="sr-only">{t('admin.email')}</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              placeholder={t('admin.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="sr-only">{t('admin.password')}</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder={t('admin.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputCls}
            />
          </div>
          {error && <p className="text-sm text-[#D9541E]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#3B2418] text-white py-3 text-sm font-normal hover:bg-[#D9541E] transition-colors disabled:opacity-50"
          >
            {loading ? '…' : t('admin.sign_in')}
          </button>
        </form>
      </div>
    </div>
  )
}
