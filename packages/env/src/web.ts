import { createEnv } from "@t3-oss/env-nextjs";

// The web app is a static marketing site — no API calls, no server, no
// secrets — so it currently declares no environment variables at all.
// The schema is intentionally left empty rather than deleted: keeping the
// module (and its import in next.config.ts) means adding a variable later
// is a one-line change with validation already wired up.
export const env = createEnv({
  client: {},
  runtimeEnv: {},
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
