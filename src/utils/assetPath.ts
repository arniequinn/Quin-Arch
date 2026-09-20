// Prefixes a root-relative path (e.g. "/portfolio/logo.png") with Vite's
// configured base path, so links and images still resolve correctly when the
// site is hosted from a subpath (e.g. GitHub Pages' /<repo>/ project pages).
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}
