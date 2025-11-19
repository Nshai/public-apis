import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production configuration - simple build with no extra logic
// Assets should be pre-populated in public folder before build
export default defineConfig({
  base: '/public-apis/',
  plugins: [react()],
  server: {
    port: 3000
  }
})
