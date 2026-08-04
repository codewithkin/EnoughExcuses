import { Platform } from "react-native";

import type FocusTimerActivityFactory from "@/activities/FocusTimerActivity";
import type { FocusTimerActivityProps } from "@/activities/FocusTimerActivity";

type LiveActivityHandle = ReturnType<typeof FocusTimerActivityFactory.start>;

let activeHandle: LiveActivityHandle | null = null;
let activeTaskId: string | null = null;

/**
 * Starts (or, if one is already running for this task, just updates) the
 * focus-session Live Activity. Safe to call on every timer tick — it only
 * spins up a *new* activity when the task id changes; otherwise it just
 * pushes updated props to the existing one, so pausing/resuming never
 * flickers or recreates the Dynamic Island entry.
 */
export function syncLiveActivity(params: {
  taskId: string;
  taskTitle: string;
  goalTitle?: string;
  remaining: number;
  total: number;
  paused: boolean;
}) {
  if (Platform.OS !== "ios") return;
  try {
    const FocusTimerActivity = require("@/activities/FocusTimerActivity").default;
    const props: FocusTimerActivityProps = {
      taskTitle: params.taskTitle,
      goalTitle: params.goalTitle,
      remaining: params.remaining,
      total: params.total,
      paused: params.paused,
    };

    if (!activeHandle || activeTaskId !== params.taskId) {
      activeHandle?.end("immediate").catch(() => {});
      activeHandle = FocusTimerActivity.start(props);
      activeTaskId = params.taskId;
      return;
    }

    activeHandle.update(props).catch(() => {});
  } catch {
    // Live Activities not available (older iOS, simulator limitation, etc.) — ignore
  }
}

export function stopLiveActivity() {
  if (Platform.OS !== "ios" || !activeHandle) return;
  activeHandle.end("immediate").catch(() => {});
  activeHandle = null;
  activeTaskId = null;
}
