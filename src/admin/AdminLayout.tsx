import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

const TABS = [
  { key: 'admin.products', path: '/admin/products' },
  { key: 'admin.testimonials', path: '/admin/testimonials' },
  { key: 'admin.settings', path: '/admin/settings' },
  { key: 'admin.enquiries', path: '/admin/enquiries' },
]

export default function AdminLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (!data.session) {
        navigate('/admin/login', { replace: true })
      } else {
        setUser(data.session.user)
      }
      setChecking(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (!session) navigate('/admin/login', { replace: true })
      else setUser(session.user)
    })
    return () => sub.subscription.unsubscribe()
  }, [navigate])

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  if (checking) return null

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col">
      {/* Admin top bar */}
      <header className="bg-[#3B2418] text-white px-4 md:px-8 py-3 flex items-center justify-between gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <Link to="/admin/products" className="font-normal text-sm">
            Sons of Damascene — Admin
          </Link>
          <span className="text-xs text-white/60">
            Changes you make appear on the public site within about an hour.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/60 hidden md:block">{user?.email}</span>
          <button
            onClick={signOut}
            className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 transition-colors"
          >
            {t('admin.sign_out')}
          </button>
          <Link to="/" className="text-xs text-white/60 hover:text-white transition-colors">
            ← Site
          </Link>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="bg-white border-b border-[#E6DFCF] px-4 md:px-8 flex gap-0 overflow-x-auto">
        {TABS.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`text-sm font-normal px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              location.pathname.startsWith(tab.path)
                ? 'border-[#D9541E] text-[#D9541E]'
                : 'border-transparent text-[#8a7060] hover:text-[#3B2418]'
            }`}
          >
            {t(tab.key)}
          </Link>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 px-4 md:px-8 py-8 max-w-5xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
