// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// Static by default; individual pages opt into server rendering with
// `export const prerender = false` (e.g. the rides page and API routes).
export default defineConfig({
  site: 'https://www.sitwell.cc',
  output: 'static',
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
