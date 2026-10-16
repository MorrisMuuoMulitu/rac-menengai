/**
 * The course as an ordered list of routes.
 *
 * Steps used to be an index into an array held in component state, which meant
 * no lesson had its own address: you could not send someone to the meeting
 * lesson, and a refresh put you back at the start. Each step now has a slug,
 * and the slug is the URL.
 */

import type { AcademyBootstrap } from "../lib/academy";
import type { PublicCourse } from "../lib/academy";

export type Step =
  | { kind: "lesson"; lessonId: string }
  | { kind: "scenario"; chapterId: string }
  | { kind: "assessment" }
  | { kind: "proposal" }
  | { kind: "join" };

export const ASSESSMENT_SLUG = "assessment";
export const PROPOSAL_SLUG = "proposal";
export const JOIN_SLUG = "join";
export const SCENARIO_PREFIX = "check-";

/** The URL segment for a step. */
export function stepSlug(step: Step): string {
  switch (step.kind) {
    case "lesson":
      return step.lessonId;
    case "scenario":
      return `${SCENARIO_PREFIX}${step.chapterId}`;
    case "assessment":
      return ASSESSMENT_SLUG;
    case "proposal":
      return PROPOSAL_SLUG;
    case "join":
      return JOIN_SLUG;
  }
}

export function stepHref(step: Step): string {
  return `/membership/academy/${stepSlug(step)}`;
}

/** Resolve a slug against the course, or null when it names nothing. */
export function resolveStep(
  slug: string | undefined,
  course: PublicCourse | undefined,
): Step | null {
  if (!slug || !course) return null;
  if (slug === ASSESSMENT_SLUG) return { kind: "assessment" };
  if (slug === PROPOSAL_SLUG) return { kind: "proposal" };
  if (slug === JOIN_SLUG) return { kind: "join" };
  if (slug.startsWith(SCENARIO_PREFIX)) {
    const chapterId = slug.slice(SCENARIO_PREFIX.length);
    const chapter = course.chapters.find((item) => item.id === chapterId);
    return chapter ? { kind: "scenario", chapterId } : null;
  }
  return course.modules.some((module) => module.id === slug)
    ? { kind: "lesson", lessonId: slug }
    : null;
}

/** Every step in the order the course presents them. */
export function courseSteps(course: PublicCourse | undefined): Step[] {
  if (!course) return [];
  const steps: Step[] = [];
  for (const chapter of course.chapters) {
    for (const lesson of chapter.lessons)
      steps.push({ kind: "lesson", lessonId: lesson.id });
    if (chapter.scenario)
      steps.push({ kind: "scenario", chapterId: chapter.id });
  }
  steps.push({ kind: "assessment" }, { kind: "proposal" }, { kind: "join" });
  return steps;
}

export function stepIsDone(step: Step, data: AcademyBootstrap | null): boolean {
  if (!data?.record || !data.summary) return false;
  switch (step.kind) {
    case "lesson":
      return data.record.completedLessons.includes(step.lessonId);
    case "scenario":
      return Boolean(
        data.summary.scenarios.find(
          (scenario) => scenario.chapterId === step.chapterId,
        )?.done,
      );
    case "assessment":
      return data.summary.assessmentPassed;
    case "proposal":
      return data.summary.proposalSubmitted;
    case "join":
      return data.summary.canApply;
  }
}

/** The step the learner should land on: the first one not finished. */
export function resumeSlug(
  course: PublicCourse | undefined,
  data: AcademyBootstrap | null,
): string {
  const steps = courseSteps(course);
  if (!steps.length) return "";
  for (const step of steps) if (!stepIsDone(step, data)) return stepSlug(step);
  return stepSlug(steps[steps.length - 1]);
}

export interface ChapterSummary {
  id: string;
  title: string;
  description: string;
  minutes: number;
  lessonsTotal: number;
  lessonsDone: number;
  scenarioDone: boolean;
  /** true when every step in the chapter is finished */
  complete: boolean;
  /** true when this chapter holds the learner's current step */
  current: boolean;
  /** the lesson the chapter's "open" action should start at */
  entrySlug: string;
}

export function chapterSummaries(
  course: PublicCourse | undefined,
  data: AcademyBootstrap | null,
): ChapterSummary[] {
  if (!course) return [];
  const currentSlug = resumeSlug(course, data);
  return course.chapters.map((chapter) => {
    const done = chapter.lessons.filter((lesson) =>
      data?.record?.completedLessons.includes(lesson.id),
    ).length;
    const scenarioDone = Boolean(
      data?.summary?.scenarios.find(
        (scenario) => scenario.chapterId === chapter.id,
      )?.done,
    );
    const firstUnfinished = chapter.lessons.find(
      (lesson) => !data?.record?.completedLessons.includes(lesson.id),
    );
    const complete =
      done === chapter.lessons.length && (!chapter.scenario || scenarioDone);
    return {
      id: chapter.id,
      title: chapter.title,
      description: chapter.description,
      minutes: chapter.minutes,
      lessonsTotal: chapter.lessons.length,
      lessonsDone: done,
      scenarioDone,
      complete,
      current: chapter.lessons.some(
        (lesson) => stepSlug({ kind: "lesson", lessonId: lesson.id }) === currentSlug,
      ),
      entrySlug: firstUnfinished ? firstUnfinished.id : chapter.lessons[0].id,
    };
  });
}
