import { Ionicons } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Body, BodyMuted, Caption, Label, Timer, Title } from "@/components/typography";
import { formatDuration } from "@/lib/date";
import { useApp } from "@/lib/store";
import { COLORS, RADIUS } from "@/lib/theme";

export default function Streak() {
  const { state } = useApp();
  const { streak, totalFocusSeconds, tasksCompleted, tasksSkipped } = state.stats;
  const history = state.history;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        <Title>Streak</Title>

        <View style={{ alignItems: "center", paddingVertical: 36 }}>
          <Ionicons name="flame" size={44} color={COLORS.coral} />
          <Timer style={{ marginTop: 8 }} color={COLORS.coral}>
            {streak}
          </Timer>
          <BodyMuted>day{streak === 1 ? "" : "s"} locked in</BodyMuted>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <MiniStat label="Tasks done" value={String(tasksCompleted)} />
          <MiniStat label="Skipped" value={String(tasksSkipped)} />
          <MiniStat label="Focus" value={formatDuration(totalFocusSeconds)} />
        </View>

        <Label style={{ marginTop: 32, marginBottom: 10 }}>History</Label>
        {history.length === 0 ? (
          <BodyMuted>No history yet. Complete a task to begin.</BodyMuted>
        ) : (
          <View style={{ gap: 8 }}>
            {history.map((h) => {
              const kept = h.completed > 0;
              return (
                <View key={h.date} style={row}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginRight: 12,
                      backgroundColor: kept ? COLORS.coral : "#2a2a30",
                    }}
                  />
                  <Body style={{ flex: 1, fontSize: 15 }}>{h.date}</Body>
                  <Caption>
                    {h.completed} done · {formatDuration(h.focusSeconds)}
                  </Caption>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={card}>
      <Title style={{ fontSize: 22, lineHeight: 26 }}>{value}</Title>
      <Caption style={{ marginTop: 4 }}>{label}</Caption>
    </View>
  );
}

const card = {
  flex: 1,
  borderRadius: RADIUS.xl,
  borderWidth: 1,
  borderColor: COLORS.line,
  backgroundColor: COLORS.card,
  padding: 16,
} as const;

const row = {
  flexDirection: "row",
  alignItems: "center",
  borderRadius: RADIUS.lg,
  borderWidth: 1,
  borderColor: COLORS.line,
  padding: 16,
} as const;
