// Builds the v3.0 gallery assets (documentation/v3.0-gallery-expansion.md §5–§6) from the source
// material kept locally in source-material/ (git-ignored, never deployed).
//
//   node scripts/build-gallery-assets.mjs            build every item in the manifest
//   node scripts/build-gallery-assets.mjs --dry-run  measure and report only, write nothing
//   node scripts/build-gallery-assets.mjs --only=furniture-showcase/1-chairs
//
// Input:  source-material/gallery-manifest.json — one entry per published file:
//           { src, out, title, op, ...op options }   (src is relative to source-material/)
// Output: public/portfolio/<out>                  WebP at native resolution, never upscaled
//         public/portfolio/thumbs/<out>           WebP, at most 800 px on the long side
//         source-material/gallery-build-report.json  size, crop box and subject fill per item
//
// Operations (§6):
//   encode   the whole image, as is (room renders)
//   crop     a fixed box { box: [x, y, w, h] }, optionally followed by a trim
//   trim     trim a uniform background (white paper, black studio, transparency) to the content's
//            extents plus `margin` (a fraction of the content size)
//   thumb    an image already published (`src: "public:<path under public/portfolio>"`): writes only
//            its thumbnail and reports its size, so existing work can join the justified grid
//   subject  furniture: crop to the measured subject box plus 8% margin, keeping the piece's own
//            proportions within `aspectRange` (the justified grid needs no shared aspect, and a
//            fixed one per category left most tiles under the 70% subject-fill target). Growth
//            uses the render's own pixels, padding with the sampled studio colour only where the
//            frame runs out
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const SOURCE = path.join(ROOT, "source-material");
const PUBLIC = path.join(ROOT, "public", "portfolio");
const THUMB_MAX = 800;

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const ONLY = args.find((a) => a.startsWith("--only="))?.slice(7);

const QUALITY = { render: 86, drawing: 90, thumb: 78 };

async function readRaw(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, W: info.width, H: info.height };
}

/** Median colour (RGBA) of four 20 px corner patches. */
function sampleBackground({ data, W, H }) {
  const n = Math.min(20, W >> 2, H >> 2);
  const px = [];
  for (const [cx, cy] of [[0, 0], [W - n, 0], [0, H - n], [W - n, H - n]])
    for (let y = cy; y < cy + n; y++)
      for (let x = cx; x < cx + n; x++) {
        const i = (y * W + x) * 4;
        px.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
      }
  return [0, 1, 2, 3].map((k) => px.map((p) => p[k]).sort((a, b) => a - b)[px.length >> 1]);
}

/** Bounding box of pixels that differ from the background by more than `threshold` on any
 *  channel. A row or column counts only if more than `minFrac` of it differs, so JPEG noise and
 *  stray specks don't stretch the box. */
function contentBox(raw, bg, threshold = 20, minFrac = 0.002) {
  const { data, W, H } = raw;
  const rows = new Uint32Array(H);
  const cols = new Uint32Array(W);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const a = data[i + 3];
      // Fully transparent pixels count as background whatever their colour.
      const d =
        a < 8 && bg[3] < 8
          ? 0
          : Math.max(
              Math.abs(data[i] - bg[0]),
              Math.abs(data[i + 1] - bg[1]),
              Math.abs(data[i + 2] - bg[2]),
              Math.abs(a - bg[3])
            );
      if (d > threshold) {
        rows[y]++;
        cols[x]++;
      }
    }
  const first = (arr, min) => arr.findIndex((v) => v > min);
  const last = (arr, min) => arr.length - 1 - [...arr].reverse().findIndex((v) => v > min);
  const x0 = first(cols, H * minFrac);
  const y0 = first(rows, W * minFrac);
  if (x0 < 0 || y0 < 0) return [0, 0, W, H];
  const x1 = last(cols, H * minFrac);
  const y1 = last(rows, W * minFrac);
  return [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
}

/** Grows [x, y, w, h] by `margin` × its size on every side, then to `aspect` (w / h) or into
 *  `aspectRange` [min, max], keeping it centred on the content. The box may extend past the image. */
function growBox([x, y, w, h], margin, aspect, aspectRange) {
  let cx = x + w / 2;
  let cy = y + h / 2;
  let bw = w * (1 + 2 * margin);
  let bh = h * (1 + 2 * margin);
  if (!aspect && aspectRange) {
    const a = bw / bh;
    if (a < aspectRange[0]) aspect = aspectRange[0];
    else if (a > aspectRange[1]) aspect = aspectRange[1];
  }
  if (aspect) {
    if (bw / bh < aspect) bw = bh * aspect;
    else bh = bw / aspect;
  }
  return [Math.round(cx - bw / 2), Math.round(cy - bh / 2), Math.round(bw), Math.round(bh)];
}

/** Moves a box inside the image where it fits, so the crop uses real pixels before any padding. */
function shiftInside([x, y, w, h], W, H) {
  const nx = w <= W ? Math.min(Math.max(0, x), W - w) : Math.round((W - w) / 2);
  const ny = h <= H ? Math.min(Math.max(0, y), H - h) : Math.round((H - h) / 2);
  return [nx, ny, w, h];
}

