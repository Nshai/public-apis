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

      // Check if source directories exist
      const swaggersDirExists = existsSync(swaggersDir)
      const reportsDirExists = existsSync(reportsDir)

      // If neither directory exists, skip copying entirely
      if (!swaggersDirExists && !reportsDirExists) {
        console.log('Skipping asset copy: output directories not found')
        return
      }

      // Copy swagger files if directory exists
      if (swaggersDirExists) {
        // Create public/swaggers directory if it doesn't exist
        if (!existsSync(publicSwaggersDir)) {
          mkdirSync(publicSwaggersDir, { recursive: true })
        }

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
      } else {
        console.log('Skipping swagger files: output/swaggers directory not found')
      }

      // Copy api-data.json if reports directory exists
      if (reportsDirExists) {
        const apiDataSrc = join(reportsDir, 'api-data.json')
        const apiDataDest = join(publicDataDir, 'api-data.json')

        if (existsSync(apiDataSrc)) {
          // Create public/data directory if it doesn't exist
          if (!existsSync(publicDataDir)) {
            mkdirSync(publicDataDir, { recursive: true })
          }

          try {
            copyFileSync(apiDataSrc, apiDataDest)
            console.log(`Copied api-data.json to public/data/`)
          } catch (error) {
            console.error(`Error copying api-data.json:`, error.message)
          }
        } else {
          console.log('Skipping api-data.json: file not found in output/reports')
        }
      } else {
        console.log('Skipping api-data.json: output/reports directory not found')
      }
    }
  }
}

// Development configuration with asset copying
export default defineConfig({
  base: '/public-apis/',
  plugins: [react(), copySwaggerPlugin()],
  server: {
    port: 3000
  }
})
