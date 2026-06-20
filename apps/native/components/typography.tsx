import { Text, type TextProps, type TextStyle } from "react-native";

import { COLORS, FONTS } from "@/lib/theme";

type Props = TextProps & { color?: string; style?: TextStyle };

function make(base: TextStyle) {
  return function Typo({ style, color, ...props }: Props) {
    return <Text {...props} style={[base, color ? { color } : null, style]} />;
  };
}

export const Display = make({
  fontFamily: FONTS.display,
  fontSize: 40,
  lineHeight: 44,
  color: COLORS.fg,
});

export const Title = make({
  fontFamily: FONTS.display,
  fontSize: 30,
  lineHeight: 36,
  color: COLORS.fg,
});

export const Heading = make({
  fontFamily: FONTS.sansSemibold,
  fontSize: 18,
  lineHeight: 24,
  color: COLORS.fg,
});

export const Body = make({
  fontFamily: FONTS.sans,
  fontSize: 16,
  lineHeight: 24,
  color: COLORS.fg,
});

export const BodyStrong = make({
  fontFamily: FONTS.sansSemibold,
  fontSize: 16,
  lineHeight: 24,
  color: COLORS.fg,
});

export const BodyMuted = make({
  fontFamily: FONTS.sans,
  fontSize: 16,
  lineHeight: 24,
  color: COLORS.subtle,
});

export const Caption = make({
  fontFamily: FONTS.sans,
  fontSize: 12,
  lineHeight: 16,
  color: COLORS.subtle,
});

export const Label = make({
  fontFamily: FONTS.monoMedium,
  fontSize: 11,
  lineHeight: 16,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: COLORS.coral,
});

export const Timer = make({
  fontFamily: FONTS.display,
  fontSize: 72,
  lineHeight: 76,
  color: COLORS.fg,
});

export const MonoTimer = make({
  fontFamily: FONTS.monoMedium,
  fontSize: 64,
  lineHeight: 68,
  color: COLORS.fg,
});
