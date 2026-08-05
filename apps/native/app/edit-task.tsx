import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Switch, TextInput, View } from "react-native";

import { PrimaryButton } from "@/components/buttons";
import { DurationPicker, Field } from "@/components/inputs";
import { ModalScreen } from "@/components/modal-screen";
import { SectionLabel } from "@/components/primitives";
import { Body, BodyMuted, Caption } from "@/components/typography";
import { useApp } from "@/lib/store";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

const RECUR_PRESETS = [
  { label: "Morning", time: "09:00" },
  { label: "Midday", time: "12:00" },
  { label: "Afternoon", time: "15:00" },
  { label: "Evening", time: "18:00" },
] as const;

export default function EditTask() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, editTask } = useApp();
  const task = useMemo(() => state.tasks.find((t) => t.id === id) ?? null, [state.tasks, id]);

  const [title, setTitle] = useState(task?.title ?? "");
  const [duration, setDuration] = useState(task?.durationMin ?? 25);
  const [recurring, setRecurring] = useState(!!task?.recurringTime);
  const [recurTime, setRecurTime] = useState(task?.recurringTime ?? "09:00");
  const [customTime, setCustomTime] = useState(
    task?.recurringTime ? !RECUR_PRESETS.some((p) => p.time === task.recurringTime) : false,
  );

  if (!task) {
    return (
      <ModalScreen title="Edit task">
        <View style={{ flex: 1, padding: 24 }}>
          <BodyMuted>That task is no longer here.</BodyMuted>
        </View>
      </ModalScreen>
    );
  }

  function save() {
    if (title.trim().length === 0) return;
    editTask(task!.id, {
      title,
      durationMin: duration,
      recurringTime: recurring ? recurTime : undefined,
    });
    router.back();
  }

  return (
    <ModalScreen title="Edit task">
      <View style={{ flex: 1, padding: 24 }}>
        <SectionLabel>Task</SectionLabel>
        <Field
          value={title}
          onChangeText={setTitle}
          placeholder="Task name"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={save}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 24,
            marginBottom: 10,
          }}
        >
          <SectionLabel style={{ marginBottom: 0 }}>Focus time</SectionLabel>
          <Caption style={{ fontFamily: FONTS.monoMedium }}>{duration} min</Caption>
        </View>
        <DurationPicker value={duration} onChange={setDuration} />

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
        <PrimaryButton label="Save changes" onPress={save} disabled={title.trim().length === 0} />
      </View>
    </ModalScreen>
  );
}

