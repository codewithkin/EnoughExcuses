"use no memo";
import { FlexWidget, TextWidget } from "react-native-android-widget";

import { formatDurationShort } from "@/lib/widget-data";

import { GlowMark, WIDGET, WidgetShell, Wordmark, flameSvg } from "./widget-style";

type Props = { completed: number; totalPending: number; streak: number; focusSeconds: number };

function Stat({
  value,
  label,
  highlight = false,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <FlexWidget style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
      <TextWidget
        text={value}
        maxLines={1}
        style={{
          fontSize: 26,
          fontWeight: "bold",
          fontFamily: "HankenGrotesk-Bold",
          color: highlight ? WIDGET.green : WIDGET.fg,
        }}
      />
      <TextWidget
        text={label}
        maxLines={1}
        style={{
          fontSize: 13,
          fontFamily: "HankenGrotesk",
          color: WIDGET.muted,
          marginTop: 2,
        }}
      />
    </FlexWidget>
  );
}

export function TodayProgressWidget(props: Props) {
  const total = props.completed + props.totalPending;
  const allDone = total > 0 && props.totalPending === 0;
  const nothingYet = total === 0;

  return (
    <WidgetShell
      accent={props.completed > 0}
      mark={
        <GlowMark
          active={props.streak > 0}
          svg={flameSvg(props.streak > 0 ? WIDGET.green : WIDGET.muted)}
        />
      }
    >
      <FlexWidget style={{ flexDirection: "row", alignItems: "center", width: "match_parent" }}>
        <TextWidget
          text={nothingYet ? "NO TASKS YET" : allDone ? "TODAY · DONE" : "TODAY"}
          style={{
            fontSize: 12,
            fontFamily: "JetBrainsMono-Medium",
            color: allDone ? WIDGET.green : WIDGET.muted,
          }}
        />
        <FlexWidget style={{ flex: 1 }} />
        <Wordmark />
      </FlexWidget>

      {nothingYet ? (
        <TextWidget
          text="Add a task to get going"
          maxLines={2}
          style={{
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "HankenGrotesk-Bold",
            color: WIDGET.muted,
            marginTop: 8,
          }}
        />
      ) : (
        <FlexWidget style={{ flexDirection: "row", width: "match_parent", marginTop: 10 }}>
          <Stat
            value={`${props.completed}/${total}`}
            label={props.completed === 1 ? "task done" : "tasks done"}
            highlight
          />
          <Stat
            value={String(props.streak)}
            label={props.streak === 1 ? "day streak" : "day streak"}
          />
          <Stat value={formatDurationShort(props.focusSeconds)} label="focused" />
        </FlexWidget>
      )}
    </WidgetShell>
  );
}
