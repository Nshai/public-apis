import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { join, resolve } from 'path'

// Plugin to copy swagger files and API data to public folder
const copySwaggerPlugin = () => {
  return {
    name: 'copy-swagger',
    buildStart() {
      const swaggersDir = resolve(__dirname, '../../output/swaggers')
      const publicSwaggersDir = resolve(__dirname, 'public/swaggers')
      const reportsDir = resolve(__dirname, '../../output/reports')
      const publicDataDir = resolve(__dirname, 'public/data')

      // Create public/swaggers directory if it doesn't exist
      if (!existsSync(publicSwaggersDir)) {
        mkdirSync(publicSwaggersDir, { recursive: true })
      }

      // Create public/data directory if it doesn't exist
      if (!existsSync(publicDataDir)) {
        mkdirSync(publicDataDir, { recursive: true })
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

      // Copy api-data.json from reports to public/data
      const apiDataSrc = join(reportsDir, 'api-data.json')
      const apiDataDest = join(publicDataDir, 'api-data.json')
      if (existsSync(apiDataSrc)) {
        try {
          copyFileSync(apiDataSrc, apiDataDest)
          console.log(`Copied api-data.json to public/data/`)
        } catch (error) {
          console.error(`Error copying api-data.json:`, error.message)
        }
      } else {
        console.warn(`Warning: api-data.json not found at ${apiDataSrc}`)
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
