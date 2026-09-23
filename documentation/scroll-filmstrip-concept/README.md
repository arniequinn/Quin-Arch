# Scroll Filmstrip Concept — Log & Handoff

**Status as of 2026-09-23 (fourth revision, same day): read §9 first — it has the current,
authoritative sequence design and supersedes §7's step-by-step choreography.** §7 is still worth
reading for its standing corrections (colors are labels only, images never resize, angled plane
edges) which still apply; §8 logs what was actually built/fixed in three passes before the §9
redesign. Nothing in §9 has been implemented yet. Phase 1 (hero ambient bands) is committed and
deployed as commit `bc94b6f`; everything past that (Phase 2/3 code, plus the fixes in §8) is
uncommitted working-tree code that itself needs the §9 rework before it's worth committing — see
"What's committed vs. not" for detail.

This document exists so a **fresh chat session** can pick this work up with full context: read
this file, look at the three original sketches in this folder, then open the live/dev site and
keep refining. That workflow is entirely workable — hand a new session this doc plus the sketch
images and a link to the site, and it has everything needed to continue without re-deriving the
concept from scratch.

---

## 1. The original idea, verbatim

This is the user's own description, unedited, from the message that started this concept:

> i have an amazing idea....... ill try my best to explain. see the first image? imagine the red
> box is a window that looks at a gallery of all the interior images lined up in a row and
> scrolling slowly to the right... then right bellow it is the same kind of window (blue box)
> with the exterior renderings and scrolling right to left....
>
> now scrolling down will move slowly the red box up and the blue box down and make room for the
> profile card... then scrolling further down will close those two boxes again and then open
> them again to reveal the next item in line (the why architecture studio ....)
>
> then once all the info is presented right before the scope estimator we will see the boxes
> come together again and this time the red one expands to show interior in full detail and the
> mouse controls the direction of the scrolling speed stays the same.
>
> then scrolling further down does the same thing to the exterior renders
>
> the the boxes go up and away and you see the scope estimator...
>
> also i think the projects library can be in its own dedicated page not the home page

And, later, the specific fix that shaped Phase 2's final form:

> lets change the sequence a bit make sure the interior images come AFTER the specialist profile
> card and then the exterior images come AFTER the why architecture studios outsource... then you
> can move on to the next phase everything else looks good.

And the correction that landed most recently:

> i can see that the interior and exterior scroll galleries are actually doubled right now.
> there only needs to be one each and between them is the specialist card

## 2. The three original sketches

All three are saved in this folder (copied from the ephemeral chat upload location, which does
not persist — these copies are the durable ones to reference going forward):

- **`sketch-1-hero-bands.png`** — navbar, hero text block, then a red band (arrow pointing
  right = interior renders drifting right) and a blue band below it (arrow pointing left =
  exterior renders drifting left), both full-bleed.
- **`sketch-2-bands-open-for-content.png`** — mid-scroll state: the red band has moved to the
  top of the viewport, the blue band to the bottom, and a bordered content card (the profile
  card) sits in the gap between them.
- **`sketch-3-bands-converging.png`** — a single thin red band at top, a gap, then red+blue
  close together at the bottom — the "boxes come together" transition state, used both between
  chapters (Phase 2) and going into the finale (Phase 3).

## 3. What got built — three phases

### Phase 1 — ambient auto-scrolling bands (hero)
- **Files:** `src/components/filmstrip/ScrollFilmstrip.tsx`, `src/components/filmstrip/useMarquee.ts`
- A continuously-scrolling, seamlessly-looping strip of images. Built on a `useAnimationFrame`
  + `MotionValue`-driven `x` offset (not CSS keyframes) **specifically** so that Phase 3's
  mouse-controlled direction could be added later as just a different *input* into the same
  engine — no rework needed when that day came, and none was needed.
- Images are duplicated 4× so the loop doesn't visibly repeat with only 5 interior / 6 exterior
  source images.
- Respects `prefers-reduced-motion` (renders a static, non-animated strip).
- Originally placed as one combined band pair right after the hero; later **split per user
  request** so the interior band sits after the Specialist/About card and the exterior band
  after the Workflows section (this was superseded by Phase 2's `ChapterFrame`, which now owns
  band placement for the Specialist section — see below).

