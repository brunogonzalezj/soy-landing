// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['lines-band-struck-hammer.trycloudflare.com', 'landing.excelenciadelasoya.org']
    }
  },
  server: {
    host: true,
    port: 4321
  },
  integrations: [react()]
});