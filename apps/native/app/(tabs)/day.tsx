import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import { DaySummaryStats, DayTimeline } from "@/components/day-summary";
import { Hint } from "@/components/hint";
import { Screen, ScreenHeader } from "@/components/screen";
import { Body, Label } from "@/components/typography";
import { formatDateLabel } from "@/lib/date";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

export default function Day() {
  const router = useRouter();

  return (
    <Screen>
      <ScreenHeader
        title="Today's summary"
        subtitle="No sugarcoating. Here's how today went."
        right={<Label style={{ marginTop: 8 }}>{formatDateLabel()}</Label>}
      />

      <View style={{ marginTop: 20 }}>
        <DaySummaryStats />
      </View>

      <Pressable
        onPress={() => router.push("/share")}
        style={({ pressed }) => ({
          marginTop: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          borderRadius: RADIUS.pill,
          backgroundColor: COLORS.coral,
          paddingVertical: 16,
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <Ionicons name="share-outline" size={18} color={COLORS.ink} />
        <Body style={{ fontFamily: FONTS.sansSemibold }} color={COLORS.ink}>
          Share today
        </Body>
      </Pressable>

      <View style={{ marginTop: 18 }}>
        <Hint id="day.share">Hit Share to turn today into a clean card for your story.</Hint>
      </View>

      <View style={{ marginTop: 24 }}>
        <DayTimeline />
      </View>
    </Screen>
  );
}
