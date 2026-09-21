import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/,
// so the built asset URLs need to be prefixed with the repo name.
const BASE_PATH = '/Quin-Arch/';

export default defineConfig(() => {
  return {
    base: BASE_PATH,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Multi-page build: the homepage plus real, independently-crawlable static pages for
      // /services/ and each service pillar (each with its own <title>/meta/schema baked into
      // its own HTML at build time — no client-side router or prerendering step needed).
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          servicesHub: path.resolve(__dirname, 'services/index.html'),
          servicesVisualization: path.resolve(__dirname, 'services/visualization/index.html'),
        },
      },
    },
  };
});
