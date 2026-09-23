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
          servicesBimCad: path.resolve(__dirname, 'services/bim-cad-drafting/index.html'),
          servicesConsultancy: path.resolve(__dirname, 'services/consultancy/index.html'),
          caseStudiesHub: path.resolve(__dirname, 'case-studies/index.html'),
          caseStudyBeachHouse: path.resolve(__dirname, 'case-studies/texas-coastal-beach-house/index.html'),
          caseStudySlamburger: path.resolve(__dirname, 'case-studies/slamburger-restaurant/index.html'),
          caseStudyCranResidence: path.resolve(__dirname, 'case-studies/cran-residence/index.html'),
          caseStudyUrbanFlats: path.resolve(__dirname, 'case-studies/urban-multi-family-flats/index.html'),
          guideLod: path.resolve(__dirname, 'guides/lod-guide/index.html'),
          designPhilosophy: path.resolve(__dirname, 'design-philosophy/index.html'),
          projects: path.resolve(__dirname, 'projects/index.html'),
          whyWorkWithUs: path.resolve(__dirname, 'why-work-with-us/index.html'),
        },
      },
    },
  };
});
