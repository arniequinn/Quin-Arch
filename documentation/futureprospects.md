# Future Prospects: Lead Generation & Conversion Roadmap

## Current Status (2026-09-27)

✅ **Conversion tracking is now live and verified** — GA4 is configured to capture booking CTA clicks.

---

## The Problem We Solved

Site launched 2 weeks ago with strong engagement metrics but zero bookings. Initial hypothesis: the CTA wasn't visible or messaging wasn't clear.

**Reality:** The homepage had a prominent "Book a 20-min capacity call" button, event tracking code was firing correctly — but **GA4 wasn't configured to display the custom events** in its reports.

**Fix:** Configured GA4 to recognize and surface the `cta_click` custom event as a Key Event. Tested in real-time — event fires successfully. ✅

---

## Phase 1: Monitor (Now — Next 7–14 days)

Watch for actual visitor clicks in the wild.

**What to track:**
- GA4 **Real-time** dashboard: refresh periodically to watch for `cta_click` events
- After 5–10 clicks, check **GA4 Reports** → **Engagement** → **Events**:
  - Which pages/sections are people clicking from (`link_location` dimension)
  - Do clicks convert to cal.com page visits
  - Are there any seasonal/timing patterns

**Success metric:** At least one booking within 7–14 days of real traffic.

---

## Phase 2: Optimize (After you get 5–10 leads)

Once you have data, test to improve conversion:

1. **CTA copy & positioning:**
   - Test different button text ("Book now" vs. "Schedule a call" vs. current)
   - Test placement (hero only vs. also in service sections)
   - Test timing (how far down page before showing)

2. **Pre-booking qualification (optional):**
   - Add a form asking: project type, budget range, timeline?
   - Or offer "Send test sheet" as lighter first touch
   - Track which path converts better

3. **Follow-up automation:**
   - Email/WhatsApp for cal.com no-shows
   - Timeframe reminders (e.g., "Your call is in 24h")
   - Post-call feedback collection

---

## Phase 3: AI Assistant (Only if volume justifies)

**Do NOT build the AI consultant yet.** Current status: 0 leads.

**When it makes sense:** After you hit ~5–10 qualified leads/week, an AI intake assistant becomes worthwhile. At that point:

- AI can pre-qualify inquiries (24/7, async)
- Hindsight can remember past interactions and project types
- Paperclip can coordinate follow-ups
- Arnie's time stays on high-value consultation calls, not email triage

**Current bottleneck:** Traffic → Booking. Fix that first.

---

## Technical Details

**Event tracking:** Already implemented at `src/services/analytics.ts`
- Fires `cta_click` events when visitors click the booking button
- Captures `cta: "capacity_call"` and `link_location` (header, project section, etc.)

**GA4 configuration:** ✅ Complete
- Event name: `cta_click` (marked as Key Event)
- Custom dimensions: `cta`, `link_location` (registered)
- Google Analytics ID: G-9LJJ2SLHF0

**No code changes required** — everything is already wired up and tested.

---

## Quick Reference: Where to Look

| Task | Where |
|------|-------|
| Monitor clicks | GA4 → Real-time |
| See event data | GA4 → Reports → Engagement → Events → `cta_click` |
| Check cal.com | cal.com/arniequinn/capacity-call (check booked dates) |
| Email analytics | arslan.qaiser1991@gmail.com (Arnie receives booking confirmations) |
| Code reference | `src/services/analytics.ts`, `src/App.tsx:144` |

---

## Timeline & Milestones

- **Week 1 (now):** Verify GA4 is capturing events from real traffic
- **Week 2–3:** Collect 5–10 leads, analyze patterns
- **Week 4+:** A/B test if volume is high; consider AI assistant if >5 leads/week

---

## Key Insight

The website works. The tracking works. The button is prominent. **The only unknown is whether people on the internet will click it.** Now we wait for real data — monitor, learn, optimize.

---

## Update (2026-09-27 Evening) — Landing Page Messaging Overhaul

