import { Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { createWidget } from "expo-widgets";

type Props = {
  hasTasks: boolean;
  nextTaskTitle?: string;
  sessionActive: boolean;
  sessionPaused: boolean;
  sessionTaskTitle?: string;
};

const QuickStartWidget = (props: Props) => {
  "widget";
  return (
    <VStack>
      <Spacer />
      {props.sessionActive ? (
        <>
          <Text modifiers={[font({ name: "HankenGrotesk-Medium", size: 13 }), foregroundStyle("#34D399")]}>
            Tap to resume
          </Text>
          <Spacer size={4} />
          <Text
            modifiers={[
              font({ name: "HankenGrotesk-Bold", size: 14 }),
              foregroundStyle(props.sessionPaused ? "#8A8A94" : "#ECEAE6"),
            ]}
          >
            {props.sessionPaused ? "Paused · " : ""}
            {props.sessionTaskTitle}
          </Text>
        </>
      ) : props.hasTasks ? (
        <>
          <Text modifiers={[font({ name: "HankenGrotesk-Medium", size: 13 }), foregroundStyle("#34D399")]}>
            Tap to start
          </Text>
          <Spacer size={4} />
          <Text modifiers={[font({ name: "HankenGrotesk-Bold", size: 14 }), foregroundStyle("#ECEAE6")]}>
            {props.nextTaskTitle}
          </Text>
        </>
      ) : (
        <Text modifiers={[font({ name: "HankenGrotesk", size: 13 }), foregroundStyle("#8A8A94")]}>
          No tasks — tap to add one
        </Text>
      )}
      <Spacer />
    </VStack>
  );
};

export default createWidget("QuickStartWidget", QuickStartWidget);