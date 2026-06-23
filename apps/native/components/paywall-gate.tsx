import { View } from "react-native";
import RevenueCatUI from "react-native-purchases-ui";

import { usePurchases } from "@/lib/purchases";
import { COLORS } from "@/lib/theme";

export function PaywallGate({ children }: { children: React.ReactNode }) {
  const { ready, isPro, paywallAvailable, refresh } = usePurchases();

  // Wait for the SDK before deciding.
  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: COLORS.ink }} />;
  }

  // Entitled, or there's no offering to present (dev / not configured): let them in.
  if (isPro || !paywallAvailable) {
    return <>{children}</>;
  }

  // Hard gate: the RevenueCat paywall fills the screen until they subscribe or start the trial.
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <RevenueCatUI.Paywall
        style={{ flex: 1 }}
        onPurchaseCompleted={() => refresh()}
        onRestoreCompleted={() => refresh()}
      />
    </View>
  );
}
