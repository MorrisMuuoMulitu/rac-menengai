/**
 * Learning progress: pure functions over a plain record.
 *
 * Nothing here touches storage, React or the network. The same functions run
 * on the server before a record is saved and in the browser before a screen is
 * drawn, so the two can never disagree about what "complete" means.
 */

import { SCENARIO_CHECKS } from "./scenarios.js";
import type { FullCourse } from "./types.js";
import { normaliseProposal, type PracticalProposal } from "./proposal.js";

export {
  normaliseProposal,
  PROPOSAL_FIELDS,
  PROPOSAL_MIN_LENGTH,
  PROPOSAL_MAX_LENGTH,
  type PracticalProposal,
} from "./proposal.js";

export interface LearningRecord {
  courseVersion: string;
  completedLessons: string[];
  /** scenario id → the option id the learner chose. */
  scenarioAnswers: Record<string, string>;
  proposal: PracticalProposal | null;
  bestScore: number;
  attempts: number;
  passed: boolean;
  passedAt: string | null;
  updatedAt: string | null;
  /** First time the course certificate was issued, kept stable after edits. */
  completedAt: string | null;
  /** Name the learner wants printed on their completion certificate. */
  certificateName: string | null;
  /** Optional portrait, already resized by the browser, used only on the certificate. */
  certificatePhoto: string | null;
  /** Permanent public identifier printed on the certificate and encoded in its QR. */
  certificateNumber: string | null;
}

export const CERTIFICATE_PHOTO_MAX_BYTES = 220_000;
export const CERTIFICATE_PHOTO_MAX_LENGTH = 300_000;
export const CERTIFICATE_NUMBER_PATTERN = /^RACMNG-\d{4}-\d{4}-\d{2,}$/;

/**
 * Curriculum migration: lesson ids that no longer exist, and where their
 * content went.
 *
 * When `meeting` and `protocol-brand` were merged into other lessons, learners
 * who had finished them would otherwise have been told they had not. An old id
 * listed here is carried forward to the lesson that now holds the same
 * material, so no completed work is reset.
 */
export const LEGACY_LESSON_IDS: Record<string, string> = {
  meeting: "protocol-meeting",
  "protocol-brand": "public-image",
};

/** Resolve an id from an earlier curriculum to the lesson that holds it now. */
export function migrateLessonId(id: string): string {
  return LEGACY_LESSON_IDS[id] ?? id;
}

export function emptyRecord(courseVersion: string): LearningRecord {
  return {
    courseVersion,
    completedLessons: [],
    scenarioAnswers: {},
    proposal: null,
    bestScore: 0,
    attempts: 0,
    passed: false,
    passedAt: null,
    updatedAt: null,
    completedAt: null,
    certificateName: null,
    certificatePhoto: null,
    certificateNumber: null,
  };
}

export type ChapterState = "not-started" | "in-progress" | "complete";

export interface ChapterProgress {
  id: string;
  state: ChapterState;
  lessonsComplete: number;
  lessonsTotal: number;
  scenarioCorrect: boolean;
}

export interface ChapterDefinition {
  id: string;
  title: string;
  description: string;
  /** Lesson ids, or lesson objects carrying an id — both shapes are accepted. */
  lessons: readonly (string | { id: string })[];
}

function lessonId(value: string | { id: string }): string {
  return typeof value === "string" ? value : value.id;
}

export function scenarioIsCorrect(
  record: LearningRecord,
  chapterId: string,
): boolean {
  const check = SCENARIO_CHECKS.find((item) => item.chapterId === chapterId);
  if (!check) return false;
  return record.scenarioAnswers[check.id] === check.bestOptionId;
}

export function chapterProgress(
  record: LearningRecord,
  chapter: ChapterDefinition,
): ChapterProgress {
  const lessonsComplete = chapter.lessons.filter((lesson) =>
    record.completedLessons.includes(lessonId(lesson)),
  ).length;
  const lessonsTotal = chapter.lessons.length;
  const scenarioCorrect = scenarioIsCorrect(record, chapter.id);
  const check = SCENARIO_CHECKS.find((item) => item.chapterId === chapter.id);
  const scenarioAnswered = check
    ? record.scenarioAnswers[check.id] !== undefined
    : false;
  const started = lessonsComplete > 0 || scenarioAnswered;
  const state: ChapterState =
    lessonsComplete === lessonsTotal && scenarioCorrect
      ? "complete"
      : started
        ? "in-progress"
        : "not-started";

  return {
    id: chapter.id,
    state,
    lessonsComplete,
    lessonsTotal,
    scenarioCorrect,
  };
}

