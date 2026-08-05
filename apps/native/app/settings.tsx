import Ionicons from "@expo/vector-icons/Ionicons";
import * as WebBrowser from "expo-web-browser";
import { Alert, Pressable, ScrollView, Switch, View } from "react-native";

import { ModalScreen } from "@/components/modal-screen";
import { Card, SectionLabel } from "@/components/primitives";
import { TimerStylePicker } from "@/components/timer-style-picker";
import { BodyMuted, BodyStrong, Caption } from "@/components/typography";
import { SITE } from "@/lib/brand";
import { useApp } from "@/lib/store";
import { COLORS } from "@/lib/theme";
import { type NotificationPrefs } from "@/lib/types";

const ROWS: {
  key: keyof NotificationPrefs;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
}[] = [
  {
    key: "timerEnd",
    icon: "alarm-outline",
    title: "Timer finished",
    desc: "When a focus session's time runs out.",
  },
  {
    key: "daily",
    icon: "sunny-outline",
    title: "Daily reminder",
    desc: "A morning nudge to start your first task.",
  },
  {
    key: "streakRisk",
    icon: "flame-outline",
    title: "Streak at risk",
    desc: "Evening reminder if today's streak is unfinished.",
  },
  {
    key: "taskNudge",
    icon: "list-outline",
    title: "Task nudges",
    desc: "Midday reminder while tasks are queued.",
  },
];

function LinkRow({
  icon,
  title,
  desc,
  onPress,
  danger = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      <Card style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <Ionicons name={icon} size={20} color={danger ? COLORS.danger : COLORS.coral} />
        <View style={{ flex: 1 }}>
          <BodyStrong style={{ fontSize: 15, color: danger ? COLORS.danger : undefined }}>
            {title}
          </BodyStrong>
          <Caption style={{ marginTop: 2 }}>{desc}</Caption>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
      </Card>
    </Pressable>
  );
}

export default function Settings() {
  const { state, setNotificationPref, resetAllData } = useApp();
  const prefs = state.notifications;

  function openUrl(path: string) {
    WebBrowser.openBrowserAsync(`https://${SITE}${path}`);
  }

  function confirmReset() {
    Alert.alert(
      "Reset all data?",
      "This permanently deletes your goals, tasks, history, and streak from this device. It can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete everything",
          style: "destructive",
          onPress: () => resetAllData(),
        },
      ],
    );
  }

  return (
    <ModalScreen title="Settings">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        <SectionLabel>Focus theme</SectionLabel>
        <TimerStylePicker />

        <SectionLabel style={{ marginTop: 28 }}>Notifications</SectionLabel>
        <View style={{ gap: 10 }}>
          {ROWS.map((r) => (
            <Card key={r.key} style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <Ionicons name={r.icon} size={20} color={COLORS.coral} />
              <View style={{ flex: 1 }}>
                <BodyStrong style={{ fontSize: 15 }}>{r.title}</BodyStrong>
                <Caption style={{ marginTop: 2 }}>{r.desc}</Caption>
              </View>
              <Switch
                value={prefs[r.key]}
                onValueChange={(v) => setNotificationPref(r.key, v)}
                trackColor={{ false: COLORS.line, true: COLORS.coral }}
                thumbColor={COLORS.fg}
                ios_backgroundColor={COLORS.line}
              />
            </Card>
          ))}
        </View>

        <BodyMuted style={{ marginTop: 18, fontSize: 13 }}>
          Turn a reminder off and it stops scheduling immediately. You can change these anytime.
        </BodyMuted>

        <SectionLabel style={{ marginTop: 28 }}>About</SectionLabel>
        <View style={{ gap: 10 }}>
          <LinkRow
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            desc="Your tasks never leave this device."
            onPress={() => openUrl("/privacy")}
          />
          <LinkRow
            icon="document-text-outline"
            title="Terms of Service"
            desc="The terms you agree to by using ExcuseLess."
            onPress={() => openUrl("/terms")}
          />
        </View>

        <SectionLabel style={{ marginTop: 28 }}>Data</SectionLabel>
        <LinkRow
          icon="trash-outline"
          title="Reset all data"
          desc="Delete every goal, task, and streak from this device."
          onPress={confirmReset}
          danger
        />
        <BodyMuted style={{ marginTop: 18, fontSize: 13 }}>
          Everything you create lives only on this device. There's no account and no server copy, so
          resetting here removes it for good.
        </BodyMuted>
      </ScrollView>
    </ModalScreen>
  );
}
