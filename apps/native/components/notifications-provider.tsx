import { useEffect } from "react";

import {
  cancelStreakRisk,
  cancelTaskNudge,
  cancelTimerEnd,
  ensureNotificationSetup,
  scheduleDailyReminder,
  scheduleStreakRisk,
  scheduleTaskNudge,
  scheduleTimerEnd,
} from "@/lib/notifications";
import { useApp } from "@/lib/store";

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { state, today, queue } = useApp();
  const onboarded = state.onboarded;
  const session = state.session;
  const sessionKey = session
    ? `${session.taskId}:${session.startedAt}:${session.durationSec}`
    : "none";

  // Ask once (after onboarding) and set the daily reminder.
  useEffect(() => {
    if (!onboarded) return;
    let mounted = true;
    (async () => {
      const granted = await ensureNotificationSetup();
      if (!granted || !mounted) return;
      await scheduleDailyReminder(9, 0);
    })();
    return () => {
      mounted = false;
    };
  }, [onboarded]);

  // Timer-finished notification tracks the active focus session.
  useEffect(() => {
    if (!onboarded) return;
    if (!session) {
      cancelTimerEnd();
      return;
    }
    const endMs = new Date(session.startedAt).getTime() + session.durationSec * 1000;
    const seconds = Math.round((endMs - Date.now()) / 1000);
    const task = state.tasks.find((t) => t.id === session.taskId);
    scheduleTimerEnd(seconds, task?.title ?? "Your task");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey, onboarded]);

  // Streak reminder only while today's streak is still at risk.
  useEffect(() => {
    if (!onboarded) return;
    if (today.completed > 0) cancelStreakRisk();
    else scheduleStreakRisk();
  }, [today.completed, onboarded]);

  // Midday nudge only while tasks are queued.
  useEffect(() => {
    if (!onboarded) return;
    if (queue.length === 0) cancelTaskNudge();
    else scheduleTaskNudge(queue.length);
  }, [queue.length, onboarded]);

  return <>{children}</>;
}
