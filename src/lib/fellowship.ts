/**
 * Recurring fellowship event system.
 *
 * The club meets weekly on Thursdays 17:30–18:30 East Africa Time (UTC+3,
 * no DST). All calculations run against the Nairobi wall clock, so the shown
 * date/time and state are correct regardless of the visitor's timezone.
 *
 * Configuration is centralized here (and mirrored for content in `data.ts`)
 * so a club officer can edit the schedule or announce a holiday override
 * without touching UI code.
 */

export const fellowship = {
  weekday: "Thursday",
  weekdayIndex: 4, // JS Date.getDay(): 0=Sun … 4=Thu
  startHour: 17,
  startMinute: 30,
  endHour: 18,
  endMinute: 30,
  timezone: "Africa/Nairobi",
  location: "Nakuru, Kenya",
  /** Set via data.ts override when the club changes the weekly schedule. */
  override: null as null | { message: string },
};

export type FellowshipState =
  | { kind: "live"; start: Date; end: Date }
  | { kind: "today"; start: Date; end: Date }
  | { kind: "upcoming"; start: Date; end: Date }
  | { kind: "override"; message: string };

interface WallTime {
  y: number;
  m: number; // 1-12
  d: number;
  h: number;
  min: number;
}

/** Wall-clock components of `date` in the configured timezone. */
export function wallClock(
  date: Date,
  timeZone: string = fellowship.timezone,
): WallTime {
  // Invalid system clock (e.g. NaN date) — fall back to "now" so the UI never
  // computes broken dates or shows a stale countdown.
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    date = new Date();
  }
  if (
    typeof Intl === "undefined" ||
    typeof Intl.DateTimeFormat !== "function"
  ) {
    // Last-resort fallback: assume UTC so the site never crashes.
    return {
      y: date.getUTCFullYear(),
      m: date.getUTCMonth() + 1,
      d: date.getUTCDate(),
      h: date.getUTCHours(),
      min: date.getUTCMinutes(),
    };
  }
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) =>
    Number(parts.find((p) => p.type === t)?.value ?? 0);
  let h = get("hour");
  if (h === 24) h = 0; // some engines report 24:xx for midnight
  return {
    y: get("year"),
    m: get("month"),
    d: get("day"),
    h,
    min: get("minute"),
  };
}

/** UTC offset in minutes for the configured timezone at `date` (Nairobi is +180, no DST). */
function tzOffsetMinutes(timeZone: string, date: Date): number {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    });
    const part =
      dtf.formatToParts(date).find((p) => p.type === "timeZoneName")?.value ??
      "GMT+3";
    const m = part.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!m) return 3 * 60; // Nairobi default
    const sign = m[1] === "-" ? -1 : 1;
    return sign * (Number(m[2]) * 60 + Number(m[3] ?? 0));
  } catch {
    return 3 * 60;
  }
}

/**
 * The absolute instant of a given wall time (y/m/d/h/min) in the configured
 * timezone. Uses the real offset so it stays correct if a zone ever drops or
 * adopts DST.
 */
export function instantAtWall(
  wall: WallTime,
  h: number,
  min: number,
  timeZone: string = fellowship.timezone,
): Date {
  // Reference instant for N weeks later (offsets don't change weekly; ok).
  const base = new Date(Date.UTC(wall.y, wall.m - 1, wall.d, 0, 0, 0, 0));
  const offset = tzOffsetMinutes(timeZone, base);
  // wall 00:00 local = UTC 00:00 - offset
  const localMidnightUtc = base.getTime() - offset * 60_000;
  return new Date(localMidnightUtc + (h * 60 + min) * 60_000);
}

/** True when `now` is a Thursday in the fellowship window (in club timezone). */
export function isFellowshipLive(now: Date = new Date()): boolean {
  const wall = wallClock(now);
  if (wall.h < fellowship.startHour) return false;
  if (wall.h === fellowship.startHour && wall.min < fellowship.startMinute)
    return false;
  if (wall.h > fellowship.endHour) return false;
  if (wall.h === fellowship.endHour && wall.min >= fellowship.endMinute)
    return false;
  const dow = new Date(Date.UTC(wall.y, wall.m - 1, wall.d)).getUTCDay();
  return dow === fellowship.weekdayIndex;
}

/**
 * Convenience: the date (absolute instant) of the next fellowship that is not
 * yet over, resolving the "it is Thursday before / during / after 5:30 PM"
 * cases. For UI statuses, prefer `fellowshipStatus()`.
 */
export function nextFellowshipDate(from: Date = new Date()): Date {
  const status = fellowshipStatus(from);
  return status.kind === "override" ? new Date(NaN) : status.start;
}

