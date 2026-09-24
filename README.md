# Quintessential Architecture — quinarch.design

The practice site of principal architect Arslan Qaiser, with a tabbed scope & fee estimator (`/scope-estimator/`: BIM / CAD, visualization, consultancy).

This is a fully static React + Vite site — no backend, no API keys, no database. The scope estimator and lead capture all run entirely in the visitor's browser, and route inquiries to WhatsApp/email instead of a server.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs to `dist/`.

## Deploying to GitHub Pages

This repo includes `.github/workflows/deploy.yml`, which builds and deploys the site automatically on every push to `main`.

One-time setup on GitHub:

1. Go to the repo's **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).
4. The site will be published at `https://quinarch.design/`.

If you rename the repository, update `BASE_PATH` in `vite.config.ts` and the URLs in `index.html` to match.

## Editing the specialist profile

Press **Ctrl + Shift + E** on the homepage and enter the owner passkey to unlock editing (the editor has no link in the public pages). Saved changes are stored in `localStorage` in that browser only — they are not shared across visitors or devices (there's no backend to sync them). To change the passkeys, edit `src/services/ownerAuth.ts`.

> **Deploys go through GitHub Actions only.** Pushing to `main` builds and publishes the site. The
> `npm run deploy` script (gh-pages branch) is not needed and is not what the live site serves.

## SEO plumbing

`vite-seo-plugin.ts` runs on every HTML entry during `npm run build`:

- **Prerendering.** After the client build, each page's React tree is rendered to HTML in Node and
  written into its `<div id="root">`, so search engines, AI crawlers and link previews get the full
  page without running JavaScript. In the browser, `src/entries/mountPage.tsx` hydrates that markup.
  Server and browser render the same tree, so anything that depends on the browser (window size,
  `matchMedia`, `localStorage`) must be read in an effect or through `useSyncExternalStore`, not
  during the first render. Otherwise React reports a hydration mismatch in the console.
- **Google Analytics** is injected into any page that lacks it. `src/services/analytics.ts` sends
  `contact_click` (WhatsApp/email/phone), `generate_lead` (LOD guide sign-up, or a scope sent from the estimator), `estimator_tab` and `save_guide_pdf`.
- **`sitemap.xml`** lists every page except `404.html`, dated by the last git commit that touched the
  page's source (the deploy workflow checks out full history for this).

To add a page: create its HTML file and an entry in `src/entries/` that exports
`render = mountPage(...)` (copy an existing one), then add the HTML file to
`build.rollupOptions.input` in `vite.config.ts`. It's prerendered and added to the sitemap from there.

## Content waiting for owner sign-off

Drafted copy that the owner still has to confirm lives behind flags in `src/data/ownerSignoff.ts`.
`npm run dev` always shows it so it can be reviewed in place; production builds hide it until its flag
is set to `true`. See `documentation/final-polish-v2.0.md` §8 for what each item needs.
