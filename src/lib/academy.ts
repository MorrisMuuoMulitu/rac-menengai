/**
 * Client access to the academy endpoint.
 *
 * Every type here is imported with `import type`, so none of the shared
 * modules that carry answers can be pulled into the browser bundle by
 * accident. The browser sends a session token and its answers; the server
 * decides everything else.
 */

import type {
  PublicChapter,
  PublicCourse,
} from "../../shared/rotaract-academy/assessment";
import type {
  ChapterProgress,
  CourseProgressSummary,
  LearningRecord,
  PracticalProposal,
} from "../../shared/rotaract-academy/progress";
import type {
  ApplicationDraft,
  ApplicationStatus,
  MembershipApplication,
} from "../../shared/rotaract-academy/application";

export type { PublicChapter, PublicCourse };
export type {
  ChapterProgress,
  CourseProgressSummary,
  LearningRecord,
  PracticalProposal,
};
export type { ApplicationDraft, ApplicationStatus, MembershipApplication };

export interface AcademyBootstrap {
  signedIn: boolean;
  signInAvailable?: boolean;
  course?: PublicCourse;
  actor?: { displayName: string | null; reviewer: boolean };
  courseVersion?: string;
  record?: LearningRecord;
  application?: MembershipApplication | null;
  statusLabel?: string | null;
  summary?: CourseProgressSummary;
  chapters?: ChapterProgress[];
}

export interface ReviewQueueResponse {
  signedIn: boolean;
  reviewer: boolean;
  queue: (MembershipApplication & { userId: string })[];
}

/**
 * One learner as the membership team sees them.
 *
 * Counts and dates only. The server never sends the stored record to this
 * screen, so an officer cannot be shown an answer or an explanation.
 */
export interface LearnerProgressRow {
  userId: string;
  displayName: string | null;
  email: string | null;
  startedAt: string | null;
  lastProgressAt: string | null;
  lastSeenAt: string | null;
  completed: number;
  total: number;
  percent: number;
  stage: string;
  lessonsDone: number;
  lessonsTotal: number;
  checksDone: number;
  checksTotal: number;
  bestScore: number;
  assessmentTotal: number;
  attempts: number;
  assessmentPassed: boolean;
  certificateName: string | null;
  proposalSubmitted: boolean;
  canApply: boolean;
  applicationStatus: ApplicationStatus | null;
  cohort: "not-started" | "needs-nudge" | "in-progress" | "done";
  daysIdle: number | null;
}

export interface LearnerProgressResponse {
  signedIn: boolean;
  reviewer: boolean;
  nudgeAfterDays: number;
  totals: {
    all: number;
    needsNudge: number;
    inProgress: number;
    notStarted: number;
    done: number;
  };
  learners: LearnerProgressRow[];
}

export interface LearnerCertificateDetails {
  name: string;
  photo: string | null;
  completedAt: string | null;
  certificateNumber: string;
  score: number;
  total: number;
}

export interface PublicCertificate {
  number: string;
  name: string;
  completedAt: string | null;
  courseTitle: string;
  issuedBy: string;
  president: string;
  rotaryYear: string;
}

export interface GradedResponse {
  correct: number;
  total: number;
  passed: boolean;
  perQuestion: boolean[];
  unanswered: number[];
  feedback: { id: string; correct: boolean; explanation: string }[];
  passMark: number;
  attemptId: number;
  record: LearningRecord;
  summary: CourseProgressSummary;
}

export interface ScenarioResponse {
  correct: boolean;
  bestOptionId: string;
  feedback: string;
  record: LearningRecord;
  summary: CourseProgressSummary;
}

export class AcademyError extends Error {
  readonly status: number;
  readonly fields?: Record<string, string>;
  constructor(
    message: string,
    status: number,
    fields?: Record<string, string>,
  ) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

async function read<T>(response: Response): Promise<T> {
  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  if (!response.ok) {
    const record = (body ?? {}) as {
      error?: string;
      fields?: Record<string, string>;
    };
    throw new AcademyError(
      record.error ?? "That did not go through. Please try again.",
      response.status,
      record.fields,
    );
  }
  return body as T;
}

async function call<T>(
  path: string,
  init: RequestInit,
  token: string | null,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers ?? {}),
      },
    });
  } catch {
    throw new AcademyError(
      "We could not reach the club's server. Check your connection.",
      0,
    );
  }
  return read<T>(response);
}

