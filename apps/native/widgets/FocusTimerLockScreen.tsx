import { Text, VStack, ZStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { createWidget } from "expo-widgets";

type Props = {
  active: boolean;
  paused: boolean;
  remaining: number;
  total: number;
};

function formatClock(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const FocusTimerLockScreen = (props: Props) => {
  "widget";
  const accent = props.paused ? "#8A8A94" : "#34D399";

  return (
    <ZStack>
      <VStack>
        {props.active ? (
          <Text modifiers={[font({ family: "JetBrainsMono-Medium", size: 13 }), foregroundStyle(accent)]}>
            {formatClock(props.remaining)}
          </Text>
        ) : (
          <Text modifiers={[font({ family: "HankenGrotesk-Bold", size: 12 }), foregroundStyle("#8A8A94")]}>
            —
          </Text>
        )}
      </VStack>
    </ZStack>
  );
};

export default createWidget("FocusTimerLockScreen", FocusTimerLockScreen);
