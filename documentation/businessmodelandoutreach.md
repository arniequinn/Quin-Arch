# Business Model, Competitive Position & Passive Outreach Plan

**Scope:** A full analysis of the Quintessential Architecture / ArchScope business as it
actually operates today (services, pricing, delivery model), how it compares to the real
competitive landscape, who the buyer actually is, and a phased plan to resolve the strategic
tensions this surfaced and build durable, low-maintenance ("passive") inbound lead flow.

**Status:** Analysis + plan only. No site code has been changed by this document. Phase 0
below is ready to implement as a follow-up whenever wanted.

---

## 1. The business model as it actually exists today

Pulled directly from the live pricing config and service pages, not assumptions:

- **Three service lines, three different pricing mechanics:**
  - BIM/CAD Drafting & Construction Documentation — deliverable/sheet-count driven, no flat
    number (the Scope Estimator produces a sheet count and turnaround; fee is worked out from
    that)
  - Architectural Visualization — flat $0.75/sq ft (interior) and $1.75/sq ft (exterior),
    same rate worldwide
  - Architect Consultant — flat $45/hr, same rate worldwide
- **One person delivers everything** — Arslan Qaiser, principal architect (B.Arch,
  Distinction in Design, National College of Arts), 9+ years, 380+ projects. Not a team, not
  an agency with account managers.
- **Based in Lahore, Pakistan; sells into the US, UK, Canada, and Australia** at a flat rate
  regardless of client location, priced well below researched benchmark rates in each of
  those markets.
- **Already has a presence on freelance marketplaces** — Upwork, Fiverr, Freelancer.com, and
  Cad Crowd are all live, linked, and carry real reviews.

That last point matters more than it looks: the business is currently running two identities
at once — a marketplace freelancer *and* a professional services site — without having
chosen between them. Section 3 below is about resolving that.

---

## 2. Competitive landscape — four real tiers

Researched against the actual outsourced-AEC-services market, not guessed:

**Tier A — Marketplace freelancers.** Upwork/Fiverr/Freelancer/Cad Crowd gig listings —
exactly where this business also has a footprint. Race-to-bottom pricing, no way for a buyer
to verify quality before paying beyond a star rating, trust lives entirely on the platform's
review system, not the provider's own brand. The most crowded, least differentiated tier —
and the tier this business is structurally trying to grow out of.

**Tier B — Agency-scale offshore outsourcing firms.** Real, established competitors: Pinnacle
Infotech (14 offices, founded 1991), TrueCADD, Archdraw Outsourcing, Silicon Consultant, and
RemoteAE (explicitly priced "from $499/wk"). These have teams, account managers, and formal
SLAs, and can absorb far more volume than one person ever could. They compete on capacity and
process maturity — a dimension this business cannot win on.

**Tier C — Rendering-only studios.** Compete purely on visualization, typically priced *per
image* ($250–8,000+ depending on tier), not per square foot. This site's per-sq-ft model is
structurally different from how most of that market prices, which is either a genuine
differentiator or a source of buyer confusion depending on how confidently it's framed.

**Tier D — The real default alternative.** A client simply hires their own local architect or
draftsperson at full local rates ($65–115/hr by the benchmark data already in the site's own
pricing config). This is who every tier above is actually trying to displace, and the
comparison this business's own pricing pages already make explicitly.

### The core strategic tension

This business **cannot win Tier B's game** (one person can't out-scale a 14-office firm's
capacity) and **shouldn't want to win Tier A's game** (no pricing power, constant
price-competition, the client relationship belongs to the platform, not the business). The
only coherent, defensible position is a wedge between B and D: **senior-architect-level
judgment, with direct access to the person actually doing the work — no account-manager
layer — at a price still meaningfully below Tier D, but never framed as "the cheap option."**

That position is real and available — the credentials back it up (NCA B.Arch with
distinction, real client work, genuine reviews) — but it requires the marketplace-platform
badges and "X% savings" language to stop leading the message, because that language pulls the
whole positioning back toward Tier A regardless of how the visuals look.

---

## 3. The judgment call: Tier A vs. the wedge position

