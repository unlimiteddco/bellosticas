import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Projects } from "./payload/collections/Projects";
import { Posts } from "./payload/collections/Posts";
import { ServiceHeroes } from "./payload/collections/ServiceHeroes";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  /**
   * The REST/GraphQL API lives at /payload-api (NOT the default /api) so it
   * never collides with the site's own /api/contact proxy route. The admin UI
   * reads this from config automatically; SSR uses the Local API (no HTTP).
   */
  routes: {
    api: "/payload-api",
    // admin stays at the conventional /admin
  },

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: "· Bellostas CMS",
    },
  },

  // Bilingual content. UI chrome stays in next-intl JSON; editorial CONTENT
  // (projects, posts, hero images metadata) is localized here.
  localization: {
    locales: [
      { label: "Español", code: "es" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "es",
    fallback: true,
  },

  collections: [Projects, Posts, ServiceHeroes, Media, Users],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || "",

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    // Auto-sync schema to the DB on boot. On in dev by default; we also enable
    // it in production via PAYLOAD_DB_PUSH=true for the first Dokploy deploys
    // (no migration files needed). Switch to migrations later for stricter
    // schema-change safety (generate them in the node:22 Docker image).
    push:
      process.env.PAYLOAD_DB_PUSH === "true" ||
      process.env.NODE_ENV !== "production",
  }),

  // Generates payload-types.ts — run `npm run payload:types` after schema changes.
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  sharp,
});