### Phase 2 — scroll-linked open/close choreography
- **Files:** `src/components/filmstrip/ChapterFrame.tsx`, `src/components/filmstrip/useIsDesktop.ts`
- Wraps a content section (currently just `SpecialistProfileCard`) so the interior/exterior
  bands grow in from the top/bottom viewport edges as the section scrolls into view, hold open
  while the content passes through, then close again as it scrolls away.
- **Deliberately not** a pinned/fixed-height stage (the riskier approach originally scoped) —
  content stays in normal document flow at its natural height, only the two decorative bands
  are `position: sticky` with scroll-linked height (`useScroll` + `useTransform`, target =
  the wrapping div, offset `["start end", "end start"]`). Native scrolling is never intercepted.
- Mobile / `prefers-reduced-motion` fallback: plain static bands (Phase 1 style, no sticky, no
  choreography) before/after the content, still wrapped in `Reveal` for a fade-in.
- **As of the most recent fix: only ONE `ChapterFrame` on the page**, wrapping
  `SpecialistProfileCard` only. It was originally wrapping `WorkflowsSection` too (a second,
  separate band pair), which the user correctly flagged as looking "doubled" — the fix removed
  the second `ChapterFrame` and `WorkflowsSection` now renders plainly (just `Reveal`-wrapped)
  right after. **This is a deviation from the original sketch's sequence** (which described the
  bands closing and reopening again for "the why architecture studio" section) — worth
  revisiting with a fresh session if the user wants that second open/close cycle back, now that
  it's clear it should probably use *different* imagery or some other treatment so it doesn't
  feel like a repeat of the first cycle rather than a genuine "doubling."

### Phase 3 — fullscreen mouse-controlled finale
- **File:** `src/components/filmstrip/FinaleSequence.tsx`
- Placed directly before the Scope Estimator. A tall (`h-[400vh]`) wrapper with a
  `position: sticky` inner stage; `useScroll` (offset `["start start", "end end"]`) drives a
  discrete stage state machine (`closed → interior → exterior → exit`) via
  `useMotionValueEvent`.
- Interior band expands to 100vh first; cursor position (left half vs. right half of the stage)
  sets `direction` via a `MotionValue<number>` fed straight into the same `useMarquee` engine
  from Phase 1 (added one `directionOverride` prop to `ScrollFilmstrip` to accept this — no
  changes to the animation loop itself). Speed stays constant (`speedPx={42}`) regardless of
  direction.
- Closes, then the exterior band does the same.
- Both close to 0 height, and the Scope Estimator section follows directly.
- Desktop-only (`!isDesktop` or `prefers-reduced-motion` → renders `null`, nothing lost since
  the estimator just follows the pricing section directly, exactly as it did before this phase
  existed).
- **Verified live** (see §5) against the original sketch/text description point by point —
  confirmed matching.

## 4. Everything else touched this session (context, not part of the filmstrip concept itself)

Before the filmstrip work, this session also did a full design-audit pass on the homepage —
worth knowing about since it's the same codebase and the same homepage:
- Stripped freelance-marketplace-style UI (badges, star ratings, box-in-box cards) from
  `SpecialistProfileCard`, `WorkflowsSection`, `DeliverablesGallery`, and matching patterns on
  the service/case-study pages.
- Moved engagement-model pricing off the homepage to `/services`; retired
  cost-savings-percentage framing in the Scope Estimator.
- Added `Reveal.tsx` (scroll-fade-in, used everywhere) and `PracticeNote.tsx` — a full-bleed
  asymmetric signature section with a **draggable before/after slider** comparing a CAD
  wireframe elevation against the finished V-Ray render of the same barn-style residence
  (unrelated to the filmstrip bands, but built the same session — see
  `documentation/frontenddesignchanges-2026-09.md` for the full audit write-up).
- Expanded the interior gallery from 5 to 12 images and exterior from 3 to 6.

Full details: `documentation/frontenddesignchanges-2026-09.md`.

## 5. Verification performed

