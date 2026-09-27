# Crunch Time — v3.33

**Date:** 2026-09-27 · **Status:** the v3.33 plan. **v3.33 part 1 is live** (commits `30d665d`, `a1399d5` and the "free" removal): new hero headline, new hero video, no "free" anywhere on the site. v3.32 (D1, D4) is live too.
Everything else is open. v3.33 ships when the section C decisions come back (C6–C12). The Phase 3 assets (C1–C3) can follow
as v3.34 if the files take longer.

## Release history

| Version | Date | What shipped |
|---|---|---|
| v3.3 | 2026-09-26 | Operation Overflow: B2B overflow positioning, capacity call, test sheet, How We Work, `/for-homeowners/` (see `operationoverflow-v3.3.md`) |
| v3.32 | 2026-09-26 | Online hours shown in the visitor's time zone (DST-proof); honeypot anti-spam field on the test-sheet and LOD-guide forms |
| v3.33 part 1 | 2026-09-27 | Homepage hero headline "Your vision/ Our project" (after brief runs of "Architecture that listens" and "Shelter. Light. Comfort. Calm."; for the 1-second US bounce); `/for-homeowners/` headline "Shelter. Light. Comfort. Calm."; nav links right-aligned; hero video cropped of baked-in black bars; new 1080p walkthrough hero video (8.7 MB) plus a 720p phone version (3.3 MB); the word "free" removed from every page and meta tag |
| v3.33 part 2 | planned | Section C decisions (C6–C12) and D2, D3, D5, D6 — see "v3.33 scope" below |

Everything still open across the planning docs, in one place. It's gathered from
`operationoverflow-v3.3.md`, `v3.0-gallery-expansion.md`, `final-polish-v2.0.md`,
`frontenddesignchanges-2026-09.md`, `businessmodelandoutreach.md` §9 and the phase 1–4 marketing
drafts. Items already done today are listed at the end so nothing gets done twice.

**Who does what:**
- **You** = owner-only: accounts, files, decisions, sending, publishing.
- **Claude** = a build or doc task that can be done on request.
- **Both** = you supply or decide something, then Claude builds it.

**The honest priority:** the site is about 90% finished. The marketing side, which is what brings
in a client, is about 30% done. Section A is the part that moves the business; the rest makes the
site better.

---

## A. This week: what actually brings in clients (you, about 5–6 h)

| # | Task | Why it matters | Source |
|---|---|---|---|
| A1 | Message every past client (last 5 years): ask for a Clutch review, permission to quote them by name and firm, and one introduction to a firm that's stretched | Reviews unlock Clutch and GoodFirms and give firm-facing quotes for the site (C3) | Business plan §9.2 A; v3.3 6.1 |
| A2 | Set up `arslan@quinarch.design` (Zoho free or Google Workspace) with SPF, DKIM and DMARC | Emails from a practice domain reach inboxes and read as a firm, not a freelancer | §9.5 item 2 |
| A3 | Add the first 25 firms to `documentation/private/outreach-tracker.csv` and pick the 1–2 project types to lead with | The main source of new clients | §9.2 B |
| A4 | Start sending: 5 emails a day using templates 1–2 (they offer the test sheet and carry UTM tags; reworded without "free" 2026-09-27) | — | `outreach-email-templates.md` |
| A5 | Set the render pilot price, the only placeholder left (`[PILOT PRICE]` in email 3) | Template 3 can't go out without it | Templates §3 |
| A6 | Update the website link on Upwork, Cad Crowd, Fiverr, Freelancer and Instagram to `https://quinarch.design` | Marketplace visitors land on the new site | §9.5 item 5 |
| A7 | Publish the LinkedIn posts, one a week (the Cran post wording was updated today), with 10–15 connection requests to firms on the tracker | Firms have seen your name before your email arrives | `phase2-linkedin-posts.md` |

## B. Quick settings (you, about 30 min in total)

| # | Task | Where |
|---|---|---|
| B1 | Mark `cta_click`, `contact_click` and `generate_lead` as key events. Register `cta`, `method`, `link_location` and `lead_source` as event-scoped custom dimensions | GA4 → Admin → Events / Custom definitions |
| B2 | Tick **Enforce HTTPS** if it isn't already | GitHub → repo → Settings → Pages |
| B3 | Import the site from Search Console, and run the Rich Results Test on the homepage and one case study | Bing Webmaster Tools; search.google.com/test/rich-results |
| B4 | Check GoodFirms and Clutch approval. When the GoodFirms portfolio unlocks, paste in the three entries (updated today with PCATP and Archicad wording) and the company-profile lines in its Notes | `phase4-goodfirms-portfolio.md` |
| B5 | Confirm whether the BIM Heroes guest pitch was sent. If not, send it (the signature is fixed); if it was, follow up around 2026-10-06 | `phase2-guest-pitch.md` |
| B6 | Check the Web3Forms **Spam** tab once a week. It keeps only 7 days on the free plan | app.web3forms.com → Quinarch Site Form → Submissions → Spam |
| B7 | Run each case-study URL through LinkedIn Post Inspector so the new share images show | linkedin.com/post-inspector |

