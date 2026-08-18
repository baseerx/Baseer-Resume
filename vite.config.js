import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const entry = (file) => fileURLToPath(new URL(file, import.meta.url))

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        // the site
        main: entry('./index.html'),
        // the printable résumé — rendered to PDF by scripts/generate-resume-pdf.mjs
        resume: entry('./resume.html'),
      },
    },
  },
})
