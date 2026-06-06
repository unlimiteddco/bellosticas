import path from "path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

// Spline's real ESM entry, bypassing its `import`-only exports map (which
// Next's webpack server trace can't resolve → "Package path . is not
// exported"). Resolved from the project root (package.json itself isn't
// exposed via exports, so require.resolve can't be used).
const splineEntry = path.resolve(
  process.cwd(),
  "node_modules/@splinetool/react-spline/dist/react-spline.js",
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Self-contained server bundle for an efficient Docker image on Dokploy.
  output: "standalone",
  // Payload's server packages must not be bundled by Next's tracing.
  serverExternalPackages: ["sharp", "payload"],
  // Alias only Spline to its real ESM file so the prod webpack build resolves
  // it (see splineEntry above). Surgical — leaves all other resolution intact.
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@splinetool/react-spline": splineEntry,
    };
    return config;
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Long-lived caching for static media so repeat visits don't refetch.
  // NOTE: if Cloudflare sits in front, also set its "Browser Cache TTL" to
  // "Respect Existing Headers" (or add a Cache Rule) or it overrides these.
  async headers() {
    return [
      {
        source: "/(.*)\\.(woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)\\.(jpg|jpeg|png|gif|svg|webp|avif|ico|mp4)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

// Compose both plugins. withPayload wraps the outside so it can inject its
// build tweaks around the next-intl-augmented config.
export default withPayload(withNextIntl(nextConfig));
