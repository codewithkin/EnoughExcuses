import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { COLORS } from "./theme";

export const NOTIF_ID = {
  timerEnd: "lockedin.timer-end",
  daily: "lockedin.daily-reminder",
  streakRisk: "lockedin.streak-risk",
  taskNudge: "lockedin.task-nudge",
  liveTimer: "lockedin.live-timer",
};

export const CATEGORY_LIVE_TIMER = "live-timer";

export const LIVE_ACTIONS = {
  done: "done",
  skip: "skip",
} as const;

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const isLiveUpdate = notification.request.identifier === NOTIF_ID.liveTimer;
    return {
      shouldShowBanner: !isLiveUpdate,
      shouldShowList: true,
      shouldPlaySound: !isLiveUpdate,
      shouldSetBadge: false,
    };
  },
});

export async function ensureNotificationSetup(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "ExcuseLess",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200, 100, 200],
      lightColor: COLORS.coral,
    });
    await Notifications.setNotificationChannelAsync("live-timer", {
      name: "Live timer",
      importance: Notifications.AndroidImportance.LOW,
    });
  }

  await Notifications.setNotificationCategoryAsync(CATEGORY_LIVE_TIMER, [
    {
      identifier: LIVE_ACTIONS.done,
      buttonTitle: "Done",
      options: { opensAppToForeground: false },
    },
    {
      identifier: LIVE_ACTIONS.skip,
      buttonTitle: "Skip",
      options: { opensAppToForeground: false, isDestructive: true },
    },
  ]);

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function cancel(id: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // not scheduled
  }
}

function todayAt(hour: number, minute: number): Date {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

// Fires when the focus session's time runs out (even if backgrounded).
export async function scheduleTimerEnd(seconds: number, taskTitle: string) {
  await cancel(NOTIF_ID.timerEnd);
  if (seconds <= 0) return;
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID.timerEnd,
    content: {
      title: "Time's up",
      body: `"${taskTitle}" — close it out or add a few minutes.`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, Math.round(seconds)),
    },
  });
}

export const cancelTimerEnd = () => cancel(NOTIF_ID.timerEnd);

// A daily nudge to start the day.
export async function scheduleDailyReminder(hour = 9, minute = 0) {
  await cancel(NOTIF_ID.daily);
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID.daily,
    content: {
      title: "Lock in",
      body: "One task. One timer. Start your day.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export const cancelDailyReminder = () => cancel(NOTIF_ID.daily);

// Evening reminder, only while the streak is still at risk today.
export async function scheduleStreakRisk(hour = 20, minute = 0) {
  await cancel(NOTIF_ID.streakRisk);
  const when = todayAt(hour, minute);
  if (when.getTime() <= Date.now() + 60_000) return;
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID.streakRisk,
    content: {
      title: "Your streak's on the line",
      body: "Finish one task before midnight to keep it alive.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: when,
    },
  });
}

export const cancelStreakRisk = () => cancel(NOTIF_ID.streakRisk);

// Midday nudge while tasks are still queued.
export async function scheduleTaskNudge(count: number, hour = 13, minute = 0) {
  await cancel(NOTIF_ID.taskNudge);
  if (count <= 0) return;
  const when = todayAt(hour, minute);
  if (when.getTime() <= Date.now() + 60_000) return;
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID.taskNudge,
    content: {
      title: "Tasks waiting",
      body: `You've got ${count} task${count === 1 ? "" : "s"} queued. Knock one out.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: when,
    },
  });
}

export const cancelTaskNudge = () => cancel(NOTIF_ID.taskNudge);

// A daily reminder that a specific recurring task is due today.
export function recurringTaskNotifId(taskId: string) {
  return `lockedin.recurring.${taskId}`;
}

export async function scheduleRecurringTask(
  taskId: string,
  hour: number,
  minute: number,
  taskTitle: string,
) {
  await cancel(recurringTaskNotifId(taskId));
  await Notifications.scheduleNotificationAsync({
    identifier: recurringTaskNotifId(taskId),
    content: {
      title: "Task's up today",
      body: `"${taskTitle}" — it resets at this time. Show up or it stays.`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export const cancelRecurringTask = (taskId: string) => cancel(recurringTaskNotifId(taskId));

export const hideLiveTimer = () => cancel(NOTIF_ID.liveTimer);

// Sets up a listener for the focus notification's Done / Skip actions.
// Returns a cleanup function. Call inside a useEffect.
export function onLiveTimerAction(handlers: {
  onDone: () => void;
  onSkip: () => void;
}): () => void {
  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const actionId = response.actionIdentifier;
    if (response.notification.request.identifier !== NOTIF_ID.liveTimer) return;
    if (actionId === Notifications.DEFAULT_ACTION_IDENTIFIER) return;
    switch (actionId) {
      case LIVE_ACTIONS.done:
        handlers.onDone();
        break;
      case LIVE_ACTIONS.skip:
        handlers.onSkip();
        break;
    }
  });
  return () => sub.remove();
}

// Persistent notification naming the task currently being focused on.
//
// Deliberately carries no countdown: notifications can't be updated more
// than about once a minute without the OS throttling them, so a ticking
// clock here just reads as stale/wrong. The in-app timer is the source of
// truth for time; this surface exists to say what you're working on and to
// let you close it out without opening the app.
export async function showLiveTimer(taskTitle: string, goalTitle?: string) {
  await cancel(NOTIF_ID.liveTimer);
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID.liveTimer,
    content: {
      title: "Focusing",
      body: goalTitle ? `${taskTitle} · ${goalTitle}` : taskTitle,
      sound: false,
      sticky: true,
      categoryIdentifier: CATEGORY_LIVE_TIMER,
      ...(Platform.OS === "ios" ? { interruptionLevel: "passive" } : {}),
      ...(Platform.OS === "android" ? { channelId: "live-timer" } : {}),
    },
    trigger: null,
  });
}
