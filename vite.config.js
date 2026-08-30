import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        const distDir = path.resolve('dist')
        const indexHtml = path.join(distDir, 'index.html')
        const fallbackHtml = path.join(distDir, '404.html')
        if (fs.existsSync(indexHtml)) {
          fs.copyFileSync(indexHtml, fallbackHtml)
        }
      }
    }
  ],
  base: '/Elevora/',
})


