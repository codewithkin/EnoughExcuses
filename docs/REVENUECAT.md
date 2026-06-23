# RevenueCat in LockedIn

How subscriptions are wired into the mobile app, and what you need to do in the RevenueCat dashboard to make them live.

> **Important:** RevenueCat ships native modules, so it only runs in a **dev build** (`expo run:android`) or a production build — **not Expo Go**.

---

## 1. Install

```
npm install --save react-native-purchases react-native-purchases-ui
```

Inside this Expo monorepo, prefer the Expo-aware installer so versions match your SDK:

```
pnpm --filter native exp install react-native-purchases react-native-purchases-ui
# or, from apps/native:
npx expo install react-native-purchases react-native-purchases-ui
```

Then rebuild the dev client (the modules are autolinked — no `app.json` plugin entry required):

```
pnpm --filter native android
```

Docs: https://www.revenuecat.com/docs/getting-started/installation/reactnative#installation

---

## 2. Dashboard setup (one time)

1. **Project → API keys.** For development you can use the **Test Store** key (`test_…`) — it works cross-platform with no store credentials. For production, add the **Google Play** key (`goog_…`) and, later, **App Store** (`appl_…`).
2. **Entitlements →** create one with identifier **`LockedIn Pro`**. This is the single switch the app checks.
3. **Products →** create/import your store products and attach them to the entitlement:
   - **Monthly** — identifier `monthly`
   - **Yearly** — identifier `yearly`
4. **Offerings →** create a `default` (current) offering with two **packages**: a Monthly package (→ `monthly`) and an Annual package (→ `yearly`).
5. **Paywalls →** design a paywall on the `default` offering. This is what `presentPaywall()` renders. https://www.revenuecat.com/docs/tools/paywalls
6. **Customer Center →** enable it so subscribers can manage/cancel/restore. https://www.revenuecat.com/docs/tools/customer-center

The app reads the **entitlement**, not specific product ids, so you can change pricing/products in the dashboard without shipping an update.

---

## 3. The key

`apps/native/lib/purchases.tsx` holds the key:

```ts
const API_KEYS = {
  default: "test_PRegaNHRLsFTthHRCcTUMwmndsL", // Test Store (dev)
  // android: "goog_…",
  // ios: "appl_…",
};
```

For production, uncomment the platform keys — `resolveApiKey()` already prefers them per platform. Best practice: move the real keys into `@lockedin/env` rather than committing them.

---

## 4. Configuration & state (`lib/purchases.tsx`)

`PurchasesProvider` (mounted in `app/_layout.tsx`, above the navigator) does all of this:

- **Configure once** on mount: `Purchases.configure({ apiKey })`, with `setLogLevel(DEBUG)` in `__DEV__`.
- **Retrieve customer info**: `await Purchases.getCustomerInfo()`.
- **Subscribe to updates**: `Purchases.addCustomerInfoUpdateListener(...)` so Pro status updates the moment a purchase/restore completes — never poll.
- **Load offerings**: `await Purchases.getOfferings()` → `offerings.current`.
- **Entitlement check**: `!!customerInfo.entitlements.active["LockedIn Pro"]` — this is the source of truth, exposed as `isPro`.

Everything is wrapped in `try/catch` so that if the SDK can't configure (e.g. running without a dev build) or offerings aren't set up yet, **the app keeps working on the free tier** instead of crashing.

Consume it anywhere:

```ts
import { usePurchases } from "@/lib/purchases";

const { isPro, presentPaywall, restore, presentCustomerCenter } = usePurchases();

// Gate a Pro feature:
if (!isPro) {
  await presentPaywall();
}
```

---

## 5. Presenting the paywall

We use the RevenueCat-hosted paywall UI (the modern approach — no hand-built purchase buttons):

```ts
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

const result = await RevenueCatUI.presentPaywall();
const purchased =
  result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED;
```

There's also `presentPaywallIfNeeded({ requiredEntitlementIdentifier: "LockedIn Pro" })`, which only shows the paywall if the user isn't already entitled — handy for gating a specific feature tap.

