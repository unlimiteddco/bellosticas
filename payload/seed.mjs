/**
 * HTTP seed — populates Payload via its REST API (no tsx/worker issues).
 *
 * Run the app first (npm run dev, or against prod), then:
 *   SEED_URL=http://localhost:3001 \
 *   SEED_ADMIN_EMAIL=admin@bellostas.studio SEED_ADMIN_PASSWORD=changeme \
 *   npm run seed
 *
 * Idempotent-ish: skips the admin if one exists; skips a project if its slug
 * already exists. Re-run safely.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const BASE = process.env.SEED_URL || "http://localhost:3001";
const API = `${BASE}/payload-api`;
const EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@bellostas.studio";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD || "bellostas2026";

const es = JSON.parse(readFileSync(path.join(ROOT, "messages/es.json"), "utf8"));
const en = JSON.parse(readFileSync(path.join(ROOT, "messages/en.json"), "utf8"));

// Mirror of lib/projects.ts (kept inline so the seed has no TS import).
const PROJECTS = [
  { slug: "seolatte", name: "SeoLatte", catEs: "SaaS · Programmatic SEO", catEn: "SaaS · Programmatic SEO", year: 2026, client: "SeoLatte", stack: ["Next.js", "Sanity", "OpenAI", "Vercel"], liveUrl: "https://seolatte.com", color: "#2C2417", descKey: "p_seolatte", order: 10 },
  { slug: "primex-academy", name: "PrimeX Academy", catEs: "LMS · Education", catEn: "LMS · Education", year: 2025, client: "PrimeX", stack: ["Next.js", "Payload", "Stripe"], color: "#1A2B3F", descKey: "p_primex", order: 20 },
  { slug: "voluntariado-aragon", name: "Voluntariado de Aragón", catEs: "Migración · Gobierno", catEn: "Migration · Government", year: 2025, client: "Gobierno de Aragón", stack: ["Next.js", "Sanity", "Cloudflare"], color: "#3A1F1F", descKey: "p_pva", order: 30 },
  { slug: "fada", name: "FADA", catEs: "Federación · Deporte", catEn: "Federation · Sport", year: 2024, client: "Federación Aragonesa de Automovilismo", stack: ["Next.js", "Sanity"], color: "#1F2E22", descKey: "p_fada", order: 40 },
  { slug: "gotten-gym", name: "Gotten Gym", catEs: "Site + Admin custom", catEn: "Site + Custom Admin", year: 2024, client: "Gotten Gym", stack: ["Next.js", "Payload", "Tailwind"], color: "#0F0F0F", descKey: "p_gotten", order: 50, logo: "public/clientes/logo-web-svg-white.svg", cover: "public/clientes/caso-gotten.jpeg", featured: true },
  { slug: "embroidery-download", name: "EmbroideryDownload", catEs: "E-commerce · En proceso", catEn: "E-commerce · In progress", year: 2026, client: "Embroidery Download", stack: ["Next.js", "Medusa", "Stripe"], color: "#2A1F33", descKey: "p_embroidery", order: 60 },
];

let token = null;
const authHeaders = () => (token ? { Authorization: `JWT ${token}` } : {});

async function api(method, pathname, body, locale) {
  const url = new URL(`${API}${pathname}`);
  if (locale) url.searchParams.set("locale", locale);
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { ok: res.ok, status: res.status, json };
}

async function ensureAdmin() {
  // Try first-register (only works when zero users exist).
  const fr = await api("POST", "/users/first-register", {
    name: "Antonio Bellostas",
    email: EMAIL,
    password: PASSWORD,
  });
  if (fr.ok) {
    console.log(`✓ Admin creado: ${EMAIL} / ${PASSWORD}`);
  } else {
    console.log("• Admin ya existe (o first-register cerrado), intentando login…");
  }
  // Login to get a token for the rest of the seed.
  const login = await api("POST", "/users/login", { email: EMAIL, password: PASSWORD });
  if (!login.ok) {
    throw new Error(`Login falló (${login.status}). Revisa SEED_ADMIN_EMAIL/PASSWORD. ${JSON.stringify(login.json)}`);
  }
  token = login.json.token;
  console.log("✓ Autenticado.");
}

async function uploadMedia(relPath, alt) {
  const abs = path.join(ROOT, relPath);
  let buf;
  try { buf = readFileSync(abs); } catch { console.log(`  · imagen no encontrada, skip: ${relPath}`); return null; }
  const name = path.basename(relPath);
  const ext = path.extname(name).slice(1).toLowerCase();
  const mime = ext === "svg" ? "image/svg+xml" : ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  const fd = new FormData();
  // Payload REST expects non-file fields inside a `_payload` JSON part.
  fd.set("_payload", JSON.stringify({ alt }));
  fd.set("file", new Blob([buf], { type: mime }), name);
  const res = await fetch(`${API}/media`, { method: "POST", headers: { ...authHeaders() }, body: fd });
  if (!res.ok) { console.log(`  · upload falló (${res.status}) para ${relPath}`); return null; }
  const json = await res.json();
  return json?.doc?.id ?? null;
}

async function seedProjects() {
  for (const p of PROJECTS) {
    const existing = await api("GET", `/projects?where[slug][equals]=${p.slug}&limit=1`);
    if (existing.ok && existing.json?.docs?.length > 0) {
      console.log(`• Proyecto ya existe, skip: ${p.slug}`);
      continue;
    }

    const logoId = p.logo ? await uploadMedia(p.logo, `${p.name} logo`) : null;
    const coverId = p.cover ? await uploadMedia(p.cover, `${p.name} cover`) : null;

    // Create in ES (default locale).
    const created = await api("POST", "/projects", {
      name: p.name,
      slug: p.slug,
      year: p.year,
      client: p.client,
      category: p.catEs,
      stack: p.stack,
      description: es.work.items[p.descKey] ?? "",
      liveUrl: p.liveUrl,
      color: p.color,
      logo: logoId,
      cover: coverId,
      featured: !!p.featured,
      order: p.order,
    }, "es");

    if (!created.ok) { console.log(`✗ Error creando ${p.slug} (${created.status}): ${JSON.stringify(created.json)}`); continue; }
    const id = created.json.doc.id;

    // Patch EN localized fields.
    await api("PATCH", `/projects/${id}`, {
      category: p.catEn,
      description: en.work.items[p.descKey] ?? "",
    }, "en");

    console.log(`✓ Proyecto: ${p.slug}${logoId || coverId ? " (con imágenes)" : ""}`);
  }
}

async function main() {
  console.log(`Seeding ${API} …`);
  await ensureAdmin();
  await seedProjects();
  console.log("\n✓ Seed completado. Entra en /admin para revisar y editar.");
}

main().catch((e) => { console.error("\n✗ Seed falló:", e.message); process.exit(1); });
