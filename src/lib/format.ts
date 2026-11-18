/* Hebrew date / time formatting. Client-safe. */

const TZ = "Asia/Jerusalem";

/** "יום חמישי, 12 בדצמבר" — from a YYYY-MM-DD string (no timezone drift). */
export function formatEventDate(date: string | null, withYear = false): string | null {
  if (!date) return null;
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  }).format(dt);
}

export function formatEventTime(time: string | null, endTime?: string | null): string | null {
  if (!time) return null;
  return endTime ? `${time}–${endTime}` : time;
}

/** "10.11.2026, 14:05" in Jerusalem time. */
export function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  }).format(new Date(iso));
}

/** "לפני 5 דקות" style relative time. */
export function formatRelative(iso: string, now = Date.now()): string {
  const diff = (new Date(iso).getTime() - now) / 1000;
  const rtf = new Intl.RelativeTimeFormat("he", { numeric: "auto" });
  const abs = Math.abs(diff);
  if (abs < 60) return "הרגע";
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), "day");
  return formatTimestamp(iso);
}

export function mapsLinks(address: string) {
  const q = encodeURIComponent(address);
  return {
    waze: `https://waze.com/ul?q=${q}&navigate=yes`,
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
  };
}
