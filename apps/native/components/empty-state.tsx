import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { PrimaryButton } from "@/components/buttons";
import { BodyMuted, Title } from "@/components/typography";
import { COLORS } from "@/lib/theme";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
};

export function EmptyState({ icon, title, message, actionLabel, onAction, compact }: Props) {
  return (
    <Animated.View
      entering={FadeIn.duration(280)}
      style={{ alignItems: "center", paddingVertical: compact ? 28 : 56, paddingHorizontal: 24 }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: COLORS.card,
          borderWidth: 1,
          borderColor: COLORS.line,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={28} color={COLORS.subtle} />
      </View>
      <Title style={{ marginTop: 18, textAlign: "center", fontSize: 22 }}>{title}</Title>
      <BodyMuted style={{ marginTop: 8, textAlign: "center", maxWidth: 280 }}>{message}</BodyMuted>
      {actionLabel && onAction ? (
        <View style={{ marginTop: 22, alignSelf: "stretch", maxWidth: 320 }}>
          <PrimaryButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </Animated.View>
  );
}
