# Principal Architect Page — Plan

2026-09-23

## Purpose

A dedicated page for Arslan, principal architect — not a bio page, a philosophy page. Its one job: let a client who has already browsed the portfolio understand *why* the work looks the way it does, in under 20 seconds of reading. Everything on it should be skimmable. The motivation letters and full portfolio are background only; the page does not link to them.

Route: `/design-philosophy`. Linked from the main nav or footer, and referenced from the homepage specialist card — e.g. "Read the thinking behind the work →".

## The philosophy, at three lengths

Same idea, three doses — use whichever fits the layout.

**One line (hero statement):**
> Data and logic, intuition and emotion — in equal measure, to solve human problems.

**Two lines (subhead under the hero):**
> Quintessential architecture: harmony between person, place, and space — built with data and logic, guided by intuition and emotion.

**One paragraph (for readers who stop to read):**
> I design with data and logic just as much as intuition and emotion — not one in service of the other. Structural loads, solar paths, material behavior: real inputs, not decoration. But a building still has to feel like somewhere a person wants to be. Quintessential architecture is what happens when both disciplines solve the same basic human problem together: shelter, light, comfort, calm.

All three already track the two lines the site copy carries verbatim (see Sourcing) — nothing here is invented, only compressed.

## Sourcing — nothing new, only distilled

| Line | Where it's already written |
| --- | --- |
| "Quintessential Architecture values maintaining the harmony between person, place, and space over any short-lived monetary, aesthetic or artistic gain" | Portfolio, p.2 (Design Philosophy) — word-for-word the same line already in `architecturalData.ts` as the site tagline |
| "I use data and logic to drive form, performance, and material integrity just as deeply as intuition and emotion" | Portfolio, p.2 (Design Methodology) — used near-verbatim |
| "An Anarchitect operating at the intersection of parametric design, BIM coordination, and digital fabrication" | Portfolio, p.2 (Context) — candidate for a short identity line, optional |
| Shelter as a human/ecological act, not a financial instrument; rejecting architecture-as-speculation | All three motivation letters (Bauhaus, Stuttgart, Wismar) — the recurring opening argument |
| Codes and structural standards as ethical obligation, not bureaucratic friction | Bauhaus letter — the PIMS fire example |
| Parametric/computational tools as instruments of precision, not profit | Bauhaus + Stuttgart letters |
| Architecture should coexist with nature, not dominate it; skepticism of "grandiose, disconnected" megaprojects (The Line, World Islands) | Wismar letter |

The motivation letters are argumentative and personal — right for a grad-school reader, too dense and a little confrontational for a client landing page. The plan keeps their conviction but drops the polemic (anthropocentrism, "Anarchitectural," named disasters) from the client-facing copy. The letters themselves stay off the site — not linked anywhere, as PDFs or otherwise — used only as source material for tone and substance.

## Page structure

1. **Hero** — portrait/avatar (already have `arslan-profile.png`), name, title, the one-line philosophy statement large and alone. No paragraph yet — let it breathe.
2. **The two-lines subhead** — directly under the hero, smaller, sets up the split the rest of the page proves: logic side, intuition side.
3. **Proof, split in two columns (or two stacked bands on mobile):**
    - **Data & logic side** — BIM schedules, environmental/wind analysis, Grasshopper scripting screenshots (already in `bimcad-workflow/`). Caption: what problem the data solved.
    - **Intuition & emotion side** — 1–2 finished interior renders. Caption: what the space needed to *feel* like.
4. **Where they meet** — the parametric furniture pieces (`parametric-furniture/`, including the wood-slat wall panel) as the literal proof object: a form driven by a script, but the result is sculptural, tactile, emotional. This is the single strongest visual argument on the page — it's the philosophy made physical, at a small enough scale to look at in one glance instead of reading a paragraph about a building.
5. ~~**Free-hand drawings (hidden by default)**~~ — **removed from the site on 2026-09-25 at the owner's request. Don't re-add them in any form.**
6. **The one paragraph** — placed after the proof, not before it, so a reader who wants the full argument gets it once they've already seen it demonstrated.

## Visual evidence already on hand

| Asset | Folder | Reads as |
| --- | --- | --- |
| Wood-slat parametric wall panel | `parametric-furniture/1.webp` | Logic (script-driven wave form) producing an emotional, tactile object — the clearest single image for this page |
| 2 more parametric furniture pieces | `parametric-furniture/0.png`, `2.png` | Same argument, more examples |
| Window schedules, structural calc, wind/solar analysis, Grasshopper scripts | `bimcad-workflow/` | Data & logic side |
| Free-hand figure drawings | Portfolio PDF p.3–5 | Not used: removed on 2026-09-25 at the owner's request |
| Finished interior/exterior renders | `visualization-showcase/`, `exterior-showcase/` | Where logic and feeling resolve into a finished space |

Only the free-hand drawings need new work (extracting them from the portfolio PDF as standalone files). The parametric furniture set is 3 pieces total for now — that's all the work in that vein so far, so the "where they meet" section is sized to 3 images, not designed to expect more.

## Decisions

- [x] Route — `/design-philosophy`
- [x] Motivation letters — not linked anywhere on the site, PDF or otherwise; used only as source material for this plan
- [x] Free-hand drawings — removed from the site on 2026-09-25 at the owner's request (the reveal button and the images). Don't re-add them in any form.
- [x] Parametric furniture — 3 pieces is the full current set; section is sized for 3, not built expecting more

## Status

Built 2026-09-23: `design-philosophy/index.html`, `src/pages/DesignPhilosophyPage.tsx`, `src/entries/design-philosophy-main.tsx` (registered in `vite.config.ts` and `public/sitemap.xml`, linked from the footer and the homepage specialist card). Captions are drafted from image filenames, so review them for accuracy.
