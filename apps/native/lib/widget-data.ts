import { File, Paths } from "expo-file-system";
import * as Linking from "expo-linking";
import { widgetsDirectory } from "expo-widgets";
import { Platform } from "react-native";

import { loadState } from "./storage";

/**
 * Deep link that opens the app straight into a focus session for `taskId`.
 * Built through expo-linking rather than hardcoding "excuseless://" so it
 * stays correct for dev/preview builds, which use a suffixed scheme.
 */
export function buildStartUri(taskId: string): string {
  return Linking.createURL("/focus", { queryParams: { start: taskId } });
}

export type WidgetData = {
  nextTask: {
    id: string;
    title: string;
    durationMin: number;
    goalTitle?: string;
  } | null;
  /** Distinct goals with pending work, so widgets can say "across 3 goals". */
  activeGoalCount: number;
  session: {
    active: boolean;
    paused: boolean;
    taskTitle: string;
    remaining: number;
    total: number;
  };
  todayStats: {
    completed: number;
    skipped: number;
    focusSeconds: number;
    totalPending: number;
  };
  streak: number;
  updatedAt: string;
};

const DATA_FILENAME = "widget-data.json";

function getWidgetFile(): File {
  const parent =
    Platform.OS === "ios" ? (widgetsDirectory as string) : Paths.document;
  return new File(parent, DATA_FILENAME);
}

export function emptyWidgetData(): WidgetData {
  return {
    nextTask: null,
    activeGoalCount: 0,
    session: { active: false, paused: false, taskTitle: "", remaining: 0, total: 0 },
    todayStats: { completed: 0, skipped: 0, focusSeconds: 0, totalPending: 0 },
    streak: 0,
    updatedAt: new Date().toISOString(),
  };
}

export async function readWidgetData(): Promise<WidgetData> {
  try {
    const raw = await getWidgetFile().text();
    return JSON.parse(raw) as WidgetData;
  } catch {
    return emptyWidgetData();
  }
}

export async function syncWidgetData(): Promise<WidgetData> {
  const state = await loadState();
  const pending = state.tasks.filter((t) => t.status === "pending");
  const doneToday = state.tasks.filter(
    (t) => t.status === "done" && t.completedAt && isSameDay(new Date(t.completedAt), new Date()),
  );
  const skippedToday = state.tasks.filter(
    (t) =>
      t.status === "skipped" && t.completedAt && isSameDay(new Date(t.completedAt), new Date()),
  );
  const focusSeconds = doneToday.reduce((sum, t) => sum + (t.focusSeconds ?? 0), 0);

  const data: WidgetData = {
    nextTask: pending[0]
      ? {
          id: pending[0].id,
          title: pending[0].title,
          durationMin: pending[0].durationMin,
          goalTitle: state.goals.find((g) => g.id === pending[0].goalId)?.title,
        }
      : null,
    activeGoalCount: new Set(pending.map((t) => t.goalId).filter(Boolean)).size,
    session: state.session
      ? {
          active: true,
          paused: !!state.session.pausedAt,
          taskTitle: state.tasks.find((t) => t.id === state.session!.taskId)?.title ?? "",
          remaining: computeRemaining(state.session),
          total: state.session.durationSec,
        }
      : { active: false, paused: false, taskTitle: "", remaining: 0, total: 0 },
    todayStats: {
      completed: doneToday.length,
      skipped: skippedToday.length,
      focusSeconds,
      totalPending: pending.length,
    },
    streak: state.stats.streak,
    updatedAt: new Date().toISOString(),
  };

  try {
    await getWidgetFile().write(JSON.stringify(data));
  } catch {
    // best-effort — widget may not be registered yet
  }

  return data;
}

function computeRemaining(session: {
  startedAt: string;
  durationSec: number;
  pausedAt: string | null;
  pausedAccumSec: number;
}): number {
  const now = Date.now();
  const started = new Date(session.startedAt).getTime();
  const pausedExtra = session.pausedAt
    ? (now - new Date(session.pausedAt).getTime()) / 1000
    : 0;
  const elapsed = Math.max(
    0,
    Math.floor((now - started) / 1000 - session.pausedAccumSec - pausedExtra),
  );
  return Math.max(0, session.durationSec - elapsed);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDurationShort(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ""}`;
  if (m > 0) return `${m}m`;
  return `${totalSeconds}s`;
}