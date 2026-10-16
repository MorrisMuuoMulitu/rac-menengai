/**
 * Assessment grading and public-course shaping.
 *
 * The answer key and the per-question explanations stay on the server. The
 * learner gets the questions, the options and their own score — never the key
 * and never the marked-up explanation until the attempt has been graded
 * server-side and returned. A client that edits localStorage or rewrites a
 * response body cannot change what the server recorded.
 */

import type { FullCourse, OrientationQuestion } from "./types.js";
import type { CurriculumChapter } from "./curriculum.js";
import type { ScenarioCheck } from "./scenarios.js";

export interface GradedAttempt {
  correct: number;
  total: number;
  passed: boolean;
  /** true where the learner answered that question correctly. */
  perQuestion: boolean[];
  /** indexes of questions left unanswered. */
  unanswered: number[];
  /** Explanation shown only after grading, alongside whether they got it right. */
  feedback: { id: string; correct: boolean; explanation: string }[];
}

/** Questions as they may safely be sent to a browser: no key, no explanation. */
export type PublicQuestion = Pick<
  OrientationQuestion,
  "id" | "question" | "options"
>;

/** A scenario as sent to a browser: the situation and the choices only. */
export type PublicScenario = Pick<
  ScenarioCheck,
  "id" | "chapterId" | "situation" | "prompt" | "options"
>;

export type PublicChapter = Omit<CurriculumChapter, "scenario"> & {
  scenario: PublicScenario | null;
};

export interface PublicCourse
  extends Omit<FullCourse, "questions" | "scenarios" | "chapters"> {
  questions: PublicQuestion[];
  scenarios: PublicScenario[];
  chapters: PublicChapter[];
}

/**
 * Strip every answer from the payload before it leaves the server: the quiz
 * key and its explanations, and each scenario's best option and reasoning.
 * The scenario's reasoning is handed back only after the learner has answered
 * it, so reading the network response cannot skip the thinking.
 */
export function publicCourse(course: FullCourse): PublicCourse {
  const scenarios = course.scenarios.map(
    ({ id, chapterId, situation, prompt, options }): PublicScenario => ({
      id,
      chapterId,
      situation,
      prompt,
      options,
    }),
  );
  const byId = new Map(scenarios.map((scenario) => [scenario.id, scenario]));
  return {
    ...course,
    questions: course.questions.map(({ id, question, options }) => ({
      id,
      question,
      options,
    })),
    scenarios,
    chapters: course.chapters.map((chapter) => ({
      ...chapter,
      scenario: chapter.scenario
        ? (byId.get(chapter.scenario.id) ?? null)
        : null,
    })),
  };
}

/** Server-only. Never serialise this. */
export function answerKey(course: FullCourse): number[] {
  return course.questions.map((question) => question.correctIndex);
}

/**
 * Grade an attempt. Answers may be null (skipped) or an index. Anything that
 * is not a valid index for that question counts as unanswered rather than
 * throwing, because the caller is untrusted input.
 */
export function gradeAttempt(
  answers: readonly unknown[],
  course: FullCourse,
): GradedAttempt {
  const perQuestion: boolean[] = [];
  const unanswered: number[] = [];
  const feedback: GradedAttempt["feedback"] = [];

  course.questions.forEach((question, index) => {
    const answer = answers[index];
    const valid =
      typeof answer === "number" &&
      Number.isInteger(answer) &&
      answer >= 0 &&
      answer < question.options.length;
    if (!valid) unanswered.push(index);
    const correct = valid && answer === question.correctIndex;
    perQuestion.push(correct);
    feedback.push({
      id: question.id,
      correct,
      explanation: question.explanation,
    });
  });

  const correct = perQuestion.filter(Boolean).length;
  return {
    correct,
    total: course.questions.length,
    passed: course.questions.length > 0 && correct >= course.passMark,
    perQuestion,
    unanswered,
    feedback,
  };
}

/**
 * Validate an incoming answers payload before grading. Returns a normalised
 * array of `number | null` of exactly the expected length, or null if the
 * payload is not usable at all.
 */
export function normaliseAnswers(
  input: unknown,
  questionCount: number,
): (number | null)[] | null {
  if (!Array.isArray(input)) return null;
  if (input.length > questionCount) return null;
  const answers: (number | null)[] = new Array(questionCount).fill(null);
  for (let index = 0; index < questionCount; index += 1) {
    const value = input[index];
    if (typeof value === "number" && Number.isInteger(value) && value >= 0)
      answers[index] = value;
  }
  return answers;
}
