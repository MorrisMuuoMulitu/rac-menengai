/**
 * Meeting / event date helpers.
 *
 * The club meets every Thursday 17:30 East Africa Time (UTC+3, no DST).
 * All date math runs against the Nairobi wall clock so the shown date and
 * countdown stay correct regardless of the visitor's timezone.
 */

const NAIROBI_TZ = 'Africa/Nairobi';

interface WallTime {
  y: number;
  m: number; // 1-12
  d: number;
  h: number; // 0-23
  min: number;
}

/** Wall-clock components of `date` in East Africa Time. */
function wallInNairobi(date: Date): WallTime {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: NAIROBI_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  let h = get('hour');
  if (h === 24) h = 0; // some engines report 24:xx for midnight
  return { y: get('year'), m: get('month'), d: get('day'), h, min: get('minute') };
}

/**
 * The Date (absolute instant) of the next Thursday 17:30 Nairobi time —
 * handling the "it is Thursday before/after 5:30 PM" edge cases.
 */
export function nextMeetingDate(from: Date = new Date()): Date {
  const wall = wallInNairobi(from);
  const calendar = Date.UTC(wall.y, wall.m - 1, wall.d, 0, 0, 0, 0);
  const dow = new Date(calendar).getUTCDay(); // 0 = Sunday … 4 = Thursday
  let diff = (4 - dow + 7) % 7;
  if (diff === 0) {
    const nowMinutes = wall.h * 60 + wall.min;
    if (nowMinutes >= 17 * 60 + 30) diff = 7; // Thursday meeting already started today
  }
  // Nairobi is UTC+3, so the instant for wall-clock 17:30 is UTC 14:30 that day.
  const instant = Date.UTC(wall.y, wall.m - 1, wall.d + diff, 17, 30, 0, 0) - 3 * 3600 * 1000;
  return new Date(instant);
}

/** e.g. "Thursday, 5 March 2026" — the real date, in East Africa Time. */
export function formatMeetingDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: NAIROBI_TZ,
  }).format(date);
}

/** e.g. "5:30–6:30 PM East Africa Time" */
export function formatMeetingTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: NAIROBI_TZ,
  }).format(date);
}

export interface CountdownParts {
  d: number;
  h: number;
  m: number;
  ms: number;
}

export function countdownParts(target: Date, from: Date = new Date()): CountdownParts {
  const ms = Math.max(0, target.getTime() - from.getTime());
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    ms,
  };
}

/**
 * Human phrasing for the countdown. Always pairs with the real date elsewhere
 * in the UI, so a timer is never the only signal.
 */
export function describeCountdown(target: Date, from: Date = new Date()): string {
  const { d, h, m } = countdownParts(target, from);
  if (d === 0 && h === 0 && m === 0) return 'now';
  if (d === 0 && h === 0) return `in ${Math.max(1, m)} min`;
  if (d === 0 && h === 1) return `in 1 hr ${m} min`;
  if (d === 0) return `in ${h} hrs ${m} min`;
  if (d === 1) return `in 1 day ${h} hrs`;
  return `in ${d} days ${h} hrs`;
}

/** Short label for opportunity cards: "Today", "Tomorrow" or a weekday. */
export function meetingDayLabel(target: Date, from: Date = new Date()): 'Today' | 'Tomorrow' | string {
  const wallFrom = wallInNairobi(from);
  const wallTarget = wallInNairobi(target);
  const dayDiff =
    Math.floor(Date.UTC(wallTarget.y, wallTarget.m - 1, wallTarget.d) / 86400000) -
    Math.floor(Date.UTC(wallFrom.y, wallFrom.m - 1, wallFrom.d) / 86400000);
  if (dayDiff === 0) return 'Today';
  if (dayDiff === 1) return 'Tomorrow';
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: NAIROBI_TZ }).format(target);
}