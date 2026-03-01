// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://fotografkomunijny.pl',
  integrations: [react(), sitemap()],
  adapter: vercel(),
  image: {},
  vite: {
    plugins: [tailwindcss()],
  },
});