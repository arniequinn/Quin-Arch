# Front-End Design Review — Quin-Arch Portfolio (Follow-up Audit)

**Scope:** Full codebase — `src/App.tsx` (homepage), `src/pages/*` (Services hub + 3 service
pages, Case Studies hub + case study template, LOD guide page), all shared components
(`Navbar`, `Footer`, `HeroBackgroundVideo`, `SpecialistProfileCard`, `WorkflowsSection`,
`DeliverablesGallery`, `ProjectGallery`, `CombinedPricingSection`, `ConsultancyPricing`,
`VisualizationPricing`, `ScopeEstimator`, `LODGuide`), `src/index.css` theme tokens, and the
multi-entry Vite build (`src/entries/*`, static `.html` files per route).

**Status:** Analysis only. No code changed. This is a follow-up to
`documentation/frontenddesignchanges.md` (the original audit) — recent commits already closed
several of that audit's findings; this pass re-audits the current codebase, confirms what's
fixed, and identifies what's left.

---

## 1. What's already fixed since the original audit

Worth stating plainly, since the original audit is still in the repo and could otherwise read
as still-current: the highest-leverage structural findings from `frontenddesignchanges.md` are
**done**.

- **IA split landed.** The homepage is no longer an 11-section mega-scroll. Pricing, the Scope
  Estimator, and the LOD glossary now also live at dedicated routes
  (`/services/`, `/services/bim-cad-drafting/`, `/services/visualization/`,
  `/services/consultancy/`, `/guides/lod-guide/`), and there's a proper Case Studies hub +
  individual case-study pages. This is a bigger structural win than the original doc even
  proposed (real routes, not just anchors).
- **Three slideshows consolidated into one.** [ProjectGallery.tsx](src/components/ProjectGallery.tsx)
  replaces the three `ImageSlideshowBand` instances with one navigable, full-bleed gallery:
  category tabs, arrow buttons, index dots, keyboard `←`/`→`, pause-on-hover, autoplay that
  respects `prefers-reduced-motion`. This directly closes failure patterns 5 and 6 — it's the
  strongest single component on the site right now and a good template for the rest.
- **Hero decluttered and rescaled.** [App.tsx:96–184](src/App.tsx:96) — discipline tags are now a
  single plain mono line (no chip row), the H1 runs `text-5xl` → `xl:text-8xl` and is the
  dominant element on first paint, and CTAs are down to one primary (Start a Project) + one
  secondary (View Services) + a de-emphasized text-only contact row. Original findings 3.9 and
  half of 3.10 are resolved.
- **Owner-editing entry point removed from public chrome.** [App.tsx:40–51](src/App.tsx:40) — the
  editor now opens only via `Ctrl+Shift+E`; there is no lock icon anywhere in `Navbar.tsx` or
  `Footer.tsx`. Finding 3.6 is fully resolved.
- **Bespoke accent color confirmed intentional.** [index.css:14–26](src/index.css:14) — the
  amber/brass palette is a genuine custom override (`#CEAA5F` etc.), not stock Tailwind amber,
  and it's centralized as theme tokens rather than scattered hex values.

That said, the fix in the original doc was "subtraction across the whole page," and it landed
unevenly — the hero and the new gallery got it; the sections below the fold did not.

---

## 2. Executive summary

The site's newest work (hero, `ProjectGallery`, the services/case-study IA, the LOD guide page)
is genuinely close to the elite-studio register this is aiming for: full-bleed imagery, one
accent color used with restraint, real routes instead of one long scroll. But three components
that sit in the middle of the homepage — `SpecialistProfileCard`, `WorkflowsSection`, and
`DeliverablesGallery` — were not touched by that pass and are essentially unchanged from the
original audit: box-in-box bordered panels, a 7-tile Upwork/Fiverr/Freelancer/Cad Crowd grid
with a literal "5.0 ★ Client Rating" line, a "100% On-Time & Verified" stat, "Verified Work" /
"Verified Client Review" star badges on portfolio cards, and "Zero billable risk" contractor
language. Scrolling from the hero into these sections is a visible register drop — confident
editorial type gives way to freelance-profile UI one screen later.

