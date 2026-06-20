import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { PrimaryButton } from "@/components/buttons";
import { Field } from "@/components/inputs";
import { ModalScreen } from "@/components/modal-screen";
import { SectionLabel } from "@/components/primitives";
import { useApp } from "@/lib/store";

export default function AddGoal() {
  const router = useRouter();
  const { addGoal } = useApp();
  const [title, setTitle] = useState("");

  function submit() {
    if (title.trim().length === 0) return;
    addGoal(title);
    router.back();
  }

  return (
    <ModalScreen title="New goal">
      <View style={{ flex: 1, padding: 24 }}>
        <SectionLabel>What are you working toward?</SectionLabel>
        <Field
          value={title}
          onChangeText={setTitle}
          placeholder="Ship LockedIn v1"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={submit}
        />

        <View style={{ flex: 1 }} />
        <PrimaryButton label="Create goal" onPress={submit} disabled={title.trim().length === 0} />
      </View>
    </ModalScreen>
  );
}
