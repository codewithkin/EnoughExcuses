import { HStack, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { createWidget } from "expo-widgets";

import { formatDurationShort } from "@/lib/widget-data";

type Props = { completed: number; totalPending: number; streak: number; focusSeconds: number };

const TodayProgressWidget = (props: Props) => {
  "widget";
  const total = props.completed + props.totalPending;
  return (
    <VStack>
      <Spacer />
      <Text modifiers={[font({ family: "JetBrainsMono-Medium", size: 11 }), foregroundStyle("#8A8A94")]}>
        Today
      </Text>
      <Spacer />
      <HStack>
        <VStack>
          <Text modifiers={[font({ family: "HankenGrotesk-Bold", size: 20 }), foregroundStyle("#34D399")]}>
            {props.completed}
          </Text>
          <Text modifiers={[font({ family: "HankenGrotesk", size: 11 }), foregroundStyle("#8A8A94")]}>
            of {total} done
          </Text>
        </VStack>
        <Spacer />
        <VStack>
          <Text modifiers={[font({ family: "HankenGrotesk-Bold", size: 20 }), foregroundStyle("#ECEAE6")]}>
            {props.streak}
          </Text>
          <Text modifiers={[font({ family: "HankenGrotesk", size: 11 }), foregroundStyle("#8A8A94")]}>
            day streak
          </Text>
        </VStack>
        <Spacer />
        <VStack>
          <Text modifiers={[font({ family: "JetBrainsMono-Medium", size: 16 }), foregroundStyle("#ECEAE6")]}>
            {formatDurationShort(props.focusSeconds)}
          </Text>
          <Text modifiers={[font({ family: "HankenGrotesk", size: 11 }), foregroundStyle("#8A8A94")]}>
            focused
          </Text>
        </VStack>
      </HStack>
      <Spacer />
    </VStack>
  );
};

export default createWidget("TodayProgressWidget", TodayProgressWidget);