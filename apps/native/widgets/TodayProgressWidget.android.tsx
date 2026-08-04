"use no memo";
import { FlexWidget, TextWidget } from "react-native-android-widget";

import { formatDurationShort } from "@/lib/widget-data";

type Props = { completed: number; totalPending: number; streak: number; focusSeconds: number };

export function TodayProgressWidget(props: Props) {
  const total = props.completed + props.totalPending;
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: "#16161A",
        borderRadius: 16,
        padding: 14,
      }}
    >
      <FlexWidget style={{ flexDirection: "column", alignItems: "center" }}>
        <TextWidget
          text={String(props.completed)}
          style={{ fontSize: 20, fontWeight: "bold", fontFamily: "HankenGrotesk-Bold", color: "#34D399" }}
        />
        <TextWidget
          text={`of ${total} done`}
          style={{ fontSize: 11, fontFamily: "HankenGrotesk", color: "#8A8A94", marginTop: 2 }}
        />
      </FlexWidget>
      <FlexWidget style={{ flexDirection: "column", alignItems: "center" }}>
        <TextWidget
          text={String(props.streak)}
          style={{ fontSize: 20, fontWeight: "bold", fontFamily: "HankenGrotesk-Bold", color: "#ECEAE6" }}
        />
        <TextWidget
          text="day streak"
          style={{ fontSize: 11, fontFamily: "HankenGrotesk", color: "#8A8A94", marginTop: 2 }}
        />
      </FlexWidget>
      <FlexWidget style={{ flexDirection: "column", alignItems: "center" }}>
        <TextWidget
          text={formatDurationShort(props.focusSeconds)}
          style={{ fontSize: 16, fontFamily: "JetBrainsMono-Medium", color: "#ECEAE6" }}
        />
        <TextWidget
          text="focused"
          style={{ fontSize: 11, fontFamily: "HankenGrotesk", color: "#8A8A94", marginTop: 2 }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}