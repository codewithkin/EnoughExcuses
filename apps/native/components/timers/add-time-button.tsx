import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { PressableScale } from "@/components/pressable-scale";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

type Props = {
  minutes: number;
  onPress: () => void;
};

export function AddTimeButton({ minutes, onPress }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.93}
      hitSlop={6}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        borderRadius: RADIUS.pill,
        borderWidth: 1,
        borderColor: COLORS.line,
        paddingHorizontal: 14,
        paddingVertical: 9,
      }}
    >
      <Ionicons name="add-circle-outline" size={14} color={COLORS.subtle} />
      <Text
        style={{
          fontFamily: FONTS.sansMedium,
          fontSize: 13,
          color: COLORS.subtle,
        }}
      >
        +{minutes}m
      </Text>
    </PressableScale>
  );
}