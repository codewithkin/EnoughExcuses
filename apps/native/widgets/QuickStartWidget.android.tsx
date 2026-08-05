"use no memo";
import { FlexWidget, SvgWidget, TextWidget } from "react-native-android-widget";

import { GlowMark, WIDGET, Wordmark, boltSvg, flameSvg, playSvg } from "./widget-style";

// Quick Start — a launcher, not a task card. Deliberately shaped differently
// from "Coming up": big centred glow mark, one verb, streak as the reason to
// press it. It doesn't name the task — that's the other widget's job.

type Props = {
  hasTasks: boolean;
  nextTaskTitle?: string;
  sessionActive: boolean;
  sessionPaused: boolean;
  sessionTaskTitle?: string;
  streak?: number;
  pendingCount?: number;
};

// Quick Start — a launcher, not a task card. Deliberately shaped
// differently from "Coming up": a big centred glow mark and a single verb,
// with the streak as the reason to press it. It doesn't name the task
// (that's the other widget's job) — it just gets you moving in one tap.
export function QuickStartWidget(props: Props) {
  const live = props.sessionActive && !props.sessionPaused;
  const streak = props.streak ?? 0;

  const verb = props.sessionActive
    ? props.sessionPaused
      ? "Resume"
      : "Back to it"
    : props.hasTasks
      ? "Start focusing"
      : "Add a task";

  const sub = props.sessionActive
    ? (props.sessionTaskTitle ?? "Session running")
    : props.hasTasks
      ? props.pendingCount && props.pendingCount > 1
        ? `${props.pendingCount} tasks waiting`
        : "1 task waiting"
      : "Nothing queued yet";

  const streakLine =
    streak > 0
      ? `${streak} day${streak === 1 ? "" : "s"} unbroken`
      : "Start your streak today";

  // Always opens the app rather than starting a task outright: the focus tab
  // lands on the goal-grouped chooser when nothing is running, so you pick
  // deliberately instead of risking the wrong task from the home screen.
  // (The "Coming up" widget is the one with a direct start action.)
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      accessibilityLabel={verb}
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: WIDGET.card,
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: 14,
      }}
    >
      <GlowMark
        active={props.hasTasks || props.sessionActive}
        svg={
          props.sessionActive
            ? flameSvg(live ? WIDGET.green : WIDGET.muted)
            : props.hasTasks
              ? playSvg(WIDGET.green)
              : boltSvg(WIDGET.muted)
        }
      />

      <FlexWidget
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          marginLeft: 16,
        }}
      >
        <TextWidget
          text={verb}
          maxLines={1}
          style={{
            fontSize: 22,
            fontWeight: "bold",
            fontFamily: "HankenGrotesk-Bold",
            color: props.hasTasks || props.sessionActive ? WIDGET.fg : WIDGET.muted,
          }}
        />
        <TextWidget
          text={sub}
          maxLines={1}
          style={{
            fontSize: 13,
            fontFamily: "HankenGrotesk",
            color: WIDGET.muted,
            marginTop: 3,
          }}
        />

        <FlexWidget style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
          <SvgWidget
            svg={flameSvg(streak > 0 ? WIDGET.green : WIDGET.muted)}
            style={{ width: 12, height: 12 }}
          />
          <TextWidget
            text={streakLine}
            maxLines={1}
            style={{
              fontSize: 12,
              fontFamily: "JetBrainsMono-Medium",
              color: streak > 0 ? WIDGET.green : WIDGET.muted,
              marginLeft: 6,
            }}
          />
        </FlexWidget>
      </FlexWidget>

      <FlexWidget style={{ flexDirection: "column", justifyContent: "flex-start", height: "match_parent" }}>
        <Wordmark />
      </FlexWidget>
    </FlexWidget>
  );
}
