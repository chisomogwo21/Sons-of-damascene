import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState, lazy, Suspense } from 'react'
import '../src/i18n'

// Public layout
import Header from './components/Header'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Craftsman from './pages/Craftsman'
import Contact from './pages/Contact'

// Lazy-loaded Admin components (keeps Supabase out of public entry chunk)
const AdminLogin = lazy(() => import('./admin/Login'))
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const AdminProducts = lazy(() => import('./admin/AdminProducts'))
const ProductForm = lazy(() => import('./admin/ProductForm'))
const TestimonialsManager = lazy(() => import('./admin/TestimonialsManager'))
const SettingsForm = lazy(() => import('./admin/SettingsForm'))
const AdminEnquiries = lazy(() => import('./admin/AdminEnquiries'))

import { fetchSiteSettings, type SiteSettings } from './lib/content'

function PublicLayout() {
  const [settings, setSettings] = useState<SiteSettings>({})
  useEffect(() => { fetchSiteSettings().then(setSettings) }, [])

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/craftsman" element={<Craftsman />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer
        instagram={settings.instagram_url}
        facebook={settings.facebook_url}
      />
    </>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#3B2418',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '0px',
            },
          }}
        />
        <Routes>
          {/* Admin routes (lazy loaded) */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={null}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={null}>
                <AdminLayout />
              </Suspense>
            }
          >
            <Route index element={<Navigate to="/admin/products" replace />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/:id" element={<ProductForm />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="settings" element={<SettingsForm />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
          </Route>
          {/* Public site */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}
