import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/buttons";
import { Body, BodyMuted, Caption, Display, Label } from "@/components/typography";
import { useApp } from "@/lib/store";
import { COLORS, DURATIONS, FONTS, RADIUS } from "@/lib/theme";

const STARTERS = ["Get fit", "Write every day", "Launch a side project", "Read more"];

export default function Onboarding() {
  const router = useRouter();
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [task, setTask] = useState("");
  const [duration, setDuration] = useState(25);

  function finish() {
    completeOnboarding(goal, task, duration);
    router.replace("/focus");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <View style={{ flex: 1, paddingHorizontal: 28 }}>
        <Progress step={step} />

        {step === 0 && (
          <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 8 }}>
            <Label style={{ marginBottom: 12 }}>12,000 people show up daily</Label>
            <Display>Stop planning.{"\n"}Start executing.</Display>
            <Body color={COLORS.subtle} style={{ marginTop: 16 }}>
              One task. A timer runs. You hit Done or Skip. That&apos;s the whole app.
            </Body>
            <View style={{ marginTop: 28 }}>
              <PrimaryButton label="Lock in" onPress={() => setStep(1)} />
            </View>
            <Caption style={{ marginTop: 16, textAlign: "center", fontFamily: FONTS.mono }}>
              No account. No setup. Nothing to lose but the excuses.
            </Caption>
          </View>
        )}

        {step === 1 && (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Display style={{ fontSize: 34, lineHeight: 38 }}>What are you working toward?</Display>
            <BodyMuted style={{ marginTop: 12 }}>
              Tasks live under a goal. Start with one — add more later.
            </BodyMuted>

            <TextInput
              value={goal}
              onChangeText={setGoal}
              placeholder="Ship LockedIn v1"
              placeholderTextColor={COLORS.subtle}
              style={inputStyle}
            />

            <Label style={{ marginTop: 24, marginBottom: 10 }}>Or pick a starter</Label>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {STARTERS.map((s) => (
                <Pressable key={s} onPress={() => setGoal(s)} style={chip(goal === s)}>
                  <Body
                    style={{ fontSize: 14, fontFamily: FONTS.sansMedium }}
                    color={goal === s ? COLORS.ink : COLORS.subtle}
                  >
                    {s}
                  </Body>
                </Pressable>
              ))}
            </View>

            <View style={{ marginTop: 28 }}>
              <PrimaryButton
                label="Next"
                onPress={() => setStep(2)}
                disabled={goal.trim().length === 0}
              />
            </View>
            <Caption style={{ marginTop: 16, textAlign: "center", fontFamily: FONTS.mono }}>
              One goal is enough to begin.
            </Caption>
          </View>
        )}

        {step === 2 && (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Display style={{ fontSize: 34, lineHeight: 38 }}>What&apos;s the one thing?</Display>
            <BodyMuted style={{ marginTop: 12 }}>
              Something real you can do right now — not a someday.
            </BodyMuted>

            <View style={{ flexDirection: "row", marginTop: 18 }}>
              <View style={goalTag}>
                <Label color={COLORS.coral} style={{ letterSpacing: 1.5 }}>
                  Under · {goal || "your goal"}
                </Label>
              </View>
            </View>

            <TextInput
              value={task}
              onChangeText={setTask}
              placeholder="Write the Q3 narrative"
              placeholderTextColor={COLORS.subtle}
              style={inputStyle}
            />

            <Label style={{ marginTop: 24, marginBottom: 10 }}>Block length</Label>
            <View style={{ flexDirection: "row", gap: 8 }}>
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

            <View style={{ marginTop: 28 }}>
              <PrimaryButton
                label="Start the timer"
                onPress={finish}
                disabled={task.trim().length === 0}
              />
            </View>
            <Caption style={{ marginTop: 16, textAlign: "center", fontFamily: FONTS.mono }}>
              The clock runs the second you tap.
            </Caption>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 6, paddingTop: 12 }}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            backgroundColor: i <= step ? COLORS.coral : COLORS.line,
          }}
        />
      ))}
    </View>
  );
}

const inputStyle = {
  marginTop: 20,
  borderWidth: 1,
  borderColor: COLORS.line,
  backgroundColor: COLORS.elevated,
  borderRadius: RADIUS.lg,
  paddingHorizontal: 16,
  paddingVertical: 16,
  fontFamily: FONTS.sans,
  fontSize: 16,
  color: COLORS.fg,
} as const;

function chip(selected: boolean) {
  return {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: selected ? COLORS.coral : COLORS.line,
    backgroundColor: selected ? COLORS.coral : "transparent",
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    paddingVertical: 14,
  } as const;
}

const goalTag = {
  borderRadius: RADIUS.pill,
  borderWidth: 1,
  borderColor: COLORS.coralDeep,
  backgroundColor: "rgba(255,107,74,0.08)",
  paddingHorizontal: 12,
  paddingVertical: 6,
} as const;
