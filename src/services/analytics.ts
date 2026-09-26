// GA4 events for what the business plan's monthly review (Phase 5) actually measures — WhatsApp,
// email and phone clicks, lead-magnet sign-ups — rather than pageviews alone. gtag itself is
// loaded on every page by vite-seo-plugin.ts; if it's blocked or missing, these calls do nothing.
//
// In GA4, mark `contact_click` and `generate_lead` as key events, and register `method` and
// `link_location` as event-scoped custom dimensions so they show up in reports.

type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: EventParams) => void;
  }
}

export function trackEvent(name: string, params: EventParams = {}): void {
  window.gtag?.("event", name, params);
}

const CONTACT_METHODS: Array<[prefix: string, method: string]> = [
  ["https://wa.me/", "whatsapp"],
  ["mailto:", "email"],
  ["tel:", "phone"],
];

// v3.3 Phase 7: the three calls to action. Mark `cta_click` as a key event and register `cta` as a
// custom dimension in GA4.
const CTA_TARGETS: Array<[hrefPart: string, cta: string]> = [
  ["cal.com/arniequinn/capacity-call", "capacity_call"],
  ["/test-sheet/", "test_sheet"],
  ["/scope-estimator/", "estimator"],
];

// Where on the page a link sits: the header/footer, else the nearest section anchor (e.g.
// "estimator"), else the heading of the section it's in (e.g. "Have a Similar Project in Mind?").
function linkLocation(link: Element): string {
  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  const anchored = link.closest("[id]:not(#root)");
  if (anchored) return anchored.id;
  const heading = link.closest("section")?.querySelector("h1, h2, h3")?.textContent?.trim();
  return heading ? heading.slice(0, 60) : "main";
}

// Every contact link on the site is a plain <a href>, so one delegated listener covers all of
// them, including ones added later. Only the channel and where on the page the link sits are
// sent, never the href itself: the pre-filled messages can carry a visitor's project details.
export function trackContactClicks(): void {
  document.addEventListener(
    "click",
    (e) => {
      const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const cta = CTA_TARGETS.find(([part]) => href.includes(part))?.[1];
      if (cta) trackEvent("cta_click", { cta, link_location: linkLocation(link) });
      const method = CONTACT_METHODS.find(([prefix]) => href.startsWith(prefix))?.[1];
      if (!method) return;
      trackEvent("contact_click", { method, link_location: linkLocation(link) });
    },
    { capture: true },
  );
}
