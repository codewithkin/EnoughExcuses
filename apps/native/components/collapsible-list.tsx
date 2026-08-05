import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { LayoutAnimation, Platform, Pressable, UIManager, View } from "react-native";

import { Caption } from "@/components/typography";
import { COLORS, FONTS } from "@/lib/theme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DEFAULT_LIMIT = 3;

/**
 * Renders the first `limit` items and tucks the rest behind a toggle, so a
 * goal with twenty tasks doesn't flood the screen. Once expanded the toggle
 * flips to "Show less", so it's always reversible.
 *
 * Takes a render function rather than children so the hidden items are never
 * constructed while collapsed.
 */
export function CollapsibleList<T>({
  items,
  renderItem,
  limit = DEFAULT_LIMIT,
  gap = 8,
  noun = "task",
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  limit?: number;
  gap?: number;
  /** Used in the toggle label: "3 more tasks". */
  noun?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const overflow = items.length - limit;
  const canCollapse = overflow > 0;
  const visible = expanded || !canCollapse ? items : items.slice(0, limit);

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  }

  return (
    <View style={{ gap }}>
      {visible.map((item, i) => renderItem(item, i))}

      {canCollapse ? (
        <Pressable
          onPress={toggle}
          hitSlop={6}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            paddingVertical: 10,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Caption style={{ fontFamily: FONTS.sansMedium }} color={COLORS.green}>
            {expanded
              ? "Show less"
              : `${overflow} more ${noun}${overflow === 1 ? "" : "s"}`}
          </Caption>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={14}
            color={COLORS.green}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
