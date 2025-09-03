import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // only allow serving files from the client folder
      allow: ['.']
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
