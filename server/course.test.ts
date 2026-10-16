import { expect, it } from "vitest";
import { FULL_COURSE } from "./course";
import { COURSE_INFO } from "../src/course-info";
import { scoreQuiz } from "../src/lib/orientation";
it("keeps the public syllabus consistent with the private course", () => {
  expect(FULL_COURSE.modules.map((m) => m.id)).toEqual(
    COURSE_INFO.lessons.map((m) => m.id),
  );
  expect(FULL_COURSE.modules.reduce((sum, m) => sum + m.minutes, 0)).toBe(
    COURSE_INFO.minutes,
  );
  expect(FULL_COURSE.questions).toHaveLength(COURSE_INFO.questionCount);
  /* Every question belongs to a lesson that exists. */
  const lessonIds = new Set(FULL_COURSE.modules.map((m) => m.id));
  expect(
    FULL_COURSE.questions.every((q) => lessonIds.has(q.lessonId)),
  ).toBe(true);
  /* And every lesson is checked at least once, so no part of the course is
     taught but never assessed. */
  const assessed = new Set(FULL_COURSE.questions.map((q) => q.lessonId));
  for (const module of FULL_COURSE.modules)
    expect(assessed.has(module.id), `${module.id} is never assessed`).toBe(true);
  expect(new Set(FULL_COURSE.questions.map((q) => q.id)).size).toBe(
    FULL_COURSE.questions.length,
  );
  expect(
    FULL_COURSE.questions.every(
      (q) => q.correctIndex >= 0 && q.correctIndex < q.options.length,
    ),
  ).toBe(true);
  expect(
    FULL_COURSE.modules.every(
      (m) =>
        m.objectives.length >= 2 &&
        m.activity.length > 50 &&
        m.blocks.length >= 4,
    ),
  ).toBe(true);
});
it("applies the real course pass boundary correctly", () => {
  const answers = FULL_COURSE.questions.map((q) => q.correctIndex);
  const allowedWrong = FULL_COURSE.questions.length - FULL_COURSE.passMark;
  const attempt = (wrong: number) =>
    answers.map((a, i) => (i < wrong ? (a + 1) % 4 : a));
  expect(
    scoreQuiz(
      attempt(allowedWrong),
      FULL_COURSE.questions,
      FULL_COURSE.passMark,
    ).passed,
  ).toBe(true);
  expect(
    scoreQuiz(
      attempt(allowedWrong + 1),
      FULL_COURSE.questions,
      FULL_COURSE.passMark,
    ).passed,
  ).toBe(false);
  expect(FULL_COURSE.requiredBeforeInduction).toBe(false);
});