## C. Build work that needs your input first (both)

| # | Task | What you supply or decide | What Claude then does | Source |
|---|---|---|---|---|
| C1 | **Phase 3 proof assets** | The six items in the v3.3 Phase 3 guide, dropped into `source-material/process/` | Crop and anonymize them, add thumbnails, and add a proof-of-process block on the homepage "How we plug in" section and the BIM/CAD page | v3.3 Phase 3, 4.1, 5.2 |
| C2 | **Sample CD set download** (2c) | Asset 6: an 8–12 sheet PDF, plus the names to mask | Email-capture download on the homepage and BIM/CAD page, like the LOD guide | v3.3 2c |
| C3 | **Homepage video swap and Lighthouse re-check** | Asset 5: the LOD 300 → 350 recording | Encode it like the other hero videos, swap `HERO_VIDEOS.home`, re-run Lighthouse (target ≥ 90) | v3.3 Phase 3, 7.4 |
| C4 | **Firm testimonials** | Quotes from A1, with role and firm size ("Principal, 12-person firm, Texas") | Put them first on How We Work, BIM/CAD and the footer rotation | v3.3 6.1 |
| C5 | **Clutch / GoodFirms footer link** | The approved profile URL | Footer link and a `sameAs` entry in the structured data | v3.3 6.3 |
| C6 | **"Not included" lists** | Read or edit `src/data/exclusions.ts` and approve it | Set `exclusions: true` in `src/data/ownerSignoff.ts` so they show on the live site (dev only today) | v2.0 §0 |
| C7 | **Visualization rates** | Approve the rates, stage multipliers, $95 revision round and turnaround rules. The CAD→USD rate (0.72) is a placeholder | Update `VISUALIZATION_RATES` if anything changes | v2.0 §0 |
| C8 | **Default sheet list** | Check the default sheet set for each project type | Edit `src/data/sheetCatalogue.ts` | v2.0 §0 |
| C9 | **LOD stance** | Confirm: LOD 100–350 standard, 400 by request, 500 not offered | Nothing, unless it changes (`src/data/lod.ts`) | v2.0 §0 |
| C10 | **Project facts** | Any of: area, bedrooms/bathrooms, year, durations, construction status, turnaround — per case study and project | Add them to the facts blocks. Only supplied facts are shown | v2.0 §8; v3.0 L8; v3.3 5.4 |
| C11 | **In-house cost benchmark in the BIM estimator** | Keep or remove. It shows "what you'd typically pay locally"; the wedge positioning argues for removing it | Remove it, or leave it as is | Front-end audit Phase C |
| C12 | **BIM/CAD page length** (about 6,500 px, target 5,000) | Accept it, or say which content to cut | Trim | v3.0 L3 |
| C13 | **Real-phone check** | Open the site on your phone: homepage ribbons, the ending into the footer, the before/after slider's first nudge, and autoplay on iOS if you can borrow an iPhone. Report anything odd | Fix what you find (v3.0 L1 re-scope: `100lvh` stage sizing if the ending gets cut short) | v3.0 L1, L2 |

## D. Build work Claude can do without anything from you

