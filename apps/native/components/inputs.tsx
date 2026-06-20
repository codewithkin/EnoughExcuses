import { Pressable, TextInput, View, type TextInputProps } from "react-native";

import { Body } from "@/components/typography";
import { COLORS, DURATIONS, FONTS, RADIUS } from "@/lib/theme";

export function Field(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={COLORS.subtle}
      autoCorrect={false}
      {...props}
      style={[
        {
          borderWidth: 1,
          borderColor: COLORS.line,
          backgroundColor: COLORS.elevated,
          borderRadius: RADIUS.lg,
          paddingHorizontal: 16,
          paddingVertical: 16,
          fontFamily: FONTS.sans,
          fontSize: 16,
          color: COLORS.fg,
        },
        props.style,
      ]}
    />
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: RADIUS.pill,
        borderWidth: 1,
        borderColor: selected ? COLORS.coral : COLORS.line,
        backgroundColor: selected ? COLORS.coral : "transparent",
        paddingHorizontal: 16,
        paddingVertical: 10,
      }}
    >
      <Body style={{ fontSize: 14, fontFamily: FONTS.sansMedium }} color={selected ? COLORS.ink : COLORS.subtle}>
        {label}
      </Body>
    </Pressable>
  );
}

export function DurationPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (d: number) => void;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {DURATIONS.map((d) => {
        const selected = d === value;
        return (
          <Pressable
            key={d}
            onPress={() => onChange(d)}
            style={{
              flex: 1,
              alignItems: "center",
              borderRadius: RADIUS.md,
              borderWidth: 1,
              borderColor: selected ? COLORS.coral : COLORS.line,
              backgroundColor: selected ? COLORS.coral : "transparent",
              paddingVertical: 14,
            }}
          >
            <Body style={{ fontFamily: FONTS.monoMedium, fontSize: 14 }} color={selected ? COLORS.ink : COLORS.subtle}>
              {d}
            </Body>
          </Pressable>
        );
      })}
    </View>
  );
}
