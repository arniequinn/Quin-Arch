# Final Polish & v2.0

**Scope:** Every point from the 22-point design review (owner + MoonCake, Discord, 2026-09-23
22:31–23:23), plus the six changes the owner asked for directly on 2026-09-24. Each item was
checked against the live site and the code.

**Status:** Built in the working tree on 2026-09-24 (not committed or deployed). See
[§0](#0-build-status-2026-09-24) for what was built, how it was verified, and what still needs the
owner before it goes live.

**What "v2.0" means:**
- The site moved from `arniequinn.github.io/Quin-Arch` to its own domain, `quinarch.design`,
  on 2026-09-24.
- v2.0 is the pass that makes it feel finished there: everything below, plus deploying the SEO
  pass (build-time prerendering, structured data, GA4 events).
- The SEO pass already exists in the working tree but is not deployed yet.

**How this was verified:**
- **Live site:** `https://quinarch.design` at commit `d1668f5`, 2026-09-24.
- **Browser:** the built-in browser, at emulated viewports of 360×780, 1280×800 and 1440×900.
- **Measurements:** made by script in the page (element positions, font census, frame timing),
  not by eye.
- **Line references:** point at the current working tree, which includes the uncommitted SEO pass.

**Format:** every item has four parts:
- **What it says.** The request or review point, quoted. For review points 1–22 the heading
  itself is the quote.
- **Verified.** What the live site and the code actually show.
- **What needs to be done.** The fix.
- **Done when.** How to check the fix.

Points that repeat an owner request (4 and 6) point to that request instead of repeating it.

---

## 0. Build status (2026-09-24)

Every item in §3–§5 is built in the working tree, on top of the uncommitted SEO pass. Nothing is
committed or deployed.

### What the owner still has to decide or supply

| Item | Where it stands | To publish |
|---|---|---|
| "Not included" lists (point 7) | Drafted exactly as in point 7, shown on each service page and estimator tab in `npm run dev` only | Edit `src/data/exclusions.ts` if needed, then set `exclusions: true` in `src/data/ownerSignoff.ts` |
| Project facts (point 17) | Only facts stated on the drawing sets themselves are shown: floors, sheets in the set, drawing list, the title-block role, plus the existing specs. "Verification" is gone | Add area, bedrooms/bathrooms, year, durations, construction status and client type in `PORTFOLIO_SAMPLES` (`src/data/architecturalData.ts`); the facts grid shows whatever is filled in |
| Drawing-set images (§5.2) | The stock photos are replaced by sheets and renders rendered from the PDFs already in `public/portfolio/docs/` (in `public/portfolio/sheets/`) | Confirm the clients are fine with it |
| LOD stance (point 8) | Implemented as recommended: LOD 100–350 standard, LOD 400 by request, LOD 500 not offered — one sentence in `src/data/lod.ts` | Confirm, or change the `status` of each level in `LOD_LEVELS` and the `LOD_COVERAGE` sentence there |
| Visualization rates (A.3/A.4) | Implemented exactly as proposed; the three worked examples reproduce in the UI | Sign off the rates, stage multipliers, $95 revision round, turnaround rules, and the CAD→USD rate (0.72, a placeholder) in `VISUALIZATION_RATES`/`FX_TO_USD` |
| Sheet catalogue (point 21) | Rebuilt with NCS/UDS numbering | Arslan to check the default set for each project type (`src/data/sheetCatalogue.ts`) |
| Point 15 reading | Both readings are handled: the nav link is gone, the library is sectioned, the BIM page ending is rebuilt | Nothing — confirm with MoonCake if wanted |
| `public/portfolio/motivation-letters/` | Still deployed (not linked anywhere) | Delete if they shouldn't be public |

### Decisions made during the build

- **LOD definitions are paraphrased, not quoted.** The spec is CC BY-NC-ND and this is a business
  site, so the guide words every definition in its own language and links to the official PDF for
  the exact text.
- **BIM chapter images:** `portfolio/drawings/` turned out to hold free-hand figure drawings, not
  sheets, so the BIM card uses sheets rendered from the project PDFs instead.
- **Workflow images (point 13):** `01`, `02` and `05` are split into single panes, with the AI chat
  panel left out of `02`. `05` is split from `screenshots/6.JPG`, a sharper original. `1.JPG` and
  `5.JPG` were put to use as panes, and the five originals were removed. `06-teen-bedroom.jpg` stays in
  the repo but isn't shown (it would be upscaled) until a larger export replaces it.
- **BIM estimator:** the fee is shown directly, as in the other two tabs, instead of behind a
  "Request Consultation" click. The sheet list moved from the sidebar to step 4.
- **"Send this scope"** posts through the existing Web3Forms key (as the LOD guide does), with an
  email fallback. WhatsApp and Email sit beside it.
- **Visualization comparison:** the US typical tier, or Canada's where its data covers the whole
  scope; other markets are compared with the US and labelled as such.
- **Type scale:** the H1 lower bound is 40 px on phones; 56 px doesn't fit a 360 px screen.
- **Navigation:** the full row appears from 1408 px, which leaves a 110 px gap on each side.
- **Practice note:** moved to Design Philosophy and restacked centered (R6).
- **Software names:** kept generic ("3D BIM"), following commit `d7d8423`.
- **Performance:** the YouTube hero video now starts after the page has loaded, galleries only load
  the current image and its neighbours, and only the first three ribbon frames load eagerly.

### Verification (§10)

| Check | Result |
|---|---|
| TypeScript + build with prerendering | Pass; 16 pages prerendered; `sitemap.xml` includes `/scope-estimator/` and all four case studies |
| Hydration (production build, fresh load of every page) | 0 console errors on all 15 pages |
| Alignment (13 pages × 360 · 390 · 768 · 1024 · 1280 · 1440 · 1920 · 2560 px) | Every H1/H2 centered within 4 px; no horizontal scroll; no text under 13 px (480 heading checks) |
| Homepage text census (1440 px) | 0% of text runs under 13 px (was 78%), monospace 4.8% (was 46%), 11 style combinations (was 31) |
| Nav (360–2560 px) | Brand 18/20/22 px; nearest gap 73 px; no destination listed twice |
| Buttons | 1 corner radius; 2 boxed variants (primary, secondary) plus the text link; 0 dead targets (332 internal links, 12 anchors, 170 images checked) |
| Estimators | Unit toggle round-trips with the same fee; A.3 examples: $800–980, $3,570–4,360, $660–810; BIM defaults identical on every run; Reset restores them |
| Sequence | 7.85 screen heights at 1440×900 (was 13.6), 7.81 at 390×844; closes into the opening pair and releases straight into the footer |
| Scrolling under 4× CPU throttling | 8 runs at 1440×900 and 390×844: no task over 50 ms; 0–0.4% dropped frames |
| Gallery | 0 images cropped or upscaled at 1440 and 1920 px; every image has a caption and alt text; no empty tabs |
| LOD guide print | 2 pages (Letter), with title block, per-level rows, all B.3 sections, sources and contact footer |
| Lighthouse, mobile, DevTools throttling | Performance: homepage 98, estimator 99, visualization 97. Accessibility 97–100, SEO 100 |

---

## 1. Executive summary

The site is technically sound: real routes, a coherent brass/serif identity, and a working
estimator. What the review picked up is **inconsistency**, not a missing concept. At 1440 px,
page headings start at up to five different horizontal positions. The homepage uses 31
combinations of font, size and weight, and 78% of its text renders below 13 px. Calls to
action come in nine different styles. And the homepage does two jobs at once: it tells the
practice's story, and it hosts a tool and a glossary.

Four moves carry most of the value:

1. **The homepage becomes pure narrative.** It's the hero, the ribbon sequence, and then the
   footer.
   - The Scope Estimator and the LOD guide get their own pages (R2).
   - The ribbons close up and exit into the footer (R3).
   - The sequence gets roughly 45% shorter (point 12).
2. **One layout and type system across the site:**
   - one centered column (R6, points 9, 11)
   - a type scale with sensible minimums (points 2, 19)
   - one `Button` component (point 10)
3. **One estimator page with three tabs** (BIM/CAD · Visualization · Consultancy) sharing one
   shell.
   - BIM gets a unit toggle and a correct sheet catalogue (R4, point 21).
   - Visualization is rebuilt around the variables the market actually prices on, including the
     existing design stage (R5, Appendix A).
4. **Honest, complete content:**
   - real project facts in the Project Library's floating window (points 17, 18)
   - workflow images split so each pane is readable (point 13)
   - a "Not included" list for each service (point 7)
   - one consistent statement of which LOD levels are covered (point 8)
   - an LOD guide based on the current BIMForum 2025 specification (point 14, Appendix B)

## 2. Decisions already made (2026-09-24)

| Question | Decision |
|---|---|
| Doc only, or build now? | Doc first. Build after the owner reviews it. |
| How literal is "all text centered"? | One centered column on every page. Headings and intros are centered; paragraphs and lists stay left-aligned *inside* that column. |
| Point 18: the separate case-study pages | **Keep** the 4 case-study pages (they're indexed, and they're the Case Studies menu). Remove the "Read the full case study →" link from the library cards; the floating window is the one way to open a project there. |
| Where the estimators live | One page, `/scope-estimator/`, with three tabs (BIM/CAD · Visualization · Consultancy) sharing one layout: steps on the left, a sticky result panel on the right. |

---

## 3. Owner requests (R1–R6)

### R1 — Rename "The thinking behind the work" to "Design Philosophy"

**What it says.** "can you change this 'the thinking behind the work'? there is a name for that
page its called Design Philosophy, use that"

**Verified.** Two links point to `/design-philosophy/` with that wording:
- The homepage chapter card "Why work with us", as its secondary link:
  [App.tsx:221](../src/App.tsx#L221) `secondary={{ label: "The thinking behind the work", … }}`.
- The Why Work With Us page: [WhyWorkWithUsPage.tsx:116](../src/pages/WhyWorkWithUsPage.tsx#L116),
  "Read the thinking behind the work →".

The same page also appears as "Principal Architect" in the nav
([Navbar.tsx:84](../src/components/Navbar.tsx#L84), [:185](../src/components/Navbar.tsx#L185))
and in the footer ([Footer.tsx:127](../src/components/Footer.tsx#L127)). That's three names for
one page.

**What needs to be done.**
- Every link to `/design-philosophy/` reads "Design Philosophy": the two links above plus the nav
  item.
- The footer duplicate goes (point 22).
- The small "Principal Architect" label above Arslan's name *on* that page stays; it's a role, not
  a link.

**Done when.**
- `grep -ri "thinking behind the work" src` returns nothing.
- Every link to `/design-philosophy/` reads "Design Philosophy".

### R2 — Scope Estimator and LOD guide get their own pages; the homepage gets buttons

**What it says.** "clean up the home page by adding buttons for the scope estimator and LOD
development. so both of them will have their own dedicated pages now". This is also review
point 6.

**Verified.**
- Both sections render only on the homepage, after the ribbon sequence:
  [App.tsx:265](../src/App.tsx#L265) `<ScopeEstimator>` and [App.tsx:271](../src/App.tsx#L271)
  `<LODGuide />`.
- The LOD guide already has its own, fuller page at `/guides/lod-guide/`
  ([LodGuidePage.tsx](../src/pages/LodGuidePage.tsx)). The homepage section repeats its table.
- **14 links and 3 scroll buttons** target the homepage's `#estimator`.
  - The links:
    - Navbar ([:71](../src/components/Navbar.tsx#L71), [:157](../src/components/Navbar.tsx#L157))
    - Footer ([:123](../src/components/Footer.tsx#L123))
    - PageShell (`onScrollToEstimator`, [:18](../src/components/PageShell.tsx#L18))
    - the HeroSequence skip link ([:135](../src/components/filmstrip/HeroSequence.tsx#L135))
    - BIM/CAD page ([:126](../src/pages/BimCadServicePage.tsx#L126), [:301](../src/pages/BimCadServicePage.tsx#L301))
    - Services hub ([:186](../src/pages/ServicesHubPage.tsx#L186), [:214](../src/pages/ServicesHubPage.tsx#L214))
    - Why Work With Us ([:97](../src/pages/WhyWorkWithUsPage.tsx#L97))
    - Design Philosophy ([:182](../src/pages/DesignPhilosophyPage.tsx#L182))
    - LOD guide ([:156](../src/pages/LodGuidePage.tsx#L156))
    - 404 page ([:10](../src/pages/NotFoundPage.tsx#L10))
    - the dead link in the Project Library's floating window
      ([DeliverablesGallery.tsx:347](../src/components/DeliverablesGallery.tsx#L347), point 10)
  - The scroll buttons: the hero "Start a Project" ([App.tsx:133](../src/App.tsx#L133)), the nav
    "Scope Planner" button ([Navbar.tsx:119](../src/components/Navbar.tsx#L119)), and the profile
    card ([SpecialistProfileCard.tsx:147](../src/components/SpecialistProfileCard.tsx#L147)).
- The visualization and consultancy calculators sit inside their service pages
  (`#rate-estimator` sections).

**What needs to be done.**
1. **New page `/scope-estimator/`**, with tabs (per §2). Each piece follows an existing pattern:

   | Piece | What it contains | Copy from |
   |---|---|---|
   | `scope-estimator/index.html` | title, description, canonical URL, Open Graph tags, and `WebPage` + `BreadcrumbList` schema | any service page's HTML |
   | `src/entries/scope-estimator-main.tsx` | `mountPage` + `PageShell` | any existing entry |
   | `src/pages/ScopeEstimatorPage.tsx` | the tabbed page | — |
   | `build.rollupOptions.input` in `vite.config.ts` | the new HTML file; the sitemap and prerender pick it up automatically | the existing entries |

   The tab is chosen by `?service=bim|visualization|consultancy`, so each service page can link
   straight to its tab.
2. **Homepage.**
   - Remove the estimator and LOD sections ([App.tsx:263–272](../src/App.tsx#L263)) and the
     hash-scroll effect that only existed for them.
   - Hero action row: **Start a Project** (primary, goes to `/scope-estimator/`) · **View
     Services** · **LOD Guide** (text link to `/guides/lod-guide/`).
   - The nav's primary button goes to `/scope-estimator/`.
3. **Re-point all 14 links and 3 buttons** to `/scope-estimator/`, each with the matching tab.
   - The sequence's "Skip to Scope Estimator ↓" becomes "Skip intro ↓", pointing at the footer.
4. **Service pages:** the embedded calculators become a short rates summary plus one "Open the
   estimator" button pointing at their tab.
5. **`LODGuide.tsx`:** delete it once nothing renders it. The guide page has its own table.

**Done when.**
- The homepage has no estimator or LOD section.
- `grep -rn "#estimator" src` finds nothing.
- `/scope-estimator/` is prerendered and appears in `dist/sitemap.xml`.
- Each service page's button opens its own tab.

### R3 — Ribbon sequence: the bands close up and exit into the footer

**What it says.** "the only thing i want to change about the moving ribbons is right at the end…
before we scroll past 'see it before it is built' i want that the bottom ribbon and top ribbon
come together again before they start going up together again and we only see the footer at the
bottom"

**Verified.**
- The sequence is one scroll-linked timeline, `U`, in
  [HeroSequence.tsx:46–60](../src/components/filmstrip/HeroSequence.tsx#L46).
- At the start (u = 0) the two bands sit together as a pair at the bottom of the hero:
  2 × ribbon height + an 8 px gap. They rise together in stage 1.
- After the last card ("See it before it is built", the visualization chapter) there's only
  `tail: 0.3` ([:59](../src/components/filmstrip/HeroSequence.tsx#L59)). Both bands stay where the
  chapters left them: interior band pinned to the top of the stage, exterior band pinned to the
  bottom.
- The sticky stage then scrolls away with that open gap between the bands, followed by the Scope
  Estimator and LOD sections.

**What needs to be done.**
- **Close stage (new).** After the last card's pop-out window:
  - The interior band's `top` animates down from 0.
  - The exterior band's `top` animates up from `S − R`.
  - They stop when they form the pair at the bottom of the stage: exactly the opening frame at
    u = 0.
  - Use the same `easeInOut` curve, over about 0.6 stage heights of scroll, so it reads as a
    deliberate closing gesture.
- **Release.** The scroll wrapper ends right after the close stage, so the stage un-pins. The pair
  scrolls up with the page, and the footer follows directly behind it, because after R2 nothing
  else remains on the homepage.
- The last card's pop-out must finish before the bands start moving, so they never overlap.
- The reduced-motion fallback (a plain stacked layout) stays as it is.

**Done when.**
- Scrolling past the visualization card, the bands meet at the bottom of the stage, rise together,
  and the footer is the only thing that follows.
- There's no blank, screen-high gap between the pair and the footer.
- Checked at 390×844, 1440×900 and 1920×1080.

### R4 — sq m / sq ft toggle in the Scope Estimator

**What it says.** "lets include a button to switch between sq meter and the sq ft for the scope
estimator"

**Verified.** Everything is in sq ft only:
- the state `areaSqFt` ([ScopeEstimator.tsx:56](../src/components/ScopeEstimator.tsx#L56))
- the "SF" unit label ([:255](../src/components/ScopeEstimator.tsx#L255))
- the presets `[850, 1500, 2800, 4500, 7500]` ([:176](../src/components/ScopeEstimator.tsx#L176))
- the project cards, e.g. "~2,800 SF" ([:233](../src/components/ScopeEstimator.tsx#L233))
- the slider, 300–12,000

The calculator also works in sq ft ([calculator.ts](../src/utils/calculator.ts), `areaSqFt`). UK,
Australian and most international visitors think in m².

**What needs to be done.**
- A segmented **ft² | m²** toggle next to "Gross Floor Area".
- All maths stays in sq ft (`calculateScope` is unchanged). Values are converted only where they're
  entered or shown: 1 m² = 10.7639 ft².
- Metric presets: **80 · 140 · 260 · 420 · 700 m²**, the rounded equivalents of today's presets.
  The metric slider runs 30–1,100 m² in 5 m² steps. Card labels follow the chosen unit.
- Default unit by jurisdiction: US and Canada use ft²; UK, Australia and international use m².
- Remember the visitor's choice in `localStorage`, wrapped in try/catch like
  [specialistProfile.ts](../src/services/specialistProfile.ts).
- WhatsApp and email messages quote the area in the chosen unit, with the other unit in brackets.
- The same toggle component is reused in the visualization tab (R5).

**Done when.**
- Switching units never changes the fee for the same physical area (±1 rounding).
- The presets and slider bounds switch with the unit.
- The message shows both units.

### R5 — Visualization estimator rebuilt from market research; consistent UI across all three

**What it says.** "we should put the same logic/effort into the scope calculator for 3d
visualization service aswel… same sq ft and sq m toggle button too… depending on if the existing
project design stage for the visualization is in concept phase… or schematic phase.. or completed
3d modeled and textured phase (only needing lighting and camera and render) those will all effect
the actual price… do real market research globally… the consultation service doesnt need a
complicated scope estimator… just polish the ui for all services make it consistent."

**Verified.**
- **Current calculator** ([VisualizationPricing.tsx](../src/components/VisualizationPricing.tsx)):
  - one number input for area ([:110](../src/components/VisualizationPricing.tsx#L110)) with no
    slider (point 20)
  - an interior/exterior toggle
  - buttons to pick a market for comparison
- **Current pricing:**
  - area × $0.75 (interior) or $1.75 (exterior) per sq ft
  - area above 1,200 / 2,500 sq ft is damped by a square root
  - minimums of $200 / $350
  - Sources: [pricingTracks.ts:31–68](../src/utils/pricingTracks.ts#L31) and
    [architecturalData.ts `OFFERED_RATES`](../src/data/architecturalData.ts#L461).
- **What it ignores.** There's no input for design stage, number of views, resolution, animation,
  360°, revisions or schedule. Those are what actually set rendering prices (Appendix A.2).
- **How the market prices.** Every source in Appendix A prices still renders **per view**. Per-sq-ft
  pricing only shows up for VR tours and walkthroughs.
- **Sale-price styling.** The market price is struck through next to the offer
  ([VisualizationPricing.tsx:129](../src/components/VisualizationPricing.tsx#L129); the same in
  [ConsultancyPricing.tsx:112](../src/components/ConsultancyPricing.tsx#L112)). That's the
  "was/now" pattern the wedge positioning dropped.
- **Three different-looking tools.**
  - BIM is a multi-step form with a sticky result panel.
  - Visualization and consultancy are small centered cards with market-picker buttons.
  - They use different WhatsApp buttons (a green gradient in two, a dark green in the other) and
    repeat disclaimers.

**What needs to be done.**
- **One shared layout** for all three tabs.
  - Numbered steps on the left; a sticky result panel on the right.
  - The same controls everywhere: segmented buttons, a slider paired with a number input, and the
    unit toggle.
  - The same result panel:
    - the fee range
    - turnaround
    - the deliverables list
    - a one-line market comparison, with no strikethrough
    - one primary "Send this scope" action, plus WhatsApp and email
- **Visualization tab**:
  1. **Scene and size.** Interior / Exterior / Aerial, with area on a slider and number input,
     the ft²/m² toggle, and presets.
  2. **Existing design stage.**
     - **Concept:** sketches, references, massing.
     - **Schematic:** 2D CAD plans, elevations, sections.
     - **Modeled & textured:** a finished, textured 3D model, needing lighting, cameras,
       rendering and post-production only.
  3. **Deliverables.**
     - still views, 1–12
     - resolution tier: Standard 2K / High 4K / Hero 6K+
     - add-ons: 360° panoramas (count) and animation (seconds)
  4. **Schedule.** Standard / Expedited / Rush, the same as BIM.
  - **Output:** fee range, turnaround, deliverables, "2 revision rounds included", and the market
    comparison for the visitor's region.
- **Pricing.** The model in Appendix A.3, with rates stored in `architecturalData.ts` next to
  `OFFERED_RATES`. A new `calculateVisualizationScope()` in `pricingTracks.ts` replaces
  `calculateVisualizationFee`.
- **Consultancy tab.** The same layout with one step (an hours slider, 1–80, plus a number input)
  and the same result panel. The logic (`calculateConsultingFee`) doesn't change.

**Done when.**
- All three tabs are built from the same components.
- The visualization fee responds to stage, views, tier, add-ons and schedule exactly as A.3
  specifies.
- The three worked examples in A.3 give the same numbers in the UI.

### R6 — Text centered on every page, at every width

**What it says.** "make sure all the text is centered and not veering off to the left or right of
center screen for any pages at any resolution". As decided in §2: one centered column; headings
and intros centered; body text left-aligned inside that column.

**Verified at 1440×900.** A script measured where each page's H1/H2 text actually sits:

| Page | Headings | Centered | Distinct left edges (x, px) |
|---|---|---|---|
| Services hub | 6 | 2 | 190 · 300 · 560 · 930 |
| Visualization | 8 | 2 | 100 · 230 · 300 · 360 |
| BIM/CAD | 10 | 1 | 100 · 170 · 230 · 300 · 360 |
| Consultancy | 8 | 2 | 230 · 300 · 360 |
| Case Studies hub | 5 | 0 | 190 · 300 · 750 |
| Case study (Cran) | 4 | 1 | 170 · 300 |
| Design Philosophy | 2 | 0 | 170 · 230 |
| LOD guide | 4 | 1 | 360 (the only consistent page) |

The Project Library zigzags around the centre line:
- "Project Library" −473 px
- "High-Precision… Deliverables" 0
- "Interior Visualization" −481
- the practice note +381
- "BIM / CAD Workflow" −475

**Root cause.** Each section picks its own container width (`max-w-3xl` through `7xl`, each
centered on its own) and its own heading alignment, so every section's left edge lands in a
different place. For example, on Why Work With Us the H1 sits in a `max-w-5xl` section at x=233,
and the next section's H2 sits in a `max-w-7xl` container at x=105.

**What needs to be done.**
- **Two layout components** in `src/components/`:
  - `Container`, with two widths, both centered: `wide` (max-w-7xl, for galleries and grids) and
    `text` (max-w-3xl, the reading column).
  - `SectionHeader`: eyebrow + H2 + intro, always centered.
- **Rules:**
  - Section headers are always centered.
  - Body text is left-aligned inside a centered `text` column.
  - Grids are centered with equal gutters.
  - Breadcrumbs share the container of the H1 below them.
  - No section uses its own one-off `max-w`.
- **Scope.** Apply to all 15 pages plus the new estimator page. The homepage hero headline block
  and the chapter cards are centered too: text block centered, images in a row beneath it.

**Done when.** Re-running the audit script on every page at 360 · 390 · 768 · 1024 · 1280 · 1440 ·
1920 · 2560 px shows:
- every H1/H2 centered (centre offset ≤ 4 px)
- body paragraphs within a section sharing one left edge
- no horizontal scrolling at 360 px

---

## 4. Review points 1–22

### 1 — "overlap on nav bar left… also company title needs to be bigger"

**Verified.**
- **Zero slack at 1280 px.** 1280×800 is where the full nav appears (Tailwind `xl`).
  - The brand name ends at x=219 and "Services" starts at x=235: **16 px**.
  - The last nav link ends at x=982 and LinkedIn starts at x=998: **16 px**.
- **The brand is barely bigger than the links.** It's 14 px Cormorant Garamond (13 px on phones)
  against 12 px nav links, so "Quintessential Architecture Services" reads as one run-on line.
- **Why it overlaps.** The brand `<button>` has `min-w-0`
  ([Navbar.tsx:39](../src/components/Navbar.tsx#L39)) and the nav is `shrink-0`
  ([:63](../src/components/Navbar.tsx#L63)). When the row is a few pixels short (slightly wider
  text rendering, browser zoom, fonts still loading), the brand is what shrinks, and its unwrapped
  text runs under the links.
- **A duplicate.** The nav holds 6 links, LinkedIn, and a "Scope Planner" button that repeats the
  "Scope Planner" link ([:70–76](../src/components/Navbar.tsx#L70) and
  [:116–123](../src/components/Navbar.tsx#L116)).
- **Phones (360×780).** The brand wraps onto two lines at 13 px with 16 px to the buttons: no
  overlap, but the title is small.
- **Still live.** The navbar commits `f2e4142` and `578f77a` (2026-09-23, 19:59 and 20:42) came
  before the review (22:31), so the review describes the live nav.

**What needs to be done.**
- **Brand:** 18 px on phones, 20–22 px on desktop, Cormorant semibold. Make it a real link,
  `<a href="/">`, instead of a JavaScript button. Remove `min-w-0` so it never compresses.
- **Nav, at most 5 items:** Services · Project Library · Case Studies · Why Work With Us · Design
  Philosophy.
  - "Start a Project" (goes to `/scope-estimator/`) is the single primary button.
  - LinkedIn becomes an icon only.
  - Drop the duplicate "Scope Planner" link and the "Construction Documentation" link (point 15).
- **When to show the full nav:** only when it fits. Measure after trimming; it's probably around
  1360–1536 px. Use the menu button below that.

**Done when.**
- From 360 to 2560 px, the brand and nav never come within 24 px of each other.
- The brand is at least 18 px.
- No destination appears twice in the nav.

### 2 — "non consistent fonts on landing page"

**Verified (homepage, 1440×900).** A census of all 338 rendered text runs:

| Font | Text runs | Share |
|---|---|---|
| DM Sans (body) | 172 | 51% |
| JetBrains Mono (monospace) | 155 | **46%** |
| Cormorant Garamond (display serif) | 11 | 3% |

- There are **31 distinct font/size/weight combinations**.
- The monospace face is used for eyebrows (e.g. [ChapterCard.tsx:41](../src/components/ChapterCard.tsx#L41)),
  labels, badges, stats, prices and software tags, not just data.
- The single most common style on the page is 10 px monospace (76 runs).

**What needs to be done.** Set font rules as tokens in `index.css` `@theme`:

| Font | Use |
|---|---|
| **Display: Cormorant Garamond** | H1/H2 only |
| **UI/body: DM Sans** | everything else, including eyebrows (as tracked uppercase DM Sans) |
| **Data: JetBrains Mono** | only sheet numbers, LOD codes, prices/rates and dimensions |

A 6-step type scale:

| Step | Size |
|---|---|
| Labels | 13 px |
| Small body | 15 px |
| Body | 17 px |
| H3 | 22 px |
| H2 | 32–40 px |
| H1 | 56–96 px, fluid with `clamp` |

Apply it to the homepage first, then site-wide (the same pass as point 19).

**Done when.** The homepage census shows monospace at 15% or less of text runs, and 12 or fewer
style combinations.

### 3 — "redo Sequence.."

**Verified.**
- "The sequence" is `HeroSequence`: hero → two filmstrip ribbons → five cards popping into the gap
  between them.
- The same day, the owner wrote "the only thing i want to change about the moving ribbons is right
  at the end".
- Read together, the redo means three things, not a new concept:
  - the new ending (R3)
  - a faster, smoother sequence (point 12)
  - more pictures in the cards (point 5)

**What needs to be done.** R3, point 12 and point 5.

**Done when.** R3, point 12 and point 5 are each done.

### 4 — "read the thinking behind the work"

Covered by **R1**: the link is renamed to "Design Philosophy" in both places.

### 5 — "needs more pictures in page previews on homepage"

**Verified.** The "page previews" are the chapter cards that pop into the gap between the ribbons
([App.tsx:201–260](../src/App.tsx#L201)):

| Card | Pictures |
|---|---|
| Principal architect (profile card) | avatar only |
| Why work with us | **none** (three bullet points instead) |
| BIM & construction documentation | 3 thumbnails |
| Architect consultant | **none** |
| Photorealistic visualization | 3 thumbnails |

- In `compact` mode — a screen narrower than 1024 px or shorter than about 720 px
  ([HeroSequence.tsx:296](../src/components/filmstrip/HeroSequence.tsx#L296)) — the cards drop
  thumbnails entirely ([ChapterCard.tsx:30](../src/components/ChapterCard.tsx#L30)).
  **So phones and tablets see no pictures in any preview.**
- The thumbnails are small: three 3:4 images in half the card.

**What needs to be done.**
- **Pictures on every card.** Suggestions (the owner can swap them):

  | Card | Suggested images |
  |---|---|
  | Why work with us | the barn render and its wireframe, or the Cran perspective |
  | Consultant | the structural and solar-analysis screens (after point 13 splits them) |
  | BIM | 3 drawing sheets from `portfolio/drawings/` |
  | Visualization | 3–4 renders |

- **Layout (R6).** Text block centered, 3–4 images in a row beneath it on desktop, a 2-image strip
  in compact mode.
- **Compact mode** keeps at least 2 images instead of dropping them all.

**Done when.** Each of the four page-preview cards shows at least 3 images on desktop and at least
2 on a 390×844 phone.

### 6 — "get the scope estimator out of the home page on its own dedicated path"

Covered by **R2**. It moves to `/scope-estimator/` (with tabs), and every link is re-pointed.

### 7 — "no mention of what my services dont cover"

**Verified.**
- No service page and no estimator lists exclusions.
- The only "not covered" statements anywhere are about LOD 400/500 in the two LOD tables
  ([LODGuide.tsx:54](../src/components/LODGuide.tsx#L54), [:65](../src/components/LODGuide.tsx#L65);
  [LodGuidePage.tsx:102](../src/pages/LodGuidePage.tsx#L102)), and those contradict each other
  (point 8).
- The one hint is buried in the calculator's permit notes: drawings are "ready for Architect of
  Record (AOR) or Professional Engineer (PE) stamp" ([calculator.ts:203](../src/utils/calculator.ts#L203)).
  That implies someone else stamps them, but the site never says so.

**What needs to be done.** Add a **"Not included"** block to each service page, and repeat the
relevant lines in each estimator tab's result panel.

The draft below is for the owner to confirm or edit. **Don't publish it unconfirmed**, especially
the licensing line.
- **BIM/CAD & construction documentation:**
  - structural, MEP, civil and geotechnical engineering design and calculations
  - professional seals or stamps: drawings are prepared for the client's architect of record or
    engineer to review and stamp *(confirm the licensing statement)*
  - permit application filing and expediting with the authority
  - site surveys, measured surveys and field verification: as-built work is drawn from supplied
    records and isn't field-verified (see Appendix B, LOD 500)
  - energy-compliance reports (e.g. Title 24 calculations) unless quoted
  - fabrication-level (LOD 400) shop drawings unless quoted
  - construction administration beyond the stated redline turnaround
- **Visualization:**
  - design work: renders show the supplied design (unless the Concept stage is chosen)
  - modelling beyond the agreed brief
  - more than 2 revision rounds (charged per round)
  - animation, 360° or VR unless selected
  - premium stock (branded furniture, licensed people or cars) beyond standard libraries
  - print production
- **Architect consultant:**
  - design responsibility or liability for the client's project
  - signed or stamped deliverables
  - site visits
  - production drafting (billed under BIM/CAD)

**Done when.** Every service page and every estimator tab shows a "Not included" list the owner has
approved.

### 8 — "edit lod section remove disclaimers"

**Verified.**
- **The homepage LOD section:**
  - It ends in an amber callout box: "Standard delivery covers LOD 100 through LOD 350 … LOD 400 …
    and LOD 500 … are outside current service scope"
    ([LODGuide.tsx:62–67](../src/components/LODGuide.tsx#L62)).
  - It tags the last two rows with "Not Provided" pills ([:54](../src/components/LODGuide.tsx#L54)).
- **The ballpark-estimate disclaimer is repeated 6 times** ([EstimateDisclaimer.tsx:15](../src/components/EstimateDisclaimer.tsx#L15)):
  - [ScopeEstimator.tsx:646](../src/components/ScopeEstimator.tsx#L646)
  - `VisualizationPricing`
  - `ConsultancyPricing`
  - the BIM, Consultancy and Visualization service pages

  There are also two grey footnotes: "Market comparison rates are researched blended benchmarks
  (Sept 2026)…".
- **The site contradicts itself about which LOD levels are covered:**

  | Where | What it says |
  |---|---|
  | Homepage LOD section | LOD 400 "Not Provided" / "outside current service scope" |
  | LOD guide page | LOD 400 "By Request" |
  | BIM page FAQ ([:64](../src/pages/BimCadServicePage.tsx#L64)) | LOD 400 "available on request" |
  | BIM page hero and "What's Included" ([:116](../src/pages/BimCadServicePage.tsx#L116), [:22](../src/pages/BimCadServicePage.tsx#L22)) | "LOD 100–400" |
  | BIM page software list ([:29](../src/pages/BimCadServicePage.tsx#L29)) | "3D BIM Modeling (LOD 200–350)" |
  | Scope Estimator phases ([:35](../src/components/ScopeEstimator.tsx#L35)) | Construction Administration = "LOD 400+" |

**What needs to be done.**
- **One stance.** The owner decides one statement of which levels are covered. The recommendation
  is: *LOD 100–350 standard, LOD 400 by request, LOD 500 not offered.* It lives in one place
  (`LOD_LEVELS` in [architecturalData.ts:348](../src/data/architecturalData.ts#L348)), and every page
  reads it from there.
- **LOD content:** no callout boxes, no pills. Each level gets a plain text status — "Standard",
  "By request" or "Not offered" — which is real information, not decoration.
- **Disclaimers:** replace all 6 with **one short line inside the estimator result panel**:
  *"Indicative range — confirmed as a fixed fee once the brief is agreed."*
  - Remove the copies on the service pages and the grey benchmark footnotes.
  - The market comparison line carries its own date: "(benchmark, Sept 2026)".

**Done when.**
- "ballpark" appears in one component, used only in the estimator result.
- Which LOD levels are covered reads the same on every page.

### 9 — "footer texts needs to be aligned"

**Verified (1440×900).** The footer is two flex rows, each split left/right with `justify-between`
([Footer.tsx:19](../src/components/Footer.tsx#L19), [:119](../src/components/Footer.tsx#L119)):
- **Row 1:** brand block at x 105–593, then social and platform links at x 673–1321.
- **Row 2:** site links at x 105–868, then copyright at x 884–1321.

The split falls at a different place in each row, so nothing lines up in columns. On phones both
rows collapse into centered stacks of wrapped links. There are two text sizes (12 and 14 px), and
one page is linked twice (point 22).

**What needs to be done.** A **grid footer**.
- Desktop columns:

  | Column | Contents |
  |---|---|
  | 1 | brand plus a one-line description of the practice |
  | 2 — Site | Services, Project Library, Case Studies, Scope Estimator, LOD Guide, Design Philosophy, Why Work With Us |
  | 3 — Contact | email, WhatsApp, LinkedIn, Instagram, YouTube |
  | 4 — Also on | Upwork, Fiverr, Freelancer, Cad Crowd (kept low-key, per the wedge decision) |

- A bottom bar with the copyright on the left and "Lahore · working worldwide" on the right,
  aligned to the same column edges.
- Phones get a single centered column (R6).
- Links at 14 px, secondary text at 13 px.

**Done when.** At 1440 px, the column edges line up between the grid and the bottom bar, and no
page is linked twice.

### 10 — "review buttons"

**Verified.**
- **9 different fill styles for calls to action:**

  | Style | Uses |
  |---|---|
  | solid `amber-400` | 11 |
  | solid `amber-500` | 6 |
  | amber outline | 3 |
  | amber tint | 3 |
  | emerald gradient | 2 |
  | solid emerald | 6 |
  | dark emerald | 1 |
  | neutral fill | 10 |
  | neutral outline | 15 |

  That's two different "primary" ambers and three different WhatsApp greens.
- **4 corner radii:** `rounded` ×35, `rounded-lg` ×24, `rounded-xl` ×22, `rounded-md` ×3.
- **At least 5 labels for the same destination (the estimator):** "Start a Project", "Scope
  Planner" (both a nav link and a nav button), "Scope Estimator" (footer), "Open Scope Estimator",
  and "Configure Estimate for This Project Type".
- **A dead button.** The main action in the Project Library's floating window, "Configure Estimate
  for This Project Type", links to `#estimator`
  ([DeliverablesGallery.tsx:346–352](../src/components/DeliverablesGallery.tsx#L346)). That element
  doesn't exist on `/projects/` (confirmed live: `document.getElementById('estimator')` is `null`),
  so the button just closes the window.
- **The nav brand** is a `<button>` that navigates with JavaScript, not a link (point 1).

**What needs to be done.**
- **One `Button` component** with three variants:
  - `primary`: solid brass, one per view
  - `secondary`: neutral outline
  - `link`: text plus an arrow

  One corner radius and two sizes. WhatsApp uses the secondary style with an icon everywhere.
- **One label per destination:** "Start a Project" always goes to `/scope-estimator/`; then "View
  Services", "WhatsApp" and "Email".
- **Fix the dead button:** point it at `/scope-estimator/?service=bim`, or remove it.

**Done when.**
- A census finds 3 button variants and 1 radius.
- A link check finds no dead targets.

### 11 — "align title texts on why work with us page"

**Verified (1440×900).**
- The H1 "Principal-level architecture, delivered remotely." is at x=233 (a `max-w-5xl` section,
  [WhyWorkWithUsPage.tsx:41](../src/pages/WhyWorkWithUsPage.tsx#L41)).
- The first H2, "A building designed around how you actually live.", is at x=105 (a `max-w-7xl`
  section, [:67](../src/pages/WhyWorkWithUsPage.tsx#L67)).
- The second H2, "Why Architecture Studios & Contractors Outsource…", is centered (it comes from
  `WorkflowsSection`).
- The feature titles sit at x=165 in the homeowners section and x=190 in the firms section.
- The H1 is weight 700; the H2s are 800.

**What needs to be done.**
- Rebuild the page with the R6 components: every section header centered via `SectionHeader`, and
  the feature grids sharing one container.
- One weight per heading level.

**Done when.** The audit shows every H1/H2 centered, and each section's feature titles share one
left edge.

### 12 — "animation needs to be quicker/ skip frames in transition"

**Verified (1440×900).**
- **Length:** getting through the sequence takes **12,205 px of scrolling, 13.6 screen heights,
  about 122 mouse-wheel notches**, before anything else on the homepage.
  - The timeline `U` ([HeroSequence.tsx:46–60](../src/components/filmstrip/HeroSequence.tsx#L46))
    totals 13.6 stage heights for 5 cards (`chapterLen 1.6`, `popLen 0.45`).
  - The wrapper height is `(U_TOTAL + 1) × stage` ([:181](../src/components/filmstrip/HeroSequence.tsx#L181)).
- **Dropped frames: not reproduced here, but plausible.**
  - A scripted scroll through the whole sequence at about 2,400 px/s recorded 306 frames, all about
    17 ms, with none over 33 ms.
  - However, the ribbons animate `top` and `height` ([FilmstripMask.tsx:65](../src/components/filmstrip/FilmstripMask.tsx#L65),
    set from [HeroSequence.tsx:355](../src/components/filmstrip/HeroSequence.tsx#L355)). That forces
    a full layout on every scroll frame.
  - The page also holds **81 full-size render images**, because each strip repeats its images four
    times ([ScrollFilmstrip.tsx:7](../src/components/filmstrip/ScrollFilmstrip.tsx#L7)).
  - On a slower machine, or while images are still decoding on first load, dropped frames are
    likely. That matches "skip frames in transition".

**What needs to be done.**
- **Shorter: about 7–8 screen heights in total (≈ −45%).** Keep all timing values together in one
  block so they're easy to tune by feel. Starting values:

  | Timing value | Now | Proposed |
  |---|---|---|
  | `travelEnd` | 0.96 | 0.6 |
  | `expandEnd` | 1.92 | 1.3 |
  | profile card window | 2.9–4.9 | 2.0–3.4 |
  | exterior band | 4.9–6.9 | 3.4–4.6 |
  | `chapterLen` | 1.6 | 1.0 |
  | `popLen` | 0.45 | 0.3 |

- **Smoother:**
  - Animate `transform: translateY` plus `clip-path: inset()` instead of `top`/`height`; the
    browser can move those without re-laying-out the page.
  - Use 2–3 copies per strip instead of 4.
  - Serve ribbon images at 1600 px wide or less (WebP/AVIF) with `decoding="async"`.
  - Set `will-change: transform` on the moving layers only while the sequence is on screen.
- **Test** on a mid-range laptop and a phone, with a Chrome DevTools performance trace at 4× CPU
  throttling.

**Done when.**
- The sequence is at most 8 screen heights at 1440×900.
- With 4× CPU throttling, the trace shows no task over 50 ms while scrolling and under 5% dropped
  frames.

### 13 — "split images in bim/ cad workflow library"

**Verified.**
- **Three of the nine BIM/CAD workflow images are 2000×543 strips (about 3.7:1)**, each combining
  several app windows:

  | Image | Panes |
  |---|---|
  | `01-window-schedule.jpg` | ArchiCAD floor plan · elevation · window schedule |
  | `02-grasshopper-rolling-polygon.jpg` | Rhino viewport · Python script editor · a **third-party AI chat panel** ("Raven Chat … Go Pro") · Rhino perspective · Grasshopper graph |
  | `05-structural-model-calc.jpg` | ArchiCAD structural 3D model · Rhino slab outlines · Grasshopper wall/slab calculations |

- **The gallery crops them.** The frame is full-width and 56vh/72vh tall with `object-cover`
  ([ProjectGallery.tsx:87](../src/components/ProjectGallery.tsx#L87), [:99](../src/components/ProjectGallery.tsx#L99)).
  - On a 1440×900 desktop the frame is 1425×648 (about 2.2:1). A strip shows **60% of its
    width**, with 20% cut off each side, so the outer panes are lost.
  - On a 390×844 phone the frame is portrait (390×473). A strip shows **22% of its width**: a
    sliver of the middle pane.
- **Unused files.** `bimcad-workflow/1.JPG` and `5.JPG` aren't referenced anywhere.

**What needs to be done.**
- Split `01`, `02` and `05` into **single-pane images**, each with a caption. For example, `01`
  becomes a floor plan, an elevation and a window schedule.
- **Crop the AI chat panel out of `02`.** A visitor could read it as the work being done by a
  chatbot.
- Show software screenshots uncropped (`object-contain`) on the dark background, with a caption.
  Renders stay cropped to fill the frame, or choose per image (point 16).
- Delete `1.JPG` and `5.JPG`, or put them to use.

**Done when.** Every workflow image is fully visible at 1440 and 390 px wide, and every one has a
caption.

### 14 — "lod pdf/ print option needs to have way more info... check online sources"

**Verified.**
- "Print / Save as PDF" ([LodGuidePage.tsx:61](../src/pages/LodGuidePage.tsx#L61)) prints the guide
  page as it stands: six rows (level, name, one-sentence description) plus two short paragraphs.
  That's about one printed page.
- Checked against the current standard (**BIMForum LOD Specification 2025**, Part I, released 30
  December 2025), the guide leaves out:
  - the official definitions
  - what each level is used for
  - element examples
  - the ISO 7817-1 "level of information need" aspects
  - the rule that LODs are not project phases
  - what LOD 500 actually means
- It also repeats two ideas the spec corrects (Appendix B.2).

**What needs to be done.**
- **Expand the guide** per Appendix B.3.
- **A print layout:**
  - a title block with logo, date and version
  - 2–4 A4/Letter pages
  - one row per LOD: definition, plain-language meaning, uses and an example
  - sections on "what a permit set covers" and "how to specify LOD in a proposal"
  - a source list
  - screen-only elements hidden (`@media print` already exists in [index.css](../src/index.css))
- Optional, later: generate a real PDF at build time.

**Done when.** Printing or saving the guide produces a 2–4 page document containing everything in
B.3, with sources cited.

### 15 — "why is there all sorts of random shit in construction documentation page (everything past software)"

**Verified.** There are two plausible readings.
- **(a) Most likely: the page the nav's "Construction Documentation" link opens.**
  - That link goes to `/projects/#deliverables`.
  - The drawing-set cards there end in software tags ("everything past software").
  - Below them the page continues with interior/exterior visualization, a practice note (the barn
    render vs. its wireframe), and the BIM/CAD workflow gallery
    ([ProjectsPage.tsx:39–62](../src/pages/ProjectsPage.tsx#L39)). None of it is about construction
    documents.
- **(b) The BIM/CAD service page.** Its H1 reads "Construction Documentation & BIM Production".
  After "Software & Standards" ([BimCadServicePage.tsx:231](../src/pages/BimCadServicePage.tsx#L231))
  it has:
  - "Recent Production Work": case-study cards with the Unsplash photos
  - "How Pricing Works", plus the disclaimer
  - "Common Questions", which contradicts the hero's "LOD 100–400"
  - the final call to action

**What needs to be done.**
- **The nav link:** point "Construction Documentation" at `/services/bim-cad-drafting/`, the page
  actually about construction documents — or drop it from the nav (point 1), since "Services"
  covers it.
- **Project Library:** clearly labelled sections with an index at the top: Drawing sets ·
  Visualization · BIM/CAD workflow. Move the practice note to the Design Philosophy page, where the
  "logic and feeling" story lives.
- **BIM page ending:**
  - Keep "Recent Production Work", with real images (§5.2).
  - Replace "How Pricing Works" and the disclaimer with the estimator button (R2).
  - Fix the FAQ's LOD answer (point 8).
- **Confirm reading (a) with MoonCake.**

**Done when.** The "Construction Documentation" link lands on a page about construction documents
only, and the library's sections are labelled.

### 16 — "clean up image gallery"

**Verified (Project Library, 1440×900).**
- **Every image is cropped to one fixed frame.** `ProjectGallery` shows everything at full width ×
  72vh = 1425×648 (≈2.2:1) with `object-cover` ([ProjectGallery.tsx:87](../src/components/ProjectGallery.tsx#L87),
  [:99](../src/components/ProjectGallery.tsx#L99)).
  - The renders come in 4:3 (2000×1500, 1600×1200), 16:9, about 1.24:1, and one square
    (`04-restaurant-interior`, 2000×2000).
  - Measured at 1440×900: a 4:3 render keeps 61% of its height and the square one 45%.
  - On a 390×844 phone the frame turns portrait, and a 4:3 render keeps only 62% of its width.
- **One is upscaled.** `06-teen-bedroom.jpg` is 1024×576 but shown 1425 px wide, about 1.4×, so
  it's soft ([architecturalData.ts:326](../src/data/architecturalData.ts#L326)).
- **No captions, empty alt text.** All images have `alt=""` ([ProjectGallery.tsx:97](../src/components/ProjectGallery.tsx#L97)),
  so there's no room or project name for visitors or search engines.
- **3 of 6 filter tabs are empty.** In the drawing-set section, "3D Visualization", "Millwork &
  Detailing" and "Before & After Conversion" show 0 projects each (checked by clicking each tab).
  The categories are hard-coded ([DeliverablesGallery.tsx:28](../src/components/DeliverablesGallery.tsx#L28)).
- **Four sets of controls stacked:** category tabs, arrows, dots and a counter.

**What needs to be done.**
- **Frames that respect each image's shape.** Either show the whole render on the dark background
  (`object-contain`), or crop each image around a focal point stored with it, so no render loses
  its subject.
- **No upscaling:** never show an image wider than its native width. Replace `06` with a larger
  export, or drop it.
- **Captions and alt text** from data: `TrackImage` gains `title` and `caption` fields, e.g.
  "Home office — interior, V-Ray".
- **Tabs built from the data:** show a category only if it has at least one project. Hide the empty
  three until there's work to put in them.
- **Fewer controls:** keep the arrows and the counter; drop the dots on desktop; tabs act as the
  section's sub-navigation.

**Done when.**
- No render is cropped or upscaled at 1440 or 1920 px.
- Every image has a caption and alt text.
- No tab is empty.

### 17 — "in project library… important descriptions missing… how long took to design/construct how many bedrooms etc"

**Verified.**
- Each project card and floating window shows a description plus exactly four facts. For the Texas
  beach house: Location "Coastal Texas (Gulf Coast)", Foundation, Code Adherence, and **"Verification:
  Authentic Client Work Sample"**.
- The fourth fact is the same "verification" line on all four projects
  ([architecturalData.ts:233](../src/data/architecturalData.ts#L233), [:255](../src/data/architecturalData.ts#L255),
  [:272](../src/data/architecturalData.ts#L272), [:289](../src/data/architecturalData.ts#L289)).
- Missing entirely:
  - area
  - bedrooms and bathrooms
  - floors
  - year
  - design/production time
  - construction status
  - the practice's role
  - sheet count
  - client type

**What needs to be done.**
- **Extend `PortfolioItem`** ([types.ts](../src/types.ts)) with structured facts: `areaSqFt`,
  `bedrooms`, `bathrooms`, `floors`, `year`, `designDuration`, `constructionStatus` (+
  `constructionDuration`), `role`, `sheets`, `clientType`.
- **Show them as a facts grid** in the floating window and on the cards. Area follows the ft²/m²
  toggle.
- **Remove "Verification: Authentic Client Work Sample"** as a fact.
- **The data comes from the owner** (table in §8). Nothing is estimated; a fact that isn't known is
  left out.

**Done when.** Each project shows at least 6 real facts supplied by the owner.

### 18 — "remove sapate pages in project library… keep floating window"

**Verified.**
- Every library card offers two routes to the same project:
  - **"View Project Details"** (or clicking the image) opens the floating window
    ([DeliverablesGallery.tsx:99](../src/components/DeliverablesGallery.tsx#L99), [:168–184](../src/components/DeliverablesGallery.tsx#L168)).
  - **"Read the full case study →"** leaves for a separate page ([:193](../src/components/DeliverablesGallery.tsx#L193)).
- The 4 separate pages are also the whole Case Studies section (the nav item and the
  `/case-studies/` hub). They're indexed by Google (Article markup, listed in the sitemap).

**Decision (§2).** Keep the case-study pages. Remove the link from the library, so the floating
window is the one way to open a project there.

**What needs to be done.**
- **Remove the link** ([DeliverablesGallery.tsx:188–195](../src/components/DeliverablesGallery.tsx#L188)).
- **Make the floating window complete,** so nothing is lost by not visiting the page:
  - the facts from point 17
  - a drawings/images gallery
  - the description
  - software
- **Fix the window's dead button** (point 10).

**Done when.**
- Library cards have one action: open the floating window.
- The case-study pages are still live and in the sitemap.

### 19 — "text size is too small in a lot of areas"

**Verified.**
- **Homepage census (1440×900): 264 of 338 text runs (78%) are below 13 px.**
  - The most common style is 10 px monospace (76 runs).
  - Next is 12 px DM Sans (80 runs across two weights).
- **Across the source:** 1 use of `text-[9px]`, **24** of `text-[10px]` and **106** of
  `text-[11px]`, plus 143 of `text-xs` (12 px).
- **The estimator is the worst area:** 9–11 px for descriptions, labels and the whole sheet list.
- Chapter-card eyebrows are 11 px; the footer and nav links are 12 px.

**What needs to be done.**
- Adopt the type scale from point 2, with these minimums:

  | Text | Minimum |
  |---|---|
  | Body | 16–17 px |
  | Secondary text | 15 px |
  | Labels and eyebrows | 13 px |
  | Legal/meta text only | 12 px |

  Nothing goes below 12 px.
- Replace every `text-[9px]`, `text-[10px]` and `text-[11px]` with a scale token.

**Done when.** On every page, under 10% of text runs are below 13 px, and none are below 12 px.

### 20 — "use slider for inputing areas in visualization calculator"

**Verified.** The area field is a bare number input
([VisualizationPricing.tsx:110](../src/components/VisualizationPricing.tsx#L110)). The consultancy
calculator already pairs its number input with a slider, and the BIM estimator has a slider plus
presets.

**What needs to be done.** In the rebuilt visualization tab (R5): a slider, a number input, the
ft²/m² toggle (R4), and presets per scene type:
- Interior: 250 · 500 · 1,000 · 2,000 · 4,000 ft² (25 · 45 · 90 · 185 · 370 m²).
- Exterior: 1,500 · 3,000 · 6,000 · 12,000 · 25,000 ft².

**Done when.** Area can be set by dragging, typing or tapping a preset, in either unit.

### 21 — "list of sheets is cooked"

**Verified.** Checked live on the homepage estimator (1440×900) and in the code
([calculator.ts:62–100](../src/utils/calculator.ts#L62), [ScopeEstimator.tsx:40–74](../src/components/ScopeEstimator.tsx#L40),
[:110–116](../src/components/ScopeEstimator.tsx#L110)).

**Whether a sheet starts selected depends on click order.** The list of sheets that start
switched off is worked out once, for the default project. Sheets added later come in switched on.

| Action | Result |
|---|---|
| Choose "Residential Remodel & Addition" | `A-100 Existing/Demolition` appears switched **on** |
| Then press Reset | `A-100` switches **off** |
| Choose "High-End Interior Fit-Out" | `A-501`/`A-502` come in **on**, while `A-401`–`A-403` stay **off** |

**Irrelevant sheets are treated as core.**
- An interior fit-out still gets `C-101` Site Plan and `A-201`/`A-202` Exterior Elevations switched
  on ([`CORE_SHEET_NUMBERS`](../src/components/ScopeEstimator.tsx#L40)).
- A restaurant gets "chimney clearances" and "crawlspace/slab tie-in" details.

**Standard permit-set sheets start switched off:** `A-601` Door/Window/Hardware Schedules and
`G-002` Code/Life-Safety.

**The numbering doesn't follow the US National CAD Standard / Uniform Drawing System.** There,
sheet numbers are a discipline letter plus a sheet-type digit:
- **`C-101`** is used for the architectural site plan ([calculator.ts:65](../src/utils/calculator.ts#L65)).
  But C means Civil.
- **The 4- and 5-series are swapped.**
  - Envelope and foundation details are numbered `A-401`/`A-402`
    ([:83](../src/utils/calculator.ts#L83)). The 4-series is for large-scale views; details belong
    in the 5-series.
  - Interior elevations are `A-501` ([:91](../src/utils/calculator.ts#L91)), which should be
    4-series.
- **`M-101`** is used for a combined MEP/structural coordination overlay
  ([:99](../src/utils/calculator.ts#L99)). M means Mechanical, and `M-101` is conventionally the
  mechanical floor plan. A coordination overlay isn't a permit-set sheet at all; it's a separate
  deliverable (e.g. a Navisworks clash report).

**Phases are mapped to LODs one-to-one** (Concept = LOD 100 … Construction Administration = "LOD
400+", [ScopeEstimator.tsx:30–36](../src/components/ScopeEstimator.tsx#L30)). BIMForum 2025 says:
*"The LODs are not defined by design phases"* (Appendix B).

**It's hard to read.** Rows are 10 px with 9 px LOD tags, inside a 208 px-tall scroll box
(`max-h-52`, [:614](../src/components/ScopeEstimator.tsx#L614)) in the sidebar. Excluded sheets show
at 35% opacity with a strikethrough.

**What needs to be done.**
- **Rebuild the sheet catalogue as data.** Each sheet gets:
  - an NCS number
  - title and description
  - discipline and sheet type
  - `appliesTo` (which project types)
  - `defaultOn` (per project type)
  - `addedBy` (which services add it)
- **Correct numbering:**
  - `A-001`/`AS-101` for the site plan
  - `A-4xx` for enlarged plans and interior elevations
  - `A-5xx` for details
  - `A-6xx` for schedules
  - coordination output as a deliverable, not an M-sheet
- **Predictable defaults.** Recompute the default set from project type + services whenever those
  change. Store the visitor's manual toggles as changes on top of that default; "Reset" clears
  them.
- **Readable list:** grouped by series (General · Site · Plans · Elevations · Sections ·
  Enlarged/Interior · Details · Schedules), full titles, 14 px checkbox rows. The count goes in the
  result panel.
- **Phases:** show phase names only. LOD is chosen per deliverable, or shown as "typical LOD" with a
  link to the guide.
- **Review:** Arslan checks the catalogue for each project type before launch.

**Done when.**
- The same project type + services always gives the same default set.
- No sheet that doesn't apply starts switched on.
- The numbering has been checked against NCS.
- The list is readable at 390 px.

### 22 — "principal architect link in footer is pointless"

**Verified.**
- The footer links `/design-philosophy/` twice: "Design Philosophy" in the top row
  ([Footer.tsx:46](../src/components/Footer.tsx#L46)) and "Principal Architect" in the bottom row
  ([:127](../src/components/Footer.tsx#L127)).
- The nav also labels that page "Principal Architect" ([Navbar.tsx:84](../src/components/Navbar.tsx#L84)).

**What needs to be done.**
- Remove the "Principal Architect" footer link.
- The page is called "Design Philosophy" everywhere (R1).
- The footer grid (point 9) lists each page once.

**Done when.** Each page appears at most once in the footer.

---

## 5. Other issues found while verifying

1. **Before JavaScript loads, pages show a bare placeholder.** On the live site each page first
   shows a title, one line of text and a row of plain yellow links, until JavaScript builds the
   real page (caught on `/projects/` at 1440×900). This is **already fixed in the working tree**
   by build-time prerendering, which isn't deployed yet. Deploying it is part of v2.0.
2. **Stock photos on "authentic client work."** 3 of the 4 case studies and library projects show
   Unsplash photos (e.g. [architecturalData.ts:227](../src/data/architecturalData.ts#L227)) while
   labelled "Authentic Client Work Sample". Replace them with a real sheet or render from each
   project. The drawing-set PDFs are in `public/portfolio/docs/`; confirm the client is fine with
   it.
3. **Strikethrough market prices.** [VisualizationPricing.tsx:129](../src/components/VisualizationPricing.tsx#L129)
   and [ConsultancyPricing.tsx:112](../src/components/ConsultancyPricing.tsx#L112) strike through
   the market price, like a sale. Replace with a plain comparison line (R5).
4. **The old product name "ArchScope"** still appears in pre-filled WhatsApp messages:
   [VisualizationPricing.tsx:30](../src/components/VisualizationPricing.tsx#L30),
   [ConsultancyPricing.tsx:30](../src/components/ConsultancyPricing.tsx#L30),
   [SpecialistProfileCard.tsx:30](../src/components/SpecialistProfileCard.tsx#L30).
5. **LOD 500 vs. "As-Built CAD & BIM Digitization."**
   - The estimator offers as-built digitization, while the LOD tables say LOD 500 isn't provided.
   - Per BIMForum, LOD 500 means geometry determined by observation or field verification.
     Converting drawings the client supplies isn't field-verified.
   - Fix: the project type should say "from supplied records, not field-verified", which ties into
     the point 7 exclusions.
6. **Unused files:**
   - `public/portfolio/bimcad-workflow/1.JPG` and `5.JPG`
   - personal documents under `public/portfolio/motivation-letters/`, already flagged in
     [businessmodelandoutreach.md §8](businessmodelandoutreach.md)

---

## 6. Appendix A — Visualization rates: market research and proposed pricing model

Researched 2026-09-24. Prices are per still image or view unless noted. Figures stay in the
source's currency; convert them at the current rate when publishing. Sources are listed at the
end.

### A.1 What the market charges

| Market / tier | Interior | Exterior | Aerial | Animation | 360° / VR | Source |
|---|---|---|---|---|---|---|
| US, budget tier | $249–600 | $400–750 | $600–1,000 | $1,500–2,500 per min | $200–500 per view | Visualizee |
| US, typical tier | $600–1,500 | $750–2,500 | $1,000–2,500 | $4,000–12,000 per min | $1,500–2,500 per space | Visualizee |
| US, premium tier | $1,400–2,600 | $3,200–4,000 | $3,000+ | $20,000+ per min | $1,600–4,000+ per project | Visualizee |
| US, mid-market studio | $600–1,500 (residential) | $800–2,500 | $1,000–3,000 | $4,000–12,000 per min | — | RealSpace3D |
| US, studio by project size | small $400–1,500; medium $700–1,800; large $1,000–2,000 | small $400–1,500; medium $800–2,000; large $1,200–5,000 | $600–4,000 | — | — | Alden Studios |
| US, studio tiers | freelancers $300–600; mid-tier $800–2,000; premium $2,500–6,000 | — | +35–50% over street level | $2,200–5,000 per min (basic); $8,000–18,000 (marketing) | — | Maverick Frame |
| US, budget studio list price | from $249 | from $499 | $799 | $2,500 per min | VR tours $2 per sq ft | Render3DQuick |
| US, marketplace floor (freelancers) | residential $200–550; commercial $275–1,000 | residential $200–700; commercial $350–2,000 | — | up to ~$7,000 per building | VR $2–5 per sq ft | Cad Crowd |
| UK | from £195 | from £195 | — | £1,650 per 60 s | 360 tours £1,200–4,000 + VAT | RealRender3D; Visualizee |
| Canada | CAD 950–2,800 | CAD 900–2,500 | — | CAD 3,500–15,000+ | — | Pacific Render Studio |
| Australia (budget studio) | from AUD 250 + GST per room | from AUD 250 + GST | — | from AUD 800 + GST per 60 s | — | 3D Design Studios |
| India | ₹12,000–45,000 | ₹15,000–60,000 | — | ₹80,000–4,00,000+ per min | — | Chasing Illusions |

Animation priced per second by named studios (via Visualizee): Trim Render $75/s, Provisual
$110/s, 7CGI from $25/s.

### A.2 What moves the price (from the sources)

- **Priced per view, not per area.** Every studio source prices still renders per image or view.
  Per-sq-ft pricing only appears for VR tours and walkthroughs (Cad Crowd: $2–5/sq ft;
  Render3DQuick: $2/sq ft).
- **What the client supplies (the design stage).**
  - *"Well-organized CAD files with material callouts can reduce modeling time by 35–50% compared to
    hand-drawn sketches"* (Maverick Frame).
  - Complete SketchUp/Revit models *"can cut the quote substantially because we skip the modelling
    stage"* (RealRender3D).
  - Comprehensive briefs run 20–30% cheaper because there's less rework (Maverick Frame).
- **More views of the same scene.**
  - *"Additional views of the same scene are far cheaper because that work is already done"*
    (RealRender3D).
  - Orders of 4+ views save 15–30% per image (RealSpace3D).
- **Scene type and scale.**
  - Aerials cost 35–50% more than street-level views (Maverick Frame).
  - Larger projects cost more per view: Alden's size grid; mixed-use towers at $3,500–6,000 per
    image (Maverick Frame).
- **Revisions.**
  - 1–2 rounds are usually included (Alden Studios, Maverick Frame).
  - Extra rounds cost $75–200 (Maverick Frame) or $100–400 (RealSpace3D).
  - Maverick Frame: revisions multiply the price more than extra views do.
- **Rush:** +25–50% (RealSpace3D), +30–50% (Maverick Frame).
- **Turnaround.**
  - Typical studios: 7–10 business days for an interior, 10–14 for an exterior, 3–6 weeks for
    animation (Maverick Frame).
  - Budget studios: 3–4 days (Render3DQuick).

### A.3 Proposed model (for owner sign-off; every value can be tuned)

```
fee = Σ over still views [ base(scene) × size × stage × tier × viewDiscount(n) ]
    + panoramas × base360 × stage
    + animationSeconds × ratePerSecond × stage
fee = max(minimumFee, fee) × schedule
shown as a range: fee × 0.9 … fee × 1.1
```

**Base price per view (offered, USD).** Set at about 50% of the US "typical" midpoint. That's the
same positioning the BIM track uses against its US benchmark (`OFFERED_RATES`: "a consistent 50-60%
below the US benchmark").

| Scene | US typical (Visualizee) | Midpoint | Proposed offer |
|---|---|---|---|
| Interior | $600–1,500 | $1,050 | **$495** |
| Exterior | $750–2,500 | $1,625 | **$795** |
| Aerial | $1,000–2,500 | $1,750 | **$895** |
| 360° panorama | $200–500 (budget, per view); $1,500–2,500 (typical, per space) | — | **$595** per view |
| Animation | $4,000–12,000 per min ≈ $67–200/s | ≈ $133/s | **$65/s** (minimum 20 s) |

As a check: the offers sit at or just above the US freelancer and budget bands ($300–600 per
interior, Maverick Frame; $249–600, Visualizee), and within India's studio band. That's
competitive without being the cheapest, which is the wedge position.

**Size factor** = `clamp(√(area / baseline), 0.8, 1.8)`.
- Baselines:

  | Scene | Baseline area |
  |---|---|
  | Interior | 1,200 ft² (111 m²) |
  | Exterior | 2,500 ft² (232 m²) |
  | Aerial | 10,000 ft² of site (929 m²) |

- This is the same square-root damping the current calculator uses
  ([pricingTracks.ts](../src/utils/pricingTracks.ts)).
- It's capped by the spread between small and large projects in the sources: Alden's exteriors run
  $400–1,500 small vs. $1,200–5,000 large, about 2–3×.

**Existing design stage** (the owner's key input), relative to Schematic:

| Stage | What the client supplies | Multiplier | Why |
|---|---|---|---|
| Concept | sketches, references, massing | **×1.35** | Clean CAD cuts modelling time 35–50% vs. sketches (Maverick Frame), so sketches need ≈1.5–2× the modelling. If modelling is ≈40–50% of a CAD-based still (an assumption, to check on the first jobs), that's ×1.2–1.5 overall; ×1.35 is the midpoint. |
| Schematic | 2D CAD plans, elevations, sections, intended materials | **×1.00** | base |
| Modeled & textured | a finished, textured 3D model; lighting, cameras, rendering and post-production only | **×0.55** | The modelling stage is skipped (RealRender3D). What's left (lighting, rendering, post) is ≈50–60% of the work (assumption). |

An optional fourth stage, "3D model, untextured", would be ×0.75.

**Resolution / quality tier:**
- Standard (2K, web and social): ×1.0
- High (4K, print and presentations): ×1.2
- Hero (6K+, marketing, heavy entourage and post): ×1.5

The gap between typical and premium tiers in the sources is ≈1.7–2.3× (Visualizee), so ×1.5 keeps
Hero competitive.

**More views of the same scene:**
- View 1 at 100%.
- Views 2–3 at 80%.
- View 4 onward at 70%.

That's in line with RealSpace3D's 15–30% and RealRender3D's "far cheaper".

**Schedule:** Standard ×1.0 · Expedited ×1.25 · Rush ×1.5. The sources give 25–50%, and these are
the same values as the BIM estimator's `TIMELINE_OPTIONS`.

**Revisions:** 2 rounds included; extra rounds **$95** each.

**Minimum fee:** one standard interior view at the chosen stage (e.g. $495 at Schematic).

**Turnaround (proposal):**
- 5 business days for the first view, plus 1 day per 2 extra views.
- Concept: +3 days. Modeled & textured: −2 days.
- Animation: +1 day per 10 s.
- Expedited ×0.65, Rush ×0.45 (the same rules as [calculator.ts](../src/utils/calculator.ts)).

**Worked examples** (the build must reproduce these):
1. **Interior, 1,200 ft², Schematic, 2 views, Standard 2K, standard schedule.**
   - Size factor 1.0.
   - View 1: $495. View 2: $495 × 0.8 = $396.
   - Total **$891**, shown as **≈ $800–980**.
2. **Exterior, 3,500 ft², Concept, 3 views, High 4K, standard schedule.**
   - Size factor √1.4 = 1.183.
   - First view: $795 × 1.183 × 1.35 × 1.2 = $1,524. Views 2–3: $1,219 each.
   - Total **$3,962**, shown as **≈ $3,570–4,360**. For comparison, three typical US exteriors cost
     $2,250–7,500.
3. **Interior, 800 ft², Modeled & textured, 4 views, Standard 2K, standard schedule.**
   - Size factor √0.667 = 0.816.
   - Base view: $495 × 0.816 × 0.55 = $222.
   - Views: $222 + $178 + $178 + $156 = **$734**, shown as **≈ $660–810**.

**Market comparison in the UI:** one plain line, e.g. *"Typical US studio price for this scope:
$1,500–3,000 (benchmark, Sept 2026)."* The benchmarks come from A.1, stored in their source
currency and converted at a documented rate.

### A.4 What the owner needs to confirm before publishing

- the offered base rates
- the stage multipliers (check them against the first 3–5 real jobs)
- the exchange rates and their date for the market comparison
- what the Hero tier includes
- the price of an extra revision round
- the turnaround commitments

---

## 7. Appendix B — LOD guide: sources and proposed content

### B.1 Sources

- **Primary: BIMForum, Level of Development (LOD) Specification 2025, Part I.** Released 30
  December 2025, licensed CC BY-NC-ND 4.0.
- For each level, the spec gives three things:
  - the **AIA Contract Documents definition**
  - a **"BIMForum Expansion"** (plain-language clarification)
  - the **ISO 7817-1** "level of information need" aspects: detail, dimensionality, location,
    appearance, parametric behaviour
- For LOD 500 accuracy, it recommends **USIBD's Level of Accuracy (LOA) Specification**.

### B.2 Corrections the site needs

- **LODs are not project phases.** The spec: *"The LODs are not defined by design phases. Rather,
  design phase completion … can be defined through the LOD language."* The estimator's one-to-one
  phase→LOD mapping (point 21) has to go, and the guide should explain that LOD applies to each
  model element separately.
- **LOD 300 and 350.**
  - The spec says designers *"rarely generate model elements higher than 300"*, and LOD 300
    elements *"are not necessarily clash-free"*.
  - LOD 350 *"is intended to define requirements for 3D model elements that are sufficiently
    developed to support construction-level coordination. This LOD usually requires craft
    knowledge."*
  - The site presents LOD 350 as its standard, "enabling clash detection". That's fine to offer,
    but the guide should explain what it takes.
- **LOD 500 is not the step after 400.** The spec: LOD 500 *"does not indicate a higher level than
  LOD 400, rather it indicates that the element's geometry is determined through observation of an
  existing item rather than design of a future item."* The site's tables list it as the next rung
  after 400.
- **"LOD 250."** Some 2026 web articles describe a new "LOD 250". It **does not appear in the
  official 2025 Part I text** (checked 2026-09-24), so don't add it.

### B.3 Proposed content for the guide and its PDF

For each level (100, 200, 300, 350, 400, 500):
- the official one-line definition, quoted and attributed
- what it means in plain language
- what it's used for
- an example element, e.g. one window at every LOD
- the ISO 7817-1 aspects
- who typically models it (designer or trade)

The official definitions, verbatim from the 2025 spec (AIA Contract Documents wording):
- **LOD 100:** "The Model Element may be graphically represented in the Model with a symbol or other
  generic representation, but does not satisfy the requirements for LOD 200. Information related to
  the Model Element (e.g., cost per square foot, tonnage of HVAC, etc.) can be derived from other
  Model Elements."
- **LOD 200:** "The Model Element is generically and graphically represented within the Model with
  approximate quantity, size, shape, location, and orientation."
- **LOD 300:** "The Model Element, as designed, is graphically represented within the Model such that
  its quantity, size, shape, location, and orientation can be measured."
- **LOD 350:** "The Model Element, as designed, is graphically represented within the Model such that
  its quantity, size, shape, location, orientation, and interfaces with adjacent or dependent Model
  Elements can be measured."
- **LOD 400:** "The Model Element is graphically represented within the Model with detail sufficient
  for fabrication, assembly, and installation."
- **LOD 500:** "The Model Element is a graphic representation of an existing or as-constructed
  condition developed through a combination of observation, field verification, or interpolation.
  The level of accuracy shall be noted or attached to the Model Element."

Further sections:
- **LOD vs. project phase**, per the spec.
- **LOD vs. level of information:** ISO 7817-1 in one paragraph.
- **What a permit set typically covers:** the sheet series, matching the rebuilt catalogue from
  point 21.
- **How to specify LOD in a proposal:** per group of elements, naming the spec edition, and with
  LOD 500 accuracy stated via LOA.
- **What we deliver:** the owner's single statement from point 8.
- **A short glossary:** BIM, LOD, LOI/LOIN, NCS, UDS, RFI, CA.
- **Sources.**

### B.4 Print layout

- A4/Letter, 2–4 pages.
- Header: logo + "LOD Field Guide — v2.0 — date".
- The per-level rows first, then the sections.
- Footer: URL and contact details.
- Navigation and buttons hidden in print (the `@media print` rules in
  [index.css](../src/index.css) are the starting point).

### B.5 Licensing

The spec is CC BY-NC-ND (no commercial reuse, no derivatives). So:
- **Quote only the short definitions,** with attribution ("BIMForum LOD Specification 2025, Part I").
- **Write everything else in the site's own words.**
- **Don't reproduce the spec's tables or figures.**

---

## 8. Data only the owner can supply

| Item | Needed for | Notes |
|---|---|---|
| Facts for each of the 4 projects: area, bedrooms/bathrooms, floors, year, design/production time, construction status (built / under construction / unbuilt) and duration, role/scope, sheet count, client type | points 17, 18 | Never estimated; unknown facts are left out |
| Real images for the 3 case studies that use stock photos | §5.2, point 16 | A rendered sheet or render per project; confirm the client is OK with it |
| Which LOD levels are covered (is LOD 400 by request or not offered? LOD 500?) | point 8, Appendix B | One sentence |
| "Not included" list per service, including a licensing/stamping statement | point 7 | Confirm or edit the draft |
| Visualization rates, stage multipliers, revision price, turnaround | R5, Appendix A.3–A.4 | Sign-off; adjust after the first jobs |
| Images for each homepage chapter card | point 5 | Or accept the suggestions |
| Which reading of point 15 MoonCake meant | point 15 | (a) the nav target or (b) the end of the BIM page |

---

## 9. Build phases (after review)

1. **Quick fixes (no new pages):**
   - R1
   - point 22
   - point 10's dead button
   - point 16's empty tabs
   - point 1's brand size and duplicate nav items
   - the "ArchScope" strings (§5.4)
   - point 18's library link
   - point 8's disclaimers and LOD wording
2. **Page structure:**
   - the `/scope-estimator/` page with tabs, and the homepage buttons (R2, point 6)
   - remove the homepage estimator and LOD sections
   - re-point the 14 links and 3 buttons
   - point 15's nav target and Project Library sections
3. **Design system:**
   - `Container`/`SectionHeader` applied to every page (R6, point 11)
   - the type scale and font rules (points 2, 19)
   - the `Button` component (point 10)
   - the footer grid (point 9)
4. **Homepage sequence:**
   - the new ending (R3)
   - the shorter timeline and smoother, compositor-friendly animation (point 12)
   - card images, including in compact mode (point 5)
5. **Estimators:**
   - the unit toggle (R4)
   - the sheet catalogue rebuild (point 21)
   - the visualization tab (R5, point 20, Appendix A)
   - the consultancy restyle
   - the single caveat line (point 8)
6. **Content:**
   - exclusions (point 7)
   - project facts and the floating window (points 17, 18)
   - the LOD guide and its print layout (point 14, Appendix B)
   - split and caption the workflow images (point 13)
   - gallery clean-up (point 16)
   - case-study images (§5.2)
7. **Verify and deploy.** Run §10. Each phase is built and checked, then reviewed by the owner
   before it merges.

## 10. Verification checklist for the build

- **Build:** the TypeScript check and the build (with prerendering) both pass.
- **Hydration:** every page loads with zero console errors (the same fresh-tab sweep used for the
  SEO pass).
- **Alignment:** the audit script finds every H1/H2 centered at 360 · 390 · 768 · 1024 · 1280 ·
  1440 · 1920 · 2560 px on every page.
- **Text census:** under 10% of text runs below 13 px; monospace at 15% or less.
- **Nav:** a gap of at least 24 px between brand and links at every width.
- **Buttons:** a census finds 3 variants and 1 radius; a link check finds no dead targets
  (`#estimator` is gone).
- **Estimators:**
  - The unit toggle round-trips.
  - The A.3 worked examples give the same numbers.
  - BIM sheet defaults are the same every time for a given input.
- **Sequence:**
  - At most 8 screen heights.
  - The ending closes up and releases into the footer.
  - A DevTools trace at 4× CPU throttling is clean.
- **Gallery:** nothing cropped or upscaled; captions and alt text present; no empty tabs.
- **Sitemap:** includes `/scope-estimator/`; the case-study pages are still there.
- **Lighthouse (mobile):** run on the homepage, the estimator and one service page.

---

## Sources (accessed 2026-09-24)

**Visualization pricing**
- Visualizee — [How Much Does Architectural Rendering Cost? (2026)](https://visualizee.ai/blog/architectural-rendering-cost)
- RealSpace3D — [3D Rendering Pricing Guide](https://www.realspace3d.com/resources/3d-rendering-pricing-guide/)
- Alden Studios — [3D Rendering Prices (2026)](https://www.aldenstudios.com/resources/3d-rendering-prices)
- Maverick Frame — [3D Rendering Cost in 2026](https://maverickframe.com/blog/3d-rendering-pricing/)
- Render3DQuick — [2026 Cost of Renderings](https://render3dquick.com/blog/how-much-does-3d-rendering-cost)
- Cad Crowd — [3D Rendering & Visualization Costs](https://www.cadcrowd.com/blog/3d-rendering-and-visualization-costs-prices/) · [Architectural VR/AR Rendering Costs](https://www.cadcrowd.com/blog/architectural-vr-ar-3d-rendering-costs-rates-3d-modeling-pricing-for-design-firms/)
- RealRender3D — [3D Rendering Cost UK (2026)](https://www.realrender3d.co.uk/3d-rendering-cost-uk/)
- Pacific Render Studio — [How Much Do Architectural Renderings Cost in Canada?](https://pacificrender.com/how-much-do-architectural-renderings-cost-in-canada/)
- 3D Design Studios — [3D Render Cost Australia 2026](https://3ddesignstudios.com.au/blog/3d-render-cost-australia/)
- Chasing Illusions — [3D Rendering Pricing in India (2026)](https://www.chasingillusions.com/blog/3d-rendering-pricing-india)

**LOD**
- BIMForum — [Official Release: 2025 LOD Specification](https://bimforum.org/official-release-2025-lod-specification/) · [LOD Specification 2025, Part I (PDF)](https://bimforum.org/wp-content/uploads/2026/01/LOD-Spec-2025-Part-I-Official.pdf)
