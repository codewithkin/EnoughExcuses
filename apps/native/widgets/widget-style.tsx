"use no memo";
import { FlexWidget, OverlapWidget, SvgWidget, TextWidget } from "react-native-android-widget";

// Shared design tokens + chrome for the Android home screen widgets, so all
// three read as one family and match the in-app design system.
//
// Constraint worth knowing: react-native-android-widget compiles to Android
// RemoteViews, which supports only a subset of layout/style props — no
// gradients, no shadows, no rgba alpha. So the app's soft green glow is
// approximated with pre-blended solid colours (green over the card bg,
// computed by hand) stacked in an OverlapWidget, and icons come through as
// inline SVG strings rather than an icon font (which would need registering
// in the config plugin).

export const WIDGET = {
  ink: "#0A0A0A",
  card: "#16161A",
  line: "#262630",
  fg: "#ECEAE6",
  muted: "#8A8A94",
  green: "#34D399",
  greenDeep: "#059669",
  /** #34D399 at ~6% over #16161A, pre-blended. */
  glowOuter: "#1A2723",
  /** #34D399 at ~12% over #16161A. */
  glowInner: "#1E332C",
} as const;

export const APP_NAME = "EXCUSELESS";

/** Small wordmark for widget branding. */
export function Wordmark({ dim = false }: { dim?: boolean }) {
  return (
    <TextWidget
      text={APP_NAME}
      style={{
        fontSize: 9,
        fontFamily: "JetBrainsMono-Medium",
        color: dim ? WIDGET.line : WIDGET.muted,
      }}
    />
  );
}

export const playSvg = (color: string) => `
<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
  <path fill="${color}" d="M8 5.1v13.8c0 .8.9 1.3 1.5.8l10.2-6.9c.6-.4.6-1.2 0-1.6L9.5 4.3c-.6-.5-1.5 0-1.5.8Z"/>
</svg>`;

export const flameSvg = (color: string) => `
<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
  <path fill="${color}" d="M12 2c.6 3.1-1 4.8-2.5 6.3C8 9.8 6.5 11.3 6.5 14a5.5 5.5 0 0 0 11 0c0-2.2-1-3.6-2-5-.4 1-1.1 1.7-2 2 .6-2.4-.4-5.2-1.5-9Z"/>
</svg>`;

export const checkSvg = (color: string) => `
<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
  <path fill="${color}" d="M9.5 17.6 4 12.1l1.8-1.8 3.7 3.7L18.2 5l1.8 1.8Z"/>
</svg>`;

export const boltSvg = (color: string) => `
<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
  <path fill="${color}" d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z"/>
</svg>`;

/** Layered green halo standing in for the in-app glow decoration. */
export function GlowMark({ svg, active = false }: { svg: string; active?: boolean }) {
  return (
    <OverlapWidget style={{ width: 62, height: 62 }}>
      <FlexWidget
        style={{
          width: 62,
          height: 62,
          borderRadius: 31,
          backgroundColor: active ? WIDGET.glowOuter : WIDGET.card,
        }}
      />
      <FlexWidget
        style={{
          width: 62,
          height: 62,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FlexWidget
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: active ? WIDGET.glowInner : WIDGET.line,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SvgWidget svg={svg} style={{ width: 22, height: 22 }} />
        </FlexWidget>
      </FlexWidget>
    </OverlapWidget>
  );
}

/**
 * Card chrome shared by every widget: full-bleed rounded surface, a left
 * accent rail that lights up green during an active session, the content
 * column, and a trailing glow mark.
 */
export function WidgetShell({
  children,
  accent = false,
  mark,
}: {
  children: React.ReactNode;
  accent?: boolean;
  mark?: React.ReactNode;
}) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: WIDGET.card,
        borderRadius: 24,
      }}
    >
      <FlexWidget
        style={{
          width: 5,
          height: "match_parent",
          backgroundColor: accent ? WIDGET.green : WIDGET.line,
        }}
      />

      <FlexWidget
        style={{
          flex: 1,
          height: "match_parent",
          flexDirection: "column",
          justifyContent: "center",
          paddingHorizontal: 18,
          paddingVertical: 16,
        }}
      >
        {children}
      </FlexWidget>

      {mark ? (
        <FlexWidget style={{ paddingHorizontal: 14 }}>{mark}</FlexWidget>
      ) : null}
    </FlexWidget>
  );
}
