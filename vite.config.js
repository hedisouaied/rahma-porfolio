import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  /* Every asset and the CV download are referenced from the site root
     (/favicon.svg, /cv/…), so the base has to be "/" as well. For a subpath
     deploy, change both. */
  base: '/',
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
