// Encodes the hero background videos (v3.0 phase 9, D14/D15).
//
// Sources live in git-ignored source-material/videos/<id>.mp4 and are never published. Each hero
// gets a silent H.264 MP4 and a WebP poster, written to public/video/. (A VP9 WebM came out larger
// than the MP4 at the same look, so it isn't made.) Cuts drop anything with words baked in
// (captions, quotes, end cards), since the page's own title sits on top of the footage.
//
// ffmpeg: set FFMPEG=path/to/ffmpeg, or have `ffmpeg` on PATH.
//   node scripts/build-hero-videos.mjs [id…]

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..");
const SRC = path.join(ROOT, "source-material", "videos");
const OUT = path.join(ROOT, "public", "video");
const FFMPEG = process.env.FFMPEG || "ffmpeg";

// segments: [start, end] in seconds of the source; crop: w:h:x:y; width: scale down to this width.
// Every source separates its shots with a short dip to black, so a loop's seam looks like any cut.
const HEROES = [
  {
    id: "hero-home",
    // The walkthrough is a 4:3 picture inside a 16:9 frame; keep only the picture. Its source is
    // 360p, so it is not scaled up.
    crop: "480:360:80:0",
    segments: [[0.5, 61.0]],
    crf: 29,
  },
  {
    id: "hero-bim-cad",
    // The 3D cutaway, then the drawing sheets. Skips the bathroom renders (they're in the
    // Visualization reel), the quote over the first plan, the captioned sill sequence and the
    // end card.
    segments: [
      [0, 5.95],
      [15.6, 30.8],
    ],
    crf: 31,
  },
  {
    id: "hero-visualization",
    // Starts after the fade-in, so the poster isn't black. Scaled to 540p: it sits under the
    // hero's dark scrim, and at 720p the whole reel was 2.6 MB.
    segments: [[0.4, 55.8]],
    width: 960,
    crf: 30,
  },
];

function ff(args) {
  execFileSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

function filterFor(h) {
  const pre = (h.crop ? `crop=${h.crop},` : "") + (h.width ? `scale=${h.width}:-2:flags=lanczos,` : "");
  const parts = h.segments.map(
    ([a, b], i) => `[0:v]trim=start=${a}:end=${b},setpts=PTS-STARTPTS,${pre}format=yuv420p[s${i}]`,
  );
  const n = h.segments.length;
  const join = n === 1 ? `[s0]null[v]` : `${h.segments.map((_, i) => `[s${i}]`).join("")}concat=n=${n}:v=1:a=0[v]`;
  return [...parts, join].join(";");
}

const kb = (f) => Math.round(statSync(f).size / 1024);

mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
for (const h of HEROES.filter((x) => !only.length || only.includes(x.id))) {
  const src = path.join(SRC, `${h.id}.mp4`);
  const base = path.join(OUT, h.id);
  const graph = ["-i", src, "-filter_complex", filterFor(h), "-map", "[v]", "-an"];

  ff([...graph, "-c:v", "libx264", "-preset", "veryslow", "-crf", String(h.crf), "-profile:v", "high",
    "-movflags", "+faststart", `${base}.mp4`]);

  // Poster: the encoded MP4's first frame, so nothing jumps when playback starts. It's in the
  // prerendered page (the hero's first paint), so it's kept small: at most 960 px wide.
  rmSync(`${base}.webm`, { force: true });
  const png = `${base}.poster.png`;
  ff(["-i", `${base}.mp4`, "-frames:v", "1", png]);
  await sharp(png).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 62 }).toFile(`${base}.webp`);
  unlinkSync(png);

  console.log(`${h.id}: mp4 ${kb(`${base}.mp4`)} KB, poster ${kb(`${base}.webp`)} KB`);
}
