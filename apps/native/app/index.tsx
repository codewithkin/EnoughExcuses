import { Redirect } from "expo-router";
import { View } from "react-native";

import { useApp } from "@/lib/store";

export default function Index() {
  const { ready, state } = useApp();

  if (!ready) return <View className="flex-1 bg-background" />;

  return <Redirect href={state.onboarded ? "/focus" : "/onboarding"} />;
}
