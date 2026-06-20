import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Share, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Body, BodyMuted, Caption, Display, Label, Title } from "@/components/typography";
import { formatDuration, isToday } from "@/lib/date";
import { useApp } from "@/lib/store";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

export default function Day() {
  const { state, today } = useApp();
  const streak = state.stats.streak;

  const todayTasks = state.tasks.filter(
    (t) => isToday(t.completedAt) && (t.status === "done" || t.status === "skipped"),
  );

  async function onShare() {
    const message = `Today on LockedIn\nCompleted: ${today.completed}\nSkipped: ${today.skipped}\nFocus: ${formatDuration(today.focusSeconds)}\nStreak: ${streak} day${streak === 1 ? "" : "s"}`;
    try {
      await Share.share({ message });
    } catch {
      // dismissed
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        <Title>Today&apos;s summary</Title>
        <BodyMuted style={{ marginTop: 4 }}>An honest mirror of the day.</BodyMuted>

        <View style={streakCard}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Ionicons name="flame" size={28} color={COLORS.coral} />
            <View>
              <Display style={{ fontSize: 30, lineHeight: 32 }} color={COLORS.coral}>
                {streak} day{streak === 1 ? "" : "s"}
              </Display>
              <Label style={{ marginTop: 2 }}>
                Streak · {today.completed > 0 ? "still alive" : "at risk"}
              </Label>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
          <Stat label="Done" value={String(today.completed)} />
          <Stat label="Skipped" value={String(today.skipped)} />
          <Stat label="Focused" value={formatDuration(today.focusSeconds)} />
        </View>

        <Pressable onPress={onShare} style={shareBtn}>
          <Ionicons name="share-outline" size={18} color={COLORS.ink} />
          <Body style={{ fontFamily: FONTS.sansSemibold }} color={COLORS.ink}>
            Share today
          </Body>
        </Pressable>

        <Label style={{ marginTop: 32, marginBottom: 10 }}>Timeline</Label>
        {todayTasks.length === 0 ? (
          <BodyMuted>Nothing logged yet today.</BodyMuted>
        ) : (
          <View style={{ gap: 8 }}>
            {todayTasks.map((t) => {
              const done = t.status === "done";
              return (
                <View key={t.id} style={row}>
                  <Ionicons
                    name={done ? "checkmark-circle" : "close-circle-outline"}
                    size={20}
                    color={done ? COLORS.coral : COLORS.subtle}
                  />
                  <Body style={{ marginLeft: 12, flex: 1, fontSize: 15 }}>{t.title}</Body>
                  <Caption>{done ? `${t.durationMin}m` : "skip"}</Caption>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={statCard}>
      <Title style={{ fontSize: 26, lineHeight: 30 }}>{value}</Title>
      <Label style={{ marginTop: 4, color: COLORS.subtle }}>{label}</Label>
    </View>
  );
}

const streakCard = {
  marginTop: 20,
  borderRadius: RADIUS.x2,
  borderWidth: 1,
  borderColor: COLORS.coralDeep,
  backgroundColor: "rgba(255,107,74,0.07)",
  padding: 20,
} as const;

const statCard = {
  flex: 1,
  borderRadius: RADIUS.xl,
  borderWidth: 1,
  borderColor: COLORS.line,
  backgroundColor: COLORS.card,
  padding: 16,
} as const;

const shareBtn = {
  marginTop: 14,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  borderRadius: RADIUS.pill,
  backgroundColor: COLORS.coral,
  paddingVertical: 16,
} as const;

const row = {
  flexDirection: "row",
  alignItems: "center",
  borderRadius: RADIUS.lg,
  borderWidth: 1,
  borderColor: COLORS.line,
  padding: 16,
} as const;
