"use no memo";
import { TextWidget } from "react-native-android-widget";

import { GlowMark, WIDGET, WidgetShell, checkSvg, flameSvg } from "./widget-style";

type Props = {
  title: string;
  durationMin?: number;
  goalTitle?: string;
  sessionActive: boolean;
  sessionPaused: boolean;
  /** @deprecated countdown removed from widgets — kept so old callers typecheck */
  remaining?: number;
};

export function NextTaskWidget(props: Props) {
  const hasTask = !!props.title && props.title !== "All done!";
  const live = props.sessionActive && !props.sessionPaused;

  const status = props.sessionActive
    ? props.sessionPaused
      ? "PAUSED"
      : "FOCUSING"
    : hasTask
      ? "NEXT TASK"
      : "ALL CLEAR";

  const meta = hasTask
    ? [props.durationMin ? `${props.durationMin} min` : null, props.goalTitle]
        .filter(Boolean)
        .join("  ·  ")
    : "Tap to add your first task";

  return (
    <WidgetShell
      accent={live}
      mark={
        <GlowMark
          active={props.sessionActive}
          svg={hasTask ? flameSvg(live ? WIDGET.green : WIDGET.muted) : checkSvg(WIDGET.green)}
        />
      }
    >
      <TextWidget
        text={status}
        style={{
          fontSize: 12,
          fontFamily: "JetBrainsMono-Medium",
          color: props.sessionActive ? WIDGET.green : WIDGET.muted,
        }}
      />

      <TextWidget
        text={hasTask ? props.title : "Nothing queued"}
        maxLines={2}
        style={{
          fontSize: 22,
          fontWeight: "bold",
          fontFamily: "HankenGrotesk-Bold",
          color: hasTask ? WIDGET.fg : WIDGET.muted,
          marginTop: 6,
        }}
      />

      <TextWidget
        text={meta}
        maxLines={1}
        style={{
          fontSize: 14,
          fontFamily: "HankenGrotesk",
          color: hasTask ? WIDGET.green : WIDGET.muted,
          marginTop: 6,
        }}
      />
    </WidgetShell>
  );
}
