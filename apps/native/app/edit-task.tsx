import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

import { PrimaryButton } from "@/components/buttons";
import { DurationPicker, Field } from "@/components/inputs";
import { ModalScreen } from "@/components/modal-screen";
import { SectionLabel } from "@/components/primitives";
import { BodyMuted, Caption } from "@/components/typography";
import { useApp } from "@/lib/store";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

export default function EditTask() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, editTask } = useApp();
  const task = useMemo(() => state.tasks.find((t) => t.id === id) ?? null, [state.tasks, id]);

  const [title, setTitle] = useState(task?.title ?? "");
  const [duration, setDuration] = useState(task?.durationMin ?? 25);

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
    editTask(task!.id, { title, durationMin: duration });
    router.back();
  }

  function bump(min: number) {
    setDuration((d) => Math.min(180, d + min));
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
          <SectionLabel style={{ marginBottom: 0 }}>Block length</SectionLabel>
          <Caption style={{ fontFamily: FONTS.monoMedium }}>{duration} min</Caption>
        </View>
        <DurationPicker value={duration} onChange={setDuration} />
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <Bump label="+5 min" onPress={() => bump(5)} />
          <Bump label="+15 min" onPress={() => bump(15)} />
        </View>

        <View style={{ flex: 1 }} />
        <PrimaryButton label="Save changes" onPress={save} disabled={title.trim().length === 0} />
      </View>
    </ModalScreen>
  );
}

function Bump({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        alignItems: "center",
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.line,
        paddingVertical: 12,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Caption style={{ fontFamily: FONTS.monoMedium, fontSize: 13 }}>{label}</Caption>
    </Pressable>
  );
}
