// Cuts publishable drawings out of the sheet PDFs rendered to PNG (200 dpi) in
// source-material/pdf-extracted/sheets-2026-09-27-hi/<set>/pNN.png — title blocks (names,
// emails) are always left out. Each part is cropped by a fractional box [x0, y0, x1, y1] of its
// page, trimmed to its content, and parts are laid out in `cols` columns with a small gap, so
// the voids between drawings on the sheet don't reach the site. Output goes to
// source-material/sheets-crops/<name>.png (≤ 2600 px), which gallery-manifest.json then encodes.
// The crop list is source-material/sheet-crops.json (git-ignored: it names the source files).
//
//   node scripts/build-sheet-crops.mjs [--only=<name-prefix>]
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const PAGES = path.join(ROOT, "source-material", "pdf-extracted", "sheets-2026-09-27-hi");
const OUT = path.join(ROOT, "source-material", "sheets-crops");
const MAX = 2600;
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7);

const CROPS = JSON.parse(fs.readFileSync(path.join(ROOT, "source-material", "sheet-crops.json"), "utf8"));

/** Trim near-white margins; returns a PNG buffer of the content plus `pad` px of white. */
async function cropPart({ set, page, box }) {
  const file = path.join(PAGES, set, `p${String(page).padStart(2, "0")}.png`);
  const { width: W, height: H } = await sharp(file).metadata();
  const [x0, y0, x1, y1] = box;
  const region = { left: Math.round(x0 * W), top: Math.round(y0 * H), width: Math.round((x1 - x0) * W), height: Math.round((y1 - y0) * H) };
  const cut = await sharp(file).extract(region).flatten({ background: "#fff" }).png().toBuffer();
  return sharp(cut).trim({ background: "#ffffff", threshold: 30 }).png().toBuffer();
}

fs.mkdirSync(OUT, { recursive: true });
for (const spec of CROPS.filter((c) => !ONLY || c.name.startsWith(ONLY))) {
  const parts = await Promise.all(spec.parts.map(cropPart));
  const metas = await Promise.all(parts.map((b) => sharp(b).metadata()));
  const cols = spec.cols ?? parts.length;
  const rows = Math.ceil(parts.length / cols);
  const colW = Array.from({ length: cols }, (_, c) => Math.max(...metas.filter((_, i) => i % cols === c).map((m) => m.width)));
  const rowH = Array.from({ length: rows }, (_, r) => Math.max(...metas.filter((_, i) => Math.floor(i / cols) === r).map((m) => m.height)));
  const gap = Math.round(Math.max(...colW, ...rowH) * 0.05);
  const pad = Math.round(Math.max(...colW, ...rowH) * 0.03);
  const width = colW.reduce((a, b) => a + b, 0) + gap * (cols - 1) + pad * 2;
  const height = rowH.reduce((a, b) => a + b, 0) + gap * (rows - 1) + pad * 2;
  const layers = parts.map((input, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    // Centre each part in its cell.
    const left = pad + colW.slice(0, c).reduce((a, b) => a + b, 0) + gap * c + Math.round((colW[c] - metas[i].width) / 2);
    const top = pad + rowH.slice(0, r).reduce((a, b) => a + b, 0) + gap * r + Math.round((rowH[r] - metas[i].height) / 2);
    return { input, left, top };
  });
  const sheet = await sharp({ create: { width, height, channels: 3, background: "#ffffff" } }).composite(layers).png().toBuffer();
  await sharp(sheet).resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true }).png().toFile(path.join(OUT, `${spec.name}.png`));
  console.log(`${spec.name}  ${width}×${height}${width > MAX || height > MAX ? " (scaled)" : ""}`);
}
