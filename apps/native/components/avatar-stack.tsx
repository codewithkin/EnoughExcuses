import { View } from "react-native";

import { Caption } from "@/components/typography";
import { COLORS, FONTS } from "@/lib/theme";

const AVATARS = [
  { bg: "#3A2E4A", initials: "JK" },
  { bg: "#4A2E2E", initials: "M" },
  { bg: "#234A3D", initials: "S" },
  { bg: "#4A4324", initials: "A" },
];

export function AvatarStack({ size = 28 }: { size?: number }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {AVATARS.map((a, i) => (
        <View
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: a.bg,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: COLORS.ink,
            marginLeft: i === 0 ? 0 : -size * 0.36,
          }}
        >
          <Caption style={{ fontSize: 10, fontFamily: FONTS.sansSemibold }} color={COLORS.fg}>
            {a.initials}
          </Caption>
        </View>
      ))}
    </View>
  );
}
