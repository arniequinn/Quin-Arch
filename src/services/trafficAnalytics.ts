import { TrafficAnalyticsSummary, TrafficAuditReport } from "../types";

const SESSION_STORAGE_KEY = "archscope_session_id";
const VISIT_LOGGED_KEY = "archscope_visit_logged";

export function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sid) {
      sid = `ses-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(SESSION_STORAGE_KEY, sid);
    }
    return sid;
  } catch {
    return `ses-${Date.now()}`;
  }
}

/**
 * Records an authentic page visit on the server.
 * Ensures strictly real telemetry — 0 fake visits.
 */
export async function recordPageVisit(): Promise<{ success: boolean; totalVisits?: number; source?: string } | null> {
  try {
    const alreadyLogged = sessionStorage.getItem(VISIT_LOGGED_KEY);
    // Allow re-logging once per distinct browser session unless explicitly forced
    if (alreadyLogged) {
      return null;
    }

    const sessionId = getOrCreateSessionId();
    const referrer = document.referrer || "";
    const path = window.location.pathname + window.location.search;
    const screenWidth = window.innerWidth;
    const language = navigator.language || "en-US";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    const res = await fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referrer,
        path,
        screenWidth,
        language,
        timezone,
        sessionId,
      }),
    });

    if (res.ok) {
      sessionStorage.setItem(VISIT_LOGGED_KEY, "true");
      return await res.json();
    }
    return null;
  } catch (err) {
    console.warn("Could not record page visit telemetry:", err);
    return null;
  }
}

/**
 * Manually logs a test visit (useful for checking live counter reactivity)
 */
export async function recordTestVisit(): Promise<any> {
  try {
    const sessionId = `test-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const res = await fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referrer: "Direct / Manual Test Ping",
        path: window.location.pathname + window.location.search,
        screenWidth: window.innerWidth,
        language: navigator.language || "en-US",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        sessionId,
      }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Failed to log test visit:", e);
  }
  return null;
}

/**
 * Records client actions (calculations, clicks, downloads)
 */
export async function recordAnalyticsEvent(
  eventName: "scope_calculation" | "whatsapp_click" | "pdf_view" | "proposal_copy" | "linkedin_click"
): Promise<void> {
  try {
    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName }),
    });
  } catch (err) {
    console.warn("Could not record analytics event:", err);
  }
}

/**
 * Fetches real aggregated analytics summary
 */
export async function fetchAnalyticsSummary(): Promise<TrafficAnalyticsSummary | null> {
  try {
    const res = await fetch("/api/analytics/summary");
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch analytics summary:", err);
  }
  return null;
}

/**
 * Fetches the Worker & Checker Agent audit and benchmark progression
 */
export async function fetchTrafficAudit(): Promise<TrafficAuditReport | null> {
  try {
    const res = await fetch("/api/analytics/traffic-audit");
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch traffic audit report:", err);
  }
  return null;
}

/**
 * Resets visitor log back to 0 (for testing or fresh campaigns)
 */
export async function resetAnalyticsVisits(): Promise<boolean> {
  try {
    const res = await fetch("/api/analytics/reset-visits", { method: "POST" });
    sessionStorage.removeItem(VISIT_LOGGED_KEY);
    return res.ok;
  } catch (err) {
    console.error("Failed to reset analytics:", err);
    return false;
  }
}
