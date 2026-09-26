# Front-End Design Review & Proposal — Quintessential Architecture Homepage

**Author lens:** Reviewed as a front-end/brand design specialist working on flagship digital
presences for elite architecture practices (Zaha Hadid Architects, BIG, Foster + Partners,
Snøhetta, OMA-tier positioning).

**Scope:** `index.html` + everything rendered by `src/App.tsx` — Navbar, Hero, Specialist
Profile, Workflows/Engagement, Deliverables Gallery, Combined Pricing, 3× Image Slideshow
Bands, Scope Estimator entry point, LOD Guide, Footer.

**Status (2026-09-26): SUPERSEDED — historical record only.** Its findings were built or replaced by
`frontenddesignchanges-2026-09.md`, `final-polish-v2.0.md`, v3.0 and v3.3. Don't work from this file.

---

## 1. How this review was done

The full component tree was read end-to-end (`App.tsx`, `Navbar`, `HeroBackgroundVideo`,
`SpecialistProfileCard`, `WorkflowsSection`, `DeliverablesGallery`, `CombinedPricingSection`,
`ImageSlideshowBand`, `LODGuide`, plus the Tailwind theme in `index.css`), and the live
deployment at the GitHub Pages URL was opened to compare rendered output against the source.
The review asks one question throughout: **if this were a portfolio for a name-brand
architecture studio, would this page read as "elite design authority" or as "freelance
service listing"?** Right now it reads closer to the latter, and the sections below explain
why, with concrete fixes.

---

## 2. Executive summary

The technical foundation is genuinely strong — clean React/Tailwind component structure, a
deliberate brass-over-amber color override, a real serif/sans/mono type system, working
before/after comparison tooling, a real LOD reference table, lazy-loaded imagery, and
reduced-motion handling on the slideshows. This is not a "bad" site technically.

But the **visual language and information architecture currently borrow far more from SaaS
dashboards and freelance-marketplace profiles (Upwork/Fiverr-style) than from elite
architecture practice sites.** The homepage tries to be a landing page, a freelancer gig
profile, a pricing calculator, and a technical BIM glossary all in one uninterrupted scroll —
with badges, pills, star ratings, and dollar-figure copy stacked on almost every section. For
a principal-architect brand, that combination reads as "hustling for contracts" rather than
"deliberate design authority," even though the underlying work (real drawing sets, real BIM
production, real renders) is legitimately impressive and could carry a much more confident
presentation.

**The single highest-leverage move:** strip the page back to *work first*. Lead with a
full-bleed hero and a curated, controllable project gallery; move pricing, the scope
estimator, the LOD glossary, and the freelance-portal badges (Upwork/Fiverr/Freelancer/Cad
Crowd) off the primary scroll and into a clearly-labeled "Start a Project" / "Services"
destination. Everything else in this document supports that one move.

---

## 3. Critical findings (ranked by impact)

### 3.1 — The homepage is one long undifferentiated stack, not a narrative
`App.tsx` currently renders, in order: Hero → Specialist identity card → Workflows/engagement
models → Deliverables gallery (with filter tabs + comparison slider + modal) → Combined
pricing (2 tracks) → full-viewport interior slideshow → full-viewport exterior slideshow →
Scope Estimator → full-viewport BIM/CAD slideshow → LOD glossary table → Footer.

That is **eleven distinct sections** with no visual pacing between "look at the work" and
"here is a spec sheet / pricing calculator." A first-time visitor gets: marketing headline →
freelancer bio card → cost-savings pitch → portfolio → pricing table → renders → calculator →
BIM glossary → renders again → glossary again. Elite firm sites (Zaha Hadid Architects, BIG,
Snøhetta) open with **work and philosophy only** — pricing, process detail, and technical
glossaries live one click away on dedicated pages, never on the home scroll.

**Recommendation:** Restructure the home route into three acts —
1. **Hero + a single, curated, full-bleed project/render gallery** (the best 8–12 images, not
   three separate auto-cycling bands).
2. **Practice/Principal** — a quieter, editorial "about the architect" band (current
   `SpecialistProfileCard` content, heavily decluttered — see §4.2).
