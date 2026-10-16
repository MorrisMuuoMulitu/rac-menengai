import { describe, expect, it } from "vitest";
import {
  chapterSummaries,
  courseSteps,
  resolveStep,
  resumeSlug,
  stepHref,
  stepIsDone,
  stepSlug,
  type Step,
} from "./steps";
import type { AcademyBootstrap } from "../lib/academy";
import { CHAPTERS } from "../course-info";
import { createCourse } from "../../shared/rotaract-academy/course";
import { publicCourse } from "../../shared/rotaract-academy/assessment";
import { MENENGAI_LEARNING_PROFILE } from "../club-learning-profile";

const course = publicCourse(createCourse(MENENGAI_LEARNING_PROFILE));

function bootstrap(
  patch: Partial<NonNullable<AcademyBootstrap["record"]>> = {},
): AcademyBootstrap {
  const record = {
    courseVersion: course.version,
    completedLessons: [] as string[],
    scenarioAnswers: {},
    proposal: null,
    bestScore: 0,
    attempts: 0,
    passed: false,
    passedAt: null,
    updatedAt: null,
    ...patch,
  };
  const scenarios = course.scenarios.map((scenario) => ({
    chapterId: scenario.chapterId,
    done:
      record.scenarioAnswers[scenario.id] ===
        course.scenarios.find((item) => item.id === scenario.id)?.id && false,
  }));
  return {
    signedIn: true,
    course,
    record,
    summary: {
      stage: "lessons",
      completed: record.completedLessons.length,
      total: course.modules.length + course.scenarios.length + 3,
      percent: 0,
      lessons: course.modules.map((module) => ({
        id: module.id,
        done: record.completedLessons.includes(module.id),
      })),
      scenarios,
      assessmentPassed: record.passed,
      proposalSubmitted: record.proposal !== null,
      canApply: false,
    },
  };
}

describe("steps as routes", () => {
  it("lists every lesson then its chapter check, in course order", () => {
    const steps = courseSteps(course);
    const slugs = steps.map(stepSlug);
    expect(slugs[0]).toBe("roots");
    /* The chapter check sits after the chapter's lessons, before the next. */
    expect(slugs.indexOf("check-discover")).toBeGreaterThan(
      slugs.indexOf("family"),
    );
    expect(slugs.indexOf("check-club")).toBeGreaterThan(
      slugs.indexOf("meeting"),
    );
    expect(slugs.indexOf("check-integrity")).toBeGreaterThan(
      slugs.indexOf("ethics"),
    );
    expect(slugs.slice(-3)).toEqual(["assessment", "proposal", "join"]);
  });

  it("round-trips every step through its address", () => {
    for (const step of courseSteps(course)) {
      const slug = stepSlug(step);
      expect(stepHref(step)).toBe(`/membership/academy/${slug}`);
      expect(resolveStep(slug, course)).toEqual(step);
    }
  });

  it("refuses a slug that names nothing", () => {
    expect(resolveStep("not-a-lesson", course)).toBeNull();
    expect(resolveStep("check-not-a-chapter", course)).toBeNull();
    expect(resolveStep(undefined, course)).toBeNull();
  });
});

describe("resuming", () => {
  it("sends a new learner to the first lesson", () => {
    expect(resumeSlug(course, bootstrap())).toBe("roots");
    expect(resumeSlug(course, { signedIn: false, course })).toBe("roots");
  });

  it("sends a returning learner to the first unfinished step", () => {
    const data = bootstrap({ completedLessons: ["roots", "family"] });
    expect(resumeSlug(course, data)).toBe("check-discover");
  });

  it("keeps the last step once everything is done", () => {
    const data = bootstrap();
    data.summary!.canApply = true;
    data.summary!.assessmentPassed = true;
    data.summary!.proposalSubmitted = true;
    data.record!.completedLessons = course.modules.map((module) => module.id);
    data.summary!.scenarios = course.scenarios.map((scenario) => ({
      chapterId: scenario.chapterId,
      done: true,
    }));
    expect(resumeSlug(course, data)).toBe("join");
  });
});

describe("chapter cards", () => {
  it("counts lessons and marks the chapter holding the current step", () => {
    const data = bootstrap({ completedLessons: ["roots"] });
    const chapters = chapterSummaries(course, data);
    expect(chapters).toHaveLength(CHAPTERS.length);
    expect(chapters[0].lessonsDone).toBe(1);
    expect(chapters[0].lessonsTotal).toBe(2);
    expect(chapters[0].current).toBe(true);
    expect(chapters[0].complete).toBe(false);
    /* A chapter with nothing done is neither current nor complete. */
    expect(chapters[5].lessonsDone).toBe(0);
    expect(chapters[5].current).toBe(false);
  });

  it("marks a chapter complete only when its check is done too", () => {
    const lessons = course.chapters[0].lessons.map((lesson) => lesson.id);
    const withoutCheck = chapterSummaries(
      course,
      bootstrap({ completedLessons: lessons }),
    );
    expect(withoutCheck[0].complete).toBe(false);
    expect(withoutCheck[0].current).toBe(true);
    expect(withoutCheck[0].entrySlug).toBe("check-discover");

    const check = course.scenarios.find(
      (scenario) => scenario.chapterId === course.chapters[0].id,
    )!;
    const data = bootstrap({ completedLessons: lessons });
    data.summary!.scenarios = data.summary!.scenarios.map((scenario) =>
      scenario.chapterId === course.chapters[0].id
        ? { ...scenario, done: true }
        : scenario,
    );
    expect(check).toBeTruthy();
    expect(chapterSummaries(course, data)[0].complete).toBe(true);
  });

  it("reports what is finished for the badge row", () => {
    const data = bootstrap({ completedLessons: ["roots"] });
    const steps: Step[] = [
      { kind: "lesson", lessonId: "roots" },
      { kind: "lesson", lessonId: "family" },
      { kind: "assessment" },
    ];
    expect(stepIsDone(steps[0], data)).toBe(true);
    expect(stepIsDone(steps[1], data)).toBe(false);
    expect(stepIsDone(steps[2], data)).toBe(false);
    expect(stepIsDone(steps[0], null)).toBe(false);
  });
});
