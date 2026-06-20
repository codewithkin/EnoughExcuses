import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { COLORS } from "@/lib/theme";

export function FadeToInk({ height = 180 }: { height?: number }) {
  return (
    <Svg width="100%" height={height} style={{ position: "absolute", bottom: 0, left: 0 }}>
      <Defs>
        <LinearGradient id="fadeInk" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={COLORS.ink} stopOpacity="0" />
          <Stop offset="1" stopColor={COLORS.ink} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height={height} fill="url(#fadeInk)" />
    </Svg>
  );
}