3. **Start a Project** — a single clear CTA band that leads to a separate `/services` or
   `/estimator` route containing the Scope Estimator, Consultancy/Visualization pricing, LOD
   guide, and engagement models. These are *conversion tools*, not homepage content.

This alone would cut the homepage's vertical length by roughly half and give every remaining
section room to breathe.

### 3.2 — Pill/badge/border overload ("SaaS dashboard," not "architecture portfolio")
Nearly every section wraps content in a `rounded-full` or `rounded-2xl`/`rounded-3xl`
bordered chip: the "Disciplines" tags, the "Tracks" nav buttons, the eyebrow badges
(`Demonstrated Technical Craftsmanship`, `THE REMOTE DIGITAL ADVANTAGE`, `Two More Service
Tracks…`), the "Available for Remote Contracts" pill, the "Verified Work" / "Verified Client
Review" badges, the LOD "Included / Not Provided" pills, and the boxed stat tiles. The
specialist card alone nests: outer rounded-3xl bordered container → inner rounded-2xl bordered
sub-panel → a 2×3 grid of rounded-xl bordered "software" chips → a grid of rounded-xl bordered
social-link cards → rounded-xl buttons. It is boxes inside boxes inside boxes.

This visual grammar (bordered pill + icon + micro-label) is the *default aesthetic of B2B SaaS
marketing sites and freelance-platform profile pages* — not of architecture. Zaha Hadid
Architects, BIG, and Foster + Partners use almost no bordered chips at all: type sits directly
on the background, imagery is flush and full-bleed, and the only "container" most of these
sites use is the edge of the viewport.

**Recommendation:** Remove borders/rounded-pill treatment from at least 80% of current
instances. Keep bordered chips only where they encode real state (e.g., LOD included/excluded)
and even there, prefer a simple color/weight distinction over a bordered badge. Section eyebrow
labels should become plain small-caps or letter-spaced text with no pill background at all.

### 3.3 — Accent color is overused and loses meaning
The brass/amber override in `index.css` (`--color-amber-400/500`) is a genuinely good,
sophisticated choice — warm, brass-like, distinct from stock Tailwind amber. But it is applied
to nearly everything: primary CTA text, secondary icon tints (email, WhatsApp-adjacent), every
section eyebrow badge, every bullet point marker, every "Included" state, LOD level labels,
stat numbers, hover borders, and the credential strip. When one accent color marks 20 different
things at once, it stops functioning as an accent and just becomes "the site's second color,"
diluting the sense of restraint that makes an accent feel premium.

**Recommendation:** Reserve brass strictly for: (a) the single primary call-to-action across
the whole site, and (b) one emphasized word/phrase per section, maximum. Everything else
(icons, bullets, secondary borders, badges) should drop to neutral greys or a hairline white
at low opacity. This is the fastest visual change to make the page feel curated rather than
templated.

### 3.4 — Copy tone reads as freelance marketplace, not design authority
Specific phrases actively work against an "elite firm" positioning:
- *"Eliminate the $85,000–$110,000/year overhead of in-house… drafting staff"* and
  *"60%–70% Production Cost Reduction"* — cost-savings-per-headcount framing belongs on an
  outsourcing/BPO landing page, not a principal architect's portfolio.
- *"Available for Remote Contracts"*, *"100% On-Time & Verified"*, star-rated *"Verified Client
  Review"* quotes, and *"5.0 ★ Client Rating"* — this is Upwork/Fiverr profile language
  (reinforced literally by linking out to Upwork, Fiverr, Freelancer.com, and Cad Crowd badges
  in the main identity block).
- *"Zero billable risk: transparent scopes & agreed milestones"* — defensive, contractor-pitch
  language.

