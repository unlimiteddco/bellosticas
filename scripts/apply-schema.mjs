/**
 * One-shot: create the Payload schema in a Postgres database.
 *
 * Payload's dev "push" does NOT run in the production standalone build, so a
 * fresh prod database starts empty ("relation users does not exist"). This
 * applies the initial schema (dumped from a known-good local DB) directly.
 *
 * Usage:
 *   DATABASE_URI="postgres://user:pass@host:5432/dbname" node scripts/apply-schema.mjs
 *
 * Safe to run against an EMPTY database. It is idempotent-ish: re-running on a
 * DB that already has the tables will error on the first duplicate — that's
 * fine, it just means the schema is already there.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(path.join(dirname, "initial-schema.sql"), "utf8");

const connectionString = process.env.DATABASE_URI;
if (!connectionString) {
  console.error("❌ Falta DATABASE_URI. Ejemplo:");
  console.error('   DATABASE_URI="postgres://postgres:PASS@HOST:5432/bellostas_web" node scripts/apply-schema.mjs');
  process.exit(1);
}

const client = new pg.Client({ connectionString });

try {
  await client.connect();
  console.log("🔌 Conectado a la base de datos.");

  const { rows } = await client.query("SELECT to_regclass('public.users') AS users");
  if (rows[0]?.users) {
    console.log("ℹ️  La tabla 'users' ya existe — el esquema ya está creado. Nada que hacer.");
    process.exit(0);
  }

  console.log("📦 Aplicando el esquema (20 tablas)...");
  await client.query(sql);
  console.log("✅ Esquema creado correctamente. Ya puedes entrar a /admin y crear tu usuario.");
} catch (err) {
  console.error("❌ Error aplicando el esquema:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
