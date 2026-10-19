import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// public/branding holds the full brand kit (AI, EPS, PDF and other source files).
// It stays in the repo for reference but should not be deployed; the site uses
// the trimmed copies in public/brand instead.
function skipBranding() {
  let outDir = "dist";
  return {
    name: "skip-branding-kit",
    apply: (config, { command }) => command === "build" && !config.build?.ssr,
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
    skipBranding(),
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  base: '/',
  ssr: {
    noExternal: true,
  },
})
