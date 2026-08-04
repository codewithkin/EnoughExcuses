"use no memo";
import { FlexWidget, TextWidget } from "react-native-android-widget";

type Props = {
  hasTasks: boolean;
  nextTaskTitle?: string;
  sessionActive: boolean;
  sessionPaused: boolean;
  sessionTaskTitle?: string;
};

export function QuickStartWidget(props: Props) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#16161A",
        borderRadius: 16,
        padding: 14,
      }}
    >
      {props.sessionActive ? (
        <>
          <TextWidget
            text="Tap to resume"
            style={{ fontSize: 13, fontFamily: "HankenGrotesk-Medium", color: "#34D399" }}
          />
          <TextWidget
            text={props.sessionPaused ? `Paused · ${props.sessionTaskTitle ?? ""}` : props.sessionTaskTitle ?? ""}
            style={{
              fontSize: 14,
              fontWeight: "bold",
              fontFamily: "HankenGrotesk-Bold",
              color: props.sessionPaused ? "#8A8A94" : "#ECEAE6",
              marginTop: 4,
            }}
          />
        </>
      ) : props.hasTasks ? (
        <>
          <TextWidget
            text="Tap to start"
            style={{ fontSize: 13, fontFamily: "HankenGrotesk-Medium", color: "#34D399" }}
          />
          <TextWidget
            text={props.nextTaskTitle ?? ""}
            style={{
              fontSize: 14,
              fontWeight: "bold",
              fontFamily: "HankenGrotesk-Bold",
              color: "#ECEAE6",
              marginTop: 4,
            }}
          />
        </>
      ) : (
        <TextWidget
          text="No tasks — tap to add one"
          style={{ fontSize: 13, fontFamily: "HankenGrotesk", color: "#8A8A94" }}
        />
      )}
    </FlexWidget>
  );
}