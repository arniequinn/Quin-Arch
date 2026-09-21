# Target design language: elite studio register

Concrete, checkable principles distilled from the reference class (Zaha Hadid Architects, BIG,
Foster + Partners, Snøhetta, OMA-tier sites). Use these when drafting recommendations or
during implementation, so fixes converge on one coherent language instead of ad hoc tweaks.

## Color
- One accent color (or none), used for exactly two jobs: the single primary CTA, and rare
  in-copy emphasis. Everything else is near-monochrome (near-black/near-white plus warm or
  cool greys).
- Prefer a bespoke accent tuned to the brand (a specific brass, a specific ochre) over a stock
  framework color — but the sophistication of the choice is wasted if it's applied everywhere;
  restraint in *usage* matters more than the hue itself.

## Typography
- A deliberate two-or-three-family pairing (a display serif or distinctive display face for
  headlines, a clean sans for body/UI, optionally a mono for genuine tabular/spec data) reads
  as editorial. Keep it to that — don't add more families.
- Display type gets real scale: hero headlines should dominate the first screen, not compete
  with it. Desktop hero type in this reference class commonly runs 80–160px; body copy stays
  modest and legible by contrast. Big scale *contrast* between display and body/label text is
  the signal, not just big type everywhere.
- Reserve mono/uppercase/wide-tracking treatment for actual data (specs, codes, rates, sheet
  numbers) — don't default every section eyebrow/label to this style, or every heading reads
  like a spec sheet.

## Layout
- Full-bleed imagery for hero and primary gallery/work sections — let media run to the
  viewport edge rather than always capping at a centered max-width container.
- At least one asymmetric layout module (offset column spans, e.g. 7/12 + 5/12 rather than even
  splits) somewhere on the page — perfect symmetry everywhere reads as templated.
- Minimal chrome: prefer whitespace and typographic hierarchy over bordered boxes to separate
  content. A page can communicate structure without drawing a border around every block.

## Imagery / media
- Consistent color grade and treatment across all photography/renders — a curated set reads as
  authored, a grab-bag of differently-treated images reads as a stock folder.
- Owned, self-hosted media over third-party embeds wherever the media is core to the brand
  (hero background, feature video) — see failure pattern 10.
- Give the single best interactive/process-revealing asset on the site more room, not less
  (e.g., a before/after or process-reveal slider deserves to be large and prominent, not boxed
  small inside a bordered card).

## Motion
- Subtle scroll-triggered reveal (fade + slight rise) on section entry reads as considered
  craft; its absence isn't fatal, but adding it is a cheap, high-return polish step.
- User-driven navigation (arrows, drag, click) beats blind auto-cycling for anything the
  visitor might want to actually study. Reserve pure autoplay for brief ambient/idle moments
  that pause immediately on interaction.

## Information architecture
- Homepage = work + philosophy + one clear next step. That's it.
- Pricing, calculators, detailed service comparisons, and technical/reference content
  (glossaries, spec tables) belong one click away on a secondary destination, not stacked into
  the primary scroll.
- Admin/owner tooling has zero visual footprint in public-facing chrome.
- Every existing feature can almost always be kept — the IA fix is relocation, not deletion.

## Calls to action
- One primary action, one visual treatment, used consistently sitewide (not a different
  "primary-looking" button in every section).
- Secondary contact channels (email, WhatsApp, social) consolidate into a single utility
  (footer or one contact panel) rather than repeating at full weight in nav + hero + every
  content section.

## Copy voice
- Outcome/craft/process language, not marketplace-metric language. Describe what gets made and
  how, not cost savings percentages, dollar figures, or star ratings.
- If the site already has one section with the right voice (often the hero headline/subcopy),
  treat that as the reference voice and extend it everywhere else, rather than inventing a new
  register from scratch.
