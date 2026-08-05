# Build from the monorepo root: docker build -f apps/web/Dockerfile .
#
# Adapted from the viraltiktokslideshows and theseosaas web images — same stack and monorepo
# shape (pnpm workspaces using the `catalog:` protocol, a Next.js app fed by shared packages/).
# Those files carry fixes for failures already hit in real deployments, so the reasoning behind
# some lines isn't visible from this codebase alone; each is commented rather than left to look
# like cruft.
#
# Difference from the theseosaas reference: this app is database-free. apps/web depends only on
# @lockedin/env, @lockedin/ui and @lockedin/config (see apps/web/package.json) — there is no
# packages/db, no Prisma, and therefore no schema copy, no `prisma generate`, and no openssl.
FROM node:22-slim AS builder

WORKDIR /app

# corepack rather than `npm install -g pnpm@11`: package.json pins packageManager to
# pnpm@11.4.0, and a floating `@11` can resolve to a newer patch than the one that wrote
# pnpm-lock.yaml, which makes --frozen-lockfile fail for no useful reason.
RUN corepack enable && corepack prepare pnpm@11.4.0 --activate

# Some platforms (Coolify, Dokku and similar) inject NODE_ENV=production as a *build-time*
# variable. pnpm reads that the same as `--prod` and silently skips devDependencies — here that
# would drop typescript, tailwindcss and @tailwindcss/postcss, all of which `next build` needs.
# Forced back to production in the runner stage.
ENV NODE_ENV=development

# Workspace manifests + lockfile first, so the install layer survives source edits.
# packages/db is intentionally absent — the web app has no database dependency.
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY packages/config/package.json packages/config/
COPY packages/env/package.json packages/env/
COPY packages/ui/package.json packages/ui/
COPY apps/web/package.json apps/web/

# No build ARGs: the site is static marketing content with no API calls, so packages/env/src/web.ts
# declares an empty schema and `next build` needs nothing injected. If a NEXT_PUBLIC_* var is ever
# added there, it must also be added here as an ARG/ENV pair — env-nextjs validates at build time
# and bakes the value into the client bundle, so a missing one fails the build rather than the run.
RUN pnpm install --frozen-lockfile

# Source after install for better layer caching.
COPY packages/config/ packages/config/
COPY packages/env/ packages/env/
COPY packages/ui/ packages/ui/
COPY apps/web/ apps/web/

RUN pnpm --filter web build

# ---- Runner ----
FROM node:22-slim AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.4.0 --activate

# next.config.ts doesn't set `output: "standalone"`, so `next start` needs the full node_modules
# tree rather than a pruned bundle — copied wholesale from the builder instead of reinstalled
# here (a fresh `pnpm install --prod` would drop next itself from the workspace links).
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web
COPY --from=builder /app/packages ./packages

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

WORKDIR /app/apps/web

EXPOSE 3001

CMD ["pnpm", "start"]
