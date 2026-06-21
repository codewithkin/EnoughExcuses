import { useEffect, useState } from "react";

import { useApp } from "./store";

export type Countdown = {
  active: boolean;
  remaining: number;
  total: number;
  elapsed: number;
};

export function useCountdown(): Countdown {
  const { state } = useApp();
  const session = state.session;
  const [, force] = useState(0);

  useEffect(() => {
    if (!session) return;
    const id = setInterval(() => force((n) => (n + 1) % 1_000_000), 1000);
    return () => clearInterval(id);
  }, [session?.taskId, session?.startedAt, session?.durationSec]);

  if (!session) return { active: false, remaining: 0, total: 0, elapsed: 0 };

  const elapsed = Math.max(0, Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000));
  const remaining = Math.max(0, session.durationSec - elapsed);
  return { active: true, remaining, total: session.durationSec, elapsed };
}