**Problem Identified:** US traffic bounces after 1 second. Current homepage headline ("Your overflow design team — without the hire") is too technical/internal-facing. Doesn't speak to what clients actually want to hear.

**Research: What People ACTUALLY Care About When Hiring an Architect**

When someone searches for an architect or lands on an architecture firm's site, their real concerns are:

1. **"Will they understand my vision?"** — Trust & communication
2. **"Can I trust this person?"** — Credibility, past work, reliability
3. **"Will it be done on time & on budget?"** — Risk mitigation
4. **"Do they have experience with my type of project?"** — Relevant expertise
5. **"Will they actually listen to me?"** — Partnership, not dictation
6. **"What if problems come up?"** — Problem-solving ability, responsiveness

Current messaging (CD sets, LOD 300-350, Archicad models) speaks ONLY to architects/contractors who already know these terms. It doesn't address emotional/practical client concerns.

### Messaging Options for Hero (Ranked by Conversion Potential)

**Option A: Trust + Certainty (highest emotional appeal)**
- Headline: "Architecture that listens"
- Subheadline: "On time, in your budget, exactly what you imagined"
- Why it works: Addresses the three biggest fears (will they listen, budget overruns, vision misalignment)
- Target: Everyone (homeowners, contractors, firms)

**Option B: Expertise + Proof (credibility-focused)**
- Headline: "Architect with 20+ years of built work"
- Subheadline: "From concept to construction — we see projects through"
- Why it works: Establishes expertise, shows they finish things
- Target: More discerning clients who vet credentials first
- Caveat: Need to confirm Arnie's years of experience

**Option C: Speed + Relief (action-focused, for busy people)**
- Headline: "Your architecture, faster"
- Subheadline: "Get your designs, drawings, and vision ready — in days, not months"
- Why it works: Speaks to time pressure (busy contractors, developers)
- Target: Busy B2B clients (contractors, design-build firms, developers)
- Note: Can include video of fast iteration here

**Option D: Partnership (relational)**
- Headline: "An architect who gets how you work"
- Subheadline: "Your standards, your workflow, your vision — delivered on your timeline"
- Why it works: Emphasizes collaboration, not selling
- Target: Established firms looking for reliable overflow capacity
- Strength: Very "B2B overflow" focused

**Option E: Visual + Minimal (if video is strong)**
- Headline: [Let the video do the talking — show Arnie working, a project evolving, before/after]
- Subheadline: "Architecture from concept to construction"
- Why it works: Reduces cognitive load, shows don't tell
- Target: Visual learners, mobile viewers who don't read much
- Requirement: Video must be REALLY good (you mentioned higher res — this is the place to use it)

### Recommendation

**Start with Option A ("Architecture that listens")** because:
- It's emotionally resonant (speaks to fears, not features)
- Works for ANY client type (homeowners, contractors, firms)
- Combats the 1-second bounce problem (humans respond to words like "listens," "imagined," "budget")
- Bridges the gap between Arnie's technical skills and client needs
- Easy to test against current headline

**Secondary test: Option C** if you want to emphasize speed (use the higher-res video + "Architect who gets how you work" might be best actual fit given the B2B positioning)

### New Assets to Use

From sheets folder, can integrate:
- High-res PDFs (Barndominium 4MB, Cran 1.8MB, Foxhole 4.3MB) — shows scope/complexity
- Coordinated MEP overlay (195KB) — shows problem-solving capability
- Section drawings (cran-sections-crop, flats-building-section) — shows detail orientation

### New Video

Once you upload the higher-res video, it should show:
- Arnie working (removes "is this person real?" doubt)
- A project evolving (shows thinking process)
- Before/after or problem-solving moment (builds confidence)

---

## Next Steps: Hero Copy Revision

**Status:** Options researched. Ready for decision when you have direction.

Reference these 5 options when you're ready to finalize hero messaging. The analysis above explains why each works and what client concerns each addresses.

When ready to implement, you'll need to update `src/App.tsx` lines 125–140 with new copy, then monitor GA4 bounce rate for 3–5 days to see if engagement improves.
