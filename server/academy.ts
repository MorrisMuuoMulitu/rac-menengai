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
  CERTIFICATE_NUMBER_PATTERN,
  CERTIFICATE_PHOTO_MAX_BYTES,
  CERTIFICATE_PHOTO_MAX_LENGTH,
  chapterProgress,
  emptyRecord,
  learnerCohort,
  NUDGE_AFTER_DAYS,
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
import { lessonSections } from "../shared/rotaract-academy/sections.js";
import {
  CLUB_ID,
  type AcademyRepository,
  type LearnerProgressRow,
} from "./academy-db.js";
import {
  reviewerAllowlist,
  type Actor,
  type ActorResolver,
  type AuthRequest,
} from "./academy-auth.js";
import {
  applicationEmail,
  learnerDeletionAdminEmail,
  learnerRecordDeletedEmail,
  type EmailSender,
} from "./email.js";
import { createCertificateNumber, rotaryYear } from "./certificate-id.js";

export interface AcademyResponse {
  status(code: number): AcademyResponse;
  setHeader(key: string, value: string): void;
  json(body: unknown): void;
}

export interface AcademyDependencies {
  resolveActor: ActorResolver;
  repository: AcademyRepository;
  sendEmail?: EmailSender | null;
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

function certificatePhotoIsValid(value: string): boolean {
  if (value.length > CERTIFICATE_PHOTO_MAX_LENGTH) return false;
  const match = /^data:image\/(jpeg|png|webp);base64,([a-z0-9+/=]+)$/i.exec(
    value,
  );
  if (!match) return false;

  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > CERTIFICATE_PHOTO_MAX_BYTES) return false;

