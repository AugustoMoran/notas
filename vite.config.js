import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/notes': {
        target: 'http://localhost:3001/notes',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/notes/, '')
      }
    }
  }
})
