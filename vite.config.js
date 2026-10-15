import { copyFileSync, rmSync } from 'node:fs'
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

// public/branding holds the full brand kit (AI, EPS, PDF and other source files).
// It stays in the repo for reference but should not be deployed; the site uses
// the trimmed copies in public/brand instead.
function skipBranding() {
  let outDir = "dist";
  return {
    name: "skip-branding-kit",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      rmSync(resolve(outDir, "branding"), { recursive: true, force: true });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    spaFallback(),
    skipBranding(),
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  base: '/',
})
