import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { join, resolve } from 'path'

// Plugin to copy swagger files to public folder
const copySwaggerPlugin = () => {
  return {
    name: 'copy-swagger',
    buildStart() {
      const swaggersDir = resolve(__dirname, '../../output/swaggers')
      const publicSwaggersDir = resolve(__dirname, 'public/swaggers')

      // Create public/swaggers directory if it doesn't exist
      if (!existsSync(publicSwaggersDir)) {
        mkdirSync(publicSwaggersDir, { recursive: true })
      }

      // Copy swagger files, excluding stats files
      if (existsSync(swaggersDir)) {
        const files = readdirSync(swaggersDir)
        files.forEach(file => {
          // Skip stats.json files
          if (file.includes('stats.json')) {
            return
          }

          const srcPath = join(swaggersDir, file)
          const destPath = join(publicSwaggersDir, file)
          try {
            copyFileSync(srcPath, destPath)
            console.log(`Copied ${file} to public/swaggers/`)
          } catch (error) {
            console.error(`Error copying ${file}:`, error.message)
          }
        })
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), copySwaggerPlugin()],
  server: {
    port: 3000
  }
})
