import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Switch, TextInput, View } from "react-native";

import { PrimaryButton } from "@/components/buttons";
import { Chip, DurationPicker, Field } from "@/components/inputs";
import { ModalScreen } from "@/components/modal-screen";
import { SectionLabel } from "@/components/primitives";
import { Body, BodyMuted, Caption } from "@/components/typography";
import { playTaskAdd } from "@/lib/sounds";
import { useApp } from "@/lib/store";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

const RECUR_PRESETS = [
  { label: "Morning", time: "09:00" },
  { label: "Midday", time: "12:00" },
  { label: "Afternoon", time: "15:00" },
  { label: "Evening", time: "18:00" },
] as const;

export default function AddTask() {
  const router = useRouter();
  const { state, addTask } = useApp();
  const [goalId, setGoalId] = useState<string | null>(state.goals[0]?.id ?? null);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(25);
  const [recurring, setRecurring] = useState(false);
  const [recurTime, setRecurTime] = useState("09:00");
  const [customTime, setCustomTime] = useState(false);

  function submit() {
    if (title.trim().length === 0) return;
    addTask({
      title,
      durationMin: duration,
      goalId,
      recurringTime: recurring ? recurTime : undefined,
    });
    playTaskAdd();
    router.back();
  }

  return (
    <ModalScreen title="New task">
      <View style={{ flex: 1, padding: 24 }}>
        {state.goals.length > 0 ? (
          <View>
            <SectionLabel>Goal</SectionLabel>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {state.goals.map((g) => (
                <Chip key={g.id} label={g.title} selected={g.id === goalId} onPress={() => setGoalId(g.id)} />
              ))}
            </View>
          </View>
        ) : (
          <BodyMuted>Add a goal first from the Goals tab.</BodyMuted>
        )}

        <View style={{ marginTop: 24 }}>
          <SectionLabel>Task</SectionLabel>
          <Field
            value={title}
            onChangeText={setTitle}
            placeholder="What's the next thing?"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={submit}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          <SectionLabel>Focus time</SectionLabel>
          <DurationPicker value={duration} onChange={setDuration} />
        </View>

        <View style={{ marginTop: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <SectionLabel style={{ marginBottom: 0 }}>Repeat daily</SectionLabel>
            <Switch
              value={recurring}
              onValueChange={setRecurring}
              trackColor={{ false: COLORS.elevated, true: COLORS.coralDeep }}
              thumbColor={recurring ? COLORS.coral : COLORS.subtle}
            />
          </View>
          {recurring ? (
            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {RECUR_PRESETS.map((p) => (
                  <Pressable
                    key={p.time}
                    onPress={() => {
                      setCustomTime(false);
                      setRecurTime(p.time);
                    }}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      borderRadius: RADIUS.md,
                      borderWidth: 1,
                      borderColor: !customTime && recurTime === p.time ? COLORS.coral : COLORS.line,
                      backgroundColor: !customTime && recurTime === p.time ? COLORS.coral : "transparent",
                      paddingVertical: 10,
                    }}
                  >
                    <Body
                      style={{ fontFamily: FONTS.sansMedium, fontSize: 12 }}
                      color={!customTime && recurTime === p.time ? COLORS.ink : COLORS.subtle}
                    >
                      {p.label}
                    </Body>
                  </Pressable>
                ))}
              </View>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                <Pressable
                  onPress={() => setCustomTime(true)}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    borderRadius: RADIUS.md,
                    borderWidth: 1,
                    borderColor: customTime ? COLORS.coral : COLORS.line,
                    backgroundColor: customTime ? COLORS.coral : "transparent",
                    paddingVertical: 10,
                  }}
                >
                  <Body
                    style={{ fontFamily: FONTS.sansMedium, fontSize: 12 }}
                    color={customTime ? COLORS.ink : COLORS.subtle}
                  >
                    Custom
                  </Body>
                </Pressable>
                {customTime ? (
                  <TextInput
                    value={recurTime}
                    onChangeText={(t) => {
                      const cleaned = t.replace(/[^0-9:]/g, "");
                      if (cleaned.length <= 5) setRecurTime(cleaned);
                    }}
                    placeholder="HH:mm"
                    placeholderTextColor={COLORS.subtle}
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: COLORS.line,
                      borderRadius: RADIUS.md,
                      backgroundColor: COLORS.elevated,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      fontFamily: FONTS.monoMedium,
                      fontSize: 14,
                      color: COLORS.fg,
                      textAlign: "center",
                    }}
                  />
                ) : null}
              </View>
            </View>
          ) : null}
        </View>

        <View style={{ flex: 1 }} />
        <PrimaryButton label="Add task" onPress={submit} disabled={title.trim().length === 0} />
      </View>
    </ModalScreen>
  );
}
