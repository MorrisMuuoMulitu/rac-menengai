/**
 * The membership academy endpoint.
 *
 * Reading the course is open: anyone can load the lessons, the situations and
 * the videos. Everything that counts — marking a lesson done, answering a
 * scenario, sitting the assessment, saving a proposal, applying, and every
 * officer decision — happens here, on the server, against the signed-in user.
 *
 * The browser is treated as a view. It never sends a score, never sends a
 * user id and never sends an approval.
 */

import { trustedSiteOrigins, CLUB_ORIGIN } from "./site-origin.js";
import { FULL_COURSE } from "./course.js";
import {
  gradeAttempt,
  normaliseAnswers,
  publicCourse,
} from "../shared/rotaract-academy/assessment.js";
import {
  chapterProgress,
  emptyRecord,
  normaliseProposal,
  normaliseRecord,
  summarise,
  type LearningRecord,
} from "../shared/rotaract-academy/progress.js";
import {
  APPLICATION_LIMITS,
  APPLICATION_STATUS_LABEL,
  canTransition,
  isApplicationStatus,
  validateDraft,
  type ApplicationDraft,
  type ApplicationStatus,
  type MembershipApplication,
} from "../shared/rotaract-academy/application.js";
import { SCENARIO_CHECKS } from "../shared/rotaract-academy/scenarios.js";
import { CURRICULUM } from "../shared/rotaract-academy/curriculum.js";
import { CLUB_ID, type AcademyRepository } from "./academy-db.js";
import type { Actor, ActorResolver, AuthRequest } from "./academy-auth.js";

export interface AcademyResponse {
  status(code: number): AcademyResponse;
  setHeader(key: string, value: string): void;
  json(body: unknown): void;
}

export interface AcademyDependencies {
  resolveActor: ActorResolver;
  repository: AcademyRepository;
}

/*
 * The order the learner is actually shown, which is the curriculum, not the
 * flat syllabus list. Those two disagree: the syllabus puts "Service, ethics
 * and belonging" before "Fellowship and meeting practice", while the chapters
 * present fellowship first. Gating on the syllabus order deadlocked the course
 * at the end of chapter two — the next lesson the page offered was one the
 * server insisted could not be reached yet.
 */
const LESSON_IDS = CURRICULUM.flatMap((chapter) =>
  chapter.lessons.map((lesson) => lesson.id),
);
const REVIEWER_STATUSES = new Set<ApplicationStatus>([
  "in_review",
  "needs_more",
  "approved",
]);

type Body = Record<string, unknown>;