**The single highest-leverage move:** apply the exact subtraction/relocation pass that already
worked on the hero and gallery to these three remaining sections — they are the last part of
the homepage still reading as a service-marketplace profile rather than a studio site.

---

## 3. Findings (ranked by impact)

### 3.1 — `SpecialistProfileCard` is the least-changed, most marketplace-toned section on the page
[SpecialistProfileCard.tsx](src/components/SpecialistProfileCard.tsx) still nests: outer
`rounded-3xl` bordered card → inner `rounded-2xl` "Technical Software & BIM Stack" panel → a
2-column grid of `rounded-xl` bordered software chips → a 2×4 grid of `rounded-xl` bordered
freelance-platform cards (LinkedIn, Upwork, Fiverr, Freelancer.com, Cad Crowd, Instagram,
YouTube) → four more `rounded-xl` contact buttons. Specific lines that fight the "studio" read:
- `"100%" / "On-Time & Verified"` stat tile ([SpecialistProfileCard.tsx:138–143](src/components/SpecialistProfileCard.tsx:138)) — an unverifiable self-reported claim, lowest-trust copy on the page.
- `"5.0 ★ Client Rating"` under the Freelancer.com tile ([SpecialistProfileCard.tsx:223](src/components/SpecialistProfileCard.tsx:223)) and the section header `"Verified Freelance Portals & Social Profiles"` ([SpecialistProfileCard.tsx:150](src/components/SpecialistProfileCard.tsx:150)) — this is gig-platform profile language sitting directly under the hero.
- `"Zero billable risk: transparent scopes & agreed milestones"` ([SpecialistProfileCard.tsx:378](src/components/SpecialistProfileCard.tsx:378)) — defensive contractor-pitch phrasing.
- A pulsing green "Online & Accepting Projects" dot on the avatar ([SpecialistProfileCard.tsx:90–92](src/components/SpecialistProfileCard.tsx:90)) — a live-chat-widget affordance, not something an architecture studio's about section uses.

