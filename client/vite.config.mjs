import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: process.cwd(),
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        '.' // only current dir
      ]
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
