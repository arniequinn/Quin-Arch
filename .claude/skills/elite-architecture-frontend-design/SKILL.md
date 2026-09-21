---
name: elite-architecture-frontend-design
description: Playbook for auditing and evolving an architecture/design-studio portfolio website (or similar high-end creative-professional site) toward elite-studio caliber — the visual and information-architecture register used by Zaha Hadid Architects, BIG, Foster + Partners, Snøhetta, and comparable name-brand practices. Use this whenever the user asks to review, critique, redesign, "make top-class," "make it feel premium/elite," or audit the front end of an architecture, design, or creative-portfolio site — including requests like "does this look professional enough," "why does this feel like a freelance site," "make this feel like a real studio," or "improve the homepage design" — even if they don't name a specific studio. Also use it when implementing changes that came out of such an audit (removing badge/pill overuse, consolidating CTAs, restructuring information architecture, tightening color/type systems), so the audit and the build stay consistent with the same design language. Not for generic SaaS/marketing sites outside the architecture/design/creative-portfolio space — those have a different reference class and this playbook's specific anti-patterns (freelance-marketplace tone, etc.) may not apply.
---

# Elite Architecture / Design-Studio Frontend Review

## Why this exists

Architecture and design-portfolio sites get built by capable engineers who default to the
visual grammar they know best: SaaS dashboards and freelance-marketplace profiles (Upwork,
Fiverr) — bordered pill badges, star ratings, cost-savings percentages, stacked CTAs, boxed
card grids. That grammar is optimized for *conversion on a service listing*. It is the wrong
reference class for a studio whose credibility comes from the work itself. Elite firm sites
(Zaha Hadid Architects, BIG, Foster + Partners, Snøhetta, OMA) use a different, more confident
grammar: full-bleed imagery, one restrained accent color, large editorial type, asymmetric
layout, and a homepage that leads with *work and philosophy*, not pricing or tools.

This skill is a worked-from-experience playbook for spotting the gap between those two
registers and closing it — for auditing an existing site, and for guiding the actual
implementation once an audit is agreed on. It was first developed doing a full review of the
Quin-Arch homepage (`D:\Work\Website\Quin-Arch`); see
`references/worked-example-quin-arch.md` for that review as a concrete precedent, and
`documentation/frontenddesignchanges.md` in that repo for the full original write-up.

## Two modes

**Audit mode** — the user wants a review/critique/findings document, not code changes yet.
Produce a written report (see "Audit output format" below). Do not edit source files in this
mode unless explicitly asked.

**Implementation mode** — the user wants changes actually made, either from a fresh request
("make this look top-class") or following up on a prior audit. Make the changes directly,
starting with the highest-leverage, lowest-risk items (see "Implementation sequencing" below),
and verify visually before reporting done.

If it's ambiguous which mode is wanted, default to audit-first: a quick written findings pass
costs little, gives the user something to react to or redirect, and prevents rewriting code
around a diagnosis they'd have pushed back on. Say so and offer to move straight to
implementation if they'd rather skip the write-up.

## Audit workflow

1. **Read the actual code, not just the rendered page.** Open every component that composes
   the page in question (start from the root layout/page component and follow its imports).
   Reading source reveals things a screenshot won't: which values are hardcoded vs.
   data-driven, whether "auto-cycling" behavior exists, whether admin/owner tooling is mixed
   into public chrome, what the real DOM nesting depth is.
2. **Open the live/deployed version (or a local dev preview) and look at it.** Source reading
   tells you structure; the rendered page tells you what a visitor actually experiences —
   scroll length, motion, load-order, how sections actually feel stacked together. Do both;
   neither alone is enough.
3. **Read the copy as carefully as the layout.** Tone is half of "elite vs. freelance." A page
   can have perfect visual craft and still read as a service listing because of word choice
   (see `references/failure-patterns.md` § Copy tone).
4. **Walk the failure-pattern checklist** in `references/failure-patterns.md` against what you
   read and saw. Don't just pattern-match keywords — confirm each finding against the actual
   source (file + line) before writing it down.
