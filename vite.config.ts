import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages project page: '/PixelForge-AI/'
  // For GitHub Pages user page or custom domain: '/'
  base: '/PixelForge-AI/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
