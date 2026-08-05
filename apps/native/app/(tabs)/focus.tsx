import { Ionicons } from "@expo/vector-icons";
import type BottomSheet from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useFocusEffect, useRouter } from "expo-router";
import { Dialog } from "heroui-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, BackHandler, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GhostButton, PrimaryButton } from "@/components/buttons";
import { FocusBackground } from "@/components/focus-background";
import { FocusChooser } from "@/components/focus-chooser";
import { GoalTasksSheet } from "@/components/goal-tasks-sheet";
import { Card } from "@/components/primitives";
import { AmbientTimer } from "@/components/timers/ambient-timer";
import { NumeralsTimer } from "@/components/timers/numerals-timer";
import { RingTimer } from "@/components/timers/ring-timer";
import { type TimerVariantProps } from "@/components/timers/types";
import { Body, BodyMuted, Caption, Label, Title } from "@/components/typography";
import { nextInGoal } from "@/lib/selectors";
import { hideLiveTimer, onLiveTimerAction, showLiveTimer } from "@/lib/notifications";
import { stopLiveActivity, syncLiveActivity } from "@/lib/live-activity";
import { syncAllWidgets } from "@/lib/widget-sync";
import { playStartFocus, playTaskComplete } from "@/lib/sounds";
import { useApp } from "@/lib/store";
import { type Task } from "@/lib/types";
import { useCountdown } from "@/lib/use-countdown";
import { COLORS } from "@/lib/theme";

export default function Focus() {
  const router = useRouter();
  const {
    currentTask,
    queue,
    state,
    today,
    setActiveTask,
    completeTask,
    skipTask,
    clearActiveTask,
    pauseSession,
    resumeSession,
    extendSession,
  } = useApp();
  const countdown = useCountdown();
  const sheetRef = useRef<BottomSheet>(null);
  const [nextUp, setNextUp] = useState<Task | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // ─────────────────────────────────────────────────────────────────────
  // NOTE: every hook must stay above the early returns further down.
  // React requires the same hooks to run in the same order on every
  // render — putting a hook after `if (!currentTask) return ...` makes it
  // conditional and throws "Rendered more hooks than during the previous
  // render" the moment the task state changes.
  // ─────────────────────────────────────────────────────────────────────

  const goal = currentTask ? state.goals.find((g) => g.id === currentTask.goalId) : undefined;
  const elapsed = countdown.active ? countdown.elapsed : 0;

  const onDone = useCallback(() => {
    if (!currentTask) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playTaskComplete();
    const wasFirstToday = today.completed === 0;
    const wasLastInQueue = queue.length === 1;
    const nxt = nextInGoal(state.tasks, currentTask.goalId, currentTask.id);
    completeTask(currentTask.id, elapsed);
    syncAllWidgets();
    if (wasFirstToday) router.push("/first-win");
    else if (wasLastInQueue) router.push("/day-summary");
    else if (nxt) setNextUp(nxt);
  }, [currentTask, today.completed, queue.length, state.tasks, elapsed, completeTask, router]);

  const onSkip = useCallback(() => {
    if (!currentTask) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const wasLastInQueue = queue.length === 1;
    skipTask(currentTask.id);
    syncAllWidgets();
    if (wasLastInQueue) router.push("/day-summary");
  }, [currentTask, queue.length, skipTask, router]);

  const togglePause = useCallback(() => {
    Haptics.selectionAsync();
    if (countdown.paused) resumeSession();
    else pauseSession();
  }, [countdown.paused, resumeSession, pauseSession]);

  const addTime = useCallback(
    (minutes: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      extendSession(minutes);
    },
    [extendSession],
  );

  // Keep the screen awake only while a session is actually running (not paused).
  useFocusEffect(
    useCallback(() => {
      if (!countdown.active || countdown.paused) return;
      activateKeepAwakeAsync("excuseless-focus");
      return () => deactivateKeepAwake("excuseless-focus");
    }, [countdown.active, countdown.paused]),
  );

  // Start chime when a new task becomes active.
  const prevTaskId = useRef<string | null>(null);
  useEffect(() => {
    const id = currentTask?.id ?? null;
    if (id && prevTaskId.current !== null && prevTaskId.current !== id) playStartFocus();
    prevTaskId.current = id;
  }, [currentTask?.id]);

  // Auto-pause when the app goes to background.
  useEffect(() => {
    if (!countdown.active || countdown.paused) return;
    const sub = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background") pauseSession();
    });
    return () => sub.remove();
  }, [countdown.active, countdown.paused, pauseSession]);

  // Persistent notification naming the current task. No countdown — the OS
  // throttles notification updates, so a clock here would read stale. It only
  // needs to re-post when the task itself changes.
  useEffect(() => {
    if (!countdown.active || !currentTask) {
      hideLiveTimer();
      return;
    }
    showLiveTimer(currentTask.title, goal?.title);
    return () => {
      hideLiveTimer();
    };
  }, [countdown.active, currentTask?.id, currentTask?.title, goal?.title]);

  // Done / Skip straight from the notification, without opening the app.
  useEffect(() => {
    if (!countdown.active) return;
    return onLiveTimerAction({ onDone, onSkip });
  }, [countdown.active, onDone, onSkip]);

  // Live Activity — Dynamic Island + Lock Screen (iOS only, no-op on Android).
  useEffect(() => {
    if (!countdown.active || !currentTask) {
      stopLiveActivity();
      return;
    }
    syncLiveActivity({
      taskId: currentTask.id,
      taskTitle: currentTask.title,
      goalTitle: goal?.title,
      paused: countdown.paused,
    });
  }, [countdown.active, countdown.paused, currentTask?.id, currentTask?.title, goal?.title]);

  // Android back button → show confirm dialog instead of navigating away.
  useEffect(() => {
    if (!countdown.active) return;
    const onBack = () => {
      setShowExitConfirm(true);
      return true;
    };
    const handler = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => handler.remove();
  }, [countdown.active]);

  // ── All hooks are above this line. Early returns are safe from here. ──

  // Just finished a task → confirm what's next.
  if (nextUp) {
    const nextUpGoal = state.goals.find((g) => g.id === nextUp.goalId);
    return (
      <NextUpConfirm
        task={nextUp}
        goalTitle={nextUpGoal?.title}
        onStart={() => {
          setActiveTask(nextUp.id);
          setNextUp(null);
        }}
        onPickAnother={() => setNextUp(null)}
      />
    );
  }

  // No active task → the goal-grouped chooser.
  if (!currentTask) {
    return <FocusChooser onPick={(id) => setActiveTask(id)} />;
  }

  const total = countdown.active ? countdown.total : currentTask.durationMin * 60;
  const remaining = countdown.active ? countdown.remaining : total;
  const timeUp = countdown.active && remaining === 0;
  const next = nextInGoal(state.tasks, currentTask.goalId, currentTask.id);

  const variantProps: TimerVariantProps = {
    taskTitle: currentTask.title,
    goalTitle: goal?.title,
    remaining,
    total,
    elapsed,
    index: today.completed + 1,
    count: today.completed + queue.length,
    timeUp,
    onDone,
    onSkip,
    onAddTime: addTime,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <FocusBackground />
      <View style={{ flex: 1 }}>
        {state.timerStyle === "ring" ? (
          <RingTimer {...variantProps} />
        ) : state.timerStyle === "numerals" ? (
          <NumeralsTimer {...variantProps} />
        ) : (
          <AmbientTimer {...variantProps} />
        )}
      </View>

      <FocusBottomBar
        paused={countdown.paused}
        onTogglePause={togglePause}
        nextTask={next}
        onViewAll={() => sheetRef.current?.expand()}
      />

      <GoalTasksSheet
        ref={sheetRef}
        goalId={currentTask.goalId}
        onPickTask={(id) => {
          sheetRef.current?.close();
          setActiveTask(id);
        }}
      />

      <Dialog isOpen={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <View style={{ padding: 24, alignItems: "center", gap: 16, maxWidth: 300 }}>
              <Dialog.Title>End focus session?</Dialog.Title>
              <Dialog.Description>
                Your progress so far will be saved. You can start a new one anytime.
              </Dialog.Description>
              <View style={{ flexDirection: "row", gap: 10, alignSelf: "stretch" }}>
                <View style={{ flex: 1 }}>
                  <GhostButton label="Cancel" onPress={() => setShowExitConfirm(false)} />
                </View>
                <View style={{ flex: 1 }}>
                  <PrimaryButton
                    label="End"
                    onPress={() => {
                      clearActiveTask();
                      syncAllWidgets();
                      setShowExitConfirm(false);
                    }}
                  />
                </View>
              </View>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </SafeAreaView>
  );
}

