// Tells Bing (and the other IndexNow search engines) which pages changed, right after a deploy.
// ChatGPT search leans on Bing's index, so new and edited pages show up there sooner.
//
// The deploy workflow runs this after each publish. It reads the live sitemap and sends the pages
// whose <lastmod> is within the last few days. `--all` sends every page (a manual workflow run).
// The key must match the file public/<key>.txt, which proves to the search engine that we own the site.
//
// Usage: node scripts/indexnow.mjs [--all]

const SITE = 'https://quinarch.design';
const KEY = '5602e1816fd87c33027e02ce632f260e';
const RECENT_DAYS = 3;

const sendAll = process.argv.includes('--all');
const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)].map(
  ([, loc, lastmod]) => ({ loc, lastmod }),
);
const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
const urls = pages.filter((p) => sendAll || Date.parse(p.lastmod) >= cutoff).map((p) => p.loc);

if (urls.length === 0) {
  console.log(`IndexNow: no pages changed in the last ${RECENT_DAYS} days, nothing sent.`);
} else {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
  });
  // 200 = accepted, 202 = accepted while the key is checked (normal the first time).
  console.log(`IndexNow: HTTP ${res.status} for ${urls.length} page(s)`);
  for (const url of urls) console.log(`  ${url}`);
  if (!res.ok) process.exitCode = 1;
}
