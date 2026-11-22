import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useEffect, useState } from 'react'
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

import { fetchSiteSettings, type SiteSettings } from './lib/content'

function PublicLayout() {
  const [settings, setSettings] = useState<SiteSettings>({})
  useEffect(() => {
    fetchSiteSettings().then(setSettings)
  }, [])

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
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Routes>
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}
