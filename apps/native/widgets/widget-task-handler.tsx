import type { WidgetTaskHandlerProps } from "react-native-android-widget";

import { emptyWidgetData, readWidgetData } from "@/lib/widget-data";
import { NextTaskWidget } from "@/widgets/NextTaskWidget.android";
import { QuickStartWidget } from "@/widgets/QuickStartWidget.android";
import { TodayProgressWidget } from "@/widgets/TodayProgressWidget.android";

// Android asks the *app* to render a widget whenever one is added to the
// home screen, resized, or refreshed by the system — it doesn't just replay
// whatever we last pushed via requestWidgetUpdate(). Without a registered
// handler for those requests, Android gets no view tree back and the widget
// renders as an empty (transparent) box.
//
// This reads the same on-device widget-data.json the app writes after every
// task mutation, so a freshly-added widget shows real data immediately
// instead of waiting for the next in-app change.

const nameToWidget = {
  NextTaskWidget,
  QuickStartWidget,
  TodayProgressWidget,
} as const;

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetName = props.widgetInfo.widgetName as keyof typeof nameToWidget;

  if (props.widgetAction === "WIDGET_DELETED") return;

  const data = await readWidgetData().catch(() => emptyWidgetData());

  switch (widgetName) {
    case "NextTaskWidget":
      props.renderWidget(
        <NextTaskWidget
          title={
            data.session.active ? data.session.taskTitle : (data.nextTask?.title ?? "All done!")
          }
          durationMin={data.nextTask?.durationMin}
          goalTitle={data.nextTask?.goalTitle}
          sessionActive={data.session.active}
          sessionPaused={data.session.paused}
        />,
      );
      break;

    case "QuickStartWidget":
      props.renderWidget(
        <QuickStartWidget
          hasTasks={data.nextTask !== null}
          nextTaskTitle={data.nextTask?.title}
          sessionActive={data.session.active}
          sessionPaused={data.session.paused}
          sessionTaskTitle={data.session.active ? data.session.taskTitle : undefined}
        />,
      );
      break;

    case "TodayProgressWidget":
      props.renderWidget(
        <TodayProgressWidget
          completed={data.todayStats.completed}
          totalPending={data.todayStats.totalPending}
          streak={data.streak}
          focusSeconds={data.todayStats.focusSeconds}
        />,
      );
      break;

    default:
      break;
  }
}
