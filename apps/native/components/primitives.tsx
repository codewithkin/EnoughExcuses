import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, type ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Body, Label } from "@/components/typography";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          borderRadius: RADIUS.x2,
          borderWidth: 1,
          borderColor: COLORS.line,
          backgroundColor: COLORS.card,
          padding: 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SectionLabel({ children, style }: { children: string; style?: ViewStyle }) {
  return <Label style={[{ marginBottom: 10 }, style]}>{children}</Label>;
}

export function AddRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: RADIUS.x2,
        borderWidth: 1,
        borderColor: COLORS.line,
        borderStyle: "dashed",
        paddingVertical: 16,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Ionicons name="add" size={18} color={COLORS.subtle} />
      <Body style={{ fontFamily: FONTS.sansMedium }} color={COLORS.subtle}>
        {label}
      </Body>
    </Pressable>
  );
}

export function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.min(1, value / total) : 0;
  return (
    <View
      style={{
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.elevated,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${pct * 100}%`,
          height: "100%",
          borderRadius: 3,
          backgroundColor: COLORS.coral,
        }}
      />
    </View>
  );
}

export function AnimatedRow({ index = 0, children }: { index?: number; children: React.ReactNode }) {
  return (
    <Animated.View entering={FadeInDown.duration(260).delay(index * 55)}>{children}</Animated.View>
  );
}
