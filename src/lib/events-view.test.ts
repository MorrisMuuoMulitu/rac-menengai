import { describe, expect, it } from "vitest";
import { initialEventView } from "./events";

describe("event browsing starts with available records", () => {
  const now = new Date("2026-10-12T12:00:00+03:00");
  it("opens the archive when only completed dates are available", () => {
    expect(initialEventView([{ date: "2026-10-10" }], now)).toBe("past");
  });
  it("opens upcoming when a future occasion is announced", () => {
    expect(
      initialEventView([{ date: "2026-10-10" }, { date: "2026-10-15" }], now),
    ).toBe("upcoming");
  });
  it("keeps today's occasion upcoming until the day ends in Nairobi", () => {
    expect(
      initialEventView(
        [{ date: "2026-10-12" }],
        new Date("2026-10-12T20:59:00Z"),
      ),
    ).toBe("upcoming");
    expect(
      initialEventView(
        [{ date: "2026-10-12" }],
        new Date("2026-10-12T21:00:00Z"),
      ),
    ).toBe("past");
  });
  it("keeps cancelled occasions from selecting an otherwise empty upcoming view", () => {
    expect(
      initialEventView([{ date: "2026-10-15", status: "cancelled" }], now),
    ).toBe("past");
  });
});
