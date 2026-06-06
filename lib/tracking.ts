/**
 * Client-side tracking utilities for stitching web visits, forms and meetings
 * to the CRM under a single visitor identity.
 *
 * Contract reference: `public/web-integration.md`.
 *
 * Keys used:
 *   - localStorage `bp_visitor_id`         — UUID v4, persistent across sessions
 *   - localStorage `bp_session_id`         — UUID v4, rotates after 30min idle
 *   - localStorage `bp_session_last_seen`  — epoch ms of last activity
 *   - localStorage `bp_first_touch`        — { utm_*, gclid, fbclid, msclkid, referrer, landing_url }
 *
 * All functions are SSR-safe — they no-op (returning sensible defaults) when
 * `window` is undefined.
 */

const VISITOR_KEY = "bp_visitor_id";
const SESSION_KEY = "bp_session_id";
const SESSION_LAST_SEEN_KEY = "bp_session_last_seen";
const FIRST_TOUCH_KEY = "bp_first_touch";

/** Session rotates after 30 min of inactivity. */
const SESSION_IDLE_MS = 30 * 60 * 1000;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;
const CLICK_ID_KEYS = ["gclid", "fbclid", "msclkid", "ttclid"] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;
export type ClickIds = Partial<Record<(typeof CLICK_ID_KEYS)[number], string>>;

export type FirstTouch = UtmParams &
  ClickIds & {
    referrer?: string;
    landing_url?: string;
    captured_at?: string;
  };

export type TrackingContext = {
  visitor_id: string;
  session_id: string;
  utm: UtmParams;
  click_ids: ClickIds;
  first_touch: FirstTouch | null;
  page_url: string;
  page_title: string;
  referrer: string;
  user_agent: string;
  viewport_width: number;
  viewport_height: number;
};

function safeRead(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* quota or disabled storage — ignore */
  }
}

function safeRemove(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}

/** UUID v4 — uses crypto.randomUUID when available, falls back to a polyfill. */
export function uuid(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  // RFC4122 v4 polyfill
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  const existing = safeRead(VISITOR_KEY);
  if (existing) return existing;
  const fresh = uuid();
  safeWrite(VISITOR_KEY, fresh);
  return fresh;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const now = Date.now();
  const lastSeenRaw = safeRead(SESSION_LAST_SEEN_KEY);
  const lastSeen = lastSeenRaw ? Number(lastSeenRaw) : 0;
  const existing = safeRead(SESSION_KEY);

  // Expired or missing → mint a new session
  if (!existing || !lastSeen || now - lastSeen > SESSION_IDLE_MS) {
    const fresh = uuid();
    safeWrite(SESSION_KEY, fresh);
    safeWrite(SESSION_LAST_SEEN_KEY, String(now));
    return fresh;
  }

  safeWrite(SESSION_LAST_SEEN_KEY, String(now));
  return existing;
}

function parseQueryParams(): { utm: UtmParams; clicks: ClickIds } {
  if (typeof window === "undefined") return { utm: {}, clicks: {} };
  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  const clicks: ClickIds = {};
  for (const key of CLICK_ID_KEYS) {
    const value = params.get(key);
    if (value) clicks[key] = value;
  }
  return { utm, clicks };
}

export function getFirstTouch(): FirstTouch | null {
  const raw = safeRead(FIRST_TOUCH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FirstTouch;
  } catch {
    return null;
  }
}

/**
 * Captures UTMs/click-ids/referrer from the current page load and stores them
 * as first-touch if no previous first-touch exists. Idempotent — only writes
 * once per visitor.
 *
 * Call this from a top-level client effect (e.g. once in the layout) so the
 * very first landing is captured even if the user doesn't immediately convert.
 */
export function captureFirstTouchIfNeeded() {
  if (typeof window === "undefined") return;
  if (getFirstTouch()) return;
  const { utm, clicks } = parseQueryParams();
  const hasAny =
    Object.keys(utm).length > 0 ||
    Object.keys(clicks).length > 0 ||
    document.referrer.length > 0;
  if (!hasAny) return;
  const record: FirstTouch = {
    ...utm,
    ...clicks,
    referrer: document.referrer || undefined,
    landing_url: window.location.href,
    captured_at: new Date().toISOString(),
  };
  safeWrite(FIRST_TOUCH_KEY, JSON.stringify(record));
}

/**
 * Returns the full tracking snapshot for a conversion event (form submit,
 * meeting booked). Combines first-touch (locked at landing) + current-session
 * UTMs (last-touch) — the CRM can decide which attribution model to use.
 */
export function getTrackingContext(): TrackingContext {
  const visitor_id = getVisitorId();
  const session_id = getSessionId();
  const { utm, clicks } = parseQueryParams();
  const firstTouch = getFirstTouch();

  // Merge: current-session params win for last-touch, but first-touch is
  // preserved separately under `first_touch` for multi-touch attribution.
  const mergedUtm: UtmParams = { ...(firstTouch ?? {}), ...utm };
  const mergedClicks: ClickIds = { ...(firstTouch ?? {}), ...clicks };

  return {
    visitor_id,
    session_id,
    utm: mergedUtm,
    click_ids: mergedClicks,
    first_touch: firstTouch,
    page_url: typeof window !== "undefined" ? window.location.href : "",
    page_title: typeof document !== "undefined" ? document.title : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    viewport_width: typeof window !== "undefined" ? window.innerWidth : 0,
    viewport_height: typeof window !== "undefined" ? window.innerHeight : 0,
  };
}

/**
 * Build the `metadata` and query params we hand off to Cal.com so a booking
 * carries the same attribution as a form. Cal.com surfaces these in the
 * `BOOKING_CREATED` webhook payload (metadata + responses).
 */
export function buildCalAttribution(): Record<string, string> {
  const ctx = getTrackingContext();
  const out: Record<string, string> = {
    visitor_id: ctx.visitor_id,
    session_id: ctx.session_id,
  };
  for (const [k, v] of Object.entries(ctx.utm)) {
    if (v) out[k] = v;
  }
  for (const [k, v] of Object.entries(ctx.click_ids)) {
    if (v) out[k] = v;
  }
  return out;
}

/** Convenience helper for tests / "withdraw consent" flows. */
export function resetTrackingIdentity() {
  safeRemove(VISITOR_KEY);
  safeRemove(SESSION_KEY);
  safeRemove(SESSION_LAST_SEEN_KEY);
  safeRemove(FIRST_TOUCH_KEY);
}