/** First lesson not yet marked complete, or the last lesson if all are done. */
export function nextLessonIndex(
  record: LearningRecord,
  lessons: readonly { id: string }[],
): number {
  const index = lessons.findIndex(
    (lesson) => !record.completedLessons.includes(lesson.id),
  );
  return index >= 0 ? index : Math.max(0, lessons.length - 1);
}

export type CourseStage = "lessons" | "assessment" | "proposal" | "complete";

export function courseStage(
  record: LearningRecord,
  course: Pick<FullCourse, "modules" | "questions">,
): CourseStage {
  const lessonsOutstanding = course.modules.some(
    (module) => !record.completedLessons.includes(module.id),
  );
  if (lessonsOutstanding) return "lessons";
  if (!record.passed) return "assessment";
  if (!record.proposal) return "proposal";
  return "complete";
}

/** Scenario checks that are still unanswered or answered wrongly. */
export function outstandingScenarios(record: LearningRecord): string[] {
  return SCENARIO_CHECKS.filter(
    (check) => record.scenarioAnswers[check.id] !== check.bestOptionId,
  ).map((check) => check.chapterId);
}

export interface CourseProgressSummary {
  stage: CourseStage;
  /** Steps: every lesson, then each scenario, then the assessment, then the proposal. */
  completed: number;
  total: number;
  percent: number;
  lessons: { id: string; done: boolean }[];
  scenarios: { chapterId: string; done: boolean }[];
  assessmentPassed: boolean;
  proposalSubmitted: boolean;
  canApply: boolean;
}

export function summarise(
  record: LearningRecord,
  course: Pick<FullCourse, "modules" | "questions">,
): CourseProgressSummary {
  const lessons = course.modules.map((module) => ({
    id: module.id,
    done: record.completedLessons.includes(module.id),
  }));
  const scenarios = SCENARIO_CHECKS.map((check) => ({
    chapterId: check.chapterId,
    done: record.scenarioAnswers[check.id] === check.bestOptionId,
  }));
  const proposalSubmitted = record.proposal !== null;
  const stage = courseStage(record, course);
  const joined = stage === "complete";
  const completed =
    lessons.filter((lesson) => lesson.done).length +
    scenarios.filter((scenario) => scenario.done).length +
    (record.passed ? 1 : 0) +
    (proposalSubmitted ? 1 : 0) +
    (joined ? 1 : 0);
  /* Lessons, then the chapter checks, the assessment, the proposal and
     joining — the same number of steps the contents rail lists. */
  const total = lessons.length + scenarios.length + 3;

  return {
    stage,
    completed,
    total,
    percent:
      total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0,
    lessons,
    scenarios,
    assessmentPassed: record.passed,
    proposalSubmitted,
    canApply: stage === "complete",
  };
}

/**
 * How long a learner may go quiet before the membership team should reach out.
 *
 * Three weeks is long enough that a holiday, a placement or an exam week is
 * not a false alarm, and short enough that someone who has genuinely stopped
 * is still reachable while the course is fresh in their mind.
 */
export const NUDGE_AFTER_DAYS = 21;

/**
 * What the membership team needs to know about a learner at a glance.
 *
 * Derived only from recorded facts: how much of the course is done, and when
 * they were last making progress. Nothing here is a judgement about the
 * person, and nothing is inferred that was not recorded.
 */
export type LearnerCohort =
  "not-started" | "needs-nudge" | "in-progress" | "done";

export interface LearnerCohortResult {
  cohort: LearnerCohort;
  /** Whole days since their last recorded progress, or null when unknown. */
  daysIdle: number | null;
}

