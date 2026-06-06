import { NextResponse } from "next/server";

/**
 * Server-side proxy that forwards form submissions from the web to the CRM
 * webhook with the shared secret. Runs in Node (not Edge) so the env var
 * `WEB_WEBHOOK_SECRET` is never exposed to the client.
 *
 * Retry policy (matches `public/web-integration.md`):
 *   - 3 attempts with exponential backoff (1s, 4s, 16s)
 *   - Bail out after 30s total
 *   - Retry only on 5xx and 429
 *   - 4xx (except 429) → forward verdict to client immediately
 *   - Same `idempotency_key` across all attempts (it's in the body)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio";
const WEBHOOK_PATH = "/api/webhooks/web/form";
const SECRET = process.env.WEB_WEBHOOK_SECRET;

const TOTAL_DEADLINE_MS = 30_000;
const BACKOFFS_MS = [1_000, 4_000, 16_000];

export async function POST(request: Request) {
  if (!SECRET) {
    console.error("[/api/contact] WEB_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { ok: false, error: "Server is not configured to send forms" },
      { status: 500 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isObject(payload)) {
    return NextResponse.json({ ok: false, error: "Body must be a JSON object" }, { status: 400 });
  }

  // Minimal sanity checks. Full validation lives in the CRM.
  if (typeof payload.idempotency_key !== "string" || payload.idempotency_key.length < 8) {
    return NextResponse.json({ ok: false, error: "Missing idempotency_key" }, { status: 400 });
  }
  if (typeof payload.form_id !== "string" || typeof payload.form_type !== "string") {
    return NextResponse.json(
      { ok: false, error: "Missing form_id or form_type" },
      { status: 400 },
    );
  }

  const url = `${CRM_BASE_URL.replace(/\/+$/, "")}${WEBHOOK_PATH}`;
  const body = JSON.stringify(payload);
  const deadline = Date.now() + TOTAL_DEADLINE_MS;

  for (let attempt = 0; attempt < BACKOFFS_MS.length + 1; attempt++) {
    if (Date.now() > deadline) break;

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": SECRET,
          "X-Forwarded-For": getClientIp(request) ?? "",
        },
        body,
        // No long polling — keep this snappy
        signal: AbortSignal.timeout(Math.min(10_000, deadline - Date.now())),
      });
    } catch (err) {
      // Network / abort error — treat as 5xx and retry
      if (attempt >= BACKOFFS_MS.length) {
        return NextResponse.json(
          { ok: false, error: "Network error reaching CRM" },
          { status: 502 },
        );
      }
      await wait(BACKOFFS_MS[attempt]);
      continue;
    }

    // 2xx → success, forward the CRM's body
    if (response.ok) {
      const data = await safeJson(response);
      return NextResponse.json(data ?? { ok: true }, { status: response.status });
    }

    // 4xx (except 429) → bail out, this is a validation problem
    if (response.status >= 400 && response.status < 500 && response.status !== 429) {
      const data = await safeJson(response);
      return NextResponse.json(
        data ?? { ok: false, error: `CRM rejected with ${response.status}` },
        { status: response.status },
      );
    }

    // 5xx or 429 → retry if budget left
    if (attempt >= BACKOFFS_MS.length) {
      const data = await safeJson(response);
      return NextResponse.json(
        data ?? { ok: false, error: `CRM unavailable (${response.status})` },
        { status: 502 },
      );
    }
    const backoff = BACKOFFS_MS[attempt];
    if (Date.now() + backoff > deadline) break;
    await wait(backoff);
  }

  return NextResponse.json(
    { ok: false, error: "CRM did not respond in time" },
    { status: 504 },
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function safeJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getClientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  const real = req.headers.get("x-real-ip");
  return real ?? null;
}