function intersect([x, y, w, h], [rx, ry, rw, rh]) {
  const x0 = Math.max(x, rx);
  const y0 = Math.max(y, ry);
  return [x0, y0, Math.min(x + w, rx + rw) - x0, Math.min(y + h, ry + rh) - y0];
}

/** Extracts a box that may extend past the image, padding the outside with `bg`. */
function extractPadded(input, [x, y, w, h], W, H, bg) {
  const left = Math.max(0, -x);
  const top = Math.max(0, -y);
  const right = Math.max(0, x + w - W);
  const bottom = Math.max(0, y + h - H);
  const inner = { left: Math.max(0, x), top: Math.max(0, y), width: w - left - right, height: h - top - bottom };
  let img = sharp(input).extract(inner);
  if (left || top || right || bottom)
    img = img.extend({ left, top, right, bottom, background: { r: bg[0], g: bg[1], b: bg[2], alpha: bg[3] / 255 } });
  return img;
}

async function processItem(item) {
  const src = item.src.startsWith("public:") ? path.join(PUBLIC, item.src.slice(7)) : path.join(SOURCE, item.src);
  const meta = await sharp(src).metadata();
  const W = meta.width;
  const H = meta.height;
  const report = { out: item.out, title: item.title, sourceSize: [W, H] };
  let box = [0, 0, W, H];
  let bg = [255, 255, 255, 255];

  if (item.op === "crop" || item.op === "trim" || item.op === "subject") {
    let region = item.box ?? [0, 0, W, H];
    let raw = await readRaw(src);
    if (item.box) {
      raw = await readRaw(await sharp(src).extract({ left: region[0], top: region[1], width: region[2], height: region[3] }).png().toBuffer());
    }
    bg = item.background ?? sampleBackground(raw);
    if (item.op === "crop" && !item.trim) {
      box = region;
    } else {
      const content = contentBox(raw, bg, item.threshold ?? 20);
      const abs = [content[0] + region[0], content[1] + region[1], content[2], content[3]];
      const margin = item.margin ?? (item.op === "subject" ? 0.08 : 0.04);
      box = growBox(abs, margin, item.aspect, item.aspectRange);
      // A trim only ever cuts: its margin stops at the edge of the region it was measured in.
      // Only furniture may pad, to reach its aspect.
      box = item.op === "subject" ? shiftInside(box, W, H) : intersect(box, region);
      report.subject = abs;
      report.fill = +((abs[2] * abs[3]) / (box[2] * box[3])).toFixed(3);
    }
  }
  if (item.cutBottom) box = [box[0], box[1], box[2], box[3] - item.cutBottom];

  report.crop = box[0] === 0 && box[1] === 0 && box[2] === W && box[3] === H ? null : box;
  report.size = [box[2], box[3]];
  if (DRY) return report;

  const kind = item.kind ?? "render";
  const pipeline = report.crop ? extractPadded(src, box, W, H, bg) : sharp(src);
  const buffer = await pipeline.png().toBuffer();
  const outPath = path.join(PUBLIC, item.out);
  // Thumbnails are always WebP, whatever the published file's format.
  const thumbPath = path.join(PUBLIC, "thumbs", item.out.replace(/.(jpe?g|png|webp)$/i, ".webp"));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.mkdirSync(path.dirname(thumbPath), { recursive: true });
  if (item.op !== "thumb") await sharp(buffer).webp({ quality: QUALITY[kind] ?? QUALITY.render, effort: 5 }).toFile(outPath);
  await sharp(buffer)
    .resize({ width: THUMB_MAX, height: THUMB_MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY.thumb, effort: 5 })
    .toFile(thumbPath);
  const t = await sharp(thumbPath).metadata();
  report.thumbSize = [t.width, t.height];
  report.bytes = fs.statSync(outPath).size;
  report.thumbBytes = fs.statSync(thumbPath).size;
  return report;
}

const manifest = JSON.parse(fs.readFileSync(path.join(SOURCE, "gallery-manifest.json"), "utf8"));
const items = manifest.filter((i) => !ONLY || i.out.startsWith(ONLY));
const results = [];
for (const item of items) {
  const r = await processItem(item);
  results.push(r);
  const fill = r.fill !== undefined ? ` fill ${Math.round(r.fill * 100)}%` : "";
  console.log(`${r.out}  ${r.size.join("×")}${fill}`);
}

if (!DRY) {
  const reportPath = path.join(SOURCE, "gallery-build-report.json");
  const previous = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, "utf8")) : [];
  const byOut = new Map(previous.map((r) => [r.out, r]));
  for (const r of results) byOut.set(r.out, r);
  fs.writeFileSync(reportPath, JSON.stringify([...byOut.values()], null, 1));
}
console.log(`${results.length} item(s)${DRY ? " measured (dry run)" : " written"}.`);
