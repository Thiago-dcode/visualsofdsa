# ─── Stage 1: builder ────────────────────────────────────────────────────────
FROM node:24-bookworm-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
# Suppress telemetry HTTP calls during the build — speeds up next build.
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

RUN corepack enable

# Dependency layer: invalidated when the lockfile or manifests change.
# package.json has to be here so corepack can read packageManager before pnpm runs.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Application source (see .dockerignore for what is excluded).
COPY . .

# Public (client-bundle) vars — inlined into the JS at build time.
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# Emit the Prisma 8 contract artifacts (src/prisma/contract.json + .d.ts) and build Next.js.
# Migrations and seeding are NOT run here: they need DATABASE_URL, which must
# not be baked into the image. Run them at deploy time instead.
RUN pnpm exec prisma contract emit
RUN pnpm exec next build


# ─── Stage 2: runner ─────────────────────────────────────────────────────────
FROM node:24-bookworm-slim AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

WORKDIR /app

# Next.js standalone output is self-contained: it bundles its own node_modules
# and a minimal server.js. We only add the static assets and public folder.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Drop root. Next.js writes ISR/revalidation output under .next/cache at runtime,
# so that directory (and only that directory) is handed to uid 1000.
RUN mkdir -p .next/cache && chown -R node:node .next/cache

USER node

EXPOSE 3000

CMD ["node", "server.js"]
