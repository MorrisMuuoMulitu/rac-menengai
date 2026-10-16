import { expect, it } from "vitest";
import { createCourse } from "./course";
import { CHAPTERS, COURSE_INFO } from "./syllabus";
import { MENENGAI_LEARNING_PROFILE } from "../../src/club-learning-profile";

it("uses a separate club profile without carrying Menengai facts into another club", () => {
  const other = {
    ...MENENGAI_LEARNING_PROFILE,
    id: "other",
    name: "Rotaract Club of Example",
    shortName: "Example",
    city: "Example City",
    district: "District Example",
    districtDescription: "The example district's approved region.",
    districtUrl: "https://example.org/district",
    sponsor: "Rotary Club of Example",
    meeting: "Mondays, 6 pm at Example Hall",
    venue: "Example Hall",
    fees: "Confirm fees with the membership team.",
    guestPolicy: "Visitors are welcome by arrangement.",
    joining: "Attend a fellowship and speak with the membership team.",
    examples: "A local literacy project.",
    evidence: "Use the club's approved event records.",
    partnership: "A joint literacy activity with a neighbouring club.",
  };
  const course = createCourse(other);
  const text = JSON.stringify(course);
  expect(text).toContain("Example Hall");
  expect(text).not.toMatch(
    /Menengai|Nakuru Athletic|Bondeni|Kabatini|Pangani|District 9215/,
  );
  expect(course.modules.map((lesson) => lesson.id)).toEqual(
    COURSE_INFO.lessons.map((lesson) => lesson.id),
  );
  expect(course.questions).toHaveLength(28);
});

it("organises every lesson once into six chapters and preserves the pass boundary", () => {
  const ids = CHAPTERS.flatMap((chapter) => chapter.lessons);
  expect(CHAPTERS).toHaveLength(6);
  expect(new Set(ids).size).toBe(COURSE_INFO.lessons.length);
  expect([...ids].sort()).toEqual(
    COURSE_INFO.lessons.map((lesson) => lesson.id).sort(),
  );
  const course = createCourse(MENENGAI_LEARNING_PROFILE);
  expect(course.passMark).toBe(23);
  expect(course.questions.every((q) => q.options[q.correctIndex])).toBe(true);
});
