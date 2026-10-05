import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* Deployment target:
   - custom domain / local dev  -> unset, base "/"
   - GitHub Pages project site -> VITE_BASE_PATH="/<repo>/" (set by the deploy workflow)
   Runtime links (the CV download) use import.meta.env.BASE_URL, so they follow
   the base automatically. index.html link[href] assets are rewritten by Vite too. */
const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    target: 'es2019',
    cssTarget: 'chrome90',
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['gsap', 'lenis'],
        },
      },
    },
  },
})
