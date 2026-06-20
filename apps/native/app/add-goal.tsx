import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/buttons";
import { Field } from "@/components/inputs";
import { SectionLabel } from "@/components/primitives";
import { BodyMuted, Title } from "@/components/typography";
import { useApp } from "@/lib/store";
import { COLORS } from "@/lib/theme";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }} edges={["bottom"]}>
      <View style={{ flex: 1, padding: 24 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Title>New goal</Title>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <BodyMuted>Cancel</BodyMuted>
          </Pressable>
        </View>

        <View style={{ marginTop: 24 }}>
          <SectionLabel>What are you working toward?</SectionLabel>
          <Field
            value={title}
            onChangeText={setTitle}
            placeholder="Ship LockedIn v1"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={submit}
          />
        </View>

        <View style={{ flex: 1 }} />
        <PrimaryButton label="Create goal" onPress={submit} disabled={title.trim().length === 0} />
      </View>
    </SafeAreaView>
  );
}