**Decision: commit the site's identity, content, and messaging fully to the wedge position.
Keep the marketplace platform accounts (Upwork, Fiverr, Freelancer, Cad Crowd) running as a
quiet, secondary revenue channel — but stop letting them shape how the business presents
itself anywhere else.**

Reasoning:

- Every piece of work already done this session — the Phase 1 redesign, the three service
  pillar pages, the four case studies — already reads as "credible professional practice,"
  not "cheap gig." Reversing that to lean back into marketplace framing would waste what's
  already built and already indexed by Google.
- Tier A has no compounding value: no pricing power, a platform take-home cut, and the client
  relationship legally and practically belongs to Upwork/Fiverr, not to Quintessential
  Architecture. Every gig won there has to be won again from zero.
- The actual credentials are above marketplace-median. Leading with "% savings" undersells
  work that could otherwise command trust-based, not price-based, decisions.
- High-consideration B2B purchases (hiring someone to produce a legally-submitted permit set)
  convert on trust and demonstrated judgment, not on the same psychology as a $50 Fiverr gig —
  the SEO/content investment only pays off if what it sends people to reads as the former.
- This doesn't require abandoning live revenue: the marketplace accounts can keep generating
  work exactly as they do today. What changes is that they move fully into "one more
  contact channel," never the headline identity — which, not coincidentally, is also where
  Phase 1 of this year's redesign already relocated them (footer-only, not the identity
  block).

**What this decision does *not* mean:** deleting the marketplace accounts, refusing
marketplace work, or pretending the reviews there don't exist. It means the *site* and all
*new* content commit to the wedge voice, full stop — no more savings-percentage badges, no
more "Verified Work via [Platform]" framing in new work, no more cost-reduction dollar
figures leading a page.

---

## 4. Who's actually buying — the real ICP

Grounded in why outsourcing actually happens in this market (not guessed): firms and
contractors outsource specifically to protect senior staff time for the judgment calls only
they can make, to absorb uneven workload without adding fixed headcount, and to avoid
software/training overhead — not primarily because they're shopping for the cheapest possible
drafter.

**Primary buyer:** a small architecture firm (roughly 2–15 people) or a general
contractor/builder without in-house design staff, hitting a capacity wall on a specific
project — needs a permit set or BIM model produced to their standard without hiring, and
needs to trust the person doing it enough not to have to re-check everything.

**Secondary buyer:** an independent developer or spec-builder who needs both a permit set
*and* marketing renders for the same small-to-mid project (multi-family flats, a custom spec
home) — cares about visualization ROI (pre-sales) as much as code compliance.

**Weak/mismatched segment — resolve, don't half-serve:** individual homeowners (the "ADU &
Guest House Conversion" project type, "Homeowners" named in `WorkflowsSection`). Nearly
everything else on the site is dense with LOD/IBC/IRC jargon a homeowner won't parse. Right
now this segment is served by neither the messaging nor, probably, the actual buying
behavior. Section 5 below resolves this explicitly rather than leaving it ambiguous.

---

## 5. Step-by-step plan

Phased so each step is independently shippable, building on what already exists rather than
starting over. Phase 0 is copy/content cleanup only (no new features); later phases are new
build work.

### Phase 0 — Align every remaining page with the wedge decision (do first)

The three new service pillar pages and four case studies already speak in the wedge voice.
What's left is the **older homepage content that still carries Tier-A framing**, which now
directly contradicts the newer pages sitting right next to it:

1. `WorkflowsSection` — still leads with "60% – 70% Production Cost Reduction" and a specific
   "$85,000 – $110,000/year" overhead figure. Rewrite to lead with outcome/process language
   (matches the tone already established on the pillar pages), keep cost information available
   but not the headline.
2. `ConsultancyPricing` and `VisualizationPricing` (the widgets embedded on the homepage via
   `CombinedPricingSection`) — still show "Save ~X% vs typical [market] rate" framing that the
   *new* `ConsultancyServicePage`/`VisualizationServicePage` deliberately avoided in favor of a
   plain rate-comparison table. Bring the homepage widgets in line with the pillar pages' more
   restrained framing.
