/**
 * Client-side helper that wraps a web form submission and ships the payload
 * to the CRM via our `/api/contact` proxy (server-side, secret-protected).
 *
 * Why proxy: the `WEB_WEBHOOK_SECRET` MUST NOT be exposed to the browser.
 * The proxy adds the secret header and forwards to the CRM with retries.
 *
 * Contract: see `public/web-integration.md` for the full field spec and the
 * list of accepted enums.
 */

import { getTrackingContext, uuid } from "./tracking";

/* Enums mirrored from the CRM contract. Keep in sync with web-integration.md. */
export type FormType =
  | "contact"
  | "quote_request"
  | "lead_magnet"
  | "newsletter"
  | "popup_discount"
  | "audit_request"
  | "other";

export type ServiceInterest =
  | "web_design"
  | "ecommerce"
  | "web_app"
  | "automation"
  | "migration"
  | "white_label"
  | "other";

export type Budget =
  | "under_3k"
  | "3k_7k"
  | "7k_15k"
  | "15k_plus"
  | "not_sure";

export type Locale = "es" | "en";

export type SubmitFormInput = {
  form_id: string;
  form_type: FormType;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  service_interest?: ServiceInterest | null;
  budget?: Budget | null;
  locale: Locale;
  /** Marketing consent checkbox state at submit time. */
  consent_marketing: boolean;
  /** Milliseconds the user spent on the page before submitting. */
  time_on_page_ms?: number;
};

export type SubmitFormResult =
  | { ok: true; id: string; duplicate?: boolean }
  | { ok: false; status: number; error: string };

/**
 * Build the full webhook payload and POST it to `/api/contact`.
 *
 * Idempotency: a fresh UUID is generated per call and propagated through any
 * retries the proxy performs, so the CRM dedupes correctly.
 */
export async function submitForm(input: SubmitFormInput): Promise<SubmitFormResult> {
  const tracking = getTrackingContext();
  const idempotency_key = uuid();

  // Filter out undefined/null/empty so the CRM sees clean optional fields.
  const payload = stripEmpty({
    idempotency_key,
    form_id: input.form_id,
    form_type: input.form_type,

    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company,
    message: input.message,
    service_interest: input.service_interest ?? null,
    budget: input.budget ?? null,

    page_url: tracking.page_url,
    page_title: tracking.page_title,
    referrer: tracking.referrer || null,
    locale: input.locale,

    utm_source: tracking.utm.utm_source ?? null,
    utm_medium: tracking.utm.utm_medium ?? null,
    utm_campaign: tracking.utm.utm_campaign ?? null,
    utm_term: tracking.utm.utm_term ?? null,
    utm_content: tracking.utm.utm_content ?? null,
    gclid: tracking.click_ids.gclid ?? null,
    fbclid: tracking.click_ids.fbclid ?? null,
    msclkid: tracking.click_ids.msclkid ?? null,

    visitor_id: tracking.visitor_id,
    session_id: tracking.session_id,

    consent_marketing: input.consent_marketing,
    consent_timestamp: input.consent_marketing ? new Date().toISOString() : null,

    user_agent: tracking.user_agent,
    viewport_width: tracking.viewport_width || null,
    viewport_height: tracking.viewport_height || null,
    time_on_page_ms: input.time_on_page_ms ?? null,
    submitted_at: new Date().toISOString(),
  });

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await safeJson(res);
      const detail =
        typeof errBody?.error === "string"
          ? errBody.error
          : `Request failed with status ${res.status}`;
      return { ok: false, status: res.status, error: detail };
    }

    const body = (await safeJson(res)) as { ok: true; id: string; duplicate?: boolean } | null;
    if (!body || !body.ok) {
      return { ok: false, status: res.status, error: "Unexpected response from server" };
    }
    return { ok: true, id: body.id, duplicate: body.duplicate };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

function stripEmpty<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k] = v;
  }
  return out as T;
}

async function safeJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}
