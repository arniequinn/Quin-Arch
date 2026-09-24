import type { Plugin } from 'vite';

// Build-time SEO helpers, applied to every HTML entry point so new pages can't forget them:
//  1. Google Analytics (GA4) is injected into any page that doesn't already carry it.
//  2. Crawlable text (an <h1>, the meta description and site links) is placed inside <div id="root">
//     so search engines and link-preview bots see real content before JavaScript runs. React's
//     createRoot replaces it as soon as the app mounts.
//  3. sitemap.xml is generated with today's date as lastmod instead of hand-typed dates.

const SITE = 'https://quinarch.design';
const GA_ID = 'G-9LJJ2SLHF0';

// Keep in sync with the `build.rollupOptions.input` list in vite.config.ts.
const PAGES: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: 'services/', priority: '0.8', changefreq: 'monthly' },
  { path: 'services/visualization/', priority: '0.8', changefreq: 'monthly' },
  { path: 'services/bim-cad-drafting/', priority: '0.8', changefreq: 'monthly' },
  { path: 'services/consultancy/', priority: '0.8', changefreq: 'monthly' },
  { path: 'projects/', priority: '0.7', changefreq: 'monthly' },
  { path: 'why-work-with-us/', priority: '0.7', changefreq: 'monthly' },
  { path: 'design-philosophy/', priority: '0.6', changefreq: 'yearly' },
  { path: 'case-studies/', priority: '0.7', changefreq: 'monthly' },
  { path: 'case-studies/texas-coastal-beach-house/', priority: '0.6', changefreq: 'yearly' },
  { path: 'case-studies/slamburger-restaurant/', priority: '0.6', changefreq: 'yearly' },
  { path: 'case-studies/cran-residence/', priority: '0.6', changefreq: 'yearly' },
  { path: 'case-studies/urban-multi-family-flats/', priority: '0.6', changefreq: 'yearly' },
  { path: 'guides/lod-guide/', priority: '0.7', changefreq: 'yearly' },
];

const NAV_LINKS: Array<[string, string]> = [
  ['Home', ''],
  ['Services', 'services/'],
  ['Project Library', 'projects/'],
  ['Why Work With Us', 'why-work-with-us/'],
  ['Design Philosophy', 'design-philosophy/'],
  ['Case Studies', 'case-studies/'],
  ['LOD Guide', 'guides/lod-guide/'],
];

const GA_SNIPPET = `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    </script>
`;

const HOME_H1 = 'Computational Design, Virtual Design & Construction. Delivered Globally.';

function staticBlock(base: string, h1: string, description: string): string {
  const links = NAV_LINKS.map(
    ([label, href]) => `<li><a style="color:#fbbf24" href="${base}${href}">${label}</a></li>`
  ).join('');
  return (
    `<div id="root"><main style="max-width:48rem;margin:0 auto;padding:4rem 1.25rem;` +
    `font-family:system-ui,sans-serif;color:#f5f5f5;line-height:1.6">` +
    `<h1 style="font-size:2rem;line-height:1.15;margin:0 0 1rem;font-weight:700">${h1}</h1>` +
    `<p style="color:#d4d4d4;margin:0">${description}</p>` +
    `<nav aria-label="Site"><ul style="list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:1rem;margin:2rem 0 0">${links}</ul></nav>` +
    `</main></div>`
  );
}

export function seoPlugin(base: string): Plugin {
  return {
    name: 'quin-arch-seo',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        let out = html;

        if (!out.includes('googletagmanager.com')) {
          out = out.replace('<head>', `<head>${GA_SNIPPET}`);
        }

        const title = /<title>([^<]*)<\/title>/.exec(out)?.[1] ?? 'Quintessential Architecture';
        const description = /<meta name="description" content="([^"]*)"/.exec(out)?.[1] ?? '';
        const isHome = ctx.path === '/index.html' || ctx.path === '/';
        const h1 = isHome ? HOME_H1 : title.split(' | ')[0];

        return out.replace('<div id="root"></div>', staticBlock(base, h1, description));
      },
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const urls = PAGES.map(
        (p) =>
          `  <url>\n    <loc>${SITE}/${p.path}</loc>\n    <lastmod>${today}</lastmod>\n` +
          `    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
      ).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}
