export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isToday(iso: string | null | undefined): boolean {
  if (!iso) return false;
  return dayKey(new Date(iso)) === dayKey();
}

export function isYesterday(key: string | null): boolean {
  if (!key) return false;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return key === dayKey(y);
}

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${totalSeconds}s`;
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function formatDateLabel(d: Date = new Date()): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function enumerateDays(fromKey: string, toKey: string): string[] {
  const out: string[] = [];
  const d = new Date(`${fromKey}T00:00:00`);
  const end = new Date(`${toKey}T00:00:00`);
  let guard = 0;
  while (d <= end && guard < 1000) {
    out.push(dayKey(d));
    d.setDate(d.getDate() + 1);
    guard += 1;
  }
  return out;
}
