# Bellostas Studio — web + Payload CMS, single image for Dokploy.
#
# Builds INSIDE the container (linux) so sharp & Payload native deps get the
# correct linux binaries. Node 22 (Payload-recommended; the Payload CLI also
# works here, unlike Node 24 on the host).
#
# Multi-stage: deps → builder → runner (Next standalone output).

# ---------- base ----------
FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ---------- deps ----------
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- builder ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# DATABASE_URI / PAYLOAD_SECRET are provided at BUILD time too because Next
# pre-renders pages that read from the CMS. Pass them as build args/secrets in
# Dokploy, or rely on the static fallback (build works even without a DB).
ENV NODE_ENV=production
RUN npm run build

# ---------- runner ----------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# Standalone server + static assets + public (incl. media upload dir).
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Uploads live here. Mount a persistent Dokploy volume at /app/public/media
# so images survive redeploys (or swap Media storage for S3/R2).
RUN mkdir -p /app/public/media && chown -R nextjs:nodejs /app/public/media

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
