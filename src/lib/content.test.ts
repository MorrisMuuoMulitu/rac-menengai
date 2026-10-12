import { describe, it, expect } from "vitest";
import { PUBLIC_STORIES, PUBLIC_EVENTS, PUBLIC_ACCOUNTS } from "../content";
import stories from "../../content/stories/index.json";
import { MEMBERSHIP, ORIENTATION } from "../data";
describe("public content boundaries", () => {
  it("never includes unapproved research in public stories", () => {
    for (const draft of stories.filter((s) => s.status === "draft"))
      expect(PUBLIC_STORIES.some((s) => s.slug === draft.slug)).toBe(false);
  });
  it("requires approval and dates for every public story", () => {
    for (const story of PUBLIC_STORIES) {
      expect(story.approval).toBeTruthy();
      expect(story.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(story.sourceUrl).toMatch(/^https:\/\//);
    }
  });
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
    expect(ORIENTATION.requiredBeforeInduction).toBe(false);
  });
});
