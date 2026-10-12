import { describe, it, expect } from "vitest";
import { PUBLIC_EVENTS, PUBLIC_ACCOUNTS } from "../content";
import { MEMBERSHIP } from "../data";
describe("public content boundaries", () => {
  it("requires approval for event publication", () => {
    expect(
      PUBLIC_EVENTS.every(
        (e) => e.approval && e.publicationStatus === "published",
      ),
    ).toBe(true);
  });
  it("hides unresolved social destinations", () => {
    expect(PUBLIC_ACCOUNTS.map((a) => a.platform)).toEqual([
      "Instagram",
      "Facebook",
    ]);
  });
  it("uses 18+ eligibility and avoids an unconfirmed induction mandate", () => {
    expect(MEMBERSHIP.whoCanJoin).toContain("18 and over");

  });
});
