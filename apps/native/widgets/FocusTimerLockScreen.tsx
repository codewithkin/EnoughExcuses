import { Image, VStack } from "@expo/ui/swift-ui";
import { createWidget } from "expo-widgets";

type Props = {
  active: boolean;
  paused: boolean;
};

// Lock Screen circular accessory. Carries no countdown by design — accessory
// widgets refresh on the system's schedule (minutes apart), so a clock here
// would read stale. It's a glanceable "session running / not running" mark.
const FocusTimerLockScreen = (props: Props) => {
  "widget";
  const accent = props.active ? (props.paused ? "#8A8A94" : "#34D399") : "#8A8A94";

  return (
    <VStack>
      <Image
        systemName={props.active ? (props.paused ? "pause.circle.fill" : "flame.fill") : "flame"}
        color={accent}
      />
    </VStack>
  );
};

export default createWidget("FocusTimerLockScreen", FocusTimerLockScreen);
