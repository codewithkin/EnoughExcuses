"use no memo";
import { TextWidget } from "react-native-android-widget";

import { GlowMark, WIDGET, WidgetShell, boltSvg, flameSvg } from "./widget-style";

type Props = {
  hasTasks: boolean;
  nextTaskTitle?: string;
  sessionActive: boolean;
  sessionPaused: boolean;
  sessionTaskTitle?: string;
};

export function QuickStartWidget(props: Props) {
  const live = props.sessionActive && !props.sessionPaused;

  const cta = props.sessionActive
    ? props.sessionPaused
      ? "TAP TO RESUME"
      : "IN PROGRESS"
    : props.hasTasks
      ? "TAP TO START"
      : "NOTHING QUEUED";

  const title = props.sessionActive
    ? (props.sessionTaskTitle ?? "")
    : props.hasTasks
      ? (props.nextTaskTitle ?? "")
      : "Add a task";

  const sub = props.sessionActive
    ? props.sessionPaused
      ? "Paused — pick it back up"
      : "Keep going"
    : props.hasTasks
      ? "One task. No excuses."
      : "Tap to line one up";

  return (
    <WidgetShell
      accent={live}
      mark={
        <GlowMark
          active={props.sessionActive || props.hasTasks}
          svg={
            props.sessionActive
              ? flameSvg(live ? WIDGET.green : WIDGET.muted)
              : boltSvg(props.hasTasks ? WIDGET.green : WIDGET.muted)
          }
        />
      }
    >
      <TextWidget
        text={cta}
        style={{
          fontSize: 12,
          fontFamily: "JetBrainsMono-Medium",
          color: props.hasTasks || props.sessionActive ? WIDGET.green : WIDGET.muted,
        }}
      />

      <TextWidget
        text={title}
        maxLines={2}
        style={{
          fontSize: 22,
          fontWeight: "bold",
          fontFamily: "HankenGrotesk-Bold",
          color: props.hasTasks || props.sessionActive ? WIDGET.fg : WIDGET.muted,
          marginTop: 6,
        }}
      />

      <TextWidget
        text={sub}
        maxLines={1}
        style={{
          fontSize: 14,
          fontFamily: "HankenGrotesk",
          color: WIDGET.muted,
          marginTop: 6,
        }}
      />
    </WidgetShell>
  );
}
