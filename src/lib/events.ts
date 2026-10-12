export interface CalendarEvent {
  slug: string;
  title: string;
  start: string;
  end: string;
  location: string;
  description: string;
  status: "scheduled" | "cancelled";
}
export function eventStatus(
  event: CalendarEvent,
  now = new Date(),
): "past" | "upcoming" | "live" | "cancelled" {
  if (event.status === "cancelled") return "cancelled";
  if (new Date(event.end).getTime() <= now.getTime()) return "past";
  return new Date(event.start).getTime() <= now.getTime() ? "live" : "upcoming";
}
export function sortEvents<T extends CalendarEvent>(
  events: T[],
  view: "past" | "upcoming",
): T[] {
  return [...events].sort(
    (a, b) =>
      (new Date(a.start).getTime() - new Date(b.start).getTime()) *
      (view === "past" ? -1 : 1),
  );
}
const escape = (text: string) =>
  text
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
const utc = (date: string) =>
  new Date(date)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
export function calendarFile(event: CalendarEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RAC Menengai//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.slug}@rac-menengai.vercel.app`,
    `DTSTAMP:${utc(event.start)}`,
    `DTSTART:${utc(event.start)}`,
    `DTEND:${utc(event.end)}`,
    `SUMMARY:${escape(event.title)}`,
    `LOCATION:${escape(event.location)}`,
    `DESCRIPTION:${escape(event.description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  // RFC 5545 folds content lines at 75 UTF-8 octets; continuation starts with a space.
  return (
    lines
      .map((line) => {
        let out = "",
          part = "";
        for (const char of line) {
          if (new TextEncoder().encode(part + char).length > 75) {
            out += part + "\r\n";
            part = " ";
          }
          part += char;
        }
        return out + part;
      })
      .join("\r\n") + "\r\n"
  );
}
export function downloadCalendar(event: CalendarEvent) {
  const url = URL.createObjectURL(
    new Blob([calendarFile(event)], { type: "text/calendar;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.slug}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Prefer real upcoming occasions; otherwise lead with the recent archive. */
export function initialEventView(
  records: readonly { date: string; status?: string }[],
  now = new Date(),
): "upcoming" | "past" {
  return records.some(
    (event) =>
      event.status !== "cancelled" &&
      new Date(`${event.date}T23:59:59+03:00`).getTime() >= now.getTime(),
  )
    ? "upcoming"
    : "past";
}