function header(request: AuthRequest, name: string): string | undefined {
  const value = request.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

function draftFrom(application: MembershipApplication): ApplicationDraft {
  return {
    fullName: application.fullName,
    email: application.email,
    phone: application.phone,
    profession: application.profession,
    location: application.location,
    motivation: application.motivation,
    availability: application.availability,
  };
}

function readDraft(input: unknown): ApplicationDraft | null {
  if (!input || typeof input !== "object") return null;
  const source = input as Record<string, unknown>;
  const draft = {} as ApplicationDraft;
  for (const key of Object.keys(
    APPLICATION_LIMITS,
  ) as (keyof ApplicationDraft)[]) {
    const value = source[key];
    if (value !== undefined && typeof value !== "string") return null;
    draft[key] = typeof value === "string" ? value.slice(0, 4000) : "";
  }
  return draft;
}

/** Everything the learner's own screen needs, and nothing about anyone else. */
function learnerPayload(
  actor: Actor,
  record: LearningRecord,
  application: MembershipApplication | null,
) {
  const summary = summarise(record, FULL_COURSE);
  return {
    signedIn: true,
    actor: {
      displayName: actor.displayName,
      reviewer: actor.reviewer,
    },
    courseVersion: FULL_COURSE.version,
    record,
    application,
    statusLabel: application
      ? APPLICATION_STATUS_LABEL[application.status]
      : null,
    summary,
    chapters: CURRICULUM.map((chapter) => ({
      ...chapterProgress(record, chapter),
    })),
  };
}

async function withLearner(dependencies: AcademyDependencies, actor: Actor) {
  const learner = await dependencies.repository.ensureLearner({
    userId: actor.userId,
    clubId: CLUB_ID,
    email: actor.email,
    displayName: actor.displayName,
  });
  return learner;
}

/**
 * A lesson can be marked done only if everything before it is done, so a
 * tampered request cannot mark the whole course complete in one call.
 */
function lessonIsUnlocked(record: LearningRecord, lessonId: string): boolean {
  const index = LESSON_IDS.indexOf(lessonId);
  if (index < 0) return false;
  if (record.completedLessons.includes(lessonId)) return true;
  const firstIncomplete = LESSON_IDS.findIndex(
    (id) => !record.completedLessons.includes(id),
  );
  return firstIncomplete === -1 || index <= firstIncomplete;
}

function chapterLessonsComplete(
  record: LearningRecord,
  chapterId: string,
): boolean {
  const chapter = CURRICULUM.find((item) => item.id === chapterId);
  if (!chapter) return false;
  return chapter.lessons.every((lesson) =>
    record.completedLessons.includes(lesson.id),
  );
}

export function createAcademyHandler(
  env: Record<string, string | undefined>,
  dependencies: AcademyDependencies,
) {
  const origin = env.SITE_ORIGIN ?? CLUB_ORIGIN;
  const permittedOrigins = trustedSiteOrigins(origin);
  const course = publicCourse(FULL_COURSE);

  return async function handler(
    request: AuthRequest,
    response: AcademyResponse,
  ) {
    response.setHeader("Cache-Control", "private, no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Vary", "Cookie, Authorization");

    if (!["GET", "POST"].includes(request.method ?? "")) {
      response.setHeader("Allow", "GET, POST");
      return response.status(405).json({ error: "Method not allowed." });
    }
    if (
      request.method === "POST" &&
      !permittedOrigins.has(header(request, "origin") ?? "")
    )
      return response.status(403).json({ error: "Origin not allowed." });

    const wantsReview = (request.url ?? "").includes("view=review");

    let actor: Actor | null = null;
    try {
      actor = await dependencies.resolveActor(request);
    } catch {
      actor = null;
    }

    /* ---------- read ---------- */
    if (request.method === "GET") {
      const readUrl = new URL(request.url ?? "/api/academy", origin);
      if (readUrl.searchParams.get("view") === "note") {
        if (!actor)
          return response
            .status(401)
            .json({ error: "Sign in to read your notes." });
        const lessonId = readUrl.searchParams.get("lessonId") ?? "";
        if (!LESSON_IDS.includes(lessonId))
          return response.status(400).json({ error: "Unknown lesson." });
        return response.status(200).json({
          note: await dependencies.repository.loadNote(
            actor.userId,
            CLUB_ID,
            lessonId,
          ),
        });
      }
      if (wantsReview) {
        if (!actor?.reviewer)
          return response
            .status(403)
            .json({ error: "Applications are for club officers." });
        const queue = await dependencies.repository.listApplications(CLUB_ID);
        return response.status(200).json({
          signedIn: true,
          reviewer: true,
          queue,
        });
      }
      if (!actor)
        return response.status(200).json({
          signedIn: false,
          signInAvailable: Boolean(env.CLERK_SECRET_KEY),
          course,
        });
      const learner = await withLearner(dependencies, actor);
      const application = await dependencies.repository.loadApplication(
        actor.userId,
        CLUB_ID,
      );
      return response.status(200).json({
        course,
        ...learnerPayload(actor, learner.record, application),
      });
    }

    /* ---------- write ---------- */
    if (!header(request, "content-type")?.startsWith("application/json"))
      return response.status(415).json({ error: "Use application/json." });

    const body = (request.body ?? {}) as Body;
    const action = typeof body.action === "string" ? body.action : "";
    if (!action) return response.status(400).json({ error: "Unknown action." });

    if (!actor) {
      if (!env.CLERK_SECRET_KEY)
        return response.status(503).json({
          error:
            "Sign-in is not configured on this deployment yet. Ask the membership team for the passcode course instead.",
        });
      return response.status(401).json({ error: "Sign in to continue." });
    }
    const signedIn: Actor = actor;

    if (action === "note") {
      /*
       * The note is stored against the authenticated user id, so this is not
       * the access boundary. It only catches a stale form that was opened
       * under a different account. An account with no email on file can still
       * save, so require both sides to carry an address before comparing.
       */
      if (
        typeof body.ownerEmail === "string" &&
        body.ownerEmail.length > 0 &&
        signedIn.email &&
        body.ownerEmail.toLowerCase() !== signedIn.email?.toLowerCase()
      )
        return response
          .status(409)
          .json({
            error:
              "Your signed-in account changed. Open the lesson again before saving.",
          });
      const lessonId = typeof body.lessonId === "string" ? body.lessonId : "";
      if (!LESSON_IDS.includes(lessonId))
        return response.status(400).json({ error: "Unknown lesson." });
      if (typeof body.text !== "string" || body.text.length > 2000)
        return response
          .status(422)
          .json({ error: "Keep your note to 2,000 characters." });
      await withLearner(dependencies, signedIn);
      const note = await dependencies.repository.saveNote(
        signedIn.userId,
        CLUB_ID,
        lessonId,
        body.text,
      );
      return response.status(200).json({ note });
    }

    /* Review actions are officer-only and never touch a learner record. */
    if (action === "review") {
      if (!actor?.reviewer)
        return response
          .status(403)
          .json({ error: "Applications are for club officers." });
      const applicationId =
        typeof body.applicationId === "string" ? body.applicationId : "";
      const next = body.status;
      const note = typeof body.note === "string" ? body.note.trim() : "";
      if (!applicationId || !isApplicationStatus(next))
        return response
          .status(400)
          .json({ error: "Choose a decision for that application." });
      const existing = await dependencies.repository.findApplication(
        CLUB_ID,
        applicationId,
      );
      if (!existing)
        return response.status(404).json({ error: "Application not found." });
      if (!canTransition(existing.status, next))
        return response.status(409).json({
          error: `That application is ${APPLICATION_STATUS_LABEL[existing.status].toLowerCase()}.`,
        });
      if (next === "needs_more" && note.length < 10)
        return response
          .status(422)
          .json({ error: "Tell the applicant what you need." });
      const decided = next === "approved" || next === "needs_more";
      const saved = await dependencies.repository.saveApplication(
        existing.userId,
        CLUB_ID,
        {
          ...existing,
          status: next,
          decidedAt: decided ? new Date().toISOString() : existing.decidedAt,
          decidedBy: decided
            ? (actor.email ?? actor.userId)
            : existing.decidedBy,
          decisionNote: note || existing.decisionNote,
        },
      );
      await dependencies.repository.logEvent({
        clubId: CLUB_ID,
        userId: existing.userId,
        actorId: actor.userId,
        actorEmail: actor.email,
        type: `application.${next}`,
        detail: { applicationId, note: note.slice(0, 500) },
      });
      return response.status(200).json({ application: saved });
    }

    /* Everything below belongs to the signed-in learner. */
    const learner = await withLearner(dependencies, signedIn);
    let record = learner.record;

    if (action === "lesson") {
      const lessonId = typeof body.lessonId === "string" ? body.lessonId : "";
      if (!LESSON_IDS.includes(lessonId))
        return response.status(400).json({ error: "Unknown lesson." });
      if (!lessonIsUnlocked(record, lessonId))
        return response
          .status(409)
          .json({ error: "Finish the earlier lessons first." });
      if (!record.completedLessons.includes(lessonId))
        record = {
          ...record,
          completedLessons: [...record.completedLessons, lessonId],
        };
      record = await dependencies.repository.saveRecord(
        signedIn.userId,
        CLUB_ID,
        record,
      );
      return response.status(200).json({
        record,
        summary: summarise(record, FULL_COURSE),
        chapters: CURRICULUM.map((chapter) => ({
          ...chapterProgress(record, chapter),
        })),
      });
    }

    if (action === "scenario") {
      const scenarioId =
        typeof body.scenarioId === "string" ? body.scenarioId : "";
      const optionId = typeof body.optionId === "string" ? body.optionId : "";
      const check = SCENARIO_CHECKS.find((item) => item.id === scenarioId);
      if (!check) return response.status(400).json({ error: "Unknown check." });
      if (!check.options.some((option) => option.id === optionId))
        return response
          .status(400)
          .json({ error: "Choose one of the options." });
      if (!chapterLessonsComplete(record, check.chapterId))
        return response
          .status(409)
          .json({ error: "Read this chapter’s lessons first." });
      const correct = optionId === check.bestOptionId;
      record = {
        ...record,
        scenarioAnswers: { ...record.scenarioAnswers, [scenarioId]: optionId },
      };
      record = await dependencies.repository.saveRecord(
        signedIn.userId,
        CLUB_ID,
        record,
      );
      await dependencies.repository.logEvent({
        clubId: CLUB_ID,
        userId: signedIn.userId,
        actorId: signedIn.userId,
        actorEmail: signedIn.email,
        type: "scenario.answered",
        detail: { scenarioId, correct },
      });
      return response.status(200).json({
        correct,
        bestOptionId: check.bestOptionId,
        feedback: check.feedback,
        record,
        summary: summarise(record, FULL_COURSE),
      });
    }

    if (action === "assessment") {
      const outstanding = LESSON_IDS.filter(
        (id) => !record.completedLessons.includes(id),
      );
      if (outstanding.length)
        return response
          .status(409)
          .json({ error: "Finish all fourteen lessons first." });
      const answers = normaliseAnswers(
        body.answers,
        FULL_COURSE.questions.length,
      );
      if (!answers)
        return response
          .status(400)
          .json({ error: "Send one answer per question." });
      const graded = gradeAttempt(answers, FULL_COURSE);
      const attempt = await dependencies.repository.recordAttempt(
        signedIn.userId,
        CLUB_ID,
        {
          correct: graded.correct,
          total: graded.total,
          passed: graded.passed,
          answers,
        },
      );
      const passedAt =
        graded.passed && !record.passed
          ? new Date().toISOString()
          : record.passedAt;
      record = await dependencies.repository.saveRecord(
        signedIn.userId,
        CLUB_ID,
        {
          ...record,
          bestScore: Math.max(record.bestScore, graded.correct),
          attempts: record.attempts + 1,
          passed: record.passed || graded.passed,
          passedAt,
        },
      );
      return response.status(200).json({
        correct: graded.correct,
        total: graded.total,
        passed: graded.passed,
        perQuestion: graded.perQuestion,
        unanswered: graded.unanswered,
        feedback: graded.feedback,
        attemptId: attempt.id,
        passMark: FULL_COURSE.passMark,
        record,
        summary: summarise(record, FULL_COURSE),
      });
    }

    if (action === "proposal") {
      if (!record.passed)
        return response
          .status(409)
          .json({ error: "Pass the assessment before writing your proposal." });
      const proposal = normaliseProposal(body.proposal);
      if (!proposal)
        return response.status(422).json({
          error:
            "Every field needs at least forty characters, and under two thousand.",
        });
      record = await dependencies.repository.saveRecord(
        signedIn.userId,
        CLUB_ID,
        { ...record, proposal },
      );
      return response.status(200).json({
        record,
        summary: summarise(record, FULL_COURSE),
      });
    }

    if (action === "draft") {
      const draft = readDraft(body.draft);
      if (!draft)
        return response.status(400).json({ error: "Invalid details." });
      const existing = await dependencies.repository.loadApplication(
        signedIn.userId,
        CLUB_ID,
      );
      if (
        existing &&
        existing.status !== "draft" &&
        existing.status !== "needs_more"
      )
        return response
          .status(409)
          .json({ error: "Your application is already with the club." });
      const saved = await dependencies.repository.saveApplication(
        signedIn.userId,
        CLUB_ID,
        {
          id: existing?.id ?? "",
          status: "draft",
          ...draft,
          courseVersion: FULL_COURSE.version,
          courseScore: record.bestScore,
          submittedAt: null,
          decidedAt: null,
          decidedBy: null,
          decisionNote: null,
          updatedAt: new Date().toISOString(),
        },
      );
      return response.status(200).json({ application: saved });
    }

    if (action === "apply") {
      const summary = summarise(record, FULL_COURSE);
      if (!summary.canApply)
        return response.status(409).json({
          error:
            "Complete the course, the chapter checks, the assessment and your proposal first.",
        });
      const existing = await dependencies.repository.loadApplication(
        signedIn.userId,
        CLUB_ID,
      );
      if (!existing)
        return response
          .status(409)
          .json({ error: "Fill in your details before sending." });
      const errors = validateDraft(draftFrom(existing));
      if (Object.keys(errors).length)
        return response.status(422).json({
          error: "Check your details before sending.",
          fields: errors,
        });
      if (existing.status === "submitted" || existing.status === "in_review")
        return response
          .status(409)
          .json({ error: "Your application is already with the club." });
      if (!canTransition(existing.status, "submitted"))
        return response
          .status(409)
          .json({ error: "That application cannot be sent again." });
      const saved = await dependencies.repository.saveApplication(
        signedIn.userId,
        CLUB_ID,
        {
          ...existing,
          status: "submitted",
          courseVersion: FULL_COURSE.version,
          courseScore: record.bestScore,
          submittedAt: new Date().toISOString(),
          decisionNote: null,
          decidedAt: null,
          decidedBy: null,
        },
      );
      await dependencies.repository.logEvent({
        clubId: CLUB_ID,
        userId: signedIn.userId,
        actorId: signedIn.userId,
        actorEmail: signedIn.email,
        type: "application.submitted",
        detail: { applicationId: saved.id, score: record.bestScore },
      });
      return response.status(200).json({
        application: saved,
        statusLabel: APPLICATION_STATUS_LABEL[saved.status],
      });
    }

    if (action === "withdraw") {
      const existing = await dependencies.repository.loadApplication(
        signedIn.userId,
        CLUB_ID,
      );
      if (!existing)
        return response
          .status(404)
          .json({ error: "No application to withdraw." });
      if (!canTransition(existing.status, "withdrawn"))
        return response
          .status(409)
          .json({ error: "That application cannot be withdrawn now." });
      const saved = await dependencies.repository.saveApplication(
        signedIn.userId,
        CLUB_ID,
        {
          ...existing,
          status: "withdrawn",
          submittedAt: null,
          decidedAt: null,
          decidedBy: null,
          decisionNote: null,
        },
      );
      return response.status(200).json({ application: saved });
    }

    return response.status(400).json({ error: "Unknown action." });
  };
}
