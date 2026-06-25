import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { PrimaryButton } from "@/components/buttons";
import { Field } from "@/components/inputs";
import { ModalScreen } from "@/components/modal-screen";
import { SectionLabel } from "@/components/primitives";
import { TaskComposer } from "@/components/task-composer";
import { BodyMuted, Title } from "@/components/typography";
import { useApp } from "@/lib/store";

export default function AddGoal() {
  const router = useRouter();
  const { addGoal } = useApp();
  const [title, setTitle] = useState("");
  const [goalId, setGoalId] = useState<string | null>(null);

  function createGoal() {
    if (title.trim().length === 0) return;
    const goal = addGoal(title);
    setGoalId(goal.id);
  }

  return (
    <ModalScreen title="New goal">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        {!goalId ? (
          <>
            <SectionLabel>What are you working toward?</SectionLabel>
            <Field
              value={title}
              onChangeText={setTitle}
              placeholder="Post on social media everyday"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={createGoal}
            />
            <View style={{ marginTop: 24 }}>
              <PrimaryButton
                label="Create goal"
                onPress={createGoal}
                disabled={title.trim().length === 0}
              />
            </View>
          </>
        ) : (
          <>
            <Title>{title.trim()}</Title>
            <BodyMuted style={{ marginTop: 4 }}>Now stack some tasks under it.</BodyMuted>
            <View style={{ marginTop: 20 }}>
              <TaskComposer goalId={goalId} onClose={() => router.back()} />
            </View>
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              style={{ marginTop: 16, alignItems: "center" }}
            >
              <BodyMuted style={{ fontSize: 14 }}>Done for now</BodyMuted>
            </Pressable>
          </>
        )}
      </ScrollView>
    </ModalScreen>
  );
}
