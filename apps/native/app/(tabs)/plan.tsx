import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Body, BodyMuted, BodyStrong, Caption, Label, Title } from "@/components/typography";
import { useApp } from "@/lib/store";
import { COLORS, DURATIONS, FONTS, RADIUS } from "@/lib/theme";

export default function Plan() {
  const { state, queue, addGoal, addTask, removeTask, moveTask } = useApp();

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState("");
  const [newTask, setNewTask] = useState("");
  const [duration, setDuration] = useState(25);

  useEffect(() => {
    if (!selectedGoalId && state.goals.length > 0) setSelectedGoalId(state.goals[0].id);
  }, [state.goals, selectedGoalId]);

  function onAddGoal() {
    if (newGoal.trim().length === 0) return;
    const g = addGoal(newGoal);
    setSelectedGoalId(g.id);
    setNewGoal("");
  }

  function onAddTask() {
    if (newTask.trim().length === 0 || !selectedGoalId) return;
    addTask({ title: newTask, durationMin: duration, goalId: selectedGoalId });
    setNewTask("");
  }

  const canAdd = !!selectedGoalId && newTask.trim().length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <Title>Plan</Title>
        <BodyMuted style={{ marginTop: 4 }}>Set goals, queue the work.</BodyMuted>

        <Label style={{ marginTop: 28, marginBottom: 10 }}>Goals</Label>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {state.goals.map((g) => {
            const selected = g.id === selectedGoalId;
            return (
              <Pressable key={g.id} onPress={() => setSelectedGoalId(g.id)} style={chip(selected)}>
                <Body
                  style={{ fontSize: 14, fontFamily: FONTS.sansMedium }}
                  color={selected ? COLORS.ink : COLORS.subtle}
                >
                  {g.title}
                </Body>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: 12, flexDirection: "row", gap: 8 }}>
          <TextInput
            value={newGoal}
            onChangeText={setNewGoal}
            placeholder="New goal"
            placeholderTextColor={COLORS.subtle}
            style={[inputStyle, { flex: 1, marginTop: 0 }]}
          />
          <Pressable onPress={onAddGoal} style={iconBtn}>
            <Ionicons name="add" size={22} color={COLORS.subtle} />
          </Pressable>
        </View>

        <Label style={{ marginTop: 28, marginBottom: 10 }}>Add a task</Label>
        <TextInput
          value={newTask}
          onChangeText={setNewTask}
          placeholder={selectedGoalId ? "What's the next thing?" : "Create a goal first"}
          placeholderTextColor={COLORS.subtle}
          editable={!!selectedGoalId}
          style={[inputStyle, { marginTop: 0 }]}
        />
        <View style={{ marginTop: 12, flexDirection: "row", gap: 8 }}>
          {DURATIONS.map((d) => (
            <Pressable key={d} onPress={() => setDuration(d)} style={durationChip(d === duration)}>
              <Body
                style={{ fontFamily: FONTS.monoMedium, fontSize: 14 }}
                color={d === duration ? COLORS.ink : COLORS.subtle}
              >
                {d}
              </Body>
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={onAddTask}
          disabled={!canAdd}
          style={{
            marginTop: 12,
            alignItems: "center",
            borderRadius: RADIUS.pill,
            backgroundColor: canAdd ? COLORS.coral : "#3A2418",
            paddingVertical: 14,
          }}
        >
          <Body
            style={{ fontFamily: FONTS.sansSemibold }}
            color={canAdd ? COLORS.ink : "#7A5238"}
          >
            Add to queue
          </Body>
        </Pressable>

        <Label style={{ marginTop: 32, marginBottom: 10 }}>Queue ({queue.length})</Label>
        {queue.length === 0 ? (
          <BodyMuted>Nothing queued yet.</BodyMuted>
        ) : (
          <View style={{ gap: 8 }}>
            {queue.map((t, i) => {
              const goal = state.goals.find((g) => g.id === t.goalId);
              return (
                <View key={t.id} style={card}>
                  <View style={{ flex: 1 }}>
                    <BodyStrong style={{ fontSize: 15 }}>{t.title}</BodyStrong>
                    <Caption style={{ marginTop: 2 }}>
                      {goal ? `${goal.title} · ` : ""}
                      {t.durationMin}m
                    </Caption>
                  </View>
                  <Pressable onPress={() => moveTask(t.id, "up")} disabled={i === 0} style={{ paddingHorizontal: 8 }}>
                    <Ionicons name="chevron-up" size={20} color={i === 0 ? "#333" : COLORS.subtle} />
                  </Pressable>
                  <Pressable
                    onPress={() => moveTask(t.id, "down")}
                    disabled={i === queue.length - 1}
                    style={{ paddingHorizontal: 8 }}
                  >
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={i === queue.length - 1 ? "#333" : COLORS.subtle}
                    />
                  </Pressable>
                  <Pressable onPress={() => removeTask(t.id)} style={{ paddingLeft: 8 }}>
                    <Ionicons name="trash-outline" size={18} color="#6b6b73" />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const inputStyle = {
  marginTop: 0,
  borderWidth: 1,
  borderColor: COLORS.line,
  backgroundColor: COLORS.elevated,
  borderRadius: RADIUS.lg,
  paddingHorizontal: 16,
  paddingVertical: 14,
  fontFamily: FONTS.sans,
  fontSize: 16,
  color: COLORS.fg,
} as const;

const iconBtn = {
  alignItems: "center",
  justifyContent: "center",
  borderRadius: RADIUS.lg,
  borderWidth: 1,
  borderColor: COLORS.line,
  paddingHorizontal: 16,
} as const;

const card = {
  flexDirection: "row",
  alignItems: "center",
  borderRadius: RADIUS.x2,
  borderWidth: 1,
  borderColor: COLORS.line,
  backgroundColor: COLORS.card,
  padding: 16,
} as const;

function chip(selected: boolean) {
  return {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: selected ? COLORS.coral : COLORS.line,
    backgroundColor: selected ? COLORS.coral : "transparent",
    paddingHorizontal: 16,
    paddingVertical: 9,
  } as const;
}

function durationChip(selected: boolean) {
  return {
    flex: 1,
    alignItems: "center",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: selected ? COLORS.coral : COLORS.line,
    backgroundColor: selected ? COLORS.coral : "transparent",
    paddingVertical: 13,
  } as const;
}
