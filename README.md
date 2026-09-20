# ArchScope — Quintessential Architecture

A static marketing site with an interactive project scope & fee estimator for Quintessential Architecture.

This is a fully static React + Vite site — no backend, no API keys, no database. The scope estimator, blueprint generator, and lead capture all run entirely in the visitor's browser, and route inquiries to WhatsApp/email instead of a server.

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
4. The site will be published at `https://arniequinn.github.io/Quin-Arch/`.

If you rename the repository, update `BASE_PATH` in `vite.config.ts` and the URLs in `index.html` to match.

## Editing the specialist profile

Click **Specialist Profile** in the nav bar or footer and enter the owner passkey to unlock editing. Saved changes are stored in `localStorage` in that browser only — they are not shared across visitors or devices (there's no backend to sync them). To change the passkeys, edit `src/services/ownerAuth.ts`.
