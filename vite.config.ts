import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import prerenderMeta from './scripts/prerenderMeta.ts'
import docsHeader from './scripts/docsHeader.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    prerenderMeta(),
    docsHeader(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  build: {
    // The home page chunk is ~1 MB because it carries three.js for the wave
    chunkSizeWarningLimit: 1100,
  },
})
