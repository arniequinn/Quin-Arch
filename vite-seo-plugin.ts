import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, normalizePath, type Plugin, type ResolvedConfig, type Rollup } from 'vite';

// Build-time SEO, applied to every HTML entry point in vite.config.ts so new pages can't forget it:
//  1. Google Analytics (GA4) is injected into any page that doesn't already carry it.
//  2. Every page is prerendered. After the client build, the React tree each page mounts in the
//     browser is rendered to HTML in Node and written into its <div id="root">, so search engines,
//     AI crawlers and link-preview bots read the whole page without running JavaScript, visitors
//     see content before the scripts arrive, and the browser hydrates that markup in place.
//  3. sitemap.xml lists every page, dated by the last git commit that changed the page's source.
//
// Adding a page = its HTML file in `build.rollupOptions.input` + an entry that calls mountPage().

const SITE = 'https://quinarch.design';
const GA_ID = 'G-9LJJ2SLHF0';
const EMPTY_ROOT = '<div id="root"></div>';
// React's server renderer adds a <link rel="preload" as="image"> for every eagerly loaded <img>.
// The <img> tags are in the same HTML anyway; on the homepage the hints would pull every filmstrip
// frame (~5 MB) forward, ahead of the scripts. Dropping them keeps image loading as it was.
const REACT_IMAGE_PRELOAD = /<link rel="preload" as="image"[^>]*\/>/g;
// Served by GitHub Pages for unknown URLs; prerendered like any page, but never in the sitemap.
const NOT_FOUND_PAGE = '404.html';

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

export function seoPlugin(): Plugin[] {
  return [analyticsPlugin(), sitemapPlugin(), prerenderPlugin()];
}

// Only the client build of `vite build` — not the dev server, and not the Node bundle the
// prerender step builds for itself (which loads this same config).
const clientBuildOnly: Plugin['apply'] = (_, env) => env.command === 'build' && !env.isSsrBuild;

function analyticsPlugin(): Plugin {
  return {
    name: 'quin-arch-analytics',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html.includes('googletagmanager.com') ? html : html.replace('<head>', () => `<head>${GA_SNIPPET}`),
    },
  };
}

/** Absolute paths of the HTML entry points, as configured in vite.config.ts. */
function htmlEntries(config: ResolvedConfig): string[] {
  const input = config.build.rollupOptions.input ?? [];
  const files = typeof input === 'string' ? [input] : Array.isArray(input) ? input : Object.values(input);
  return files.filter((file) => file.endsWith('.html'));
}

/** Project-relative, forward-slashed path of an entry, e.g. "services/visualization/index.html". */
function relativeEntry(config: ResolvedConfig, file: string): string {
  return normalizePath(path.relative(config.root, file));
}

function sitemapPlugin(): Plugin {
  let config: ResolvedConfig;

  // Everything a page is built from inside the project: its HTML plus every source module
  // bundled into its entry chunk and the chunks that imports. Stylesheets are left out, since
  // a styling change isn't a content change worth a new lastmod.
  function sourcesOf(html: string, bundle: Rollup.OutputBundle): string[] {
    const chunks = Object.values(bundle).filter((c): c is Rollup.OutputChunk => c.type === 'chunk');
    const entry = chunks.find((c) => c.isEntry && c.facadeModuleId === normalizePath(html));
    const sources = new Set([relativeEntry(config, html)]);
    const seen = new Set<string>();
    const visit = (chunk: Rollup.OutputChunk | undefined) => {
      if (!chunk || seen.has(chunk.fileName)) return;
      seen.add(chunk.fileName);
      for (const id of chunk.moduleIds) {
        const file = id.split('?')[0];
        if (file.startsWith('\0') || file.includes('/node_modules/') || file.endsWith('.css')) continue;
        if (file.startsWith(normalizePath(config.root) + '/')) sources.add(relativeEntry(config, file));
      }
      for (const name of chunk.imports) visit(chunks.find((c) => c.fileName === name));
    };
    visit(entry);
    return [...sources];
  }

  // Google only trusts lastmod when it tracks real changes, so each page is dated by its last
  // commit (CI checks out full history for this). Outside a git checkout, fall back to today.
  function lastCommitDate(files: string[]): string {
    try {
      const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...files], {
        cwd: config.root,
        encoding: 'utf8',
      }).trim();
      if (date) return date;
    } catch {
      // not a git checkout
    }
    return new Date().toISOString().slice(0, 10);
  }

  return {
    name: 'quin-arch-sitemap',
    apply: clientBuildOnly,
    configResolved(resolved) {
      config = resolved;
    },
    generateBundle(_, bundle) {
      // Google and Bing ignore <priority> and <changefreq>, so only <loc> and <lastmod> are listed.
      const urls = htmlEntries(config)
        .filter((file) => relativeEntry(config, file) !== NOT_FOUND_PAGE)
        .map((file) => {
          const loc = `${SITE}/${relativeEntry(config, file).replace(/index\.html$/, '')}`;
          const lastmod = lastCommitDate(sourcesOf(file, bundle));
          return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
        });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
      });
    },
  };
}

function prerenderPlugin(): Plugin {
  let config: ResolvedConfig;
  let written = false;

  return {
    name: 'quin-arch-prerender',
    apply: clientBuildOnly,
    configResolved(resolved) {
      config = resolved;
    },
    writeBundle() {
      written = true;
    },
    async closeBundle() {
      // closeBundle also runs when the client build fails; let that error surface instead.
      if (!written) return;

      // Bundle src/prerender.tsx (which imports every page entry) for Node, with this same config.
      const serverDir = path.resolve(config.root, 'node_modules/.cache/quin-arch-prerender');
      await build({
        configFile: config.configFile,
        root: config.root,
        mode: config.mode,
        logLevel: 'warn',
        build: {
          ssr: 'src/prerender.tsx',
          outDir: serverDir,
          emptyOutDir: true,
          copyPublicDir: false,
          rollupOptions: { output: { entryFileNames: 'prerender.mjs' } },
        },
      });

      try {
        const serverEntry = pathToFileURL(path.join(serverDir, 'prerender.mjs')).href;
        const { renderPage } = (await import(`${serverEntry}?t=${Date.now()}`)) as {
          renderPage: (entry: string) => string;
        };
        const outDir = path.resolve(config.root, config.build.outDir);

        for (const file of htmlEntries(config)) {
          const page = relativeEntry(config, file);
          // The page's own module, exactly as its HTML references it, e.g. "/src/main.tsx".
          const entry = /<script type="module" src="([^"]+)"/.exec(fs.readFileSync(file, 'utf8'))?.[1];
          if (!entry) throw new Error(`[prerender] ${page} has no <script type="module" src> to render`);

          const outFile = path.join(outDir, page);
          const html = fs.readFileSync(outFile, 'utf8');
          if (html.split(EMPTY_ROOT).length !== 2) {
            throw new Error(`[prerender] ${page} must contain exactly one ${EMPTY_ROOT}`);
          }
          const markup = renderPage(entry).replace(REACT_IMAGE_PRELOAD, '');
          // A replacer function, so "$" sequences in the markup (prices like "$45/hr") stay literal.
          fs.writeFileSync(outFile, html.replace(EMPTY_ROOT, () => `<div id="root" data-prerendered>${markup}</div>`));
        }
      } finally {
        fs.rmSync(serverDir, { recursive: true, force: true });
      }
    },
  };
}
