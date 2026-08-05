import { HStack, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { createWidget } from "expo-widgets";

type Props = {
  title: string;
  durationMin?: number;
  goalTitle?: string;
  sessionActive: boolean;
  sessionPaused: boolean;
  /** @deprecated countdown removed from widgets */
  remaining?: number;
};

const GREEN = "#34D399";
const MUTED = "#8A8A94";
const FG = "#ECEAE6";

// No countdown by design: home screen widgets refresh on the system's
// schedule (minutes apart), so a ticking clock would show stale time.
const NextTaskWidget = (props: Props) => {
  "widget";
  const hasTask = !!props.title && props.title !== "All done!";
  const status = props.sessionActive
    ? props.sessionPaused
      ? "PAUSED"
      : "FOCUSING"
    : hasTask
      ? "NEXT TASK"
      : "ALL CLEAR";

  return (
    <VStack>
      <Spacer />
      <Text
        modifiers={[
          font({ family: "JetBrainsMono-Medium", size: 11 }),
          foregroundStyle(props.sessionActive ? GREEN : MUTED),
        ]}
      >
        {status}
      </Text>
      <Text
        modifiers={[
          font({ family: "HankenGrotesk-Bold", size: 18 }),
          foregroundStyle(hasTask ? FG : MUTED),
        ]}
      >
        {hasTask ? props.title : "Nothing queued"}
      </Text>
      <HStack>
        <Text
          modifiers={[
            font({ family: "HankenGrotesk", size: 12 }),
            foregroundStyle(hasTask ? GREEN : MUTED),
          ]}
        >
          {hasTask
            ? [props.durationMin ? `${props.durationMin} min` : null, props.goalTitle]
                .filter(Boolean)
                .join("  ·  ")
            : "Tap to add one"}
        </Text>
      </HStack>
      <Spacer />
    </VStack>
  );
};

export default createWidget("NextTaskWidget", NextTaskWidget);
