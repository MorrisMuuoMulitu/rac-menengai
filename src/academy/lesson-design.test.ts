import { expect, it } from "vitest";
import { LESSON_DESIGN } from "./lesson-design";
import { FULL_COURSE } from "../../server/course";
import { lessonSections } from "../../shared/rotaract-academy/sections";

it("gives every taught section a meaningful name and each lesson a practice check", () => {
  for (const lesson of FULL_COURSE.modules) {
    const design = LESSON_DESIGN[lesson.id];
    expect(design, lesson.id).toBeDefined();
    expect(design.sections).toHaveLength(lessonSections(lesson.blocks).length);
    expect(new Set(design.sections).size).toBe(design.sections.length);
    expect(design.check.options.length).toBeGreaterThanOrEqual(3);
    expect(design.check.correct).toBeGreaterThanOrEqual(0);
    expect(design.check.correct).toBeLessThan(design.check.options.length);
    expect(design.check.explanation.length).toBeGreaterThan(35);
  }
});