5. **Rank findings by impact, not by order-of-appearance on the page.** A finding that affects
   the entire homepage's narrative (e.g., "no clear information architecture, everything is one
   undifferentiated stack") outranks a finding about one button's border-radius. Lead the
   report with the 3–5 things that would change the reader's *overall impression* first.
6. **Every finding needs a concrete fix, not just a complaint.** "Too many badges" is an
   observation; "remove the bordered-pill treatment from the eyebrow labels, keep it only where
   it encodes real state like LOD included/excluded" is a finding. Point at real anchors —
   which repo file, roughly which section — so the read is checkable and actionable.
7. **Don't recommend deleting functionality.** Almost every fix in this space is *relocation
   and restyling*, not removal — pricing tools, calculators, freelance-platform links, and admin
   editors usually still belong somewhere (a secondary route, the footer, a hidden admin
   entry), just not in the primary homepage narrative. Recommending outright deletion of working
   features erodes trust in the review; keep suggestions additive-safe.

### Audit output format

Write the findings to a markdown file (ask where the user keeps project docs — check for a
`documentation/` folder first, per project convention, before creating one elsewhere). Use
this shape, adapting section names to fit what was actually found:

```markdown
# Front-End Design Review — <site/page name>

**Scope**, **Status** (analysis only vs. some changes made)

## Executive summary
2–4 sentences: what's technically solid, what register problem exists, and the single
highest-leverage move.

## Critical findings (ranked by impact)
One numbered subsection per finding: what's wrong, why it matters (tie to the elite-studio
reference class, not just taste), the concrete fix.

## Section-by-section recommendations
Walk the actual page top to bottom; say what to keep, cut, move, or restyle in each section.

## Proposed design-system adjustments
Color, type, spacing, motion — as *usage rules*, not just "make it nicer."

## Proposed information architecture (if relevant)
What stays on the homepage vs. moves to a secondary route/section.

## Suggested phasing
Group fixes into phases by risk/effort: no-new-routes visual fixes first, then copy, then
structural/IA changes, then polish (self-hosted video, scroll motion, etc.).

## Summary
```

## Implementation sequencing

When moving from findings to actual code changes, work in this order — it front-loads the
changes with the best impact-to-risk ratio and avoids a risky big-bang rewrite:

1. **Subtraction first.** Remove/simplify bordered pills, badges, and box-in-box nesting;
   narrow accent-color usage to one primary CTA + sparing emphasis; remove admin/owner UI from
   public chrome. These are typically pure CSS/JSX simplifications with no data or routing
   impact — lowest risk, highest immediate visual impact.
2. **Consolidate repeated mechanisms.** If the page has multiple near-identical components
   doing the same job (e.g., three auto-cycling image bands), merge them into one
   well-controlled version rather than fixing each copy separately.
3. **Copy pass.** Rewrite tone-mismatched copy (cost-savings percentages, star ratings,
   marketplace badges) into outcome/craft language, guided by whatever voice the site's best
   existing copy already uses (there's usually at least one section — often the hero — that
   already has the right register; extend that voice, don't invent a new one).
4. **Information-architecture changes.** Splitting a mega-page into a work-first homepage plus
   a secondary "services/start a project" destination is the highest-value change but also the
   highest-effort (routing, moving components, updating internal links) — sequence it after the
   cheaper wins above, and confirm the user wants the added routing complexity before doing it.
5. **Polish.** Self-hosted/color-graded video over third-party embeds, scroll-triggered motion,
   asymmetric/full-bleed layout modules. These compound on top of a page that's already been
   decluttered — doing them first on a still-cluttered page wastes the effort.

After implementing, verify visually (dev server + browser, not just a code read) before
reporting the change as done — this kind of work is judged by eye.

## Reference files

- `references/failure-patterns.md` — the recurring anti-patterns to check for, with what they
  look like in code and why each one hurts the "elite studio" read. Load this during the audit
  step.
- `references/elite-design-language.md` — the target visual/IA language to push toward, as
  concrete, checkable principles (not vibes). Load this when drafting recommendations or
  during implementation to keep changes consistent with the target register.
- `references/worked-example-quin-arch.md` — a condensed version of the first full audit this
  skill was built from, as a calibration example of the level of specificity a good audit
  finding should have.
