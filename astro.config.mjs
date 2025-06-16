// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://dayala1.github.io',
  vite: {
    assetsInclude: ['**/*.glb', '**/*.gltf'],
    plugins: [tailwindcss()],
  },
  server: {host: true},
  build: {
    format: 'preserve',
  }
});
