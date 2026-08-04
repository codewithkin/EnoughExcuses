"use no memo";
import { FlexWidget, TextWidget } from "react-native-android-widget";

type Props = {
  title: string;
  durationMin?: number;
  goalTitle?: string;
  sessionActive: boolean;
  sessionPaused: boolean;
  remaining?: number;
};

function formatClock(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function NextTaskWidget(props: Props) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#16161A",
        borderRadius: 16,
        padding: 14,
      }}
    >
      <TextWidget
        text={props.sessionActive ? (props.sessionPaused ? "Paused" : "Focusing") : "Next task"}
        style={{ fontSize: 11, fontFamily: "JetBrainsMono-Medium", color: "#8A8A94" }}
      />
      <TextWidget
        text={props.title}
        style={{
          fontSize: 15,
          fontWeight: "bold",
          fontFamily: "HankenGrotesk-Bold",
          color: props.sessionActive ? "#34D399" : "#ECEAE6",
          marginTop: 4,
        }}
      />
      <FlexWidget style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
        {props.sessionActive && props.remaining !== undefined ? (
          <TextWidget
            text={formatClock(props.remaining)}
            style={{ fontSize: 13, fontFamily: "JetBrainsMono-Medium", color: "#34D399" }}
          />
        ) : props.durationMin ? (
          <TextWidget
            text={`${props.durationMin}m`}
            style={{ fontSize: 12, fontFamily: "JetBrainsMono-Medium", color: "#34D399" }}
          />
        ) : null}
        {props.goalTitle ? (
          <TextWidget
            text={` · ${props.goalTitle}`}
            style={{ fontSize: 11, fontFamily: "HankenGrotesk", color: "#8A8A94" }}
          />
        ) : null}
      </FlexWidget>
    </FlexWidget>
  );
}