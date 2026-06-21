import { Ionicons } from "@expo/vector-icons";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

import { Body } from "@/components/typography";
import { COLORS, RADIUS } from "@/lib/theme";

type Tone = "error" | "info";
type ToastContextType = { show: (message: string, tone?: Tone) => void };

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, tone: Tone = "info") => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, tone });
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast ? (
        <View
          pointerEvents="none"
          style={{ position: "absolute", left: 0, right: 0, bottom: 44, alignItems: "center" }}
        >
          <Animated.View
            entering={FadeInDown.duration(220)}
            exiting={FadeOutDown.duration(220)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: COLORS.elevated,
              borderWidth: 1,
              borderColor: toast.tone === "error" ? COLORS.coralDeep : COLORS.line,
              borderRadius: RADIUS.pill,
              paddingHorizontal: 16,
              paddingVertical: 12,
              maxWidth: "86%",
            }}
          >
            <Ionicons
              name={toast.tone === "error" ? "alert-circle" : "information-circle"}
              size={16}
              color={toast.tone === "error" ? COLORS.coral : COLORS.subtle}
            />
            <Body style={{ fontSize: 14 }}>{toast.message}</Body>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
