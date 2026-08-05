import { Platform } from "react-native";
import { requestWidgetUpdate } from "react-native-android-widget";

import { NextTaskWidget } from "@/widgets/NextTaskWidget.android";
import { QuickStartWidget } from "@/widgets/QuickStartWidget.android";
import { TodayProgressWidget } from "@/widgets/TodayProgressWidget.android";

import { WidgetData, syncWidgetData as syncData } from "./widget-data";

export async function syncAllWidgets(): Promise<void> {
  const data = await syncData();
  if (Platform.OS === "ios") {
    await updateIOSWidgets(data);
  } else {
    await updateAndroidWidgets(data);
  }
}

async function updateIOSWidgets(data: WidgetData) {
  try {
    const NextTaskWidget = require("@/widgets/NextTaskWidget.ios").default;
    const QuickStartWidget = require("@/widgets/QuickStartWidget.ios").default;
    const TodayProgressWidget = require("@/widgets/TodayProgressWidget.ios").default;
    const FocusTimerLockScreen = require("@/widgets/FocusTimerLockScreen").default;

    NextTaskWidget.updateSnapshot({
      title: data.session.active ? data.session.taskTitle : (data.nextTask?.title ?? "All done!"),
      durationMin: data.nextTask?.durationMin,
      goalTitle: data.nextTask?.goalTitle,
      sessionActive: data.session.active,
      sessionPaused: data.session.paused,
    });

    QuickStartWidget.updateSnapshot({
      hasTasks: data.nextTask !== null,
      nextTaskTitle: data.nextTask?.title,
      sessionActive: data.session.active,
      sessionPaused: data.session.paused,
      sessionTaskTitle: data.session.active ? data.session.taskTitle : undefined,
    });

    TodayProgressWidget.updateSnapshot({
      completed: data.todayStats.completed,
      totalPending: data.todayStats.totalPending,
      streak: data.streak,
      focusSeconds: data.todayStats.focusSeconds,
    });

    FocusTimerLockScreen.updateSnapshot({
      active: data.session.active,
      paused: data.session.paused,
    });
  } catch {
    // Widgets not registered yet — ignore
  }
}

async function updateAndroidWidgets(data: WidgetData) {
  try {
    requestWidgetUpdate({
      widgetName: "NextTaskWidget",
      renderWidget: () => (
        <NextTaskWidget
          title={data.session.active ? data.session.taskTitle : (data.nextTask?.title ?? "All done!")}
          durationMin={data.nextTask?.durationMin}
          goalTitle={data.nextTask?.goalTitle}
          sessionActive={data.session.active}
          sessionPaused={data.session.paused}
        />
      ),
    });

    requestWidgetUpdate({
      widgetName: "QuickStartWidget",
      renderWidget: () => (
        <QuickStartWidget
          hasTasks={data.nextTask !== null}
          nextTaskTitle={data.nextTask?.title}
          sessionActive={data.session.active}
          sessionPaused={data.session.paused}
          sessionTaskTitle={data.session.active ? data.session.taskTitle : undefined}
        />
      ),
    });

    requestWidgetUpdate({
      widgetName: "TodayProgressWidget",
      renderWidget: () => (
        <TodayProgressWidget
          completed={data.todayStats.completed}
          totalPending={data.todayStats.totalPending}
          streak={data.streak}
          focusSeconds={data.todayStats.focusSeconds}
        />
      ),
    });
  } catch {
    // Widgets not registered yet — ignore
  }
}