**Where it's wired:** the Streak screen's Pro card calls `presentPaywall()` when an offering is available. If offerings aren't configured yet (`paywallAvailable === false`), it falls back to the in-app `app/paywall.tsx` screen so there's always *something* to show. Once a subscriber, the same card flips to "LockedIn Pro · active" and opens the **Customer Center** instead.

---

## 5b. Hard paywall gate + 2-day free trial

The app is **gated**: `components/paywall-gate.tsx` wraps the tabbed app (`app/(tabs)/_layout.tsx`). The flow:

1. **Onboarding finishes** → the user lands in the tabs → the gate runs.
2. **Not entitled** → the gate renders the full-screen RevenueCat paywall (`<RevenueCatUI.Paywall>`) with **no dismiss** — the only way forward is the paywall's CTA.
3. **They start the 2-day free trial** (or subscribe) → RevenueCat grants the **`LockedIn Pro`** entitlement → `isPro` flips true via the customer-info listener → the gate renders the app.
4. **Trial ends without converting** → the entitlement lapses → `isPro` flips false → the gate shows the paywall again, **unskippable**, until they subscribe.

All of this is **entitlement-driven** — there's no timer in our code counting the 2 days. The "2 days then hard lock" behaviour comes entirely from configuring a **free trial (introductory offer)** on the subscription products:

- In **Google Play Console**, add a **free trial** offer (2 days) to the `monthly` and `yearly` base plans.
- In **RevenueCat**, make sure those products are attached to the `LockedIn Pro` entitlement and included in the `default` offering's packages.
- Design the paywall (RevenueCat **Paywalls**) so its primary button reads **"Start 2-day free trial"** and, ideally, **without a close button** (it's a hard gate).

During the trial the entitlement is active, so the app is fully usable; when it expires the entitlement disappears and the gate re-locks — automatically.

**Safety valve:** the gate **fails open** if there's no offering to present (`paywallAvailable === false`) — e.g. a dev build with nothing configured, or a launch-time network failure. This prevents the app from bricking itself behind a paywall it can't show. Once your `default` offering + paywall are live, the gate is hard. If you want it to fail *closed* instead, remove the `|| !paywallAvailable` check in `paywall-gate.tsx`.

---

## 6. Customer Center

```ts
await RevenueCatUI.presentCustomerCenter();
```

Exposed as `presentCustomerCenter()` and surfaced from the Streak Pro card for active subscribers. It handles manage/cancel/restore/refund flows so you don't have to build them.

---

## 7. Restoring purchases

```ts
const info = await Purchases.restorePurchases();
const isPro = !!info.entitlements.active["LockedIn Pro"];
```

Exposed as `restore()`. The Customer Center also offers restore, but keep a "Restore purchases" affordance on any standalone paywall for store-review compliance.

---

## 8. Best practices applied here

- **Entitlement is the source of truth** — never persist "isPro" locally as the authority; always read `customerInfo.entitlements.active`.
- **Listen, don't poll** — `addCustomerInfoUpdateListener` keeps UI in sync after purchases, restores, renewals, and expirations.
- **Fail open** — every RevenueCat call is guarded; failures degrade to the free tier or the fallback paywall, never a crash.
- **Configure once**, as early as possible, above the navigation tree.
- **Dashboard-driven** — pricing, products, and paywall design live in RevenueCat, so they change without an app release.
- **Test Store for dev**, platform keys for production.

---

## 9. Files

| File | Role |
|---|---|
| `lib/purchases.tsx` | `PurchasesProvider` + `usePurchases()` — config, entitlement, offerings, paywall, customer center, restore |
| `app/_layout.tsx` | Mounts `PurchasesProvider` above the navigator |
| `app/(tabs)/streak.tsx` | Pro CTA: present paywall / customer center, reflects `isPro` |
| `app/paywall.tsx` | In-app fallback paywall when the hosted paywall isn't available |
