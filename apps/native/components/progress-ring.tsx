import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Body } from "@/components/typography";
import { COLORS, FONTS } from "@/lib/theme";

type Props = {
  value: number;
  total: number;
  size?: number;
  stroke?: number;
};

export function ProgressRing({ value, total, size = 56, stroke = 5 }: Props) {
  const pct = total > 0 ? Math.min(1, value / total) : 0;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={COLORS.elevated} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={COLORS.coral}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      <Body style={{ fontFamily: FONTS.monoMedium, fontSize: 13 }}>{Math.round(pct * 100)}%</Body>
    </View>
  );
}
