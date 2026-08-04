import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8013,
    open: true
  },
  build: {
    target: 'es2020',              // smaller output, no legacy transpiling
    cssCodeSplit: true,
    assetsInlineLimit: 4096,       // inline tiny assets, kill extra requests
    reportCompressedSize: false,   // faster builds
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Split vendor code so the small React/UI runtime caches separately
        // from the big (lazy) three.js bundle.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('three')) return 'three'
          if (id.includes('react') || id.includes('scheduler')) return 'react'
          if (id.includes('framer-motion')) return 'motion'
          return 'vendor'
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
