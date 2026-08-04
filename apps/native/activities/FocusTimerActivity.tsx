import { HStack, Image, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, padding } from "@expo/ui/swift-ui/modifiers";
import { createLiveActivity } from "expo-widgets";

export type FocusTimerActivityProps = {
  taskTitle: string;
  goalTitle?: string;
  remaining: number;
  total: number;
  paused: boolean;
};

function formatClock(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const FocusTimerActivity = (props: FocusTimerActivityProps) => {
  "widget";
  const accent = props.paused ? "#8A8A94" : "#34D399";

  return {
    banner: (
      <HStack modifiers={[padding({ all: 14 })]}>
        <VStack>
          <Text modifiers={[font({ family: "HankenGrotesk-Bold", size: 15 }), foregroundStyle("#ECEAE6")]}>
            {props.taskTitle}
          </Text>
          <Text modifiers={[font({ family: "HankenGrotesk", size: 12 }), foregroundStyle("#8A8A94")]}>
            {props.paused ? "Paused" : (props.goalTitle ?? "Focus")}
          </Text>
        </VStack>
        <Text modifiers={[font({ family: "JetBrainsMono-Medium", size: 20 }), foregroundStyle(accent)]}>
          {formatClock(props.remaining)}
        </Text>
      </HStack>
    ),

    compactLeading: <Image systemName={props.paused ? "pause.circle.fill" : "timer"} color={accent} />,
    compactTrailing: (
      <Text modifiers={[font({ family: "JetBrainsMono-Medium", size: 13 }), foregroundStyle(accent)]}>
        {formatClock(props.remaining)}
      </Text>
    ),

    minimal: <Image systemName={props.paused ? "pause.circle.fill" : "timer"} color={accent} />,

    expandedLeading: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Image systemName={props.paused ? "pause.circle.fill" : "timer"} color={accent} />
        <Text modifiers={[font({ family: "HankenGrotesk", size: 12 }), foregroundStyle("#8A8A94")]}>
          {props.paused ? "Paused" : "Focus"}
        </Text>
      </VStack>
    ),
    expandedTrailing: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ family: "HankenGrotesk-Bold", size: 22 }), foregroundStyle(accent)]}>
          {formatClock(props.remaining)}
        </Text>
        <Text modifiers={[font({ family: "HankenGrotesk", size: 11 }), foregroundStyle("#8A8A94")]}>
          remaining
        </Text>
      </VStack>
    ),
    expandedBottom: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ family: "HankenGrotesk-Bold", size: 14 }), foregroundStyle("#ECEAE6")]}>
          {props.taskTitle}
        </Text>
        {props.goalTitle ? (
          <Text modifiers={[font({ family: "HankenGrotesk", size: 11 }), foregroundStyle("#8A8A94")]}>
            {props.goalTitle}
          </Text>
        ) : null}
      </VStack>
    ),
  };
};

export default createLiveActivity<FocusTimerActivityProps>("FocusTimerActivity", FocusTimerActivity);
