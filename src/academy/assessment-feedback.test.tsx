import { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { AssessmentStep } from "../pages/AcademyLesson";
import { createCourse } from "../../shared/rotaract-academy/course";
import {
  gradeAttempt,
  publicCourse,
} from "../../shared/rotaract-academy/assessment";
import { emptyRecord, summarise } from "../../shared/rotaract-academy/progress";
import { MENENGAI_LEARNING_PROFILE } from "../club-learning-profile";
import type { GradedResponse } from "../lib/academy";

const full = createCourse(MENENGAI_LEARNING_PROFILE);
const course = publicCourse(full);

it("shows a passing attempt's question feedback before offering the proposal", () => {
  const record = {
    ...emptyRecord(course.version),
    passed: true,
    bestScore: 20,
  };
  const result: GradedResponse = {
    ...gradeAttempt(
      full.questions.map((q) => q.correctIndex),
      full,
    ),
    passMark: full.passMark,
    attemptId: 1,
    record,
    summary: summarise(record, full),
  };
  const html = renderToStaticMarkup(
    <AssessmentStep
      course={course}
      record={record}
      result={result}
      draftIdentity="test"
      signedIn
      busy={false}
      headingRef={createRef()}
      onSubmit={() => {}}
      onContinue={() => {}}
      onRetry={() => {}}
    />,
  );
  expect(html).toContain("Assessment passed");
  expect(html).toContain("Continue to my service proposal");
  expect(html.match(/Correct\. /g)).toHaveLength(20);
  expect(html).toContain(full.questions[0].explanation);
});

it("identifies incorrect answers and explains them after a failed attempt", () => {
  const record = emptyRecord(course.version);
  const result: GradedResponse = {
    ...gradeAttempt(
      full.questions.map(() => null),
      full,
    ),
    passMark: full.passMark,
    attemptId: 1,
    record,
    summary: summarise(record, full),
  };
  const html = renderToStaticMarkup(
    <AssessmentStep
      course={course}
      record={record}
      result={result}
      draftIdentity="test"
      signedIn
      busy={false}
      headingRef={createRef()}
      onSubmit={() => {}}
      onContinue={() => {}}
      onRetry={() => {}}
    />,
  );
  expect(html).toContain("Review your answers below");
  expect(html.match(/Not quite\. /g)).toHaveLength(20);
  expect(html).not.toContain("Continue to my service proposal");
});
