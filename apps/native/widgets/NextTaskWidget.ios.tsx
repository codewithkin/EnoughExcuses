import { HStack, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { createWidget } from "expo-widgets";

type Props = {
  title: string;
  durationMin?: number;
  goalTitle?: string;
  sessionActive: boolean;
  sessionPaused: boolean;
  remaining?: number;
};

const NextTaskWidget = (props: Props) => {
  "widget";
  return (
    <VStack>
      <Spacer />
      <Text modifiers={[font({ name: "JetBrainsMono-Medium", size: 11 }), foregroundStyle("#8A8A94")]}>
        {props.sessionActive ? (props.sessionPaused ? "Paused" : "Focusing") : "Next task"}
      </Text>
      <Spacer size={4} />
      <Text
        modifiers={[
          font({ name: "HankenGrotesk-Bold", size: 15 }),
          foregroundStyle(props.sessionActive ? "#34D399" : "#ECEAE6"),
        ]}
      >
        {props.title}
      </Text>
      <Spacer size={2} />
      <HStack>
        {props.sessionActive && props.remaining !== undefined ? (
          <Text modifiers={[font({ name: "JetBrainsMono-Medium", size: 13 }), foregroundStyle("#34D399")]}>
            {formatClock(props.remaining)}
          </Text>
        ) : props.durationMin ? (
          <Text modifiers={[font({ name: "JetBrainsMono-Medium", size: 12 }), foregroundStyle("#34D399")]}>
            {props.durationMin}m
          </Text>
        ) : null}
        {props.goalTitle ? (
          <Text modifiers={[font({ name: "HankenGrotesk", size: 11 }), foregroundStyle("#8A8A94")]}>
            · {props.goalTitle}
          </Text>
        ) : null}
      </HStack>
      <Spacer />
    </VStack>
  );
};

function formatClock(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default createWidget("NextTaskWidget", NextTaskWidget);