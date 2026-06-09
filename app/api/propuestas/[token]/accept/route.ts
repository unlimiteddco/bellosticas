import { NextResponse } from "next/server";

/**
 * Server-side proxy: reenvía la aceptación de una propuesta desde la web al CRM
 * con el shared secret. Runs en Node para que `WEB_WEBHOOK_SECRET` nunca llegue
 * al cliente. Misma política de reintentos que /api/contact.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio";
const SECRET = process.env.WEB_WEBHOOK_SECRET;

const TOTAL_DEADLINE_MS = 30_000;
const BACKOFFS_MS = [1_000, 4_000, 16_000];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  if (!SECRET) {
    console.error("[/api/propuestas/accept] WEB_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { ok: false, error: "Server is not configured" },
      { status: 500 },
    );
  }

  const { token } = await params;
  if (!token || token.length < 8) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 400 });
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
  if (
    typeof payload.fiscal_name !== "string" ||
    typeof payload.vat_number !== "string" ||
    typeof payload.fiscal_address !== "string"
  ) {
    return NextResponse.json(
      { ok: false, error: "Missing fiscal fields" },
      { status: 400 },
    );
  }

  const url = `${CRM_BASE_URL.replace(/\/+$/, "")}/api/public/proposals/${encodeURIComponent(token)}/accept`;
  const body = JSON.stringify({ ...payload, payment_method: payload.payment_method ?? "transfer" });
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
        signal: AbortSignal.timeout(Math.min(12_000, deadline - Date.now())),
      });
    } catch {
      if (attempt >= BACKOFFS_MS.length) {
        return NextResponse.json(
          { ok: false, error: "Network error reaching CRM" },
          { status: 502 },
        );
      }
      await wait(BACKOFFS_MS[attempt]);
      continue;
    }

    if (response.ok) {
      const data = await safeJson(response);
      return NextResponse.json(data ?? { ok: true }, { status: response.status });
    }

    // 4xx (excepto 429) → problema de validación, no reintentar
    if (response.status >= 400 && response.status < 500 && response.status !== 429) {
      const data = await safeJson(response);
      return NextResponse.json(
        data ?? { ok: false, error: `CRM rejected with ${response.status}` },
        { status: response.status },
      );
    }

    // 5xx o 429 → reintentar si queda presupuesto
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
  return req.headers.get("x-real-ip");
}