function startInstant(wall: WallTime, daysAhead: number): Date {
  return instantAtWall(
    wall,
    fellowship.startHour,
    fellowship.startMinute,
    fellowship.timezone,
  );
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

/**
 * Full state for the UI:
 * - `live`     — Thursday 17:30–18:30 right now → "Fellowship is happening now"
 * - `today`    — Thursday before 17:30 → "Today at 5:30 PM"
 * - `upcoming` — otherwise → "Thursday, [date] · 5:30–6:30 PM"
 * - `override` — holiday/special-event announcement (from data.ts)
 */
export function fellowshipStatus(
  now: Date = new Date(),
  cfg: typeof fellowship = fellowship,
): FellowshipState {
  if (cfg.override) return { kind: "override", message: cfg.override.message };
  const wall = wallClock(now, cfg.timezone);
  const dow = new Date(Date.UTC(wall.y, wall.m - 1, wall.d)).getUTCDay();
  const minutes = wall.h * 60 + wall.min;
  const startMinutes = cfg.startHour * 60 + cfg.startMinute;
  const endMinutes = cfg.endHour * 60 + cfg.endMinute;

  if (
    dow === cfg.weekdayIndex &&
    minutes >= startMinutes &&
    minutes < endMinutes
  ) {
    return {
      kind: "live",
      start: instantAtWall(wall, cfg.startHour, cfg.startMinute, cfg.timezone),
      end: instantAtWall(wall, cfg.endHour, cfg.endMinute, cfg.timezone),
    };
  }

  // Next fellowship: same day when it's Thursday before the start, otherwise
  // the following Thursday (handles "after 6:30 PM on Thursday" correctly).
  let diff = (cfg.weekdayIndex - dow + 7) % 7;
  if (diff === 0 && minutes >= startMinutes) diff = 7;
  const next = addDays(
    instantAtWall(wall, cfg.startHour, cfg.startMinute, cfg.timezone),
    diff,
  );

  if (dow === cfg.weekdayIndex && diff === 0) {
    return { kind: "today", start: next, end: endInstantFrom(next, cfg) };
  }
  return { kind: "upcoming", start: next, end: endInstantFrom(next, cfg) };
}

function endInstantFrom(start: Date, cfg: typeof fellowship): Date {
  const durMin =
    cfg.endHour * 60 + cfg.endMinute - (cfg.startHour * 60 + cfg.startMinute);
  return new Date(start.getTime() + durMin * 60_000);
}

/** "Thursday, 5 March 2026" — real date in club timezone. */
export function formatMeetingDate(
  date: Date,
  timeZone: string = fellowship.timezone,
): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone,
    }).format(date);
  } catch {
    return date.toDateString();
  }
}

/** "5:30–6:30 PM" built from the config (not hardcoded). */
export function meetingTimeLabel(cfg: typeof fellowship = fellowship): string {
  const fmt = (h: number, m: number, period: boolean): string => {
    if (!period)
      return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")}`;
    return `${fmt(h, m, false)} ${h >= 12 ? "PM" : "AM"}`;
  };
  return `${fmt(cfg.startHour, cfg.startMinute, false)}–${fmt(cfg.endHour, cfg.endMinute, true)}`;
}

/** "Thursday, [date] · 5:30–6:30 PM · Nakuru" — the canonical one-liner. */
export function fellowshipLine(status: FellowshipState): string {
  switch (status.kind) {
    case "override":
      return status.message;
    case "live":
      return `Fellowship is happening now · ${fellowship.location}`;
    case "today":
      return `Fellowship today at 5:30 PM · ${fellowship.location}`;
    case "upcoming":
      return `Next fellowship: ${formatMeetingDate(status.start)} · ${meetingTimeLabel()} · ${fellowship.location}`;
  }
}

export interface CountdownParts {
  d: number;
  h: number;
  m: number;
  ms: number;
}

/** Non-negative countdown (clamped at 0; never NaN, stale or negative). */
export function countdownParts(
  target: Date,
  from: Date = new Date(),
): CountdownParts {
  const raw = target.getTime() - from.getTime();
  const ms = Number.isFinite(raw) ? Math.max(0, raw) : 0;
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    ms,
  };
}

/** "Today" / "Tomorrow" / "Thursday" — short day label for cards. */
export function meetingDayLabel(
  target: Date,
  from: Date = new Date(),
  timeZone: string = fellowship.timezone,
): "Today" | "Tomorrow" | string {
  const wallTarget = wallClock(target, timeZone);
  const wallFrom = wallClock(from, timeZone);
  const dayDiff =
    Math.floor(
      Date.UTC(wallTarget.y, wallTarget.m - 1, wallTarget.d) / 86_400_000,
    ) -
    Math.floor(Date.UTC(wallFrom.y, wallFrom.m - 1, wallFrom.d) / 86_400_000);
  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Tomorrow";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      timeZone,
    }).format(target);
  } catch {
    return "Thursday";
  }
}

/**
 * Human phrase for a countdown that never shows stale values:
 * "now" / "in 45 min" / "in 3 hrs" / "in 2 days 6 hrs".
 */
export function describeCountdown(
  start: Date,
  end: Date,
  from: Date = new Date(),
): string {
  if (from >= start && from < end) return "now — the fellowship is live";
  const { d, h, m } = countdownParts(start, from);
  if (d === 0 && h === 0 && m === 0) return "in less than a minute";
  if (d === 0 && h === 0) return `in about ${Math.max(1, m)} min`;
  if (d === 0 && h === 1) return `in about 1 hr ${Math.max(m, 0)} min`;
  if (d === 0) return `in about ${h} hrs`;
  if (d === 1) return `in 1 day ${h} hrs`;
  return `in ${d} days ${h} hrs`;
}
