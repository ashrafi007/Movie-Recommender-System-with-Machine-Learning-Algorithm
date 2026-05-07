import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/movies': 'http://localhost:5001',
      '/recommend': 'http://localhost:5001',
      '/hero-posters': 'http://localhost:5001',
    },
  },
})
