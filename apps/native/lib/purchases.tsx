import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesOffering,
} from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

// ─────────────────────────────────────────────────────────────────────────
// PAYMENTS KILL-SWITCH
// Master switch for in-app payments. Set to `false` to fully disable
// RevenueCat: the SDK never configures, the paywall never shows, and every
// user is treated as entitled (full access, free). Flip back to `true` to
// restore the paywall exactly as it was — no other code changes needed.
export const PAYMENTS_ENABLED = false;
// ─────────────────────────────────────────────────────────────────────────

// The entitlement identifier configured in the RevenueCat dashboard.
export const PRO_ENTITLEMENT = "LockedIn Pro";

// RevenueCat Test Store key — works cross-platform for development.
// For production, swap to platform-specific keys (goog_… / appl_…).
const API_KEYS = {
  default: "test_PRegaNHRLsFTthHRCcTUMwmndsL",
  // android: "goog_…",
  // ios: "appl_…",
};

function resolveApiKey(): string {
  if (Platform.OS === "android" && "android" in API_KEYS) return (API_KEYS as Record<string, string>).android;
  if (Platform.OS === "ios" && "ios" in API_KEYS) return (API_KEYS as Record<string, string>).ios;
  return API_KEYS.default;
}

type PurchasesContextType = {
  ready: boolean;
  isPro: boolean;
  customerInfo: CustomerInfo | null;
  currentOffering: PurchasesOffering | null;
  paywallAvailable: boolean;
  presentPaywall: () => Promise<boolean>;
  presentPaywallIfNeeded: () => Promise<boolean>;
  presentCustomerCenter: () => Promise<void>;
  restore: () => Promise<boolean>;
  refresh: () => Promise<void>;
};

const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);

function hasPro(info: CustomerInfo | null): boolean {
  return !!info?.entitlements.active[PRO_ENTITLEMENT];
}

export function PurchasesProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);

  useEffect(() => {
    // Payments disabled: skip all RevenueCat native calls, mark ready, done.
    if (!PAYMENTS_ENABLED) {
      setReady(true);
      return;
    }

    let mounted = true;

    const onUpdate = (info: CustomerInfo) => {
      if (mounted) setCustomerInfo(info);
    };

    (async () => {
      try {
        if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        Purchases.configure({ apiKey: resolveApiKey() });
        Purchases.addCustomerInfoUpdateListener(onUpdate);

        const info = await Purchases.getCustomerInfo();
        if (mounted) setCustomerInfo(info);

        try {
          const offerings = await Purchases.getOfferings();
          if (mounted) setCurrentOffering(offerings.current ?? null);
        } catch {
          // offerings not configured yet — paywall falls back to the in-app screen
        }
      } catch {
        // SDK config failed (e.g. not a dev build) — app keeps working on the free tier
      } finally {
        if (mounted) setReady(true);
      }
    })();

    return () => {
      mounted = false;
      try {
        Purchases.removeCustomerInfoUpdateListener(onUpdate);
      } catch {
        // ignore
      }
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      setCustomerInfo(await Purchases.getCustomerInfo());
    } catch {
      // ignore
    }
  }, []);

  const presentPaywall = useCallback(async () => {
    try {
      const result = await RevenueCatUI.presentPaywall();
      return result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED;
    } catch {
      return false;
    }
  }, []);

  const presentPaywallIfNeeded = useCallback(async () => {
    try {
      const result = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: PRO_ENTITLEMENT,
      });
      return result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED;
    } catch {
      return false;
    }
  }, []);

  const presentCustomerCenter = useCallback(async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch {
      // ignore
    }
  }, []);

  const restore = useCallback(async () => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      return hasPro(info);
    } catch {
      return false;
    }
  }, []);

  const value = useMemo<PurchasesContextType>(
    () =>
      !PAYMENTS_ENABLED
        ? {
            // Payments off: unlocked for everyone, no paywall, no-op actions.
            ready: true,
            isPro: true,
            customerInfo: null,
            currentOffering: null,
            paywallAvailable: false,
            presentPaywall: async () => true,
            presentPaywallIfNeeded: async () => true,
            presentCustomerCenter: async () => {},
            restore: async () => true,
            refresh: async () => {},
          }
        : {
            ready,
            isPro: hasPro(customerInfo),
            customerInfo,
            currentOffering,
            paywallAvailable: !!currentOffering,
            presentPaywall,
            presentPaywallIfNeeded,
            presentCustomerCenter,
            restore,
            refresh,
          },
    [
      ready,
      customerInfo,
      currentOffering,
      presentPaywall,
      presentPaywallIfNeeded,
      presentCustomerCenter,
      restore,
      refresh,
    ],
  );

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>;
}

export function usePurchases() {
  const ctx = useContext(PurchasesContext);
  if (!ctx) throw new Error("usePurchases must be used within PurchasesProvider");
  return ctx;
}
