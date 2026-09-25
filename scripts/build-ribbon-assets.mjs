// Ribbon-size copies for the filmstrip templates (v3.0 §12), and src/data/ribbonAssets.ts.
//
// A ribbon band opens to at most about 950 px at 1920 × 1080, so every image on a strip is kept
// at most 1200 px tall (the render ribbons' existing limit): tall enough to open fully there,
// light enough for a marquee. Rules, per source image under public/portfolio/:
//  - a WebP no more than 1200 px tall is used as it is (no copy)
//  - anything else is written to public/portfolio/ribbon/<same path>.webp, at most 1200 px tall
//  - drawing sheets (sheets/, not the renders) are trimmed to the drawing first — the white paper
//    margin goes, a thin even margin is put back — so the line work, not the paper, fills the band
//  - the original screen captures get descriptive names (their files are only numbered)
// The existing homepage ribbon copies (ribbon/int-*, ribbon/ext-*) are only measured.
//
// Only the images a template in src/data/filmstrips.ts names (sheet("…"), fromPath("…"), the
// renamed screens) get copies, plus the furniture, which is used as it is; any other copy under
// ribbon/ is deleted, so the folder never holds files no strip shows.
//
//   node scripts/build-ribbon-assets.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const PORTFOLIO = path.join(ROOT, "public", "portfolio");
const MAX_H = 1200;

const FOLDERS = [
  "sheets",
  "screenshots",
  "bimcad-workflow",
  "parametric-furniture",
  "exterior-showcase",
  "visualization-showcase",
  "furniture-showcase",
];
const RENAMED = {
  "screenshots/3.JPG": "ribbon/screens/fractal-panel-script.webp",
  "screenshots/4.JPG": "ribbon/screens/point-pattern-script.webp",
  "screenshots/6.JPG": "ribbon/screens/structural-and-analytical-model.webp",
  "screenshots/7.JPG": "ribbon/screens/point-cloud-analysis.webp",
};
const FILMSTRIPS = fs.readFileSync(path.join(ROOT, "src", "data", "filmstrips.ts"), "utf8");
const WANTED = new Set([
  ...[...FILMSTRIPS.matchAll(/\bsheet\("([^"]+)"/g)].map((m) => `sheets/${m[1]}`),
  ...[...FILMSTRIPS.matchAll(/\bfromPath\("([^"]+)"/g)].map((m) => m[1]),
  ...Object.keys(RENAMED),
]);
const wanted = (rel) => WANTED.has(rel) || rel.startsWith("furniture-showcase/");

const isSheet = (rel) => rel.startsWith("sheets/") && !rel.includes("-render-");
const toPosix = (p) => p.split(path.sep).join("/");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const full = path.join(dir, d.name);
    return d.isDirectory() ? walk(full) : /\.(webp|jpe?g|png)$/i.test(d.name) ? [full] : [];
  });
}

const files = {}; // published ribbon path -> { w, h }
const of = {}; // source path -> ribbon path

for (const full of walk(path.join(PORTFOLIO, "ribbon"))) {
  const rel = toPosix(path.relative(PORTFOLIO, full));
  if (rel.split("/").length !== 2) continue; // only the homepage copies at ribbon/ top level
  const m = await sharp(full).metadata();
  files[rel] = { w: m.width, h: m.height };
}

let written = 0;
for (const folder of FOLDERS) {
  for (const full of walk(path.join(PORTFOLIO, folder))) {
    const rel = toPosix(path.relative(PORTFOLIO, full));
    if (!wanted(rel)) continue;
    const meta = await sharp(full).metadata();
    const trim = isSheet(rel);
    if (!trim && /\.webp$/i.test(rel) && meta.height <= MAX_H && !RENAMED[rel]) {
      files[rel] = { w: meta.width, h: meta.height };
      of[rel] = rel;
      continue;
    }
    const out = RENAMED[rel] ?? `ribbon/${rel.replace(/\.(webp|jpe?g|png)$/i, ".webp")}`;
    const outFull = path.join(PORTFOLIO, out);
    fs.mkdirSync(path.dirname(outFull), { recursive: true });

    let img = sharp(full);
    if (trim) {
      const trimmed = await sharp(full).flatten({ background: "#ffffff" }).trim({ background: "#ffffff", threshold: 40 }).toBuffer({ resolveWithObject: true });
      const pad = Math.round(Math.min(trimmed.info.width, trimmed.info.height) * 0.025);
      img = sharp(trimmed.data).extend({ top: pad, bottom: pad, left: pad, right: pad, background: "#ffffff" });
      const padded = await img.toBuffer({ resolveWithObject: true });
      img = sharp(padded.data);
    }
    const buf = await img
      .resize({ height: MAX_H, withoutEnlargement: true })
      .webp({ quality: trim ? 82 : 78, effort: 5 })
      .toBuffer({ resolveWithObject: true });
    fs.writeFileSync(outFull, buf.data);
    files[out] = { w: buf.info.width, h: buf.info.height };
    of[rel] = out;
    written++;
  }
}

// Remove copies no template uses any more (only the subfolders: the homepage copies sit at the top).
let removed = 0;
for (const full of walk(path.join(PORTFOLIO, "ribbon"))) {
  const rel = toPosix(path.relative(PORTFOLIO, full));
  if (rel.split("/").length > 2 && !files[rel]) {
    fs.rmSync(full);
    removed++;
  }
}
for (const dir of fs.readdirSync(path.join(PORTFOLIO, "ribbon"), { recursive: true }).map((d) => path.join(PORTFOLIO, "ribbon", d)).sort((a, b) => b.length - a.length)) {
  if (fs.statSync(dir).isDirectory() && !fs.readdirSync(dir).length) fs.rmdirSync(dir);
}

const sorted = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
const ts = `// Generated by scripts/build-ribbon-assets.mjs — do not edit by hand.
// RIBBON_FILES: every image a filmstrip can show, as published (paths under public/portfolio/), with
// its size. RIBBON_OF: for each gallery image, the file its filmstrip shows — the image itself when
// it's already light enough, otherwise its copy under ribbon/ (drawing sheets trimmed to the drawing).

export const RIBBON_FILES: Record<string, { w: number; h: number }> = ${JSON.stringify(sorted(files), null, 2)};

export const RIBBON_OF: Record<string, string> = ${JSON.stringify(sorted(of), null, 2)};
`;
fs.writeFileSync(path.join(ROOT, "src", "data", "ribbonAssets.ts"), ts);
console.log(`${written} ribbon copies written, ${removed} unused removed, ${Object.keys(of).length} images mapped`);
