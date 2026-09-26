# Operation Overflow — v3.3

**Status:** Draft plan for owner review. No code written yet.
**Date:** 2026-09-26
**Goal:** Turn quinarch.design from a studio portfolio that serves everyone into a B2B site that converts a cold principal architect, developer, or design-build contractor (US first) into a **booked capacity call** or a **free test sheet**.
**Success metric:** At least 1 booked call or test-sheet submission per 10 qualified outreach clicks, measured over 30 days after launch.

---

## 0. Owner decisions needed before work starts

Items marked **BLOCKING** stop the step that depends on them.

| # | Decision | Options | Recommendation | Blocks |
|---|---|---|---|---|
| D1 | Booking tool | ✅ **DONE 2026-09-26:** Cal.com live at **https://cal.com/arniequinn/capacity-call**: 20 min, Google Meet, "Overflow hours" schedule (Mon–Sat 6 pm – midnight PKT), 10-min buffer after, 12 h notice, max 3/day; asks firm, platform, "What's overflowing right now?". Default events hidden | — | Phase 2 |
| D2 | Software naming rule | ✅ **DECIDED:** name **Archicad** as the authoring platform across the site. Never claim Revit-native production. Image file names stay generic | — | — |
| D3 | Homeowner content | ✅ **DECIDED:** move to `/for-homeowners/`, reachable from the footer only | — | Phase 4 |
| D4 | Free test-sheet offer | ✅ **DECIDED:** 1 sheet free, capped scope (one plan or elevation sheet, client's template, max ~4 h). Terms shown on the form | — | Phase 2 |
| D5 | Credential wording | ✅ **DECIDED:** "Registered architect — Pakistan Council of Architects and Town Planners (PCATP), reg. no. A-07767". Verified on the PCATP public register (status: Registered). See the jurisdiction note below | — | Phase 1 |
| D6 | Proof assets | ✅ **DECIDED:** owner supplies originals; we crop, anonymize and caption | — | Phase 3 |
| D7 | Availability | ✅ **DECIDED:** 6 pm – midnight Pakistan time (PKT, UTC+5), 6 days a week. See the time-zone table below | — | Phase 1, 2, 4 |
| D8 | Visualization's role | ✅ **DECIDED:** demote to an add-on for firms. Pages stay; removed from the homepage hero path | — | Phase 4 |
| D9 | Which listed tools are real | ✅ **DECIDED:** see Phase 0a. No BIM 360 / ACC. BIMx is used | — | — |
| D10 | Other listed tools | ✅ **DECIDED:** Cabinet Vision, AutoCAD MEP, Bluebeam Revu, V-Ray, Lumion, Navisworks Manage and AutoCAD are all **optional / compatibility tools**: familiar and used on past work, run on a **temporary licence provided by the client firm** to work on their files | — | Phase 0 |

**All decisions closed.** Note: the Cal.com event description says "9 am – 3 pm Eastern"; change it to "8 am – 2 pm Eastern" when US DST ends (Nov 1).

### D5 note — licence and jurisdiction (important for honest copy)

- PCATP registration makes the owner a **licensed architect in Pakistan**. It does **not** give stamping or sealing rights in the US, UK, Canada or Australia.
- Copy must say "PCATP-registered architect" (or "licensed architect, Pakistan"), never an unqualified "licensed architect" on pages aimed at US firms.
- This fits the overflow model: the hiring firm's architect of record reviews and stamps; we produce. State it plainly on the BIM/CAD page and in the FAQ: **"Sets are prepared for your architect or engineer of record to review and stamp."**
- The current hero line "NCA-trained principal architect" gets replaced with the PCATP wording.
- Optional: link the registration number to the PCATP public register so firms can verify it themselves.

### D7 note — US overlap for 6 pm – midnight PKT

| US zone | Summer (Mar–Nov, DST) | Winter (Nov–Mar) |
|---|---|---|
| Eastern | 9 am – 3 pm | 8 am – 2 pm |
| Central | 8 am – 2 pm | 7 am – 1 pm |
| Pacific | 6 am – 12 pm | 5 am – 11 am |

- This is a strong selling point: live hours fall in the US **morning**, and work done overnight is waiting at the start of the next US business day.
- Proposed copy: **"Online 9 am – 3 pm Eastern, six days a week. Hand off by lunch, review first thing tomorrow."** (winter: "8 am – 2 pm Eastern").
- ✅ Days confirmed: **Monday – Saturday**. Saturday availability is a bonus worth stating ("Mon–Sat").
- **Capacity reality check:** about 36 hours a week total. Put a capacity line in the plan (e.g. "one retainer + one test sheet at a time") and keep the 24–48 h redline promise to **small** redline sets, so the promise stays true while the day job continues.

---

## Phase 0 — Workflow terminology audit (Archicad-accurate wording)

**Why:** The owner's authoring platform is **Archicad**. Some site copy uses Revit-specific terms ("families", "cloud worksharing") or Autodesk-stack tools that suggest a Revit-native workflow. A principal who runs Revit will ask for native `.rvt` with editable families, and that is **out of scope**. Overclaiming here costs trust on the first call, so wording must match the real workflow before any B2B push.

### 0a. The real workflow (source of truth for all copy)

**Primary toolset (what the work is actually done in):** Archicad · GDL · Rhino · Grasshopper · Python · Tapir · Twinmotion · Coohom · Canva · BIMx.

**Optional / compatibility tools (familiar, used on past work; run on a temporary licence the client firm provides):** Navisworks Manage, AutoCAD, AutoCAD MEP, Bluebeam Revu, Cabinet Vision, V-Ray, Lumion.

| Area | What the owner does | What the owner does **not** do |
|---|---|---|
| Authoring & drafting | **All** modeling and drafting in Archicad (native `.pln` / `.pla`) | Revit-native production; drafting in AutoCAD |
| Objects | Writes and edits GDL objects; imports Revit families (`.rfa`) and converts them to GDL | Exporting GDL objects as Revit families |
| Revit hand-off | `.rvt` export of the model (geometry, **without** editable families) | Deliver editable Revit families or a Revit family library |
| Open BIM | IFC export/import (main interop route to Revit, Tekla, etc.) | — |
| 2D / CAD | DWG export mapped to the client's layer standard; opens and works on client DWGs (owns an AutoCAD licence) | Draft new sets in AutoCAD |
| Coordination & clash | Archicad Collision Detection for everyday checks. **Navisworks Manage** for large federated models and formal clash reports — on the client's licence (temporary seat access) or the owner's renewed licence when a retainer needs it | Authoring in Navisworks |
| Parametric | Rhino + Grasshopper, connected to Archicad through **Tapir** | Grasshopper–Archicad Live Connection (not used; don't mention) |
| Scripting | Python, including Archicad automation through Tapir | — |
| Visualization | Twinmotion (live link from Archicad), Coohom, Rhino; Canva for presentation boards | V-Ray, Lumion only as compatibility tools on the client's licence |
| Client review | BIMx models and hypermodels for clients to walk through | BIM 360 / Autodesk Construction Cloud |
| File exchange | Client's shared drive or platform (Dropbox, Google Drive, whatever the office uses) | — |

**How to word the Navisworks / AutoCAD position (proposed copy):**
> "Drafted and modeled in Archicad. For large federated models, clash coordination and reports run in Navisworks Manage — on your seat or ours. DWG in, DWG out, on your layer standard."

This is honest and reads as normal practice: many offices give consultants temporary seats, so it doesn't need to be explained further.

### 0b. Glossary — Revit term → Archicad term to use

| Don't write | Write instead |
|---|---|
| families / parametric families | GDL objects / parametric GDL objects (library parts) |
| your templates and families | your template (`.tpl`), attributes and object library |
| view templates | view settings / Model View Options, Organizer / View Map |
| worksharing / worksets | Teamwork (only if the owner uses it on a client's BIMcloud; otherwise omit) |
| wall types | composites and complex profiles |
| shared parameters | properties and classifications |
| Dynamo | Grasshopper + Tapir / Python |
| "Live Connection" | Tapir (for Grasshopper/Python); "live link" only for Twinmotion |
| "native file" (unqualified) | native Archicad file, plus IFC, DWG and `.rvt` export |
| BIM 360 / ACC for client review | BIMx |

### 0c. Findings — current site copy to fix

| File | Current wording | Issue | Proposed fix |
|---|---|---|---|
| `src/components/WorkflowsSection.tsx:26` | "BIM 360, Autodesk Construction Cloud, cloud worksharing…" | Not used; "worksharing" is a Revit term | "Your shared drive — Dropbox, Google Drive or your own platform — with BIMx models for review, delivered into your titleblocks and CAD layering." |
| `src/components/WorkflowsSection.tsx:31` | "…annotation and parametric families on every plan…" | Revit term | "…annotation and parametric GDL objects on every plan…" |
| `src/pages/ServicesHubPage.tsx:123` | "Your studio's own templates and families" | Promises working in the client's Revit families | "Your studio's templates, layer standards and titleblocks — Revit families converted to GDL when needed" |
| `src/data/architecturalData.ts:133` | "A coordinated model with parametric families…delivered as the native file and an IFC export." | Revit term; "native file" is ambiguous | "A coordinated Archicad model with parametric GDL objects, composites and schedules — delivered as the native file, IFC, and an `.rvt` export on request (geometry only, no editable families)." |
| `src/data/architecturalData.ts:135` | softwareUsed: "3D BIM Software", "Navisworks", "BIM 360", "IFC" | BIM 360 not used | `["Archicad", "GDL", "IFC", "BIMx"]` |
| `src/data/architecturalData.ts:33,43` + `src/pages/BimCadServicePage.tsx:31,40` | "MEP & structural clash detection (Navisworks Manage)" / "Autodesk Navisworks (clash detection)" in the **software/expertise lists** | Reads as a core authoring tool | Expertise: "Clash detection & coordination — Archicad Collision Detection; Navisworks Manage for large federated models". Remove Navisworks from the primary software list; move it to a "Coordination & compatibility" line with AutoCAD |
| `src/data/architecturalData.ts:157,159` + `src/data/sheetCatalogue.ts:375` | Clash deliverable: "(Navisworks)", softwareUsed "Navisworks Manage", "AutoCAD MEP" | Accurate as a deliverable, AutoCAD MEP is a compatibility tool (D10) | Keep "Clash report & issues log (Navisworks Manage or Archicad, depending on model size)"; softwareUsed `["Archicad", "Navisworks Manage (client licence)", "IFC"]` |
| `src/data/architecturalData.ts:40` + `BimCadServicePage.tsx:37` | "AutoCAD Architectural & Detailing" as a core tool | Implies drafting is done in AutoCAD | Replace with "Archicad — modeling, drafting & detailing". AutoCAD moves to the compatibility line ("DWG in / DWG out") |
| `src/data/architecturalData.ts:127,143,151,195,228,258,285` | softwareUsed / software: "AutoCAD 2024", "AutoCAD", "3D BIM Software", "3D BIM", "Cabinet Vision", "Bluebeam Revu" | Drafting was done in Archicad; the rest are compatibility tools (D10) | "Archicad" first, then "DWG export" where the client received DWG. Keep Cabinet Vision / Bluebeam only where genuinely used on that project, shown as secondary |
| `src/data/architecturalData.ts:38,41` + `BimCadServicePage.tsx:30,38` | "Rhino 7 / Grasshopper Algorithmic", "Parametric & computational design (Rhino + Grasshopper)" | Missing the Archicad connection | "Rhino + Grasshopper, connected to Archicad through Tapir; Python automation" |
| Visualization page, homepage chapter 4 (`App.tsx` visualization description), `VisualizationServicePage.tsx` | "V-Ray, Lumion and Twinmotion" | V-Ray / Lumion are compatibility tools (D10) | "Twinmotion (live-linked to the Archicad model) and Coohom — V-Ray or Lumion on your licence if your office standardises on them" |
| All software lists | — | GDL, Python, Tapir, BIMx, Coohom are missing everywhere | Add to the BIM/CAD and Consultancy software lists |
| `src/data/sheetCatalogue.ts:369` | "BIM model — native file and IFC export" | Ambiguous | "BIM model — native Archicad file, IFC, and `.rvt` export (no editable families)" |
| `src/pages/BimCadServicePage.tsx:67`, `ServicesHubPage.tsx:102`, `App.tsx:166` | "Native BIM, DWG and vector PDF" / "IFC · DWG · PDF — Native delivery" | Fine, but can be more precise | "Archicad · IFC · RVT · DWG · PDF" |
| `src/data/architecturalData.ts:419` (comment) | "freelance/outsourced Revit & BIM drafting runs" | Code comment only, not public — low priority | Update for accuracy |

### 0d. New copy to add (honest scoping sells)

1. A short **"File formats & interoperability"** block on the BIM/CAD page and in the new "How we plug into your office" section:
   - "Authored in Archicad. Delivered as native Archicad, IFC, DWG (your layer standard), vector PDF and BIMx. Revit offices: `.rvt` export of the model — geometry, not editable families. Send us your Revit families and we'll convert them to GDL to match your content. Large federated models are clash-checked in Navisworks Manage, on your seat or ours."
2. A **toolset strip** in two tiers, used on the BIM/CAD page and the profile card:
   - **Primary:** Archicad · GDL · Rhino · Grasshopper · Python / Tapir · Twinmotion · Coohom · BIMx
   - **Formats:** IFC · DWG · RVT export · PDF · BIMx
   - **On your licence:** Navisworks Manage · AutoCAD / AutoCAD MEP · Bluebeam Revu · Cabinet Vision · V-Ray · Lumion — with the line "Familiar with your stack. Provide a temporary seat and we work directly in your files."
3. FAQ entries (short, direct answers that filter out bad-fit leads):
   - **"Do you work in Revit?"** — Archicad-authored; IFC and `.rvt` export; families converted in, not out.
   - **"Can you work in our Navisworks / AutoCAD / Bluebeam files?"** — Yes. Provide a temporary seat on your licence and we work directly in your files.
   - **"Are you licensed?"** — PCATP-registered architect (A-07767). Sets are prepared for your architect or engineer of record to review and stamp.
   - **"When are you online?"** — 9 am – 3 pm Eastern (8 am – 2 pm in winter), six days a week.
   - **"Can you work to our CAD standard?"** — Yes: DWG export mapped to your layers, pens and titleblock.
4. Phase 3 proof captions use Archicad terms (composites, pen sets, attributes, Organizer, GDL, Tapir), not Revit terms. Add one Tapir asset: a Grasshopper/Python script driving the Archicad model (e.g. batch property updates or element placement), with the time saved.

### 0e. Steps

1. ~~Owner answers D2, D9, D10~~ Done 2026-09-26.
2. Full-site sweep: re-run the term search (Revit, family/families, worksharing, workset, view template, Dynamo, Live Connection, BIM 360, ACC, Navisworks, AutoCAD, V-Ray, Lumion, Bluebeam, Cabinet Vision, "3D BIM Software", native) across `src/`, `index.html`, the page `index.html` shells, `projectPages.json` and SEO metadata/JSON-LD, and check the prerendered `dist/` output after the build.
3. Apply the fixes from 0c and add the copy from 0d.
4. Update the outreach templates (`outreach-email-templates.md`), the GoodFirms portfolio drafts (`phase4-goodfirms-portfolio.md`) and the Clutch / GoodFirms profile text with the same terms (directory profiles are owner-side). Add the PCATP registration and the online hours to Clutch / GoodFirms too.
5. Replace the "generic BIM software naming" memory rule with the D2 decision.

**Done when:** No public page uses a Revit-only term to describe the owner's own workflow, and every deliverable claim matches 0a.

---

## Phase 1 — Hero and positioning copy (homepage)

**File:** `src/App.tsx` (hero block + chapter 1)

1. Replace the H1 with B2B overflow copy (final wording chosen by owner):
   - A: "Your overflow drafting team — without the hire."
   - B: "Senior BIM production capacity for firms with more work than hands."
2. Replace the subhead with a single sentence naming: the deliverables (CD sets, LOD 300–350 models, parametric geometry), *in your templates and standards*, the redline turnaround (24–48 h), and the US overlap ("online 9 am – 3 pm Eastern, six days a week", D7).
3. Replace the eyebrow line with the buyer, not the disciplines: "For architecture firms, developers & design-build contractors".
4. Make the credentials strip (`AIA · NCS`, `LOD 100–350`, `24–48 h`, `Archicad · IFC · RVT · DWG`) visible at all heights. Remove the `min-height:1000px` gate and let it collapse to 2×2 on mobile.
5. Rewrite chapter 1 ("Why work with us") to address firms only. Remove "for homeowners planning a build".
6. Replace "NCA-trained principal architect" in the subhead with "PCATP-registered architect (A-07767)" (D5). Update the profile card and structured data (JSON-LD) to match.
7. Update `<title>`, meta description and OG text for the homepage to match (via `vite-seo-plugin.ts` / `projectPages.json` as applicable).

**Done when:** A principal reading only the H1 and subhead can say who it's for, what it is, and how fast it comes back.

---

## Phase 2 — Conversion paths (CTAs)

### 2a. "Book a 20-min capacity call" (primary)
1. Add a `bookingUrl` to the specialist profile / `services/contact` (D1).
2. New CTA button component usage: hero primary, navbar button (replacing "Start a Project"), mobile menu, end of every service page, end of case studies.
3. Opens the Cal.com page in a new tab (no heavy embed script on the homepage; keeps performance).

### 2b. "Send a test sheet — first one free" (secondary)
1. New page `/test-sheet/` with a short form: name, firm, email, platform, sheet type, file link (Dropbox/Drive/WeTransfer URL — no file hosting on our side), notes.
2. Submit through the existing Web3Forms integration (`VITE_WEB3FORMS_ACCESS_KEY`), with the existing mailto fallback.
3. Show the offer terms (D4) and an NDA line ("Happy to sign your NDA before you send files").
4. Add the route to `routes.ts`, the Vite multi-page entries, the prerender, and the sitemap.
5. Hero secondary button, plus placements on the BIM/CAD page and the new "How we plug in" section.

### 2c. "Download a sample CD set" (cold visitors)
1. Reuse `EmailCaptureForm` (same pattern as the LOD guide).
2. Deliver one anonymized 8–12 sheet PDF set (from Phase 3, step 6).
3. Place after the proof section on the homepage and on the BIM/CAD page.

### 2d. Scope Estimator repositioned
1. Keep the page and its footer link. Remove it as the site-wide primary CTA.
2. Relabel the entry point "Price a single project" on the services hub and the BIM/CAD page.

**Done when:** Every page ends in either the call or the test sheet, and no primary button says "Start a Project".

---

## Phase 3 — Proof-of-process assets (owner produces, we publish)

Owner supplies originals (D6). All assets are anonymized, carry no client names, and follow the existing portfolio rules (all work presented as the owner's, no free-hand drawings, colour or black-on-white only).

| # | Asset | What it proves | Format |
|---|---|---|---|
| 1 | Archicad attribute screenshots: layer combinations, pen sets, composites / complex profiles, Organizer / View Map, sheet index (Layout Book), and a Revit family converted to GDL | Clean, standards-compliant files | 4–6 annotated screenshots |
| 2 | Redline round-trip: marked-up PDF → revised sheet, with timestamps | 24–48 h turnaround is real | Before/after pair using the existing `CompareSlider` |
| 3 | Grasshopper canvas + its output (e.g. panelization → schedule → geometry) | Parametric capability beyond renders | 3-image sequence |
| 4 | Python/BIM automation before/after, with the time saved stated | Speed and systems thinking | Snippet or node graph + one-line metric |
| 5 | 60–90 s screen recording of a real model LOD 300 → 350 | Replaces the interior walkthrough hero video | Self-hosted, compressed like the existing hero videos |
| 6 | One anonymized 8–12 sheet CD set | Lead magnet for 2c | PDF, < 10 MB |

**Publishing steps:**
1. Add assets under `public/portfolio/process/` with WebP thumbs (existing thumb script).
2. Register them in `galleryAssets.ts` / `architecturalData.ts`.
3. Swap `HERO_VIDEOS.home` to the new recording (asset 5).

**Done when:** A visitor sees file hygiene and a redline round-trip before they see a single render.

---

## Phase 4 — Information architecture: firms-first

1. **New homepage section "How we plug into your office"**, placed directly after the hero, before the chapters:
   - Four steps: send standards/template → free test sheet → weekly capacity block → redlines in 24–48 h.
   - A facts row: "Online 9–3 Eastern, 6 days" (D7), "PCATP-registered architect, A-07767" (D5), file formats, NDA / IP ownership stays with the firm, communication channel (email / Teams / Slack), and the stamping line ("prepared for your architect of record to stamp").
   - Proof assets 1 and 2 inline.
   - CTA pair: call + test sheet.
2. **Homepage chapter order:** How we plug in → BIM & CDs → Parametric & automation (renamed from "Architect consultant", with assets 3–4) → Visualization (as an add-on) → Profile card.
3. **Why Work With Us:** Firms section first and default. Move homeowner content to `/for-homeowners/` (D3); replace the two-button chooser with a single small link for homeowners.
4. **Nav:** Services · Project Library · Case Studies · How We Work (renamed Why Work With Us) · [Book a call]. Move Design Philosophy to the footer.
5. **Footer:** Remove the "Furniture & Virtual Staging" link from the primary column (the page stays live).
6. **Testimonials:** Show the most professional-sounding quotes first. Drop "very fair costs" from the display selection (it works against the wedge positioning). Add firm-facing testimonials as they come in (Phase 6).
7. Add redirects/canonicals so any moved content keeps its SEO value.

**Done when:** A firm visitor never has to scroll past homeowner content, and the path is hero → how it works → proof → CTA.

---

## Phase 5 — Service page alignment

1. **BIM/CAD page:** lead with "Overflow production for firms". Add a "Your standards, not ours" block (templates, layering, title blocks), the test-sheet CTA, and the sample-set download.
2. **Consultancy page:** reframe around parametric/computational and automation work for firms. Add the Python/Grasshopper assets.
3. **Visualization page:** add a "For firms: renders from your model for client presentations" intro so it reads as B2B.
4. **Case studies:** add a short "Firm context / what was handed over / turnaround" facts block to each, where the facts are real.

---

## Phase 6 — Trust signals (ongoing, owner-side)

1. Ask the first 2–3 firm clients from outreach for a one-line quote with role and firm size ("Principal, 12-person firm, Texas").
2. Add a small "NDA-friendly · IP stays with you · Files in your platform" line near every CTA.
3. Once Clutch / GoodFirms approve, link the review profile from the footer (no marketplace badges in the hero).

---

## Phase 7 — QA, launch, and measurement

1. Build + prerender. Check every new route renders statically (SEO plugin, sitemap, canonical tags).
2. Browser verification: desktop and mobile (375 px), light/dark as applicable, no horizontal scroll, credentials strip visible, hero legible over the new video.
3. Forms: submit a test on the test-sheet form and the sample-set capture and confirm both arrive at arslan.qaiser1991@gmail.com. Confirm the booking link opens the right event.
4. Lighthouse: performance ≥ 90 on the homepage after the video swap.
5. Analytics: add click tracking for the three CTAs (privacy-friendly, e.g. Plausible/Umami or GA4 events — owner picks). Tag outreach links with UTM parameters.
6. Update the outreach email templates (`outreach-email-templates.md`) to point at `/test-sheet/` and the booking link instead of the homepage.
7. Update the v2/v3 build-status docs and memory. Commit as "v3.3: Operation Overflow". Deploy through the existing GitHub Actions pipeline.
8. **30-day review:** compare outreach clicks → calls / test sheets. Iterate on the H1 variant if conversion is under target.

---

## Order of execution and dependencies

```
D1–D9 decisions ─┬─> Phase 0 (terminology) ─> Phase 1 (copy) ─┐
                 ├─> Phase 2 (CTAs)  [needs D1, D4]
                 ├─> Phase 3 (assets, owner) ─┼─> Phase 4 (IA) ─> Phase 5 ─> Phase 7 (QA/launch)
                 └───────────────────────────-┘
Phase 6 runs in parallel, ongoing.
```

- Phases 1, 2 and 4 can be built **before** the Phase 3 assets arrive, using the existing workflow images as placeholders. Launch waits for at least assets 1, 2 and 5.
- Estimated effort on our side: Phases 1–2 about one session; Phases 4–5 about one to two sessions; Phase 7 about one session. Phase 3 depends on how fast the owner supplies assets.

## Out of scope for v3.3

- Paid ads, new directory listings, blog/content marketing.
- Pricing changes (rates stay as currently published).
- A full visual redesign. The existing design system, fonts and ribbon frame stay.
