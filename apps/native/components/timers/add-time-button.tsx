import { Text, View } from "react-native";

import { PressableScale } from "@/components/pressable-scale";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

type Props = {
  minutes: number;
  onPress: () => void;
};

// Matches PrimaryButton's treatment — green fill with a lighter top-half
// sheen and a soft glow — so adding time reads as an equally real action
// rather than a muted afterthought. Stays pill-sized; only the colour
// weight changes. The "+" in the label already says "add", so no icon.
export function AddTimeButton({ minutes, onPress }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.93}
      hitSlop={6}
      style={{
        borderRadius: RADIUS.pill,
        backgroundColor: COLORS.green,
        overflow: "hidden",
        shadowColor: COLORS.green,
        shadowOpacity: 0.45,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
        elevation: 6,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "55%",
          backgroundColor: COLORS.greenBright,
          opacity: 0.45,
        }}
      />
      <Text
        style={{
          fontFamily: FONTS.sansSemibold,
          fontSize: 13,
          color: COLORS.ink,
          paddingHorizontal: 16,
          paddingVertical: 9,
        }}
      >
        +{minutes}m
      </Text>
    </PressableScale>
  );
}
