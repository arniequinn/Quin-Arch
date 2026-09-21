# Recurring failure patterns

Checklist to walk against source + rendered page during an audit. Each pattern: what it looks
like in code, why it undercuts the "elite studio" read, and what "good" looks like instead.
Confirm each one against real file/line evidence before writing it up — don't pattern-match
from memory.

## 1. Badge / pill / border overload
**Looks like:** almost every piece of content wrapped in a `rounded-full` or bordered
`rounded-xl`/`rounded-2xl` container — eyebrow labels, nav chips, stat tiles, social links,
"verified" badges, included/excluded states. Often nested: bordered outer card → bordered inner
panel → grid of bordered chips.
**Why it hurts:** this is the default aesthetic of B2B SaaS marketing sites and
freelance-platform profiles. Elite studio sites use almost no bordered chips — type sits
directly on the background, imagery is flush, and the viewport edge is usually the only
"container" in use.
**Good looks like:** remove borders/pills from the large majority of instances; keep them only
where they encode real state (e.g., a spec table's included/excluded marker), and even then
prefer a plain color/weight distinction over a bordered badge. Section eyebrows become plain
letter-spaced text with no background.

## 2. Accent color overuse
**Looks like:** one accent color (however well-chosen) applied to CTA text, icon tints,
badges, bullet markers, stat numbers, hover borders, and status states — everywhere at once.
**Why it hurts:** when one color marks twenty different things, it stops functioning as an
accent and just becomes "the site's second color." The whole point of restraint is that it
signals confidence — throwing it everywhere signals the opposite.
**Good looks like:** reserve the accent for (a) the single primary CTA across the whole site,
and (b) one emphasized word/phrase per section, maximum. Everything else drops to neutral
grays or low-opacity white/black hairlines.

## 3. Freelance-marketplace tone vs. design-authority tone
**Looks like:** dollar-figure cost-savings copy ("$X/year overhead," "60–70% cost reduction"),
star ratings, "verified" badges on testimonials, "available for contracts" pills, links out to
Upwork/Fiverr/Freelancer/Cad Crowd-style platforms sitting in the primary identity block,
defensive/contractor-pitch phrasing ("zero billable risk").
**Why it hurts:** this is gig-platform profile language. It can be honest and even effective
for a services business, but it fights against serif display type and a restrained accent —
visual craft says "studio," copy says "freelancer," and the reader resolves the conflict by
trusting the copy.
**Good looks like:** one consistent voice. If the site's visual language aims for "elite
studio," let the copy speak in outcome/craft/process language throughout, and move
pricing/dollar-figures/marketplace badges to a secondary page reached by one clear CTA rather
than stating them on the homepage identity block.

## 4. CTA proliferation, no primary action
**Looks like:** counting outward clickable "contact/convert" affordances across nav + hero +
identity section commonly reaches 12–16+, with several channels (e.g., WhatsApp, email,
LinkedIn) repeated at full visual weight in multiple sections.
**Why it hurts:** when everything is emphasized, nothing is. A visitor should know the one next
step without scanning a wall of equally-weighted buttons.
**Good looks like:** pick one primary conversion action for the page and give it exclusive use
of the strongest visual treatment (e.g., solid accent fill). Consolidate every other contact
channel into a single utility (footer, or one slide-in contact panel) instead of repeating them
at full weight in nav + hero + identity block simultaneously.

## 5. No asymmetry, no full-bleed imagery
**Looks like:** every section centered in the same `max-w-*` container, every grid an even
2- or 3-column split, no image or type ever breaks the container edge.
**Why it hurts:** elite studio sites lean on asymmetric grids and full-bleed breakouts —
offset column spans, imagery that runs to the viewport edge, large type that overlaps or
interrupts imagery — as a signal of compositional confidence. A page that is safely centered
and evenly gridded everywhere reads as templated.
**Good looks like:** at least the hero and one primary gallery/work section should break out of
the standard container and run full-bleed; introduce at least one offset (e.g., 8/12 image +
4/12 caption) layout module rather than uniform equal columns everywhere.

## 6. Under-controlled auto-cycling carousels/slideshows
**Looks like:** full-viewport (or near-full) image bands that auto-advance on a timer with no
manual controls — no arrows, no dots, no pause, no counter — especially when the same
mechanism is repeated multiple times down the page for different image categories.
**Why it hurts:** a visitor who wants to actually study one image has no way to hold it; a
normal scroller sees each image for only a few seconds. Repeating the identical full-viewport
mechanism several times reads as templated rather than curated.
**Good looks like:** consolidate into one navigable gallery with real controls (arrow
keys/click-through, thumbnail rail or index dots, pause-on-hover/tap); use category as a filter
within one gallery rather than duplicating the whole mechanism per category. If a pure ambient
auto-cycling divider is still wanted, use it once, as one deliberate signature moment.

## 7. Admin/owner tooling exposed in public chrome
**Looks like:** an "edit profile," lock/unlock icon, or other owner-only affordance visible in
the navbar, footer, or a public content card, intended for the site owner to manage their own
content client-side.
**Why it hurts:** a padlock icon and "(Protected)" label in a portfolio site's main navigation
reads as unfinished admin tooling leaking into the public product — never present on a real
studio site.
**Good looks like:** remove owner-editing affordances from all public-facing chrome; gate the
editor behind something invisible to normal visitors (keyboard shortcut, hidden route, hidden
query param).

## 8. Compressed display typography, headline competing for attention
**Looks like:** a modest-scale hero headline (roughly 36–60px desktop) sitting underneath or
alongside multiple rows of chip navigation, tag lists, and 3–4 CTA buttons, so by the time a
reader's eye reaches the actual headline it has already parsed several other UI elements.
**Why it hurts:** elite studio hero headlines routinely run far larger (80–160px on desktop)
and dominate the first screen essentially alone — the type *is* the statement.
**Good looks like:** let the display headline be the dominant element on first paint; move
secondary wayfinding (tag lists, quick-nav chips) out of the primary hero viewport, and scale
the headline up significantly at larger breakpoints.

## 9. One undifferentiated page stack, no narrative
**Looks like:** every section a site has — hero, bio, service pitch, portfolio, pricing,
calculators, technical glossaries, galleries — stacked in one continuous homepage scroll with
no pacing between "look at the work" and "here is a spec sheet / conversion tool."
**Why it hurts:** elite studio sites open with work and philosophy only; pricing, process
detail, and technical/reference content live one click away on dedicated pages, never
competing for space on the first scroll.
**Good looks like:** restructure into acts — work-led homepage (hero + curated gallery + brief
practice note + one clear next-step CTA), with pricing/tools/glossaries/service comparisons
moved to a secondary route reached from that one CTA. Nothing needs to be deleted, only
relocated.

## 10. Third-party embeds standing in for owned, graded media
**Looks like:** a raw YouTube/Vimeo iframe used as hero background or feature media, often with
workarounds bolted on (timed cover divs to hide the platform's branding flash, muted autoplay
hacks).
**Why it hurts:** depends on a third-party player, can still leak platform branding, can't be
color-graded to match the site's palette, and adds an extra network origin — a fragile
workaround standing in for what should be an owned asset.
**Good looks like:** self-host a short, muted, looping, color-graded video (with a poster
frame) via a native `<video>` element instead.