3. `DeliverablesGallery` and the case-study pages — "Verified Work" badges are fine (real,
   checkable claim), but "Verified Client Review via Freelancer" / "via Fiverr" framing quietly
   re-attaches the marketplace association to genuine testimonials. Keep the real quotes, drop
   or de-emphasize the platform attribution.
4. Decide the homeowner segment: either (a) add a short, plain-language homeowner-facing
   section/page for ADU and small residential work specifically, written without BIM/LOD
   jargon, or (b) deliberately narrow `PROJECT_TYPES`/copy to stop half-targeting homeowners.
   Pick one rather than leaving it implicit.

### Phase 1 — Passive-outreach infrastructure (foundational assets)

5. ~~**Lead magnet + email capture.**~~ **Done (2026-09-22).** Built `/guides/lod-guide/` — a
   public, crawlable field guide built from the existing `LODGuide` content, cross-linked from
   the homepage and the BIM/CAD pillar page. Deliberately *not* gated: hiding it behind an
   email wall would undercut the SEO/content investment this plan depends on. Instead, an
   optional email-capture (Web3Forms, verified working end-to-end) offers to send a copy, and a
   "Print / Save as PDF" button uses the browser's native print-to-PDF against a dedicated print
   stylesheet — no gate, no backend file to maintain.
6. ~~**Google Business Profile.**~~ **Dropped (2026-09-22).** GBP's service-area-business model
   is built for a business based near where it serves customers, not a Lahore-based firm
   claiming a US/UK/Canada/Australia service area — Google's own guidelines discourage, and can
   suspend, profiles whose claimed area isn't plausible relative to their real location. Setting
   one up honestly (Lahore/Punjab only) would be policy-safe but low-value, since the actual ICP
   (small US/UK/Canada/Australia firms) doesn't search the Maps local-pack for this. Decided to
   skip it and redirect the effort to Phase 2 instead.
7. **A minimal nurture step** for anyone who submits their email via the LOD guide — even a
   single well-written follow-up — so the list being built isn't just sitting unused.

**Confirmed (2026-09-22):** `VITE_WEB3FORMS_ACCESS_KEY` was added as a GitHub Actions repo secret
and the live production form is confirmed working end-to-end (real Web3Forms capture, not the
mailto fallback). Phase 1 item 5 is fully closed out.

### Phase 2 — Distribute what's already built

8. **LinkedIn cadence.** Turn the four real case studies already built into individual posts
   (one specific problem solved per post, not a portfolio dump). The credentials are real and
   citable — this is genuinely passive once a monthly rhythm exists, since it's repurposing
   content, not creating new content each time. **Drafted (2026-09-22)**: all 4 posts written,
   ready to publish on a 1–2 week cadence — see `documentation/phase2-linkedin-posts.md`.
   **Pinned/on hold (2026-09-22)** — posts are ready whenever the user wants to pick this back up,
   not abandoned.
9. **YouTube.** The profile already links a channel. Short before/after render reveals or a
   60-second "what LOD 350 actually looks like" clip, built from assets already in the
   portfolio, are exactly what a visualization buyer searches for — and YouTube is its own
   search engine, independent of Google/SEO work already done. **Drafted (2026-09-22)**: 3 short
   scripts written, using only existing portfolio assets (no new renders needed) — see
   `documentation/phase2-youtube-shorts.md`. Actual filming/editing/upload not done — outside
   what can be executed in this environment.