**Fix:** keep name / title / portrait / one-paragraph bio / education / software stack, presented
without the outer bordered card (image + text directly on the page background, per the target
design language). Drop the "100% On-Time & Verified" stat and the pulsing status dot entirely.
Move the Upwork/Fiverr/Freelancer/Cad Crowd grid and the "5.0 ★" line to `/contact` or the
footer (footer already lists these — see §3.6, they're currently duplicated in three places).
Cut "Zero billable risk" from the workflow bullet list.

### 3.2 — `WorkflowsSection` still frames the offer as headcount cost-avoidance, not design capability
[WorkflowsSection.tsx:16–41](src/components/WorkflowsSection.tsx:16) leads with "Senior
Capacity, No Overhead Hire" / "Pay only for the exact drawing sheets... you need" — this is
softer than the original doc's literal dollar figures (those are gone from this section now),
but the frame is still "avoid hiring a headcount," which is BPO/outsourcing-vendor positioning,
not design-authority positioning. It also still uses the bordered-pill icon-tile grammar (four
`rounded-2xl` cards with `rounded-xl` icon badges) that the rest of the page has moved away
from, and a `"Most Popular for Busy Firms"` floating pill badge on the featured engagement
model ([WorkflowsSection.tsx:136](src/components/WorkflowsSection.tsx:136)) — a SaaS-pricing-page
convention.

**Fix:** reframe the four benefit tiles around what gets delivered and how (turnaround
discipline, standards compliance, parametric capability) rather than what a firm avoids paying
for. Drop the "Most Popular" badge — let the featured card's border/ring do that signaling
without a pill label. This section is also a candidate to fold into `/services` now that a
dedicated hub exists — see §3.5.

### 3.3 — `DeliverablesGallery` duplicates star ratings and "verified" badges the rest of the site has moved away from
[DeliverablesGallery.tsx](src/components/DeliverablesGallery.tsx) still puts a `ShieldCheck`
"Verified Work" badge on card thumbnails ([DeliverablesGallery.tsx:116–121](src/components/DeliverablesGallery.tsx:116))
and a filled-star "Verified Client Review" quote block on card fronts
([DeliverablesGallery.tsx:153–163](src/components/DeliverablesGallery.tsx:153)) — literally the
same review-badge pattern flagged in the original audit's §3.4, unchanged. The filter tabs are
still pill-styled buttons (`rounded-xl` active/inactive states,
[DeliverablesGallery.tsx:77–88](src/components/DeliverablesGallery.tsx:77)) rather than the plain
underlined-tab treatment `ProjectGallery` already uses one section later on the same page — so
the homepage now has two different tab styles for conceptually the same job.

**Fix:** drop the star-rating quote block from card fronts (client quotes, if kept, belong in a
dedicated pull-quote treatment, not a bordered chip on a thumbnail). Drop "Verified Work" —
either the work is credibly presented or it isn't; a badge doesn't add trust an architecture
studio's presentation should already carry. Restyle the category filter to match
`ProjectGallery`'s underlined-tab pattern so the page reads as one design system, not two.

### 3.4 — Homepage still runs four consecutive gallery/portfolio mechanisms
Current homepage order: `SpecialistProfileCard` → `WorkflowsSection` →
`DeliverablesGallery` (filterable card grid + modal) → `ProjectGallery` (Interior/Exterior) →
`CombinedPricingSection` → `ScopeEstimator` → `ProjectGallery` (BIM/CAD) → `LODGuide`. That's
still eight sections, and two different "browse the work" mechanisms (`DeliverablesGallery`'s
card grid+modal, and `ProjectGallery`'s full-bleed slider) doing overlapping jobs, split apart
by `WorkflowsSection` and `CombinedPricingSection` in between. The original audit's finding 3.1
(no narrative pacing) is partly fixed — sections moved off-page — but what's left on the
homepage is still one continuous stack without an act break.

**Fix:** now that `/services` exists as a real destination, this is the moment to also move
`WorkflowsSection`'s engagement-model comparison there (it's decision-stage content, and
`/services` already explains the three tracks) — it doesn't need to live on the homepage at all.
That leaves a homepage of: Hero → About (trimmed `SpecialistProfileCard`) → one consolidated
gallery (merge `DeliverablesGallery`'s card/modal detail view into `ProjectGallery`'s browsing
UI, or place them back-to-back as "browse" then "inspect one") → Pricing/Estimator → LOD guide →
Footer. Simpler, and matches the acts pattern already working in the hero → gallery transition.

### 3.5 — Two visual grammars now coexist on one page
Because the fix passes hit the hero and `ProjectGallery` but not `SpecialistProfileCard` /
`WorkflowsSection` / `DeliverablesGallery`, the homepage currently reads as two different sites
stitched together: plain-on-background editorial type up top, then boxed/bordered/pilled SaaS
grammar for three sections, then full-bleed editorial again. This is a worse state than a
uniformly-unfinished page, because the contrast makes the untouched sections look more dated by
comparison, not less. This isn't a new failure pattern so much as the visible cost of a
partially-applied fix — flagging it because it should raise the priority of finishing the
subtraction pass on the three sections above, ahead of any new polish work.

### 3.6 — Freelance-platform links still appear in three places at once
Upwork/Fiverr/Freelancer/Cad Crowd links currently appear in `SpecialistProfileCard` (§3.1,
full tile grid with taglines), and again in `Footer.tsx:70–109` (plain text links, correctly
scoped). That's the right footer treatment — the fix here is just removing the duplicate,
heavier-weight version from the profile card, not touching the footer.

### 3.7 — `ScopeEstimator` still computes and can surface an "in-house cost" comparison
[ScopeEstimator.tsx:130–138](src/components/ScopeEstimator.tsx:130) computes
`inHouseCostEstimate` / `clientSavingsAmount` alongside the fee estimate. This wasn't read in
full (tool is 150+ lines beyond what was reviewed here), so it's worth a quick check of where in
the UI these numbers surface before finishing the copy pass — if they're shown to the visitor,
that's the same cost-savings-percentage framing already retired from the homepage copy; if
they're unused/legacy calculator output, they're just dead computation worth confirming and
possibly removing for cleanliness. Not ranked as a major finding since it wasn't fully verified,
but worth a five-minute check given the site otherwise moved away from this framing everywhere
else.

### 3.8 — Minor: `SpecialistProfileCard`'s stat tiles and `WorkflowsSection`'s icon tiles are the last `rounded-xl` bordered-chip holdouts
Everywhere else on the current homepage (hero credential strip, `ProjectGallery` labels,
`LODGuide`'s included/excluded markers) either uses plain text or reserves the bordered-pill
treatment for genuine state (LOD included/excluded is a legitimate use — keep that one). The
stat tiles in `SpecialistProfileCard` (§3.1) and the four benefit icon-tiles in
`WorkflowsSection` (§3.2) are decorative uses of the same pattern and are the most visible
remaining instances of failure pattern 1.

---

## 4. Code health notes (not visual, worth flagging)

- **`src/entries/*` + one static `.html` per route** ([services/*, case-studies/*, guides/*]
  directories) is a reasonable multi-page-app pattern for a GitHub Pages static export, and
  `dist/` mirrors it correctly. No issue — noting only because it's a slightly unusual structure
  worth a future contributor understanding: each route is its own Vite entry, not client-side
  routing.
- `assetUrl()` ([utils/assetPath.ts](src/utils/assetPath.ts)) and `import.meta.env.BASE_URL`
  are used consistently for internal links and asset paths across every component read for this
  audit — good, avoids the classic GitHub-Pages-subpath breakage.
- `CASE_STUDY_SLUGS` in `DeliverablesGallery.tsx:19–24` hardcodes a portfolio-item-id → route
  mapping in the component. Fine at four entries; if the case-study list grows, this pairing
  probably belongs next to `PORTFOLIO_SAMPLES` in `architecturalData.ts` instead, so a new
  portfolio item and its case-study link are defined in one place.

---

## 5. Suggested phasing

This is a much smaller remaining lift than the original audit's four phases — most of that plan
is done. What's left:

**Phase A — Finish the subtraction pass (no new routes, matches work already merged):**
- Strip the bordered-card nesting from `SpecialistProfileCard`; drop the "100% On-Time &
  Verified" stat and the pulsing "Online" dot (§3.1).
- Move the freelance-platform tile grid out of `SpecialistProfileCard` (footer already has the
  correct treatment — just remove the duplicate) (§3.1, §3.6).
- Drop "Verified Work" / star-rating badges from `DeliverablesGallery` card fronts; restyle its
  filter tabs to match `ProjectGallery`'s underlined-tab pattern (§3.3).
- Drop the "Most Popular for Busy Firms" pill in `WorkflowsSection`; reframe the four benefit
  tiles toward capability/craft language instead of headcount-avoidance (§3.2).

**Phase B — Structural: move `WorkflowsSection` to `/services`:**
- Now that `/services` is a real, working route, relocate the engagement-model comparison there
  and cut the homepage down to Hero → About → Gallery → Pricing/Estimator → LOD Guide → Footer
  (§3.4).

**Phase C — Verify and clean:**
- Confirm whether `ScopeEstimator`'s `inHouseCostEstimate`/`clientSavingsAmount` values are
  user-visible; retire if so, per the wedge-positioning decision already made for the rest of the
  site (§3.7).
- Fold `CASE_STUDY_SLUGS` into `architecturalData.ts` if the case-study list is expected to grow
  (§4, code health).

**Phase D — Polish (unchanged from original doc, still not started):**
- Scroll-triggered reveal motion on section entry.
- One deliberate asymmetric layout module (offset image/caption columns) somewhere on the
  homepage or a service page.

---

## 6. Summary

The site made real, substantive progress since the last review — the hero, the consolidated
`ProjectGallery`, and the new `/services` + `/case-studies` route structure are legitimately
close to the elite-studio bar this is aiming for, and the IA split (the original audit's
single highest-leverage recommendation) is done. What's left is finishing the same
subtraction/relocation pass on three sections that pass skipped —
`SpecialistProfileCard`, `WorkflowsSection`, `DeliverablesGallery` — which currently make the
homepage feel like two different sites stitched together rather than one considered whole.
Nothing here requires deleting functionality: every freelance-platform link, stat, and pricing
comparison already has a correct home elsewhere on the site (the footer, `/services`) — this is
purely about removing the duplicate, heavier-weight copies from the primary homepage scroll.
