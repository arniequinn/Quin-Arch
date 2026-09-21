# Worked example: Quin-Arch homepage audit

This is the audit this skill was distilled from. Full write-up:
`documentation/frontenddesignchanges.md` in this repo. Condensed here as a calibration example
for the level of specificity a finding should have — vague ("too busy") vs. specific ("here's
the file, here's why it reads as marketplace not studio, here's the fix").

**Site:** a principal-architect portfolio combining remote BIM/CAD production services,
consultancy, and visualization work. React + Tailwind, dark near-black theme with a custom
brass accent override, DM Sans / Cormorant Garamond / JetBrains Mono type system.

**What was technically solid:** clean component structure, a genuinely distinctive brass
accent color (not stock Tailwind amber), a real type system, a working before/after
comparison slider showing actual Grasshopper-script-to-render process, a real LOD reference
table, lazy-loaded imagery, reduced-motion handling already present on the slideshows.

**The core diagnosis:** visual and tonal language borrowed from SaaS dashboards and
freelance-marketplace profiles rather than architecture-studio sites — despite genuinely
strong underlying work (real permit sets, real BIM production, real parametric process).

**Findings identified, in the site's own components** (patterns generalized into
`failure-patterns.md`):
- Eleven stacked homepage sections with no narrative pacing (pattern 9) — hero → identity card
  → service pitch → gallery → pricing → three separate full-viewport slideshows → calculator →
  glossary → footer.
- Box-in-box nesting in the identity card: outer bordered `rounded-3xl` card → inner bordered
  `rounded-2xl` panel → grid of bordered `rounded-xl` chips (pattern 1).
- Brass accent applied to CTA text, icon tints, every badge, every bullet marker, every stat
  number, every hover border (pattern 2).
- Copy mixing "Computational Design, Virtual Design & Construction. Delivered Globally." (studio
  voice) with "$85,000–$110,000/year overhead," "60–70% cost reduction," star-rated "Verified
  Client Review," and direct links to Upwork/Fiverr/Freelancer/Cad Crowd in the primary identity
  block (pattern 3).
- ~16 distinct contact/convert affordances counted across nav + hero + identity card before a
  visitor sees one completed project (pattern 4).
- Three separate `ImageSlideshowBand` instances, each ~85–92vh, each auto-cycling every 5s with
  zero manual controls (pattern 6).
- "Edit Profile" lock icon present in navbar, identity card, and footer — owner-only tooling
  visible to every visitor (pattern 7).
- Hero H1 at `text-4xl sm:text-5xl lg:text-6xl` sitting underneath two rows of tag/chip
  navigation and above four CTA buttons (pattern 8).
- Hero background implemented as a raw YouTube iframe embed with a manufactured timed cover-div
  to hide the platform's branding flash (pattern 10).

**Proposed IA split:** homepage (hero + one consolidated navigable gallery + trimmed "about"
band + one CTA) / `/services` (engagement models + pricing + scope estimator + LOD guide,
currently stacked into the homepage) / `/contact` (freelance-platform badges, CV download,
full social list — currently duplicated across hero and identity card).

**Phasing used:** (1) subtraction — strip badges/borders, narrow accent usage, remove owner UI
from public chrome, consolidate the three slideshows into one; (2) copy rewrite; (3) IA split
into routes; (4) polish — self-hosted hero video, scroll-reveal motion, one asymmetric layout
module. This ordering (cheap/low-risk visual fixes before structural routing changes) is the
default recommended sequencing in `SKILL.md` § Implementation sequencing.
