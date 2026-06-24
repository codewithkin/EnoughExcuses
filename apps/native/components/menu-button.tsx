import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Pressable } from "react-native";

import { COLORS } from "@/lib/theme";

export function MenuButton() {
  const navigation = useNavigation();
  return (
    <Pressable hitSlop={10} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
      <Ionicons name="menu" size={24} color={COLORS.subtle} />
    </Pressable>
  );
}
