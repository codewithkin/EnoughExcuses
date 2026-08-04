# LockedIn — AGENTS.md

## Stack
- pnpm monorepo + turborepo, Bun runtime, TypeScript ^6
- Next.js 16 (`apps/web`, port 3001), Hono (`apps/server`, port 3000), Expo/React Native (`apps/native`)
- Prisma 7 + PostgreSQL (driver adapter via `@prisma/adapter-pg`)
- Tailwind CSS v4, shadcn/ui in `packages/ui`, `tw-animate-css`
- No ESLint, Prettier, tests, lint-staged, or commit hooks

## Commands
| Command | What |
|---|---|
| `pnpm dev` | turbo dev (all apps) |
| `pnpm dev:web` | Next.js only |
| `pnpm dev:server` | Hono only (bun --hot) |
| `pnpm dev:native` | Expo only |
| `pnpm build` | turbo build |
| `pnpm check-types` | typecheck across all packages (preferred over typecheck) |
| `pnpm db:push` | prisma db push |
| `pnpm db:generate` | prisma generate |
| `pnpm db:migrate` | prisma migrate dev |
| `pnpm db:studio` | prisma studio |

## Architecture
- **3 apps, 4 packages**: `apps/{web,server,native}`, `packages/{ui,db,env,config}`
- Server entry: `apps/server/src/index.ts` (Hono, exports default app)
- Web is a marketing/waitlist landing page (Next.js App Router)
- Native is an Expo Router app with `uniwind` (Tailwind for RN) and `heroui-native`
- **No auth, no API routes** configured yet — server only has `GET /`

## Prisma quirks
- Client generated to `packages/db/prisma/generated/` (not `node_modules/.prisma`)
- `prisma generate` runs on `postinstall` automatically
- Uses custom `packages/db/prisma.config.ts` (Prisma 7 multi-file config); reads `.env` from `../../apps/server/.env`
- Runtime is `bun` → uses `@prisma/adapter-pg` driver adapter (not the default pooling client)
- `.env` required at `apps/server/.env` with `DATABASE_URL` and `CORS_ORIGIN`

## Env validation
- `@t3-oss/env` per platform: `@lockedin/env/server`, `@lockedin/env/web`, `@lockedin/env/native`
- Validation can be skipped with `SKIP_ENV_VALIDATION=true`

## Build
- Server bundles with `tsdown` (ESM), `noExternal: [/@lockedin\/.*/]` to inline workspace packages
- UI and DB packages export raw `.ts` source (not pre-built dist)
- `node-linker=isolated` in `.npmrc`

## Style
- Tailwind v4 `@import "tailwindcss"` syntax (not v3 `@tailwind` directives)
- Custom design tokens (`--color-coral`, `--color-ink`, `--color-fg`, etc.) in `packages/ui/src/styles/globals.css`
- Apps import CSS via `@import "@lockedin/ui/globals.css"`
- `apps/web` uses its own `src/index.css` which re-exports the shared globals
- Fonts: Hanken Grotesk (sans), Newsreader (display), JetBrains Mono (mono) via next/font

## Imports
- `@lockedin/ui/components/button` (etc.) — shared shadcn components
- `@lockedin/ui/globals.css` — shared styles
- `@lockedin/env/server`, `@lockedin/env/web`, `@lockedin/env/native` — env schemas
- `@lockedin/db` — Prisma client (`createPrismaClient()` or default singleton)
- `@/...` in each app maps to `app/src/...`

## Plans
- Implementation plans live in `plans/` (gitignored)
- Current: `plans/widgets.md` — iOS Home Screen widgets + Live Activities (expo-widgets) and Android widgets (react-native-android-widget)