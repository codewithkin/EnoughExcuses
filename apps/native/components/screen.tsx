import { ScrollView, View, type ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MenuButton } from "@/components/menu-button";
import { BodyMuted, Title } from "@/components/typography";
import { COLORS } from "@/lib/theme";

type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  scrollViewProps?: ScrollViewProps;
};

export function Screen({ children, scroll = true, padded = true, scrollViewProps }: ScreenProps) {
  const pad = padded ? { padding: 24, paddingBottom: 56 } : undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }} edges={["top"]}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={pad}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, pad]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  right,
  menu = true,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  menu?: boolean;
}) {
  return (
    <View>
      {menu ? (
        <View style={{ marginBottom: 14 }}>
          <MenuButton />
        </View>
      ) : null}
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Title>{title}</Title>
          {subtitle ? <BodyMuted style={{ marginTop: 4 }}>{subtitle}</BodyMuted> : null}
        </View>
        {right ? <View style={{ marginLeft: 12 }}>{right}</View> : null}
      </View>
    </View>
  );
}
