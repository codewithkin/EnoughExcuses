"use no memo";
import { FlexWidget, SvgWidget, TextWidget } from "react-native-android-widget";

import { WIDGET, Wordmark, checkSvg, playSvg } from "./widget-style";

type Props = {
  /** Deep link that starts this task; omitted when there's nothing to start. */
  startUri?: string;
  title: string;
  durationMin?: number;
  goalTitle?: string;
  goalCount?: number;
  sessionActive: boolean;
  sessionPaused: boolean;
  /** @deprecated countdown removed from widgets */
  remaining?: number;
};

// "Coming up" — a task card. Distinct from Quick Start in both job and
// shape: this one names the specific next task in the queue, gives it
// context (duration, goal, how many other goals have work waiting), and
// carries a real Start button that deep links straight into that task.
export function NextTaskWidget(props: Props) {
  const hasTask = !!props.title && props.title !== "All done!";
  const startUri = props.startUri;

  // When a session is already running this widget has nothing to queue up,
  // so it reports the running task instead of pretending to be a starter.
  const heading = props.sessionActive
    ? props.sessionPaused
      ? "PAUSED"
      : "IN PROGRESS"
    : "COMING UP";

  const context = !hasTask
    ? "Your queue is clear"
    : [
        props.durationMin ? `${props.durationMin} min` : null,
        props.goalTitle,
        props.goalCount && props.goalCount > 1 ? `+${props.goalCount - 1} more goals` : null,
      ]
        .filter(Boolean)
        .join("  ·  ");

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "column",
        backgroundColor: WIDGET.card,
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: 14,
      }}
    >
      <FlexWidget style={{ flexDirection: "row", alignItems: "center", width: "match_parent" }}>
        <TextWidget
          text={heading}
          style={{
            fontSize: 11,
            fontFamily: "JetBrainsMono-Medium",
            color: props.sessionActive ? WIDGET.green : WIDGET.muted,
          }}
        />
        <FlexWidget style={{ flex: 1 }} />
        <Wordmark />
      </FlexWidget>

      <TextWidget
        text={hasTask ? props.title : "Nothing queued"}
        maxLines={2}
        style={{
          fontSize: 21,
          fontWeight: "bold",
          fontFamily: "HankenGrotesk-Bold",
          color: hasTask ? WIDGET.fg : WIDGET.muted,
          marginTop: 8,
        }}
      />

      <TextWidget
        text={context}
        maxLines={1}
        style={{
          fontSize: 13,
          fontFamily: "HankenGrotesk",
          color: WIDGET.muted,
          marginTop: 4,
        }}
      />

      <FlexWidget style={{ flex: 1 }} />

      {hasTask && !props.sessionActive && startUri ? (
        <FlexWidget
          clickAction="OPEN_URI"
          clickActionData={{ uri: startUri }}
          accessibilityLabel={`Start ${props.title}`}
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",
            backgroundColor: WIDGET.green,
            borderRadius: 999,
            paddingHorizontal: 16,
            paddingVertical: 9,
            marginTop: 10,
          }}
        >
          <SvgWidget svg={playSvg(WIDGET.ink)} style={{ width: 13, height: 13 }} />
          <TextWidget
            text="Start this task"
            style={{
              fontSize: 13,
              fontWeight: "bold",
              fontFamily: "HankenGrotesk-Bold",
              color: WIDGET.ink,
              marginLeft: 7,
            }}
          />
        </FlexWidget>
      ) : !hasTask ? (
        <FlexWidget
          style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
        >
          <SvgWidget svg={checkSvg(WIDGET.green)} style={{ width: 14, height: 14 }} />
          <TextWidget
            text="All clear — tap to add one"
            style={{
              fontSize: 13,
              fontFamily: "HankenGrotesk",
              color: WIDGET.green,
              marginLeft: 7,
            }}
          />
        </FlexWidget>
      ) : null}
    </FlexWidget>
  );
}
