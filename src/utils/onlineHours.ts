import { useEffect, useState } from "react";

// The owner is online 6 pm – midnight Pakistan time (UTC+5, no daylight saving), Monday–Saturday
// (v3.3 D7). That's 13:00–19:00 UTC, which lands in the US morning — but "9–3 Eastern" is only true
// in summer. So the prerendered HTML carries wording that's true all year, and the browser swaps
// in the visitor's own clock after hydration (the first client render matches the HTML).
const START_UTC_HOUR = 13;
const HOURS = 6;

/** DST-proof wording for the prerendered HTML and crawlers. */
export const ONLINE_HOURS_FALLBACK = {
  long: "6 pm – midnight Pakistan time (the US morning)",
  short: "6 pm – midnight PKT",
};

function formatTime(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone }).formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  const period = (parts.find((p) => p.type === "dayPeriod")?.value ?? "").toLowerCase();
  if (hour === "12" && minute === "00") return period === "am" ? "midnight" : "noon";
  return `${hour}${minute === "00" ? "" : `:${minute}`} ${period}`.trim();
}

// en-US names only US zones (others come out as "GMT+1"), so try British and Australian English
// too, e.g. BST and AEST. Pakistan has no abbreviation in any of them.
function zoneName(date: Date, timeZone: string): string {
  if (timeZone === "Asia/Karachi") return "PKT";
  let name = "";
  for (const locale of ["en-US", "en-GB", "en-AU"]) {
    name =
      new Intl.DateTimeFormat(locale, { timeZoneName: "short", timeZone })
        .formatToParts(date)
        .find((p) => p.type === "timeZoneName")?.value ?? "";
    if (!/^(GMT|UTC)[+-]/.test(name)) break;
  }
  return name;
}

/** Today's online window in the visitor's zone, e.g. "9 am – 3 pm EDT" (long and short are the same once localised). */
export function localOnlineHours(
  now = new Date(),
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
): { long: string; short: string } {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), START_UTC_HOUR));
  const end = new Date(start.getTime() + HOURS * 3600_000);
  const from = formatTime(start, timeZone);
  const to = formatTime(end, timeZone);
  const zone = zoneName(start, timeZone);
  const long = `${from} – ${to} ${zone}`;
  return { long, short: long };
}

/** The online hours to show: the fallback on first render, the visitor's local clock after. */
export function useOnlineHours(): { long: string; short: string } {
  const [hours, setHours] = useState(ONLINE_HOURS_FALLBACK);
  useEffect(() => {
    try {
      setHours(localOnlineHours());
    } catch {
      // Keep the fallback if Intl can't resolve the zone.
    }
  }, []);
  return hours;
}