10. **One guest-content pitch.** Several real AEC industry blogs surfaced in competitor
    research (Cad Crowd's own blog, United-BIM, BIM Heroes) publish outsourcing-focused
    content. A single well-placed guest article linking back to a service page is a durable
    backlink and a referral source for a one-time effort. **Sent (2026-09-22)**: pitch emailed
    to BIM Heroes (`info@bimheroes.com`) — see `documentation/phase2-guest-pitch.md` for the
    text. Awaiting a reply; if accepted, next step is drafting the ~900–1200 word article.

### Phase 3 — Community trust-building (slow-compounding, ongoing)

11. Identify 3–5 genuinely relevant communities (r/architecture, r/Revit, r/AutoCAD, the
    Autodesk community forums) and commit to a light, honest cadence — answering real
    technical questions with real expertise and a profile link, never a pitch. This reaches
    Tier D buyers (people about to hire an architect) before they ever search commercially, and
    costs nothing but time. **Researched (2026-09-22)**: final shortlist is r/architecture,
    r/Revit, r/AutoCAD, r/BIM, and r/rhino — see `documentation/phase3-community-list.md` for
    the reasoning and cadence rules. This phase is inherently ongoing/manual (answering real
    questions as they appear), so there's no further one-time setup step — it starts whenever
    time is spent actually answering questions on an account.

### Phase 4 — Directory / backlink building

12. Research (don't assume) which AEC-specific professional directories are worth a listing —
    deliberately *not* more gig marketplaces, which would undo Phase 0's work. This needs a
    dedicated research pass before acting, since directory quality varies enormously and a bad
    one can hurt more than help. **Researched (2026-09-22)**: recommended target is a
    **GoodFirms** company profile (`goodfirms.co/engineering/3d-modeling-cad` — real B2B
    review-driven directory, not a gig marketplace, with comparable BIM/CAD outsourcing
    companies already listed); Clutch.co as a second option once GoodFirms has a review or two.
    One candidate (AEC Listing) was checked and rejected — domain doesn't resolve. AIA's
    directory doesn't apply (US-licensed-architect gated). See
    `documentation/phase4-directory-research.md`. **Not yet created** — a GoodFirms profile
    needs an account signup (email verification, business details) that has to be done by the
    user directly.

### Phase 5 — Measure and adjust

13. GA4 and Search Console are already live. Once Phases 1–3 are running, review monthly which
    channel is actually driving traffic to the service/case-study pages and which is driving
    real inquiries (WhatsApp/email clicks, lead-magnet downloads) — not just pageviews. Double
    down on whichever channel is working; drop what isn't after a fair trial, rather than
    running everything forever by default.

### Explicitly parked — do not act on without more care

- **Referring past marketplace clients directly.** Tempting, since Upwork/Fiverr reviews
  already exist — but both platforms' terms generally restrict directing clients off-platform
  to avoid fees. This needs an actual read of the current Upwork and Fiverr ToS before any
  action, not a default yes. Not part of the active plan until that's done.

---

## 6. Suggested order of execution

Phase 0 is the highest-leverage, lowest-effort step — it's pure copy alignment on pages that
already exist, and it resolves the identity contradiction that undermines everything else in
this plan. Phases 1–2 are the next concrete builds (lead magnet is the single most valuable
one, since it's the only thing on this list that converts anonymous traffic into a contactable
lead). Phases 3–4 are ongoing habits more than one-time builds, and can start in parallel
once 0–2 are in motion. Phase 5 is a standing monthly practice, not a one-time task.

---

## 7. Status update (2026-09-23, SEO pass)

- Homeowner segment (Phase 0 item 4): now covered by `/why-work-with-us/`.
- GA4 was only on the homepage; now injected on all 14 pages by `vite-seo-plugin.ts`, so the
  Phase 5 monthly review has real data.
- Every page now ships crawlable text (h1, description, links) before JavaScript runs; sitemap is
  generated at build time with the real date. Homepage title, description and structured data were
  rewritten around the practice name (Quintessential Architecture, Arslan Qaiser).
- Still open: resubmit the sitemap in Search Console and request indexing (user action); GoodFirms
  profile; publish the LinkedIn posts; film the Shorts; follow up the BIM Heroes pitch around 10/6.
- ~~Parked: custom domain~~ **Done (2026-09-24):** bought `quinarch.design` (GoDaddy), DNS pointed at
  GitHub Pages (4 A records + `www` CNAME), `public/CNAME` added, site now served from the root path
  (`vite.config.ts` base `/`). Every canonical/OG/JSON-LD/robots/sitemap URL and the docs now use
  `https://quinarch.design/`. The old `arniequinn.github.io/Quin-Arch/` URLs are superseded.
- **Search Console (2026-09-24):** new Domain property `quinarch.design` verified via DNS TXT; sitemap
  submitted and processed (14 pages); homepage crawled by Googlebot, indexing requested. The old
  `arniequinn.github.io` property is obsolete and can be ignored.

### Open items (as of 2026-09-24)

1. Tick **Enforce HTTPS** in GitHub Settings → Pages (once available).
2. Update website links to `https://quinarch.design` on Upwork, CADCrowd, Instagram (`quin_arch`),
   Fiverr, Freelancer.com, and the Google Analytics property URL.
3. Create the GoodFirms profile (Phase 4) — user action; list the new domain.
4. Publish the LinkedIn posts (Phase 2) — drafted in `phase2-linkedin-posts.md`.
5. Film the YouTube Shorts (Phase 2) — scripts in `phase2-youtube-shorts.md`.
6. Follow up the BIM Heroes guest pitch around 10/6.
7. Start the light Reddit/community cadence (Phase 3) and wire up the LOD-guide nurture email (Phase 1 item 7).
8. Phase 5: first monthly GA4 / Search Console review once traffic exists.

---

## 8. Status update (2026-09-24, SEO pass 2: prerendering, structured data, measurement)

- **Every page is now prerendered.** The build renders each page's full React content into its
  HTML, and the browser hydrates it. Before this, crawlers that don't run JavaScript saw only an h1,
  the meta description and nav links. That includes AI crawlers, link previews and, often, Bing
  (whose index Copilot and DuckDuckGo draw on). The homepage's HTML went from ~12 KB of placeholder to
  ~100 KB of real content. Hydration was verified clean on all 15 pages, and on the homepage with
  reduced motion on (the only page whose layout changes for it).
- **Structured data is one connected graph.** The homepage now declares the site (`WebSite`, which
  Google uses for the site name shown in results), the practice (`ProfessionalService`, Lahore
  address, US/UK/Canada/Australia as area served), and Arslan Qaiser (`Person`: NCA credential,
  LinkedIn/YouTube/Upwork/Freelancer profiles). Service pages, case studies and the LOD guide refer
  to them by `@id`. `/design-philosophy/` is marked up as his `ProfilePage`. Removed: an invalid
  schema type (`ArchitecturalService`), homepage FAQ markup for questions that aren't on the page
  (against Google's guidelines), and an `ArchScope` app node that fails Google's validator.
- **Titles:** the Principal Architect page now leads with "Arslan Qaiser, Principal Architect".
  "Why Work With Us", "Project Library" and "Case Studies" now carry what a searcher would type.
- **Phase 5 measurement:** GA4 now receives `contact_click` (method: whatsapp/email/phone, plus
  where on the page), `generate_lead` (LOD guide email sign-up) and `save_guide_pdf`.
- **Sitemap dates are real:** each page's `<lastmod>` is its last git commit, not the build date.
  Google ignores lastmod on sites where it's always "today".
- Also: a branded 404 page (noindex); the avatar shrank from 1.5 MB to 7 KB.

### New open items (user actions)

9. **GA4:** Admin → Events → mark `contact_click` and `generate_lead` as key events. Admin → Custom
   definitions → add event-scoped dimensions `method`, `link_location` and `lead_source`. Events
   appear once the change is deployed and someone clicks.
10. **After deploy:** run the homepage, `/design-philosophy/` and one case study through Google's
    Rich Results Test. In Search Console, URL Inspection → "Request indexing" for the homepage and
    the four retitled pages.
11. **Bing Webmaster Tools:** add the site by importing it from Search Console (one click). Bing's
    index is used by Copilot and DuckDuckGo, and it can now read the full pages.
12. **Case-study images:** 3 of the 4 case studies ("Authentic Client Work Sample") show Unsplash
    stock photos as their hero and share image. Replace them with a real sheet or render from each
    project (the drawing-set PDFs are in `public/portfolio/docs/`).
13. `public/portfolio/motivation-letters/` (three university motivation letters) and
    `public/portfolio/docs/AQ CV Minimal.pdf` are deployed publicly. The CV is linked from the
    profile card; the letters aren't linked anywhere but are reachable by URL. Remove them if that
    wasn't intended.
