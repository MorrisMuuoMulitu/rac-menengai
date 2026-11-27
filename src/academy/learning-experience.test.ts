import { describe, expect, it } from "vitest";
import { assessmentDraftIdentity } from "./learning-experience";
import { lessonSections } from "../../shared/rotaract-academy/sections";

describe("learning experience", () => {
  it("isolates draft answers by learner and exact question order", () => {
    const questions = [
      { id: "a", options: ["yes", "no"] },
      { id: "b", options: ["one", "two"] },
    ];
    const first = assessmentDraftIdentity("v2", "member-a", questions);
    expect(first).not.toBe(
      assessmentDraftIdentity("v2", "member-b", questions),
    );
    expect(first).not.toBe(
      assessmentDraftIdentity("v2", "member-a", [...questions].reverse()),
    );
    expect(first).not.toBe(
      assessmentDraftIdentity("v2", "member-a", [
        { ...questions[0], options: ["no", "yes"] },
        questions[1],
      ]),
    );
  });
  it("keeps a paragraph and its supporting list together without losing blocks", () => {
    const blocks = [
      { kind: "p" as const, text: "First idea." },
      { kind: "list" as const, items: ["Detail"] },
      { kind: "p" as const, text: "Next idea." },
      { kind: "note" as const, text: "Remember." },
    ];
    const sections = lessonSections(blocks);
    expect(sections).toHaveLength(2);
    expect(sections.flat()).toEqual(blocks);
    expect(lessonSections([])).toEqual([]);
  });
});
