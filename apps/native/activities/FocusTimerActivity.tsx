import { HStack, Image, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, padding } from "@expo/ui/swift-ui/modifiers";
import { createLiveActivity } from "expo-widgets";

export type FocusTimerActivityProps = {
  taskTitle: string;
  goalTitle?: string;
  paused: boolean;
};

const GREEN = "#34D399";
const MUTED = "#8A8A94";
const FG = "#ECEAE6";

const FocusTimerActivity = (props: FocusTimerActivityProps) => {
  "widget";
  const accent = props.paused ? MUTED : GREEN;
  const status = props.paused ? "Paused" : "Focusing";

  return {
    banner: (
      <HStack modifiers={[padding({ all: 14 })]}>
        <VStack>
          <Text
            modifiers={[font({ family: "JetBrainsMono-Medium", size: 11 }), foregroundStyle(accent)]}
          >
            {status.toUpperCase()}
          </Text>
          <Text
            modifiers={[font({ family: "HankenGrotesk-Bold", size: 17 }), foregroundStyle(FG)]}
          >
            {props.taskTitle}
          </Text>
          {props.goalTitle ? (
            <Text
              modifiers={[font({ family: "HankenGrotesk", size: 12 }), foregroundStyle(MUTED)]}
            >
              {props.goalTitle}
            </Text>
          ) : null}
        </VStack>
        <Spacer />
        <Image systemName={props.paused ? "pause.circle.fill" : "flame.fill"} color={accent} />
      </HStack>
    ),

    compactLeading: (
      <Image systemName={props.paused ? "pause.circle.fill" : "flame.fill"} color={accent} />
    ),
    compactTrailing: (
      <Text modifiers={[font({ family: "HankenGrotesk-Medium", size: 13 }), foregroundStyle(accent)]}>
        {props.taskTitle}
      </Text>
    ),

    minimal: <Image systemName={props.paused ? "pause.circle.fill" : "flame.fill"} color={accent} />,

    expandedLeading: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Image systemName={props.paused ? "pause.circle.fill" : "flame.fill"} color={accent} />
        <Text modifiers={[font({ family: "HankenGrotesk", size: 12 }), foregroundStyle(MUTED)]}>
          {status}
        </Text>
      </VStack>
    ),
    expandedTrailing: (
      <VStack modifiers={[padding({ all: 12 })]}>
        {props.goalTitle ? (
          <Text modifiers={[font({ family: "HankenGrotesk", size: 12 }), foregroundStyle(MUTED)]}>
            {props.goalTitle}
          </Text>
        ) : null}
      </VStack>
    ),
    expandedBottom: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ family: "HankenGrotesk-Bold", size: 18 }), foregroundStyle(FG)]}>
          {props.taskTitle}
        </Text>
      </VStack>
    ),
  };
};

export default createLiveActivity<FocusTimerActivityProps>("FocusTimerActivity", FocusTimerActivity);
