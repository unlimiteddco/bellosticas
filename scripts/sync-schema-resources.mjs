/**
 * Pone al día una base de datos de producción a la que le falta la colección
 * «Recursos» (ver el porqué en sync-schema-resources.sql).
 *
 * Uso:
 *   DATABASE_URI="postgres://user:pass@host:5432/dbname" node scripts/sync-schema-resources.mjs
 *
 * Solo añade lo que falta y se puede repetir sin riesgo.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(path.join(dirname, "sync-schema-resources.sql"), "utf8");

const connectionString = process.env.DATABASE_URI;
if (!connectionString) {
  console.error("❌ Falta DATABASE_URI. Ejemplo:");
  console.error('   DATABASE_URI="postgres://postgres:PASS@HOST:5432/bellostas_web" node scripts/sync-schema-resources.mjs');
  process.exit(1);
}

const client = new pg.Client({ connectionString });

const hay = async (consulta) => Boolean((await client.query(consulta)).rows[0]?.ok);
const estado = async () => ({
  recursos: await hay("SELECT to_regclass('public.resources') IS NOT NULL AS ok"),
  bloqueos: await hay(
    "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payload_locked_documents_rels' AND column_name = 'resources_id') AS ok",
  ),
});

try {
  await client.connect();
  console.log("🔌 Conectado a la base de datos.");

  const antes = await estado();
  console.log(`   Antes: tabla de recursos ${antes.recursos ? "sí" : "NO"} · columna de bloqueos ${antes.bloqueos ? "sí" : "NO"}`);

  await client.query(sql);

  const despues = await estado();
  if (despues.recursos && despues.bloqueos) {
    console.log("✅ Esquema al día. El gestor ya puede editar y leer recursos (no hace falta reiniciar).");
  } else {
    console.error("❌ El script terminó pero sigue faltando algo:", despues);
    process.exit(1);
  }
} catch (err) {
  // El SQL va en una transacción: si falla, no se queda nada a medias.
  console.error("❌ Error poniendo al día el esquema:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
