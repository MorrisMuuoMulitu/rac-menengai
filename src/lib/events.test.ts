import { describe, it, expect } from "vitest";
import { eventStatus, calendarFile, sortEvents } from "./events";
const event = {
  slug: "test",
  title: "Nakuru; fellowship",
  start: "2026-10-15T17:30:00+03:00",
  end: "2026-10-15T18:30:00+03:00",
  location: "Nakuru, Kenya",
  description: "Meet\nServe",
  status: "scheduled" as const,
};
describe("event lifecycle and calendar", () => {
  it("moves an event into the archive at its exact end", () => {
    expect(eventStatus(event, new Date("2026-10-15T15:30:00Z"))).toBe("past");
  });
  it("does not advertise cancelled events as upcoming", () => {
    expect(
      eventStatus({ ...event, status: "cancelled" }, new Date("2026-10-12")),
    ).toBe("cancelled");
  });
  it("exports timezone-safe times and escaped calendar text", () => {
    const file = calendarFile(event);
    expect(file).toContain("DTSTART:20261015T143000Z");
    expect(file).toContain("SUMMARY:Nakuru\\; fellowship");
    expect(file).toContain("LOCATION:Nakuru\\, Kenya");
    expect(file).toContain("\r\nEND:VCALENDAR\r\n");
  });
  it("sorts upcoming events chronologically", () => {
    expect(
      sortEvents(
        [
          { ...event, slug: "later", start: "2026-11-01T12:00:00+03:00" },
          event,
        ],
        "upcoming",
      )[0].slug,
    ).toBe("test");
  });
});