None of this is dishonest, and for a freelance-services business it is arguably effective
copy — but it directly undercuts the "elite architecture practice" register the visual design
(serif display type, brass accent, editorial hero copy — *"Computational Design, Virtual
Design & Construction. Delivered Globally."*) is trying to establish. The two voices are
fighting each other on the same page.

**Recommendation:** Decide on one register. If the goal is the elite-firm read, move
dollar-figures, star ratings, and freelance-platform badges to a dedicated `/services` or
`/hire` page, and let the homepage speak in outcome/craft language only ("code-compliant BIM
production," "LOD 100–400," "concept to closeout" — the existing hero copy already does this
well; extend that voice everywhere else).

### 3.5 — Three separate full-viewport auto-cycling slideshows, with no user control
`ImageSlideshowBand` is used three times (Interior Visualization, Exterior Visualization,
BIM/CAD Workflow), each rendered at `h-[82vh] sm:h-[92vh]` — i.e., each band is nearly a full
screen — and each auto-cycles every 5 seconds with a 1.2s crossfade and **no manual
controls** (no arrows, no dots, no pause button, no counter). A visitor who wants to actually
study one render has no way to hold it on screen, and someone scrolling normally will see each
image for only a few seconds before it's gone or before they've scrolled past it entirely.
Three of these back-to-back (separated by other full sections) also reads as repetitive rather
than as a cohesive gallery experience — there's no sense of "here is one curated collection,"
just three visually-identical full-screen bands with different filenames behind them.

**Recommendation:** Consolidate into **one** editorial gallery component with real navigation
(arrow keys, click-through, thumbnail rail or index dots, and a pause-on-hover/tap), and let
category (Interior / Exterior / BIM-CAD) be a filter *within* that single gallery rather than
three separate full-viewport sections. This also removes ~2 full-viewport-heights of scroll
per page.

### 3.6 — Owner/admin editing UI is exposed in the public chrome
The `Navbar`, `SpecialistProfileCard`, and footer all surface an "Edit Profile" lock/unlock
icon (`Lock` / `UserCheck` from `lucide-react`) intended for the site owner to edit their own
profile data client-side. This is functional, but visually it is dead weight for 100% of real
visitors, and a padlock icon + "(Protected)" label in the main navigation of a portfolio site
reads as unfinished admin tooling leaking into the public product — never seen on a real
architecture-firm website.

**Recommendation:** Remove owner-editing affordances from all public-facing chrome (navbar,
profile card, footer). Gate entry to the editor behind something invisible to normal
visitors — a keyboard shortcut, a hidden query param, or a separate `/admin` route — so the
public page has zero visual trace of the CMS-lite functionality underneath it.

### 3.7 — No asymmetry, no full-bleed imagery, no compositional risk
Every section (hero included) is centered inside `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
Every card grid is 2 or 3 equal columns. The one genuinely interesting compositional device on
the page — the diagonal `clip-path` on the slideshow bands — is a nice idea, undermined by
being reused identically three times (see §3.5) rather than being one deliberate signature
moment.

Elite architecture-firm sites lean hard on **asymmetric grids and full-bleed breakouts** —
images that ignore the container and run to the viewport edge, offset column spans (e.g., an
8/12 image next to a 4/12 caption block), and large-scale type that overlaps or interrupts
imagery. None of that visual risk currently exists here; everything is safely centered and
evenly gridded.

**Recommendation:** Introduce one asymmetric layout module (offset image + caption columns)
and let the hero and the consolidated gallery (§3.5) break out of `max-w-7xl` entirely, running
full-bleed edge-to-edge.

### 3.8 — Hero background is a raw YouTube iframe embed
`HeroBackgroundVideo.tsx` embeds `https://www.youtube-nocookie.com/embed/...` with a
manufactured 2.8s solid-color cover to hide YouTube's own branding/thumbnail flash before
fading in. This is a clever workaround for a fundamentally fragile approach: it depends on a
third-party player, can still show a YouTube watermark per their attribution terms, adds an
extra network origin, cannot be color-graded to match the site's palette, and the fixed-timer
cover is a guess, not a guarantee (slow connections will still see YouTube chrome flash after
the cover lifts).

**Recommendation:** Self-host a short (10–20s), color-graded, muted, looping `.webm`/`.mp4`
(with a poster frame) using a native `<video>` element. This removes the third-party
dependency, guarantees no branding leakage, allows a genuine editorial color grade to match the
brass/near-black palette, and is the standard approach on every high-end studio site referenced
above.

### 3.9 — Typography hierarchy is compressed; display type is under-scaled
The hero H1 is `text-4xl sm:text-5xl lg:text-6xl` (~36–60px) — respectable, but modest next to
the type scale used by BIG, Zaha Hadid Architects, or Snøhetta, where hero headlines routinely
run 80–160px on desktop and dominate the first screen almost alone. Here, the H1 competes for
attention with two full rows of pill navigation ("Disciplines" tags, "Tracks" buttons) sitting
directly above it, a credential strip below it, and four CTA buttons — by the time the eye
reaches the actual headline, it has already parsed six other UI elements.

**Recommendation:** Let the display headline be the dominant element on first paint. Move the
discipline tags and track-navigation chips out of the primary hero viewport (into a slim sticky
sub-nav revealed on scroll, or removed from the hero entirely), and scale the H1 up
significantly on `lg`/`xl` breakpoints.

### 3.10 — CTA proliferation with no single primary action
Counting outward-facing calls to action on first load: Navbar has WhatsApp + LinkedIn + Owner
lock + "Scope Planner" (4). Hero has Scope Planner + WhatsApp + Email + LinkedIn (4 more,
duplicating two of the navbar's). The Specialist card adds LinkedIn + Edit Profile + WhatsApp +
Email + LinkedIn again + "Launch Scope Estimator" + a 7-tile grid of freelance-platform links
(9 more). That is roughly 16 distinct clickable "contact/convert" affordances before a visitor
has seen a single completed project. No single action is visually privileged as *the* next
step.

**Recommendation:** Pick one primary conversion action for the homepage (e.g., "Start a
Project" or "Enquire") and give it exclusive use of the strongest visual treatment (solid
brass fill). Every other contact channel (WhatsApp, email, LinkedIn, freelance platforms)
moves to a single consolidated "Contact" utility — footer plus one slide-in panel — rather than
being repeated at full visual weight in the navbar, hero, and profile card simultaneously.

---

## 4. Section-by-section recommendations

### 4.1 Navbar (`Navbar.tsx`)
- Remove the Owner/Lock icon button from public chrome (§3.6).
- Reduce right-side actions to two: primary CTA ("Start a Project") + a single "Contact"
  affordance (opens the consolidated contact panel, not three parallel icon buttons).
- Keep the sticky glass blur — it's a good, modern touch and reads well against imagery.

### 4.2 Hero (`App.tsx` hero section + `HeroBackgroundVideo.tsx`)
- Self-host the background loop (§3.8); color-grade it to sit under the copy without needing a
  scrim as dark as `via-neutral-950/60 to-neutral-950/92` currently requires.
- Move "Disciplines" tags and "Tracks" quick-nav out of the hero's first viewport; they are
  wayfinding, not headline content.
- Scale up the display headline (§3.9); let it be the visual anchor.
- Reduce hero CTAs from four to two: one primary ("Start a Project" → scrolls to / links the
  services route) and one secondary ("View Selected Work" → scrolls to the consolidated
  gallery).
- Keep the credential strip (AIA·NCS, LOD 100–400, 24–48h, Native Delivery) — it's genuinely
  effective, terse, and on-brand — but simplify to plain text columns without the mono/amber
  double-emphasis on every line.

### 4.3 Specialist identity (`SpecialistProfileCard.tsx`)
- This section currently tries to be an "About the Architect" band, a credentials sheet, a
  social-proof wall, and a freelance-platform directory at once. Split it:
  - **Keep on homepage:** name, title, portrait, one-paragraph bio, education, years/projects
    stats (drop the "100% On-Time & Verified" stat — unverifiable claim, low-trust signal),
    software stack. Present this without the outer bordered card — let it sit directly on the
    page background as an editorial "about" layout (image left, text right, no container).
  - **Move off homepage:** the 7-tile grid of Upwork/Fiverr/Freelancer/Cad Crowd/Instagram/
    YouTube/LinkedIn links, the "Available for Remote Contracts" pill, and the CV download —
    these belong on a `/contact` or `/about` page, not the primary identity block of an elite
    portfolio.
  - Remove the "Edit Profile" control from this public view entirely (§3.6).

### 4.4 Workflows / engagement models (`WorkflowsSection.tsx`)
- Cost-savings copy ("$85,000–$110,000/year," "60%–70% Production Cost Reduction") and the
  "Per-Project vs. Dedicated Monthly Partner" comparison are legitimate, useful content for a
  buyer evaluating outsourced production — but they are *decision-stage* content, not
  *homepage-introduction* content. Move this entire section to the `/services` route proposed
  in §3.1, directly alongside the Scope Estimator and pricing.
- If a trimmed version stays on the homepage, cut it to a single quiet line of text (no icon
  grid, no bordered pillars) — e.g., one sentence on remote delivery philosophy — and link out
  to the full breakdown.

### 4.5 Deliverables gallery (`DeliverablesGallery.tsx`)
- The before/after Grasshopper-script-to-render slider is the single best interactive moment
  on the page — it demonstrates real process, not just a finished picture. Keep it, but give it
  more visual room (currently boxed at `h-72 sm:h-96` inside a bordered card; let it run larger
  and closer to full-bleed).
- Drop the "Verified Work" and star-rating client-review badges (§3.4) from card fronts; move
  client testimonials to a dedicated quote/testimonial treatment (large pull-quote typography,
  not a small bordered chip inside a project card).
- Filter tabs (`All / CAD Permit Sets / 3D BIM / …`) are useful; keep them, but drop the pill
  styling in favor of plain underlined text tabs (closer to editorial gallery navigation than
  app-style segmented control).
- This is the section that should absorb the three separate `ImageSlideshowBand` instances —
  see §3.5. Consider one unified, filterable, full-bleed gallery combining permit sets, BIM
  screenshots, interior renders, and exterior renders in a single browsing experience with
  category chips, rather than four separate gallery mechanisms (this grid + 3 slideshows) doing
  overlapping jobs.

### 4.6 Pricing (`CombinedPricingSection.tsx`, `ConsultancyPricing`, `VisualizationPricing`)
- Move to the `/services` (or `/estimator`) route (§3.1) alongside the Scope Estimator and
  LOD Guide, so the homepage stays work-led and this whole cluster becomes a single, complete
  "ready to start a project" destination reachable from one clear CTA.

### 4.7 Image slideshow bands (`ImageSlideshowBand.tsx`)
- Consolidate all three usages into one gallery component with manual navigation (§3.5).
- If a full-viewport ambient divider is still wanted somewhere in the new IA, use it **once**,
  as a single signature transition between "hero" and "work," not three times between
  unrelated sections.

### 4.8 Scope Estimator & LOD Guide
- Both are strong, genuinely useful tools — keep them fully intact, just relocate them to the
  `/services` route (§3.1) so they're available on demand rather than mandatory scroll content
  for a first-time visitor evaluating design quality.

### 4.9 Footer
- Consolidate all contact/social/freelance-platform links here (this is the correct home for
  them) instead of duplicating most of them in the hero and profile card as well.
- Remove the "(Protected)" / owner-login affordance from public footer chrome (§3.6).

---

## 5. Proposed design-system adjustments

### 5.1 Color
- Keep the brass override in `index.css` (`--color-amber-400/500`, etc.) — it's a good,
  distinctive choice, not stock Tailwind amber. Just narrow its *usage* (§3.3): one primary CTA
  treatment, one emphasis-per-section, done.
- Everything currently amber-tinted "for decoration" (bullet dots, secondary icons, hover
  borders, stat numbers, badge outlines) shifts to neutral (`neutral-300`–`neutral-500`) or a
  simple white-on-dark hairline.

### 5.2 Typography
- Keep the three-family system (DM Sans / Cormorant Garamond / JetBrains Mono) — it's a
  legitimate editorial pairing and already wired cleanly into Tailwind's theme.
- Expand the *scale*, not the family count: hero H1 should have real headroom at `xl`/`2xl`
  breakpoints (target roughly double current desktop size).
- Restrict `font-mono` + uppercase + wide-tracking treatment to genuine data/spec content
  (LOD codes, sheet counts, rate tables) — stop using it as the default "section eyebrow" style
  everywhere, which currently makes nearly every section header look like a spec sheet label.

### 5.3 Spacing & containment
- Introduce a full-bleed breakout utility for hero media and the consolidated gallery — content
  should not always be capped at `max-w-7xl`.
- Reduce border usage broadly: prefer whitespace and typographic hierarchy to delineate
  sections instead of `border border-neutral-800` boxes around nearly every content block.

### 5.4 Motion
- Add scroll-triggered reveal (opacity/translate-y on section entry) for a more considered,
  premium feel — currently the only motion is hover states and the slideshow autoplay.
- Replace blind auto-cycling on the (now singular) gallery with user-driven, momentum-based
  transitions (arrow/drag), reserving autoplay only for a brief idle-state ambient loop that
  pauses immediately on any interaction.

---

## 6. Proposed information architecture

**Current (single route, ~11 stacked sections):**
Hero → Specialist Card → Workflows → Deliverables Gallery → Combined Pricing → Interior
Slideshow → Exterior Slideshow → Scope Estimator → BIM/CAD Slideshow → LOD Guide → Footer

**Proposed:**
- **`/` (Home)** — Hero (self-hosted video, large display type, two CTAs) → Consolidated,
  navigable project gallery (merges Deliverables + all 3 slideshows) → Quiet "About the
  Architect" band (trimmed Specialist card, no freelance-platform grid) → Single "Start a
  Project" CTA band → Footer.
- **`/services`** (or `/estimator`) — Engagement models (trimmed Workflows content) →
  Consultancy & Visualization pricing → Scope Estimator → LOD Guide. Everything currently
  competing for space on the homepage lives here, reachable from one clear "Start a Project"
  action.
- **`/contact`** (or a footer-anchored contact panel, if a second route is out of scope) — CV
  download, freelance-platform badges, all social links.

This keeps 100% of the current functionality (nothing gets deleted) — it just separates "here
is the work and who does it" from "here is how to buy it," which is the core distinction elite
architecture-firm sites make and this site currently does not.

---

## 7. Suggested phasing

**Phase 1 — No new routes, lowest risk, highest visual impact:**
- Strip badge/pill/border overuse (§3.2) and narrow accent-color usage (§3.3).
- Remove owner-editing affordances from public chrome (§3.6).
- Consolidate the three `ImageSlideshowBand` instances into one navigable gallery (§3.5).
- Reduce hero CTA count and move discipline/track tags out of the primary viewport (§3.9,
  §4.2).

**Phase 2 — Content/copy pass:**
- Rewrite freelance-marketplace-toned copy (§3.4) into design-authority language.
- Trim the Specialist card to bio/credentials/stack only; relocate freelance-platform links
  (§4.3).

**Phase 3 — Structural/IA change:**
- Split into `/` and `/services` (§6); this is the biggest lift (routing, likely via
  `react-router` or simple hash-based sectioning) but delivers the clearest before/after in
  perceived caliber.

**Phase 4 — Polish:**
- Self-host hero video (§3.8).
- Add scroll-reveal motion and one asymmetric/full-bleed layout module (§3.7, §5.4).

---

## 8. Summary

The underlying work — real BIM production, real permit sets, real parametric/Grasshopper
process, a functioning scope estimator — is exactly the substance an elite architecture
practice's site should be built around. The current implementation is technically sound but
visually and tonally borrows the wrong reference class: bordered pill UI, star ratings,
freelance-platform badges, and dollar-figure cost-savings copy read as *service marketplace*,
not *design authority*. The fix is not a rewrite — it's subtraction: fewer boxes, fewer
competing CTAs, one accent used sparingly, work presented before pricing, and admin tooling
removed from public view. Every recommendation above is additive-safe (nothing described here
requires deleting functionality, only relocating and restyling it).