function FocusBottomBar({
  paused,
  onTogglePause,
  nextTask,
  onViewAll,
}: {
  paused: boolean;
  onTogglePause: () => void;
  nextTask: Task | null;
  onViewAll: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.line,
      }}
    >
      <Pressable
        onPress={onTogglePause}
        hitSlop={8}
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          borderWidth: 1,
          borderColor: paused ? COLORS.coral : COLORS.line,
          backgroundColor: paused ? "rgba(52,211,153,0.1)" : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={paused ? "play" : "pause"} size={18} color={paused ? COLORS.coral : COLORS.fg} />
      </Pressable>

      <View style={{ flex: 1 }}>
        <Label>{paused ? "Paused" : "Next up"}</Label>
        <Body style={{ fontSize: 14 }} numberOfLines={1} color={nextTask ? COLORS.fg : COLORS.subtle}>
          {nextTask ? nextTask.title : "That's the last task"}
        </Body>
      </View>

      <Pressable
        onPress={onViewAll}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: COLORS.line,
          paddingHorizontal: 14,
          paddingVertical: 9,
        }}
      >
        <Caption color={COLORS.fg}>See all</Caption>
        <Ionicons name="chevron-up" size={14} color={COLORS.subtle} />
      </Pressable>
    </View>
  );
}

function NextUpConfirm({
  task,
  goalTitle,
  onStart,
  onPickAnother,
}: {
  task: Task;
  goalTitle?: string;
  onStart: () => void;
  onPickAnother: () => void;
}) {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 28 }}>
        <View style={{ alignItems: "center" }}>
          <Label>Next up</Label>
          <Title style={{ marginTop: 10, textAlign: "center" }}>Task done. Onto the next one?</Title>
        </View>

        <Card style={{ marginTop: 26, alignItems: "center", paddingVertical: 26 }}>
          {goalTitle ? <Label>{goalTitle}</Label> : null}
          <Title style={{ marginTop: 8, textAlign: "center" }}>{task.title}</Title>
          <Caption style={{ marginTop: 8, fontFamily: "JetBrainsMono_500Medium" }}>
            {task.durationMin}m
          </Caption>
        </Card>

        <View style={{ marginTop: 26, gap: 8 }}>
          <PrimaryButton label="Start this task" onPress={onStart} />
          <Pressable onPress={onPickAnother} style={{ alignItems: "center", paddingVertical: 12 }}>
            <BodyMuted style={{ fontSize: 15 }}>Pick another task</BodyMuted>
          </Pressable>
          <Pressable
            onPress={() => router.push("/share?type=task")}
            style={{ alignItems: "center", paddingVertical: 4 }}
          >
            <Caption color={COLORS.coral}>Share it</Caption>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
