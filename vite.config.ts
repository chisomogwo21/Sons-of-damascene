import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  build: {
    modulePreload: false,
  },
  plugins: [
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
