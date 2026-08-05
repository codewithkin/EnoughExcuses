import { Platform } from "react-native";

import type FocusTimerActivityFactory from "@/activities/FocusTimerActivity";
import type { FocusTimerActivityProps } from "@/activities/FocusTimerActivity";

type LiveActivityHandle = ReturnType<typeof FocusTimerActivityFactory.start>;

let activeHandle: LiveActivityHandle | null = null;
let activeTaskId: string | null = null;

/**
 * Starts (or updates, if one is already running for this task) the focus
 * Live Activity. Keyed on task id so pausing/resuming updates the existing
 * activity rather than tearing it down and creating a new one.
 *
 * Carries no countdown — see the note in lib/notifications.ts. The activity
 * names what you're focused on; the app owns the clock.
 */
export function syncLiveActivity(params: {
  taskId: string;
  taskTitle: string;
  goalTitle?: string;
  paused: boolean;
}) {
  if (Platform.OS !== "ios") return;
  try {
    const FocusTimerActivity = require("@/activities/FocusTimerActivity").default;
    const props: FocusTimerActivityProps = {
      taskTitle: params.taskTitle,
      goalTitle: params.goalTitle,
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
    // Live Activities not available (older iOS, simulator limitation, etc.)
  }
}

export function stopLiveActivity() {
  if (Platform.OS !== "ios" || !activeHandle) return;
  activeHandle.end("immediate").catch(() => {});
  activeHandle = null;
  activeTaskId = null;
}
