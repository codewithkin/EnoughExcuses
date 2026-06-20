import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";

import { COLORS, FONTS, RADIUS } from "@/lib/theme";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  haptic?: boolean;
};

export function PrimaryButton({ label, onPress, disabled, haptic = true }: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={({ pressed }) => ({
        backgroundColor: disabled ? "#3A2418" : COLORS.coral,
        borderRadius: RADIUS.pill,
        opacity: pressed ? 0.9 : 1,
        overflow: "hidden",
      })}
    >
      {!disabled ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "55%",
            backgroundColor: COLORS.coralBright,
            opacity: 0.45,
          }}
        />
      ) : null}
      <Text
        style={{
          color: disabled ? "#7A5238" : COLORS.ink,
          fontFamily: FONTS.sansSemibold,
          fontSize: 16,
          textAlign: "center",
          paddingVertical: 16,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function GhostButton({ label, onPress, disabled, haptic = false }: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => ({
        borderRadius: RADIUS.pill,
        borderWidth: 1,
        borderColor: COLORS.line,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text
        style={{
          color: COLORS.subtle,
          fontFamily: FONTS.sansMedium,
          fontSize: 16,
          textAlign: "center",
          paddingVertical: 16,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