- `npx tsc --noEmit` and `npm run build` — clean after every change described above.
- Live browser verification of Phase 2: scrolled through and watched the bands grow in from the
  viewport edges, frame the Specialist card, and close.
- Live browser verification of Phase 3: jumped to precise scroll-progress positions via
  `window.scrollTo` (computed from the wrapper's measured top/height) to confirm each stage —
  screenshotted the interior fullscreen state, tested cursor-driven direction reversal (moved
  cursor left half → right half, confirmed the strip visibly reversed), screenshotted the
  exterior fullscreen state, and confirmed both bands collapse cleanly with the Scope Estimator
  heading fading in right after.
- Confirmed the mobile/reduced-motion fallback produces no orphaned blank space (pricing section
  flows directly into the estimator at mobile width, since `FinaleSequence` returns `null`).
- Cross-checked the finished Phase 3 behavior against the original sketches and verbatim text
  description point-by-point (see the table in the conversation this doc summarizes) — confirmed
  match, with one flagged interpretive choice: "boxes go up and away" was built as both bands
  *shrinking to zero height* (which reads as "receding"/"going away") rather than literally
  translating off-screen. Worth revisiting if the literal fly-off motion is preferred.

## 6. What's committed vs. not

- **Committed and deployed** (commit `bc94b6f`, pushed to `main` and to GitHub Pages via
  `npm run deploy`): the full design-audit pass (§4) plus Phase 1 of the filmstrip concept.
- **Not yet committed:** Phase 2 (`ChapterFrame.tsx`), Phase 3 (`FinaleSequence.tsx`), the
  "remove second ChapterFrame" fix, and this documentation folder itself. All of this is sitting
  in the working tree, verified working, but the user asked to pause here rather than commit —
  so a fresh session should check `git status` before assuming anything past Phase 1 is safe to
  build on top of without first confirming it's still there / still working.

## 7. Revision — corrected concept, second pass (2026-09-23)

After reading this doc back, the user clarified that Phases 2 and 3 as built **do not match the
original intent** closely enough. The three sketch images in this folder were also re-edited by
the user the same day (sketches 2 and 3 now show diagonal hatch marks, not plain angled lines —
see them fresh, don't rely on memory of the originals). This section is the corrected spec and
**supersedes §1–§3 wherever they conflict.** Nothing described here has been built yet — this is
a planning update only, no code changed in this pass.

**Standing correction that applies everywhere below:** red/blue are not literal render colors —
they're just a labeling convention (red = interior track, blue = exterior track) carried over
from the sketches. Don't read anything into the actual hue used in the UI.

**Standing constraint that applies everywhere below:** the images inside a strip must **never be
resized, scaled, or cropped differently** as a band's height/width changes. They stay at one
fixed rendered size throughout the whole page, always. When a band grows or shrinks, that must
work purely as a **mask/clip window** getting bigger or smaller over the same fixed-size,
still-running strip underneath — like a camera iris or a curtain opening, never like the image
itself stretching or squishing. This is a real change from the current build: `ScrollFilmstrip`
today renders images with `h-full` + `object-cover` inside `ChapterFrame`/`FinaleSequence`, which
means the images currently **do** resize as the band height animates — that's the part to fix.

**Standing target:** desktop-first, full desktop treatment is the priority. A working (simplified
is fine) mobile version is now a real goal, not an accepted gap — but only after desktop is right.

### The corrected sequence, step by step

1. **Landing.** Hero text + `HeroBackgroundVideo` (`src/components/HeroBackgroundVideo.tsx`),
   as today. No bands visible yet.

2. **First scroll trigger.** The hero content (text + video) moves up and out. Two thin strips
   enter from the bottom edge of the viewport — per sketch 1, each strip's top and bottom edge is
   cut at roughly a **15° angle** (a personal style preference, not incidental), so each strip
   reads as a distinct **tilted plane** floating over the scrolling images, not a plain rectangular
   band. This needs a `clip-path` (angled polygon) on each strip, not just a height/opacity
   animation.
   The entrance itself should look like **one plane sliding away to reveal a second plane behind
   it** — i.e. two layers per strip: a covering plane that moves off, uncovering the actual
   scrolling-image plane underneath. Not a simple grow-from-zero-height reveal (which is what
   `ChapterFrame` does today).

3. **Second scroll trigger.** The two strips (red on top, blue on bottom) move further apart —
   translating away from center, opening a gap — and the Specialist card **swoops** into that gap
   (sketch 2): an arced/curved entrance motion, not a straight fade or slide-up. The strips need
   to move far enough apart that the card has real breathing room, matching sketch 2's proportions
   (card fills most of the gap, strips reduced to thin bands top and bottom).

4. **Third scroll trigger.** The card swoops back out (same animation, reversed), and the **red
   (interior) band expands to take over the full stage**, revealing the interior images at full
   size (sketch 3 — the diagonal hatching there represents the band having expanded to fill the
   frame, packed with images). This is the same idea as today's `FinaleSequence` interior
   takeover, just reached via the swoop/mask mechanics above instead of the current plain
   height-tween.

5. **Fourth scroll trigger.** Continuing to scroll shrinks the red band back down while the blue
   (exterior) band expands to take its place and reveal the exterior images at full size — a
   direct handoff, red closing exactly as blue opens into the space it vacates. (No sketch for
   this step specifically, but it mirrors step 4's mechanics in reverse color.)

### What this means for the existing components

- `ScrollFilmstrip.tsx` — needs its image sizing decoupled from the wrapping band's height, so a
  parent can resize the *mask* without resizing the *images*. Likely: images render at a fixed
  height always, and the wrapping band becomes an `overflow-hidden` window that grows/shrinks
  independently (clipping more or less of a strip that never changes size itself).
- `ChapterFrame.tsx` — the grow-from-zero band animation and the "plain rectangle" shape both need
  replacing: angled (`clip-path`) plane edges, a two-layer cover/reveal entrance, and a
  translate-apart (not just grow-taller) motion to open room for the swoop-in card.
  `SpecialistProfileCard`'s entrance/exit also need the swoop treatment instead of whatever
  `Reveal`/default motion it uses today.
- `FinaleSequence.tsx` — mechanically closest to correct already (interior-then-exterior
  takeover, scroll-linked), but needs the same fixed-image-size mask fix, and should connect
  continuously from step 3/4 above rather than being its own separate `h-[400vh]` set piece later
  in the page — worth deciding whether steps 2–5 are one continuous scroll-linked sequence
  (single wrapper) or still-separate sections like today's `ChapterFrame` + `FinaleSequence` split.
- Mobile — needs an actual simplified version of this sequence (not just "bands as flat static
  strips" per the current fallback) — exact simplification TBD, revisit once desktop is right.

### Implementation progress against this spec (2026-09-23, same day)

First build pass, checked against this section live in the browser (desktop viewport, stepping
through scroll position by hand) after each change — this is the discipline going forward: build
a piece, then re-open this doc and the sketches and confirm it visually matches before moving on.

**Done and verified matching:**
- `FilmstripMask.tsx` (new) — the fixed-size-image fix. `ScrollFilmstrip` now always renders its
  image track at one constant height; the mask around it is the only thing whose height animates,
  via `overflow-hidden` + `align="start"/"end"/"center"` to choose which part of the fixed track
  shows through as the mask grows/shrinks. Confirmed in-browser: images do not stretch or squash
  at any scroll position in either `ChapterFrame` or `FinaleSequence`.
- Angled plane edges — `FilmstripMask` applies a `clip-path` polygon cut (fixed 18px offset, reads
  as roughly the sketch's 15°) on the mask's top and/or bottom edge. Applied to both
  `ChapterFrame`'s bands and `FinaleSequence`'s bands.
- `ChapterFrame` gap mechanics fixed — first attempt added an explicit "translate the bands apart"
  motion on top of their height animation, which was wrong: it pushed the bands fully off-screen
  instead of just opening room, because the bands are already `sticky top-0` / `sticky bottom-0`
  and naturally frame whatever gap exists between them. Removed the extra translate; the sticky
  positioning alone now produces the sketch-2 framing correctly (verified: thin band pinned at the
  very top edge, thin band pinned at the very bottom edge, card content filling the gap between,
  matching sketch 2's proportions).
- `FinaleSequence` "pinned but tiny" bug — first pass kept the default ~440px fixed track height
  even inside a fullscreen (100vh) mask, so the fully-expanded interior/exterior takeover left a
  large empty gap below a small pinned image row — didn't read as "expand to reveal the images"
  like sketch 3. Fixed by giving `FinaleSequence` specifically a taller fixed track
  (`h-[78vh]`, still a *constant*, never animated) so the fully-open state reads as a
  near-fullscreen, packed image wall, matching sketch 3's density, while `ChapterFrame`'s much
  smaller max band height keeps the original default track size (no visible gap there either).

**Not done yet — still open against this spec:**
- **Two-layer cover/reveal entrance** (step 2: "one plane sliding away to reveal a second plane
  behind it"). Current entrance is still a plain height-tween (band grows from 0), same mechanism
  as before this pass, just now angled and image-safe. This is the biggest remaining gap versus
  the corrected concept and worth doing next.
- **Swoop entrance/exit for the Specialist card** (step 3). Current motion is opacity + a small
  x/y offset + scale — a fade/slide, not an arced "swoop." Needs an actual curved motion path
  (e.g. an SVG `offsetPath`/`motion` path, or a two-axis easing that visibly arcs rather than
  moves in a straight line).
- **Continuous single sequence vs. two separate components** — steps 2–5 are still built as two
  separate pieces (`ChapterFrame` then, much later in the page, `FinaleSequence`), not one
  continuous scroll-linked progression. Not yet decided whether that separation is fine or should
  be merged.
- **Mobile** — untouched this pass; still the old flat-static-strip fallback.

### All-viewport-sizes revision (2026-09-23, third pass)

The user asked for the whole sequence — not a simplified stand-in — to work "regardless of page
size: tablet or phone or fullscreen/widescreen." The `useIsDesktop()` gate in both `ChapterFrame`
and `FinaleSequence` was a cautious first-pass decision, not a technical requirement: the whole
mechanism is scroll-*reading* (native `scrollY` via `useScroll`/`useTransform`), never scroll-
*jacking*, so there was nothing about it that actually required a desktop viewport — it works the
same off native touch-scroll on a phone as it does off a desktop wheel.

Changes:
- Removed the `useIsDesktop` check from both components — the only remaining fallback branch is
  `prefers-reduced-motion` (an accessibility need, not a screen-size one). `useIsDesktop.ts` is
  now unused and was deleted.
- `ChapterFrame`'s band track height is now responsive
  (`h-[150px] sm:h-[220px] lg:h-[440px]`) instead of one fixed desktop size, so the thin strips
  don't dwarf a phone viewport.
- `FinaleSequence`'s cursor-direction control (mouse position steering which way
  the strip drifts) now also listens for `touchmove`, so dragging a finger across the fullscreen
  stage on a phone/tablet does the same thing a mouse does on desktop. Caption copy updated to
  mention both.
- Verified live at three widths: 375px (mobile), 768px (tablet), and desktop-wide — the thin-band
  entrance, the card-in-the-gap framing, and general proportions all hold up and the desktop
  choreography (not the old static fallback) runs at all three.
- **Not fully re-verified at small widths:** the `FinaleSequence` fullscreen takeover itself
  (interior/exterior full-bleed stages) was spot-checked at desktop width only during this pass —
  worth a dedicated pass scrolling all the way through it at 375px/768px before calling this done,
  along with checking the Specialist card's internal layout doesn't feel cramped at the thinnest
  band heights.

## 8. Progress log, same day — three build passes before the sequence redesign in §9

Quick index of what happened in the session that did the actual implementation work (all detail
lives inline in §7's subsections above; this is just the summary trail):

1. **Foundational fixed-size-image fix.** New `FilmstripMask.tsx` — the mask (an
   `overflow-hidden` window with an angled `clip-path`, ~15°) is the only thing that ever resizes;
   the image track inside always renders at one constant height. Applied to both `ChapterFrame`
   and `FinaleSequence`. Fixed a real bug: images were previously being stretched/squashed as
   band height animated.
2. **Gap-mechanics fix.** A first attempt added an explicit "translate the bands apart" motion in
   `ChapterFrame` for the card-reveal gap — wrong, it pushed the bands fully off-screen. Removed
   it: the bands' own `sticky top-0`/`sticky bottom-0` positioning already holds the gap open
   correctly with no extra translate needed. Also gave `FinaleSequence` a taller fixed track
   (`h-[78vh]`) so its fullscreen takeover reads as a packed image wall (sketch 3) instead of a
   small image floating in empty space.
3. **All-viewport-sizes pass.** Removed the `useIsDesktop()` gate from both components (deleted
   the now-unused `useIsDesktop.ts`) — the mechanism is scroll-*reading*, never scroll-*jacking*,
   so it was never actually desktop-only, that was just a cautious first-pass default. Made
   `ChapterFrame`'s band track height responsive across breakpoints, and added `touchmove`
   support to `FinaleSequence`'s cursor-direction control so a finger drag steers the strip the
   same way a mouse does. Verified live at 375px / 768px / desktop-wide. One gap flagged: the
   Finale's fullscreen takeover itself wasn't walked end-to-end at small widths yet.

None of this is committed — see §6, still accurate.

## 9. Sequence redesign — leading with the void (2026-09-23, fourth pass)

After seeing passes 1–3 working live, the user significantly revised the middle of the sequence,
with a new organizing principle stated explicitly: **emphasize emptiness — use the void.** The
two bands aren't just decorative texture anymore; their *movement through negative space* is the
point. This section is the current authoritative sequence and **supersedes §7's step-by-step
sequence** (§7's standing corrections — colors are labels only, images never resize, angled
plane edges — all still apply unchanged; only the choreography below is new).

An annotated screenshot of the current landing state is saved as
`sketch-4-void-travel-annotated.webp` in this folder — the user marked it up directly: a **red
circle** around the two thin ribbons already sitting at the bottom edge of the landing viewport,
and a **blue circle** around the hero text block (roughly "Delivered Globally." down through the
descriptive paragraph) — the ribbons' *destination* for stage 1 below.

**Important structural change: this is now one continuous scroll-linked sequence, not two
separate components.** §7 had flagged this as an open question ("not yet decided whether steps
2–5 should merge into one continuous sequence") — it's now decided: yes. `ChapterFrame` and
`FinaleSequence` as separate, independently-triggered components (the latter much further down
the page, wrapping its own unrelated `h-[400vh]`) no longer matches the intent — the bands
travel and transform continuously from the landing state through to the final exterior takeover,
never fully resetting or disappearing in between. Whoever implements this should treat it as
likely one new sequence-owning component (or a shared scroll-progress driving both), not a patch
on top of the current two.

### The sequence, step by step

0. **Landing (current state, confirmed good — no changes here).** Hero text + video, two thin
   ribbons already visible at the very bottom edge of the viewport, same as today.

1. **First scroll stage — the void travel.** The two ribbons — **still exactly the same thin
   size, position only changes** — travel upward together as a pair, from the bottom of the
   viewport to roughly where the hero text block currently sits (the blue-circled area).
   Simultaneously, and in the same scroll range, the hero text + video move upward and exit the
   top of the viewport entirely — timed so that **by the time the ribbons arrive at the blue-
   circled position, the hero content is fully gone.** This is a swap through empty space: hero
   exits up top, ribbons arrive at hero's old center. Nothing grows or shrinks here — it's pure
   translation, which is the "use the void" instruction: the emptiness above/below the ribbons
   as they travel is deliberate, not filled with anything.

2. **Second scroll stage — interior takes the full screen (sketch 2's converged framing, then
   sketch 3's fullscreen).** Continuing to scroll: the top ribbon (interior) **expands to full
   screen size**; the bottom ribbon (exterior) **stays at its current thin size**, now sitting
   just below the fullscreen interior band (i.e. together they fill the whole viewport — big
   interior area on top, thin exterior sliver at the very bottom). Every image visible here must
   be at real, maximum usable size — "no pixel clustering or blowing" — i.e. the fixed-track-size
   discipline from §7 still applies, sized generously enough that this stage doesn't feel like a
   small image adrift in a big dark frame (the exact issue pass 2 fixed for the old
   `FinaleSequence` with `h-[78vh]` — same standard applies here).

3. **Third scroll stage — interior recedes, the card pops in.** Further scrolling **shrinks the
   top (interior) ribbon back down**; the bottom (exterior) ribbon **does not move or resize at
   all** — it stays exactly where and how it was in stage 2. As the interior band shrinks, it
   exposes void behind it, and the Specialist card (with the social/contact row) **pops in with
   its own animation** and takes center screen. ("Pops in" — distinct wording from the earlier
   "swoop" language in §7; worth clarifying the exact motion with the user when this gets built,
   but treat it as a deliberate, noticeable entrance, not a plain fade.)

4. **Fourth scroll stage — the card leaves, exterior takes over.** Further scrolling: the card
   **exits using the same pop animation it entered with** (reversed). The top (interior) ribbon
   **stays exactly where it is** (thin, unchanged) — it does not move again. The bottom
   (exterior) ribbon now **expands to full screen**, mirroring stage 2 but with roles swapped:
   exterior fills the view, interior is left as "just a tiny sliver on top, just like it was on
   the initial landing screen" — i.e. the interior band's final resting size/position should
   visually rhyme with where the pair started at stage 0, not just be "thin" in the abstract.

### What this means for the existing components

- The current `ChapterFrame` (grows bands from 0 height, frames `SpecialistProfileCard`) and
  `FinaleSequence` (separate `h-[400vh]` fullscreen interior→exterior takeover much further down
  the page) both need to be superseded by one sequence-owning piece driven by a single
  `scrollYProgress` (or a small number of adjacent, deliberately-linked ones) covering stages
  0–4 above, likely replacing both files' current usage in `App.tsx`.
- Stage 1's "ribbons travel as a rigid pair, same size, hero exits simultaneously" is new
  behavior — nothing today moves the *position* of a thin band across a large vertical distance
  while holding its size constant; today's bands only ever change height. This will need
  `y`/`top`/`translateY` motion values driven by the same scroll range that also drives the
  hero's own exit (today's hero has no scroll-linked exit animation at all — check for one before
  assuming it needs to be added).
- Stage 3 introduces a *second* full takeover-and-recede cycle (interior only) distinct from
  stage 4's (exterior only) — each band gets its own solo fullscreen moment at a different point
  in the sequence, rather than both driven by one shared progress range the way `FinaleSequence`
  currently does it.
- The Specialist card's entrance/exit ("pops in") still needs its own motion design — not yet
  built in either direction (this was true in §7 too, under "swoop"; the word changed, the gap in
  implementation hasn't).
- Nothing here has been implemented yet — this section is planning only, written at the user's
  request before touching code again.

## 10. Suggested next steps for whoever picks this up

Roughly in order of how the user has been sequencing this work:

1. Re-verify the current state still works (`npm run dev`, look at the site, scroll through the
   existing `ChapterFrame` and `FinaleSequence`) — things may have drifted if time has passed.
2. Build the §9 sequence redesign — this is the current priority, ahead of everything below.
3. Decide whether `WorkflowsSection` should get its own choreographed moment after all now that
   the "doubled" issue is understood (see the note at the end of §3's Phase 2 section) — the
   user's original sketch did want a second open/close cycle, just not one that felt repetitive.
4. Consider the "boxes go up and away" exit motion nuance flagged in §5.
5. The original idea's last line — "the projects library can be in its own dedicated page not
   the home page" — has **not** been acted on. `DeliverablesGallery` and `ProjectGallery` are
   still on the homepage. This was explicitly called out by the user as part of the same original
   idea and is still open.
6. Once satisfied, commit (the user's stated preference has been "commit after a phase/checkpoint
   is confirmed working," with a deploy to GitHub Pages as a fallback checkpoint — see §6).

## 11. Clarifications after §9 review (2026-09-23, fifth pass)

Added before any §9 code is written. These sharpen §9; they do not change its stage order.

### 11.1 Each band expands exactly once, never together
A summary of §9 was worded loosely ("stages 2 and 4: the interior band, then the exterior band,
expands to fullscreen"). That reads as though both bands expand in the same stage, and that is
**wrong**. The correct rule:

- **Stage 2:** ONLY the interior (top) band expands to fullscreen. The exterior (bottom) band
  stays at its thin size and does not move, resize or expand.
- **Stage 3:** the interior band shrinks back. The exterior band still does not change. The
  Specialist card pops in.
- **Stage 4:** the card exits. ONLY NOW does the exterior band expand to fullscreen, once.
  The interior band stays thin and unchanged.
- The exterior band expands **exactly once**, and only after the profile card has been shown.
  It never expands during stage 2. Each band gets one solo fullscreen moment: interior first,
  exterior after the card.
- Implementation consequence: the two bands need independent height/mask motion values, not one
  shared progress range.

### 11.2 Fallback if the Specialist card is too tall
If the card does not fit the void between the bands (mainly phones and short viewports), do not
shrink it into illegibility. Reduce the card and add links or "click to view" buttons instead:
- Socials become compact links or buttons rather than a full contact row.
- A button to view the **Principal Architect's Design Philosophy page**.

### 11.3 New page: Design Philosophy
The full plan is `documentation/principal-architect-page-plan.md` (read 2026-09-23). Key facts
for the card: route is `/design-philosophy`; the card links to it with copy like "Read the
thinking behind the work →". The page is a separate build (hero statement, two-line subhead,
logic/intuition proof columns, parametric furniture, hidden free-hand drawings, then the
paragraph). It is not part of the filmstrip sequence. The card button can ship first, and the
page itself is a follow-on task.

### 11.4 Still to confirm with the user
- Exact motion for "pops in" (default proposal: scale from ~0.9 + opacity + slight upward
  rise with a springy ease, not an arc).
- Whether to commit the current uncommitted `ChapterFrame` / `FinaleSequence` as a checkpoint
  before replacing them.

## 12. §9 sequence — first implementation (2026-09-23, sixth pass)

Built as `src/components/filmstrip/HeroSequence.tsx`, wired into `App.tsx` in place of the old
hero section + `ChapterFrame` + `FinaleSequence`. **Uncommitted** (per the user, the deployed
page stays as-is until the redesign is finished). `ChapterFrame.tsx` / `FinaleSequence.tsx` are
now unused but left on disk (uncommitted, so they are not recoverable from git if deleted).

- One sticky stage (viewport minus the 64px navbar) inside a tall wrapper; one `scrollYProgress`
  drives everything. Timeline constants live in `Q` at the top of the file.
- **Image scale:** both bands share one fixed track height `T = stageH - R - gap`, i.e. the
  largest window either band ever opens to. At full expansion the images fill the stage minus the
  other band's thin sliver; at thin sizes the mask is just a window (centered) over the same
  fixed strip. Images never resize.
- Stage 1 pure translation (ribbons rise as a rigid pair to ~40% of stage height; hero exits up).
  Stage 2 interior only. Stage 3 interior recedes, card pops in (scale .88→1 with back-out,
  rise, opacity; exit is the same curve reversed). Stage 4 card out, exterior expands once.
- Tall hero (phones): the hero first scrolls natively by its overflow height before the
  choreography starts, so nothing is clipped at landing.
- Card: `compact` mode below 1024px wide / short voids (bio clamped, capabilities column hidden,
  "Design philosophy →" button), plus a scale-to-fit fallback so it never clips.
  **The `/design-philosophy/` link is a dead link until that page is built.**
- Cursor/finger steers the direction of whichever band is fully expanded.
- Verified in-browser at 826x416, 375x812 and 1440x900: hero exit, ribbon travel, interior
  takeover with exterior sliver, card in the void, exterior takeover with interior sliver.
  Not yet checked: the scroll feel/pacing (`SCROLL_STAGES = 6`), reduced-motion fallback, and the
  hand-off from the exterior takeover into the Workflows section.

## 13. Status: completed and committed (2026-09-23)

The user confirmed the §12 implementation matches their vision exactly. Committed locally (not
pushed or deployed). Remaining follow-ups: build the `/design-philosophy` page (see
`documentation/principal-architect-page-plan.md`) so the card's button stops being a dead link,
tune scroll pacing if desired, and decide whether to delete the now-unused `ChapterFrame.tsx` and
`FinaleSequence.tsx`.