export function learnerCohort(input: {
  completed: number;
  total: number;
  lastActiveAt: string | null;
  now?: Date;
}): LearnerCohortResult {
  const now = input.now ?? new Date();
  let daysIdle: number | null = null;
  if (typeof input.lastActiveAt === "string" && input.lastActiveAt) {
    const then = new Date(input.lastActiveAt);
    if (!Number.isNaN(then.getTime()))
      daysIdle = Math.max(
        0,
        Math.floor((now.getTime() - then.getTime()) / 86_400_000),
      );
  }
  /* An empty record is not started, whatever timestamps happen to be on it. */
  if (input.completed <= 0) return { cohort: "not-started", daysIdle };
  if (input.total > 0 && input.completed >= input.total)
    return { cohort: "done", daysIdle };
  if (daysIdle !== null && daysIdle >= NUDGE_AFTER_DAYS)
    return { cohort: "needs-nudge", daysIdle };
  return { cohort: "in-progress", daysIdle };
}

/**
 * Stamp a record with the moment its progress was written.
 *
 * Every progress write goes through the repository's `saveRecord`, so this is
 * the one place that knows when a learner last actually moved. Without it a
 * stored record has no way to tell "stopped three weeks ago" from "started
 * this morning", and the membership team cannot see who has stalled.
 */
export function withProgressStamp(
  record: LearningRecord,
  at: Date = new Date(),
): LearningRecord {
  return { ...record, updatedAt: at.toISOString() };
}

/**
 * Coerce whatever came back from storage or the API into a record we are
 * willing to render. Unknown lessons are dropped; a record from a different
 * curriculum version is emptied rather than silently upgraded, so old progress
 * can never certify a course the learner did not take.
 */
export function normaliseRecord(
  input: unknown,
  courseVersion: string,
  validLessonIds: readonly string[],
): LearningRecord {
  if (!input || typeof input !== "object") return emptyRecord(courseVersion);
  const source = input as Partial<LearningRecord>;
  if (source.courseVersion !== courseVersion) return emptyRecord(courseVersion);

  /*
   * Ids from an earlier curriculum are carried forward before anything is
   * dropped, so a merge never reads as "you did not do this".
   */
  const completedLessons = Array.isArray(source.completedLessons)
    ? [
        ...new Set(
          source.completedLessons
            .filter((id): id is string => typeof id === "string")
            .map(migrateLessonId)
            .filter((id) => validLessonIds.includes(id)),
        ),
      ]
    : [];

  const scenarioAnswers: Record<string, string> = {};
  if (source.scenarioAnswers && typeof source.scenarioAnswers === "object") {
    for (const check of SCENARIO_CHECKS) {
      const value = (source.scenarioAnswers as Record<string, unknown>)[
        check.id
      ];
      if (
        typeof value === "string" &&
        check.options.some((option) => option.id === value)
      )
        scenarioAnswers[check.id] = value;
    }
  }

  const bestScore =
    typeof source.bestScore === "number" &&
    Number.isFinite(source.bestScore) &&
    source.bestScore >= 0
      ? Math.floor(source.bestScore)
      : 0;
  const attempts =
    typeof source.attempts === "number" &&
    Number.isFinite(source.attempts) &&
    source.attempts >= 0
      ? Math.floor(source.attempts)
      : 0;
  const completedAt =
    typeof source.completedAt === "string" &&
    !Number.isNaN(new Date(source.completedAt).getTime())
      ? new Date(source.completedAt).toISOString()
      : null;
  const certificateName =
    typeof source.certificateName === "string"
      ? source.certificateName.trim().slice(0, 120) || null
      : null;
  const certificatePhoto =
    typeof source.certificatePhoto === "string" &&
    source.certificatePhoto.length <= CERTIFICATE_PHOTO_MAX_LENGTH &&
    /^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(
      source.certificatePhoto,
    )
      ? source.certificatePhoto
      : null;
  const certificateNumber =
    typeof source.certificateNumber === "string" &&
    CERTIFICATE_NUMBER_PATTERN.test(source.certificateNumber)
      ? source.certificateNumber
      : null;

  return {
    courseVersion,
    completedLessons,
    scenarioAnswers,
    proposal: normaliseProposal(source.proposal),
    bestScore,
    attempts,
    passed: source.passed === true,
    passedAt: typeof source.passedAt === "string" ? source.passedAt : null,
    updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : null,
    completedAt,
    certificateName,
    certificatePhoto,
    certificateNumber,
  };
}
