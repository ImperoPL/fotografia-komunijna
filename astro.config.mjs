// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: vercel(),
  image: {
    domains: ["e4xaiorglwqwok6k.public.blob.vercel-storage.com"],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});