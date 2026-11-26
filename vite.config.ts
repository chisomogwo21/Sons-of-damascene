import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
const SITE_URL = (
  process.env.VITE_SITE_URL || 'https://chisomogwo21.github.io/Sons-of-damascene'
).replace(/\/+$/, '')

export default defineConfig({
  define: {
    __BUILD_ID__: JSON.stringify(new Date().toISOString()),
    __SITE_URL__: JSON.stringify(SITE_URL),
  },
  base: process.env.VITE_BASE || '/',
  build: {
    modulePreload: false,
  },
  plugins: [
    {
      name: 'inject-site-url',
      transformIndexHtml(html) {
        return html.replace(/%SITE_URL%/g, SITE_URL)
      },
    },
    {
      name: 'base-assets-rewrite',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url && req.url.startsWith('/Sons-of-damascene/')) {
            req.url = req.url.replace('/Sons-of-damascene', '')
          }
          next()
        })
      },
    },
    tailwindcss(),
    react(),
  ],
})
