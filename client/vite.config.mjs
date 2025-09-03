import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: process.cwd(),
  server: {
    fs: {
      allow: [
        // Search up for workspace root
        searchForWorkspaceRoot(process.cwd()),
        // Allow serving files from parent directory
        '..',
        // Allow serving files from current directory
        '.'
      ]
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
