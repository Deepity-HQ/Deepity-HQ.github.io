import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves 404.html for any path it has no file for. Emitting a
// copy of the app shell there lets client-side routes (/tutorial, /about, ...)
// load on a direct visit or refresh instead of showing GitHub's 404 page.
function spaFallback() {
  let outDir = "dist";
  return {
    name: "spa-fallback-404",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      copyFileSync(resolve(outDir, "index.html"), resolve(outDir, "404.html"));
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    spaFallback(),
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  base: '/',
})