  if (match[1].toLowerCase() === "jpeg")
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (match[1].toLowerCase() === "png")
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    );
  return (
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

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
  learner: {
    displayName: string | null;
    phone: string | null;
  },
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
    profile: {
      displayName: learner.displayName ?? actor.displayName,
      phone: learner.phone,
      officialName: record.certificateName,
      complete: Boolean(
        learner.phone?.trim().length &&
        learner.phone.trim().length >= 7 &&
        record.certificateName,
      ),
    },
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

async function withCertificateIdentity(
  dependencies: AcademyDependencies,
  userId: string,
  record: LearningRecord,
): Promise<LearningRecord> {
  if (!record.passed || record.certificateNumber) return record;
  const completedAt =
    record.completedAt ??
    record.passedAt ??
    record.updatedAt ??
    new Date().toISOString();
  const sequence = await dependencies.repository.nextCertificateSequence(
    CLUB_ID,
    rotaryYear(new Date(completedAt)),
  );
  return {
    ...record,
    completedAt,
    certificateNumber: createCertificateNumber(completedAt, sequence),
  };
}

/**
 * A lesson can be marked done only if everything before it is done, so a
 * tampered request cannot mark the whole course complete in one call.
 */
/**
 * Everyone on the course, shaped for the membership team's progress screen.
 *
 * Each learner's own view is generated from the same `summarise` call, so an
 * officer and the learner can never be shown different numbers. No answers
 * and no explanations leave here: the payload carries counts and dates only.
 */
function learnerProgressPayload(
  rows: LearnerProgressRow[],
  applicationStatus: Map<string, ApplicationStatus>,
) {
  const now = new Date();
  const learners = rows.map((row) => {
    const summary = summarise(row.record, FULL_COURSE);
    /*
     * Progress writes are stamped; the learner row's own timestamp also moves
     * on sign-in. Prefer the progress stamp so a learner who keeps opening the
     * page without moving is not reported as active.
     */
    const lastProgressAt = row.record.updatedAt ?? row.lastSeenAt;
    const { cohort, daysIdle } = learnerCohort({
      completed: summary.completed,
      total: summary.total,
      lastActiveAt: lastProgressAt,
      now,
    });
    return {
      userId: row.userId,
      displayName: row.displayName,
      email: row.email,
      phone: row.phone,
      startedAt: row.startedAt,
      lastProgressAt,
      lastSeenAt: row.lastSeenAt,
      completed: summary.completed,
      total: summary.total,
      percent: summary.percent,
      stage: summary.stage,
      lessonsDone: summary.lessons.filter((lesson) => lesson.done).length,
      lessonsTotal: summary.lessons.length,
      checksDone: summary.scenarios.filter((item) => item.done).length,
      checksTotal: summary.scenarios.length,
      bestScore: row.record.bestScore,
      assessmentTotal: FULL_COURSE.questions.length,
      attempts: row.record.attempts,
      assessmentPassed: summary.assessmentPassed,
      certificateName: row.record.certificateName,
      proposalSubmitted: summary.proposalSubmitted,
      canApply: summary.canApply,
      applicationStatus: applicationStatus.get(row.userId) ?? null,
      cohort,
      daysIdle,
    };
  });
  /*
   * Officer order: the people who need a nudge come first, then everyone still
   * moving, then those who have not opened it. Within a group, longest quiet
   * first, so the top of the list is always the next person to contact.
   */
  const rank: Record<string, number> = {
    "needs-nudge": 0,
    "in-progress": 1,
    "not-started": 2,
    done: 3,
  };
  learners.sort(
    (a, b) =>
      rank[a.cohort] - rank[b.cohort] ||
      (b.daysIdle ?? -1) - (a.daysIdle ?? -1) ||
      (a.displayName ?? a.email ?? "").localeCompare(
        b.displayName ?? b.email ?? "",
      ),
  );
  return {
    nudgeAfterDays: NUDGE_AFTER_DAYS,
    totals: {
      all: learners.length,
      needsNudge: learners.filter((item) => item.cohort === "needs-nudge")
        .length,
      inProgress: learners.filter((item) => item.cohort === "in-progress")
        .length,
      notStarted: learners.filter((item) => item.cohort === "not-started")
        .length,
      done: learners.filter((item) => item.cohort === "done").length,
    },
    learners,
  };
}

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
  const notificationRecipients = [
    ...reviewerAllowlist(
      env.ACADEMY_NOTIFICATION_EMAILS ?? env.ACADEMY_REVIEWER_EMAILS,
    ),
  ];

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

    if (request.method === "GET") {
      const publicUrl = new URL(request.url ?? "/api/academy", origin);
      if (publicUrl.searchParams.get("view") === "certificate-verification") {
        const number = publicUrl.searchParams.get("number") ?? "";
        if (!CERTIFICATE_NUMBER_PATTERN.test(number))
          return response
            .status(404)
            .json({ valid: false, error: "Certificate not found." });
        const rows = await dependencies.repository.listLearners(CLUB_ID);
        const row = rows.find(
          (item) =>
            item.record.passed &&
            item.record.certificateNumber?.toUpperCase() ===
              number.toUpperCase(),
        );
        if (!row)
          return response
            .status(404)
            .json({ valid: false, error: "Certificate not found." });
        return response.status(200).json({
          valid: true,
          certificate: {
            number: row.record.certificateNumber,
            name:
              row.record.certificateName ??
              row.displayName ??
              "Academy graduate",
            completedAt:
              row.record.completedAt ??
              row.record.passedAt ??
              row.record.updatedAt,
            courseTitle: "Rotaract, from the ground up",
            issuedBy: "Rotaract Club of Menengai",
            president: "Wanjiku Nguru",
            rotaryYear: "2026-2027",
          },
        });
      }
    }

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
      if (readUrl.searchParams.get("view") === "learners") {
        if (!actor?.reviewer)
          return response
            .status(403)
            .json({ error: "Learner progress is for club officers." });
        /*
         * Both reads are scoped to the club and neither accepts a user id from
         * the caller, so an officer can only ever see their own club's roster.
         */
        const [rows, applications] = await Promise.all([
          dependencies.repository.listLearners(CLUB_ID),
          dependencies.repository.listApplications(CLUB_ID),
        ]);
        const statuses = new Map(
          applications.map((item) => [item.userId, item.status]),
        );
        return response.status(200).json({
          signedIn: true,
          reviewer: true,
          ...learnerProgressPayload(rows, statuses),
        });
      }
      if (readUrl.searchParams.get("view") === "certificate") {
        if (!actor?.reviewer)
          return response
            .status(403)
            .json({ error: "Certificates are for club officers." });
        const userId = readUrl.searchParams.get("userId");
        if (!userId)
          return response.status(400).json({ error: "Choose a learner." });
        const rows = await dependencies.repository.listLearners(CLUB_ID);
        const row = rows.find((item) => item.userId === userId);
        if (!row?.record.passed)
          return response
            .status(404)
            .json({ error: "That learner has no completed certificate." });
        const certificateRecord = await withCertificateIdentity(
          dependencies,
          row.userId,
          row.record,
        );
        if (certificateRecord !== row.record)
          await dependencies.repository.saveRecord(
            row.userId,
            CLUB_ID,
            certificateRecord,
          );
        return response.status(200).json({
          signedIn: true,
          certificate: {
            name:
              certificateRecord.certificateName ??
              row.displayName ??
              row.email ??
              "Learner",
            photo: certificateRecord.certificatePhoto,
            completedAt:
              certificateRecord.completedAt ??
              certificateRecord.passedAt ??
              certificateRecord.updatedAt,
            certificateNumber: certificateRecord.certificateNumber,
            score: certificateRecord.bestScore,
            total: FULL_COURSE.questions.length,
          },
        });
      }
      if (!actor)
        return response.status(200).json({
          signedIn: false,
          signInAvailable: Boolean(env.CLERK_SECRET_KEY),
          course,
        });
      const learner = await withLearner(dependencies, actor);
      const learnerRecord = await withCertificateIdentity(
        dependencies,
        actor.userId,
        learner.record,
      );
      if (learnerRecord !== learner.record)
        learner.record = await dependencies.repository.saveRecord(
          actor.userId,
          CLUB_ID,
          learnerRecord,
        );
      const application = await dependencies.repository.loadApplication(
        actor.userId,
        CLUB_ID,
      );
      return response.status(200).json({
        course,
        ...learnerPayload(actor, learner, learner.record, application),
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

    if (action === "delete-learner") {
      if (!signedIn.reviewer)
        return response.status(403).json({
          error: "Deleting learners is restricted to club officers.",
        });
      const userId = typeof body.userId === "string" ? body.userId : "";
      if (!userId)
        return response.status(400).json({ error: "Choose a learner." });
      if (userId === signedIn.userId)
        return response.status(403).json({
          error: "You cannot delete your own learner record.",
        });
      if (body.confirm !== "DELETE")
        return response.status(422).json({
          error: "Type DELETE to confirm permanent removal.",
        });

      const deletedAt = new Date().toISOString();
      const deleted = await dependencies.repository.deleteLearner(
        userId,
        CLUB_ID,
      );
      if (!deleted)
        return response.status(404).json({ error: "Learner not found." });

      const learnerName = deleted.displayName ?? deleted.email ?? "Learner";
      const learnerEmail = deleted.email?.trim() ?? "";
      const actorEmail = signedIn.email?.trim() ?? "";
      let learnerNotified = false;
      let adminNotified = false;

      if (dependencies.sendEmail && learnerEmail) {
        try {
          await dependencies.sendEmail({
            to: [learnerEmail],
            ...learnerRecordDeletedEmail({
              learnerName,
              deletedAt,
              contactEmail: notificationRecipients[0] ?? "menengairc@gmail.com",
            }),
            idempotencyKey: `learner-deleted-${userId}-${deletedAt}`,
          });
          learnerNotified = true;
        } catch {
          /* The deletion is complete; the admin notice records the outcome. */
        }
      }

      if (dependencies.sendEmail && actorEmail) {
        try {
          await dependencies.sendEmail({
            to: [actorEmail],
            ...learnerDeletionAdminEmail({
              learnerName,
              learnerEmail: learnerEmail || "No email on file",
              deletedAt,
            }),
            idempotencyKey: `learner-deletion-admin-${userId}-${deletedAt}`,
          });
          adminNotified = true;
        } catch {
          /* The deletion remains valid even if the confirmation email fails. */
        }
      }

      await dependencies.repository
        .logEvent({
          clubId: CLUB_ID,
          userId,
          actorId: signedIn.userId,
          actorEmail: signedIn.email,
          type: "learner.deleted",
          detail: {
            learnerNotified,
            adminNotified,
            learnerEmailPresent: Boolean(learnerEmail),
          },
        })
        .catch(() => undefined);

      return response.status(200).json({
        deleted: true,
        learner: {
          userId: deleted.userId,
          displayName: deleted.displayName,
          email: deleted.email,
        },
        notifications: {
          learner: learnerNotified,
          admin: adminNotified,
        },
      });
    }

    if (action === "self-profile") {
      const learner = await withLearner(dependencies, signedIn);
      const phone = typeof body.phone === "string" ? body.phone.trim() : "";
      const officialName =
        typeof body.officialName === "string" ? body.officialName.trim() : "";
      if (phone.length < 7 || phone.length > 40)
        return response
          .status(422)
          .json({ error: "Enter a phone number between 7 and 40 characters." });
      if (officialName.length < 2 || officialName.length > 120)
        return response.status(422).json({
          error: "Use the official name from 2 to 120 characters.",
        });
      const updated = await dependencies.repository.updateLearnerProfile(
        signedIn.userId,
        CLUB_ID,
        {
          displayName: learner.displayName ?? signedIn.displayName ?? "Learner",
          certificateName: officialName,
          phone,
        },
      );
      if (!updated)
        return response.status(404).json({ error: "Learner not found." });
      return response.status(200).json({
        record: updated.record,
        profile: {
          displayName: updated.displayName,
          phone: updated.phone,
          officialName: updated.record.certificateName,
          complete: true,
        },
      });
    }

    if (action === "learner-profile") {
      if (!signedIn.reviewer)
        return response
          .status(403)
          .json({ error: "Learner details are for club officers." });
      const userId = typeof body.userId === "string" ? body.userId : "";
      const displayName =
        typeof body.displayName === "string" ? body.displayName.trim() : "";
      const certificateName =
        typeof body.certificateName === "string"
          ? body.certificateName.trim()
          : "";
      const phone = typeof body.phone === "string" ? body.phone.trim() : "";
      if (!userId || displayName.length < 1 || displayName.length > 120)
        return response
          .status(422)
          .json({ error: "Use a display name between 1 and 120 characters." });
      if (certificateName.length < 2 || certificateName.length > 120)
        return response.status(422).json({
          error: "Use a certificate name between 2 and 120 characters.",
        });
      if (phone.length < 7 || phone.length > 40)
        return response
          .status(422)
          .json({ error: "Use a phone number between 7 and 40 characters." });
      const updated = await dependencies.repository.updateLearnerProfile(
        userId,
        CLUB_ID,
        { displayName, certificateName, phone },
      );
      if (!updated)
        return response.status(404).json({ error: "Learner not found." });
      await dependencies.repository
        .logEvent({
          clubId: CLUB_ID,
          userId,
          actorId: signedIn.userId,
          actorEmail: signedIn.email,
          type: "learner.profile_updated",
          detail: { fields: ["displayName", "certificateName"] },
        })
        .catch(() => undefined);
      return response.status(200).json({
        learner: {
          userId: updated.userId,
          email: updated.email,
          displayName: updated.displayName,
          certificateName: updated.record.certificateName,
          phone: updated.phone,
        },
      });
    }

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
        return response.status(409).json({
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
      if (existing.userId === signedIn.userId)
        return response
          .status(403)
          .json({ error: "You cannot review your own application." });
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
    let record = await withCertificateIdentity(
      dependencies,
      signedIn.userId,
      learner.record,
    );
    if (record !== learner.record)
      record = await dependencies.repository.saveRecord(
        signedIn.userId,
        CLUB_ID,
        record,
      );

    if (
      [
        "section",
        "lesson",
        "scenario",
        "assessment",
        "proposal",
        "certificate",
        "draft",
        "apply",
      ].includes(action) &&
      (!learner.phone ||
        learner.phone.trim().length < 7 ||
        !record.certificateName)
    )
      return response.status(409).json({
        error:
          "Add your phone number and official certificate name before continuing the course.",
      });

    if (action === "section") {
      const lessonId = typeof body.lessonId === "string" ? body.lessonId : "";
      const sectionIndex =
        typeof body.sectionIndex === "number" ? body.sectionIndex : -1;
      const module = FULL_COURSE.modules.find((item) => item.id === lessonId);
      if (!module)
        return response.status(400).json({ error: "Unknown lesson." });
      if (!lessonIsUnlocked(record, lessonId))
        return response
          .status(409)
          .json({ error: "Finish the earlier lessons first." });
      const sectionCount = lessonSections(module.blocks).length;
      if (
        !Number.isInteger(sectionIndex) ||
        sectionIndex < 0 ||
        sectionIndex >= sectionCount
      )
        return response
          .status(422)
          .json({ error: "That lesson section does not exist." });

      const existing = record.sectionProgress[lessonId] ?? {
        lastSection: 0,
        completedSections: [],
      };
      const completedSections =
        body.completed === true &&
        !existing.completedSections.includes(sectionIndex)
          ? [...existing.completedSections, sectionIndex].sort((a, b) => a - b)
          : existing.completedSections;
      const nextSection = {
        lastSection: sectionIndex,
        completedSections,
      };
      record = await dependencies.repository.saveRecord(
        signedIn.userId,
        CLUB_ID,
        {
          ...record,
          sectionProgress: {
            ...record.sectionProgress,
            [lessonId]: nextSection,
          },
        },
      );
      return response.status(200).json({
        record,
        sectionProgress: nextSection,
      });
    }

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
        return response.status(409).json({
          error: `Finish all ${FULL_COURSE.modules.length} lessons first.`,
        });
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
      const assessedRecord = await withCertificateIdentity(
        dependencies,
        signedIn.userId,
        {
          ...record,
          bestScore: Math.max(record.bestScore, graded.correct),
          attempts: record.attempts + 1,
          passed: record.passed || graded.passed,
          passedAt,
        },
      );
      record = await dependencies.repository.saveRecord(
        signedIn.userId,
        CLUB_ID,
        assessedRecord,
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

    if (action === "certificate") {
      if (!record.passed)
        return response.status(409).json({
          error: "Pass the final assessment before creating a certificate.",
        });
      const certificateName =
        typeof body.name === "string" ? body.name.trim() : "";
      if (certificateName.length < 2 || certificateName.length > 120)
        return response.status(422).json({
          error: "Use a certificate name between 2 and 120 characters.",
        });
      let certificatePhoto = record.certificatePhoto;
      if (Object.prototype.hasOwnProperty.call(body, "photo")) {
        if (body.photo === null) certificatePhoto = null;
        else if (
          typeof body.photo === "string" &&
          certificatePhotoIsValid(body.photo)
        )
          certificatePhoto = body.photo;
        else
          return response.status(422).json({
            error:
              "Use a JPEG, PNG or WebP photo under 220 KB, or leave the photo blank.",
          });
      }
      const completedAt =
        record.completedAt ??
        record.passedAt ??
        record.updatedAt ??
        new Date().toISOString();
      const certificateRecord = await withCertificateIdentity(
        dependencies,
        signedIn.userId,
        {
          ...record,
          certificateName,
          certificatePhoto,
          completedAt,
        },
      );
      record = await dependencies.repository.saveRecord(
        signedIn.userId,
        CLUB_ID,
        certificateRecord,
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
      let existing = await dependencies.repository.loadApplication(
        signedIn.userId,
        CLUB_ID,
      );
      /*
       * The send button submits the values currently on screen. Saving those
       * values in the same request prevents a stale or missing draft from
       * blocking an application the learner has just completed.
       */
      if (body.draft !== undefined) {
        const draft = readDraft(body.draft);
        if (!draft)
          return response.status(400).json({ error: "Invalid details." });
        const draftErrors = validateDraft(draft);
        if (Object.keys(draftErrors).length)
          return response.status(422).json({
            error: "Check your details before sending.",
            fields: draftErrors,
          });
        if (
          existing &&
          existing.status !== "draft" &&
          existing.status !== "needs_more" &&
          existing.status !== "withdrawn"
        )
          return response
            .status(409)
            .json({ error: "Your application is already with the club." });
        existing = await dependencies.repository.saveApplication(
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
      }
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
      if (dependencies.sendEmail && notificationRecipients.length) {
        try {
          await dependencies.sendEmail({
            to: notificationRecipients,
            ...applicationEmail({
              applicantName: saved.fullName,
              applicantEmail: saved.email,
              location: saved.location,
              score: saved.courseScore,
              total: FULL_COURSE.questions.length,
              submittedAt: saved.submittedAt ?? new Date().toISOString(),
              queueUrl: `${origin}/membership/queue`,
            }),
            replyTo: saved.email,
            idempotencyKey: `application-submitted-${saved.id}`,
          });
          await dependencies.repository
            .logEvent({
              clubId: CLUB_ID,
              userId: null,
              actorId: null,
              actorEmail: null,
              type: "application.notification_sent",
              detail: { applicationId: saved.id },
            })
            .catch(() => undefined);
        } catch {
          await dependencies.repository
            .logEvent({
              clubId: CLUB_ID,
              userId: null,
              actorId: null,
              actorEmail: null,
              type: "application.notification_failed",
              detail: { applicationId: saved.id },
            })
            .catch(() => undefined);
        }
      }
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
