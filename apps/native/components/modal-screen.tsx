import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Label } from "@/components/typography";
import { COLORS } from "@/lib/theme";

type Props = {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
};

export function ModalScreen({ children, title, onClose }: Props) {
  const router = useRouter();
  const close = onClose ?? (() => router.back());

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 4,
        }}
      >
        <Pressable
          onPress={close}
          hitSlop={12}
          style={{
            position: "absolute",
            left: 20,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: COLORS.elevated,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="close" size={18} color={COLORS.fg} />
        </Pressable>
        {title ? <Label color={COLORS.subtle}>{title}</Label> : null}
      </View>

      <Animated.View entering={FadeIn.duration(260)} style={{ flex: 1 }}>
        {children}
      </Animated.View>
    </SafeAreaView>
  );
}