export function loadAcademy(token: string | null) {
  return call<AcademyBootstrap>("/api/academy", { method: "GET" }, token);
}

export type LessonNote = { text: string; updatedAt: string };
export function loadLessonNote(token: string | null, lessonId: string) {
  return call<{ note: LessonNote | null }>(
    `/api/academy?view=note&lessonId=${encodeURIComponent(lessonId)}`,
    { method: "GET" },
    token,
  );
}
export function saveLessonNote(
  token: string | null,
  lessonId: string,
  text: string,
  ownerEmail?: string,
) {
  return call<{ note: LessonNote }>(
    "/api/academy",
    {
      method: "POST",
      keepalive: true,
      body: JSON.stringify({ action: "note", lessonId, text, ownerEmail }),
    },
    token,
  );
}

export function loadReviewQueue(token: string | null) {
  return call<ReviewQueueResponse>(
    "/api/academy?view=review",
    { method: "GET" },
    token,
  );
}

export function loadLearnerProgress(token: string | null) {
  return call<LearnerProgressResponse>(
    "/api/academy?view=learners",
    { method: "GET" },
    token,
  );
}

export function loadLearnerCertificate(token: string | null, userId: string) {
  return call<{ signedIn: true; certificate: LearnerCertificateDetails }>(
    `/api/academy?view=certificate&userId=${encodeURIComponent(userId)}`,
    { method: "GET" },
    token,
  );
}

export function saveLearnerProfile(
  token: string | null,
  userId: string,
  displayName: string,
  certificateName: string,
) {
  return academyAction<{
    learner: {
      userId: string;
      email: string | null;
      displayName: string;
      certificateName: string;
    };
  }>(token, {
    action: "learner-profile",
    userId,
    displayName,
    certificateName,
  });
}

export function verifyCertificate(certificateNumber: string) {
  return call<{ valid: true; certificate: PublicCertificate }>(
    `/api/academy?view=certificate-verification&number=${encodeURIComponent(certificateNumber)}`,
    { method: "GET" },
    null,
  );
}

export function academyAction<T>(
  token: string | null,
  body: Record<string, unknown>,
) {
  return call<T>(
    "/api/academy",
    { method: "POST", body: JSON.stringify(body) },
    token,
  );
}

export const markLesson = (token: string | null, lessonId: string) =>
  academyAction<{
    record: LearningRecord;
    summary: CourseProgressSummary;
    chapters: ChapterProgress[];
  }>(token, { action: "lesson", lessonId });

export const answerScenario = (
  token: string | null,
  scenarioId: string,
  optionId: string,
) =>
  academyAction<ScenarioResponse>(token, {
    action: "scenario",
    scenarioId,
    optionId,
  });

export const submitAssessment = (
  token: string | null,
  answers: (number | null)[],
) => academyAction<GradedResponse>(token, { action: "assessment", answers });

export const saveCertificateDetails = (
  token: string | null,
  name: string,
  photo: string | null,
) =>
  academyAction<{
    record: LearningRecord;
    summary: CourseProgressSummary;
  }>(token, { action: "certificate", name, photo });

export const saveProposal = (
  token: string | null,
  proposal: PracticalProposal,
) =>
  academyAction<{
    record: LearningRecord;
    summary: CourseProgressSummary;
  }>(token, { action: "proposal", proposal });

export const saveDraft = (token: string | null, draft: ApplicationDraft) =>
  academyAction<{ application: MembershipApplication }>(token, {
    action: "draft",
    draft,
  });

export const sendApplication = (token: string | null) =>
  academyAction<{
    application: MembershipApplication;
    statusLabel: string;
  }>(token, { action: "apply" });

export const withdrawApplication = (token: string | null) =>
  academyAction<{ application: MembershipApplication }>(token, {
    action: "withdraw",
  });

export const recordDecision = (
  token: string | null,
  applicationId: string,
  status: ApplicationStatus,
  note: string,
) =>
  academyAction<{ application: MembershipApplication }>(token, {
    action: "review",
    applicationId,
    status,
    note,
  });