| # | Task | Notes | Source |
|---|---|---|---|
| D1 | ✅ **Done 2026-09-26.** **Daylight-saving-proof hours.** The hero and the "How we plug in" facts say "9–3 Eastern", which is wrong from 2026-11-01 (it becomes 8–2). Show the hours in the visitor's own time zone (worked out in the browser from 18:00–24:00 PKT), with "9 am – 3 pm Eastern" as the prerendered fallback | Otherwise the copy needs changing by hand twice a year. The Cal.com event description needs the same change on 1 Nov (you, or Claude in the built-in browser) | v3.3 D7 note |
| D2 | **One asymmetric layout module** (offset image and caption columns) on the BIM/CAD or How We Work page | Design polish from the elite-studio audit | Front-end audit Phase D |
| D3 | **Fold `CASE_STUDY_SLUGS` into `architecturalData.ts`** | Code tidy-up; only worth doing if more case studies are coming | Front-end audit Phase C |
| D4 | ✅ **Done 2026-09-26 (both forms).** **Test-sheet form: Web3Forms honeypot field** | A hidden `botcheck` field Web3Forms supports. It cuts bot spam, so the spam filter can stay loose enough for real leads | New (from today's form test) |
| D5 | **Outreach tracker columns for the new funnel** | Add "test sheet sent" and "call booked" columns to `private/outreach-tracker.csv` | v3.3 7.8 |
| D6 | **v3.3 30-day review template** | A short section in `operationoverflow-v3.3.md` to fill in on about 2026-10-26: emails sent, `cta_click` by CTA, calls, test sheets, and whether to change the H1 | v3.3 7.8 |

## E. Ongoing and slow (you, when time allows)

| # | Task | Source |
|---|---|---|
| E1 | Film the three YouTube Shorts from the scripts | `phase2-youtube-shorts.md` |
| E2 | Answer Reddit and forum questions from the community shortlist (no pitching) | `phase3-community-list.md` |
| E3 | Reply to LOD-guide sign-ups with the nurture template (its signature is updated) | `phase1-nurture-email.md` |
| E4 | 90-day checkpoints: day 30 (~2026-10-26), day 60 (~2026-11-25), day 90 (~2026-12-25) | Business plan §9.4 |

---

## Done 2026-09-27 (v3.33 part 1)

- **Hero copy:** H1 changed from "Your overflow design team — without the hire" to "Architecture that listens", then (same day) to "Shelter. Light. Comfort. Calm.", then to "Your vision. Our project.", then "Your vision/ Our project" (one line) with the subhead "We treat your drawings like our own …". "Shelter. Light. Comfort. Calm." moved to the `/for-homeowners/` headline; the
  jargon subhead (CD sets, LOD 300–350) replaced with "On time, on budget, exactly what you imagined …". og and
  twitter titles match. The page `<title>` (search-facing) is unchanged. **Interim line:** you want a stronger H1
  later; judge this one on GA4 US bounce and engagement over 3–5 days first (to about 2026-10-01).
- **Hero video:** the new 1080p apartment walkthrough replaces `hero-home.mp4` (30 MB original compressed to 8.7 MB,
  30 fps, no audio, black lead-in/out trimmed, new poster). Phones under 768 px get `hero-home-720.mp4` (3.3 MB)
  via `mobileSrc` in `HeroVideo.tsx`. The original is in `source-material/video/`. C3 is now only the LOD 300 → 350
  recording plus the Lighthouse re-check.
- **No "free" on the site:** buttons now say "Send a test sheet"; the test-sheet page reads "See the work before you
  commit"; the "Free test sheet" step is "Start with a test sheet"; test-sheet and How We Work meta tags reworded;
  the LOD 300 "clash-free" line reworded. Rule: the offer is implied, never worded as free. Outreach
  templates 1–2 reworded the same way ("start with a test sheet", "send me one sheet first").

## Done 2026-09-26, so not on the list

- v3.3 Phases 0, 1, 2 (except 2c), 4, 5, 6 (trust line) and 7 (launch, form test, tracking): live.
- Guest pitch signature changed from faizanqaiser9@ to arslan.qaiser1991@gmail.com, with the PCATP
  line. Its LOD claim now matches the site (100–350, 400 by request).
- GoodFirms drafts: PCATP and Archicad wording, Cran's real handover (a UK construction firm's
  schematic drawings), fixed image paths, and profile-text notes for GoodFirms and Clutch.
- LinkedIn Cran post and the nurture-email signature brought in line with the new wording.
- 11 unreferenced thumbnails deleted (v3.0 L6).
- **v3.32:** D1 (local-time hours) and D4 (honeypot) built, verified and pushed.
- The first front-end audit marked superseded; the follow-up audit given a status line.

## v3.33 scope

**Ships in v3.33 (once you answer):**
- C6 "Not included" lists live · C7 visualization rates · C8 default sheet list · C9 LOD stance ·
  C10 project facts · C11 in-house cost benchmark keep/remove · C12 BIM/CAD length.
- D2 asymmetric layout module · D3 `CASE_STUDY_SLUGS` tidy-up · D5 tracker columns · D6 30-day review template.
- C4 and C5 if the quotes or the Clutch/GoodFirms URL are in by then.

**Next (v3.34, when the files arrive):** C1–C3 Phase 3 assets, sample-set download, homepage video swap and Lighthouse; C13
phone-check fixes.

**Release steps (same as v3.3):** build → prerender/sitemap check → 375 px and desktop check in the preview → owner review →
commit → tag → push (GitHub Actions deploys).

**Reminder, 2026-11-01 (US DST ends):** change the Cal.com "Capacity call" description from "9 am – 3 pm Eastern" to
"8 am – 2 pm Eastern" (the site handles itself since v3.32).

## Suggested order

1. **This week:** A1–A7 and B1–B7 (you). ~~Claude does D1 and D4~~ done in v3.32.
2. **As you go:** answer C6–C12 (one line each is enough) → Claude builds v3.33 in one batch with D2, D3, D5, D6.
3. **When the files are ready:** C1–C3 (Phase 3) as v3.34, then C13 on your phone.
4. **About 2026-10-01:** read GA4 US bounce for the new hero (v3.33 part 1) and decide whether to write a stronger H1 now.
5. **About 2026-10-26:** the 30-day review (D6), then decide on the H1, the offer and which firms to target.
