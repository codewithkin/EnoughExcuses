import { Pressable, Text, View } from "react-native";

import { PrimaryButton } from "@/components/buttons";
import { BodyMuted, Caption, Label, Title } from "@/components/typography";
import { formatClock } from "@/lib/date";
import { COLORS, FONTS } from "@/lib/theme";
import { type TimerVariantProps } from "./types";

export function NumeralsTimer({
  taskTitle,
  remaining,
  total,
  elapsed,
  index,
  count,
  timeUp,
  onDone,
  onSkip,
}: TimerVariantProps) {
  const pct = total > 0 ? Math.max(0, Math.min(1, elapsed / total)) : 0;
  const blockMin = Math.round(total / 60);

  return (
    <View style={{ flex: 1, paddingHorizontal: 28 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 16 }}>
        <Label>Focus</Label>
        <Caption style={{ fontFamily: "JetBrainsMono_500Medium", letterSpacing: 1 }}>
          {index} of {count}
        </Caption>
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Title style={{ fontSize: 20, lineHeight: 24, textAlign: "center" }}>{taskTitle}</Title>

        <Text
          style={{
            fontFamily: FONTS.sansBold,
            fontSize: 80,
            lineHeight: 88,
            letterSpacing: -2,
            marginTop: 18,
            color: timeUp ? COLORS.coral : COLORS.fg,
          }}
        >
          {formatClock(remaining)}
        </Text>

        <View
          style={{
            width: 168,
            height: 2,
            borderRadius: 1,
            backgroundColor: COLORS.elevated,
            marginTop: 14,
            overflow: "hidden",
          }}
        >
          <View style={{ width: `${pct * 100}%`, height: "100%", backgroundColor: COLORS.coral }} />
        </View>

        <Label style={{ marginTop: 16, color: COLORS.subtle, letterSpacing: 1.5 }}>
          {blockMin} min focus · {formatClock(elapsed)} in
        </Label>
      </View>

      <View style={{ gap: 8, paddingBottom: 12 }}>
        <PrimaryButton label="Done" onPress={onDone} haptic={false} />
        <Pressable onPress={onSkip} style={{ alignItems: "center", paddingVertical: 12 }}>
          <BodyMuted style={{ fontSize: 15 }}>Skip</BodyMuted>
        </Pressable>
      </View>
    </View>
  );
}
