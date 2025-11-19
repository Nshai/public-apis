import { loadEnv } from 'vite'
import devConfig from './vite.config.dev.js'
import prodConfig from './vite.config.prod.js'

// Main config that delegates to dev or prod based on mode
export default ({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  console.log(`Loading Vite config for mode: ${mode}`)

  // Return appropriate config based on mode
  if (mode === 'development') {
    return devConfig
  } else {
    return prodConfig
  }
}
