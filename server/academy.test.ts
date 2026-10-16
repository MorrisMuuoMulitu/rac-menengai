import { beforeEach, describe, expect, it } from "vitest";
import { createAcademyHandler } from "./academy";
import type {
  AcademyRepository,
  AttemptRow,
  LearnerRow,
  ReviewQueueItem,
} from "./academy-db";
import type { Actor } from "./academy-auth";
import { FULL_COURSE } from "./course";
import { CURRICULUM } from "../shared/rotaract-academy/curriculum";
import { SCENARIO_CHECKS } from "../shared/rotaract-academy/scenarios";
import {
  emptyRecord,
  type LearningRecord,
} from "../shared/rotaract-academy/progress";
import type { MembershipApplication } from "../shared/rotaract-academy/application";

/* ---------------- a repository that behaves like the real one --------------- */

function fakeRepository(): AcademyRepository & {
  data: Map<string, LearnerRow>;
} {
  const data = new Map<string, LearnerRow>();
  const applications = new Map<string, ReviewQueueItem>();
  const events: string[] = [];
  const notes = new Map<string, { text: string; updatedAt: string }>();
  const key = (userId: string, clubId: string) => `${clubId}:${userId}`;

  return {
    data,
    async loadNote(userId, clubId, lessonId) {
      return notes.get(`${key(userId, clubId)}:${lessonId}`) ?? null;
    },
    async saveNote(userId, clubId, lessonId, text) {
      const note = { text, updatedAt: new Date().toISOString() };
      notes.set(`${key(userId, clubId)}:${lessonId}`, note);
      return note;
    },
    async ensureLearner({ userId, clubId, email, displayName }) {
      const existing = data.get(key(userId, clubId));
      if (existing) return existing;
      const learner: LearnerRow = {
        userId,
        clubId,
        email,
        displayName,
        record: emptyRecord(FULL_COURSE.version),
      };
      data.set(key(userId, clubId), learner);
      return learner;
    },
    async saveRecord(userId, clubId, record) {
      const learner = data.get(key(userId, clubId));
      if (!learner) throw new Error("learner-missing");
      learner.record = record as LearningRecord;
      return learner.record;
    },
    async recordAttempt(userId, clubId, attempt): Promise<AttemptRow> {
      const learner = data.get(key(userId, clubId));
      if (!learner) throw new Error("learner-missing");
      return {
        id: 1,
        correct: attempt.correct,
        total: attempt.total,
        passed: attempt.passed,
        createdAt: new Date().toISOString(),
      };
    },
    async loadApplication(userId, clubId) {
      return applications.get(key(userId, clubId)) ?? null;
    },
    async saveApplication(userId, clubId, application) {
      const saved = {
        ...application,
        id: application.id || `app-${userId}`,
        userId,
      } as ReviewQueueItem;
      applications.set(key(userId, clubId), saved);
      return saved;
    },
    async listApplications() {
      return [...applications.values()].filter(
        (item) => item.status !== "draft",
      );
    },
    async findApplication(_clubId, applicationId) {
      return (
        [...applications.values()].find((item) => item.id === applicationId) ??
        null
      );
    },
    async logEvent(event) {
      events.push(`${event.type}:${event.userId ?? ""}`);
    },
  } as AcademyRepository & { data: Map<string, LearnerRow> };
}

/* --------------------------- request/response stubs ------------------------ */

type StubResponse = {
  statusCode: number;
  body: unknown;
  headers: Record<string, string>;
  status(code: number): StubResponse;
  setHeader(key: string, value: string): void;
  json(body: unknown): void;
};

function response(): StubResponse {
  const res: StubResponse = {
    statusCode: 200,
    body: undefined,
    headers: {},
    status(code) {
      res.statusCode = code;
      return res;
    },
    setHeader(key, value) {
      res.headers[key] = value;
    },
    json(body) {
      res.body = body;
    },
  };
  return res;
}

const SITE = "https://rotaractmenengai.org";

function request(
  method: "GET" | "POST",
  options: {
    body?: unknown;
    url?: string;
    user?: string;
    origin?: string;
  } = {},
) {
  return {
    method,
    url: options.url ?? "/api/academy",
    body: options.body,
    headers: {
      origin: options.origin ?? SITE,
      "content-type": "application/json",
      ...(options.user ? { "x-test-user": options.user } : {}),
    } as Record<string, string>,
  };
}

const env = {
  SITE_ORIGIN: SITE,
  CLERK_SECRET_KEY: "sk_test_stub",
  ACADEMY_REVIEWER_EMAILS: "morrismulitu@gmail.com",
} as Record<string, string>;

/**
 * The resolver stands in for Clerk. It reads a header only in tests; the real
 * resolver reads a signed session and cannot be influenced by the caller.
 */
function resolver(people: Record<string, Actor>) {
  return async (req: {
    headers: Record<string, string | string[] | undefined>;
  }) => {
    const id = req.headers["x-test-user"];
    const userId = Array.isArray(id) ? id[0] : id;
    return userId ? (people[userId] ?? null) : null;
  };
}

const learner: Actor = {
  userId: "user_amina",
  email: "amina@example.com",
  displayName: "Amina Wanjiru",
  reviewer: false,
};

const secondLearner: Actor = {
  userId: "user_otieno",
  email: "otieno@example.com",
  displayName: "Otieno",
  reviewer: false,
};

const officer: Actor = {
  userId: "user_officer",
  email: "morrismulitu@gmail.com",
  displayName: "Membership team",
  reviewer: true,
};

const people = {
  [learner.userId]: learner,
  [secondLearner.userId]: secondLearner,
  [officer.userId]: officer,
};

let repository: ReturnType<typeof fakeRepository>;
let handler: ReturnType<typeof createAcademyHandler>;

beforeEach(() => {
  repository = fakeRepository();
  handler = createAcademyHandler(env, {
    resolveActor: resolver(people),
    repository,
  });
});

const LESSON_IDS = FULL_COURSE.modules.map((module) => module.id);

describe("private lesson notes", () => {
  it("saves only to the authenticated account without changing course progress", async () => {
    const saved = await post(learner.userId, {
      action: "note",
      lessonId: "roots",
      text: "My reflection",
      userId: secondLearner.userId,
    });
    expect(saved.statusCode).toBe(200);
    const own = await get(
      learner.userId,
      "/api/academy?view=note&lessonId=roots",
    );
    expect((own.body as { note: { text: string } }).note.text).toBe(
      "My reflection",
    );
    const other = await get(
      secondLearner.userId,
      "/api/academy?view=note&lessonId=roots",
    );
    expect((other.body as { note: unknown }).note).toBeNull();
    const reviewerRead = await get(
      officer.userId,
      "/api/academy?view=note&lessonId=roots",
    );
    expect((reviewerRead.body as { note: unknown }).note).toBeNull();
    expect(
      repository.data.get(`menengai:${learner.userId}`)?.record
        .completedLessons,
    ).toEqual([]);
    const publicRead = await get(
      undefined,
      "/api/academy?view=note&lessonId=roots",
    );
    expect(publicRead.statusCode).toBe(401);
  });
  it("rejects unknown lessons and oversized notes", async () => {
    expect(
      (
        await post(learner.userId, {
          action: "note",
          lessonId: "unknown",
          text: "x",
        })
      ).statusCode,
    ).toBe(400);
    expect(
      (
        await post(learner.userId, {
          action: "note",
          lessonId: "roots",
          text: "x".repeat(2001),
        })
      ).statusCode,
    ).toBe(422);
  });
  it("still saves for an account with no email on file, and rejects a stale account", async () => {
    const noEmail: Actor = {
      userId: "user_no_email",
      email: null,
      displayName: "No Email",
      reviewer: false,
    };
    const scoped = createAcademyHandler(env, {
      resolveActor: resolver({ ...people, [noEmail.userId]: noEmail }),
      repository,
    });
    const reply = async (user: string, body: Record<string, unknown>) => {
      const res = response();
      await scoped(request("POST", { user, body }), res as never);
      return res;
    };
    expect(
      (
        await reply(noEmail.userId, {
          action: "note",
          lessonId: "roots",
          text: "Kept without an email",
          ownerEmail: "",
        })
      ).statusCode,
    ).toBe(200);
    expect(
      (
        await reply(learner.userId, {
          action: "note",
          lessonId: "roots",
          text: "Wrong account",
          ownerEmail: secondLearner.email,
        })
      ).statusCode,
    ).toBe(409);
  });
});
/** The order the page actually offers lessons in. */
const PRESENTED_LESSON_IDS = CURRICULUM.flatMap((chapter) =>
  chapter.lessons.map((lesson) => lesson.id),
);

async function post(user: string, body: Record<string, unknown>) {
  const res = response();
  await handler(request("POST", { user, body }), res as never);
  return res;
}

async function get(user?: string, url?: string) {
  const res = response();
  await handler(request("GET", { user, url }), res as never);
  return res;
}

/** Walk a learner through everything the club requires, via the API only. */
async function completeCourse(user: string) {
  for (const lessonId of PRESENTED_LESSON_IDS) {
    const res = await post(user, { action: "lesson", lessonId });
    expect(res.statusCode, `lesson ${lessonId}`).toBe(200);
  }
  for (const check of SCENARIO_CHECKS) {
    const res = await post(user, {
      action: "scenario",
      scenarioId: check.id,
      optionId: check.bestOptionId,
    });
    expect(res.statusCode, `scenario ${check.id}`).toBe(200);
    expect((res.body as { correct: boolean }).correct).toBe(true);
  }
  const graded = await post(user, {
    action: "assessment",
    answers: FULL_COURSE.questions.map((question) => question.correctIndex),
  });
  expect(graded.statusCode).toBe(200);
  const proposal = await post(user, {
    action: "proposal",
    proposal: {
      need: "The scout group asked for somewhere to store equipment safely.",
      objective: "A locked store room in use by the group before December.",
      host: "Nakuru Scouts, agreed with their group leader on 4 October.",
      roles: "Project lead is Otieno; three volunteers on the build day.",
      resources: "Timber and a lock donated; transport has to be paid for.",
      risks: "Rain, late timber delivery, and lifting on uneven ground.",
      followUp: "Check the store is in use in February and write it down.",
      openQuestions: "Who holds the key, and whether the county has to sign.",
    },
  });
  expect(proposal.statusCode).toBe(200);
}

async function fillDraft(user: string) {
  const res = await post(user, {
    action: "draft",
    draft: {
      fullName: "Amina Wanjiru",
      email: "amina@example.com",
      phone: "+254 700 000 000",
      profession: "Civil engineer",
      location: "Nakuru",
      motivation:
        "I want to work on water projects where I can use my engineering training and keep learning from people who have run projects for longer than I have.",
      availability: "Weekday evenings",
    },
  });
  expect(res.statusCode).toBe(200);
}

/* --------------------------------- tests ---------------------------------- */

describe("reading the course", () => {
  it("serves the lessons to anyone, without the answer key", async () => {
    const res = await get();
    expect(res.statusCode).toBe(200);
    const body = res.body as {
      signedIn: boolean;
      course: { questions: unknown[] };
    };
    expect(body.signedIn).toBe(false);
    expect(body.course.questions).toHaveLength(FULL_COURSE.questions.length);
    expect(JSON.stringify(body)).not.toContain("correctIndex");
    expect(JSON.stringify(body)).not.toContain("bestOptionId");
  });

  it("refuses to write anything without a signed-in session", async () => {
    const res = await post("nobody", {
      action: "lesson",
      lessonId: LESSON_IDS[0],
    });
    expect(res.statusCode).toBe(401);
  });

  it("rejects a write from another origin", async () => {
    const res = response();
    await handler(
      request("POST", {
        user: learner.userId,
        origin: "https://example.com",
        body: { action: "lesson", lessonId: LESSON_IDS[0] },
      }),
      res as never,
    );
    expect(res.statusCode).toBe(403);
  });

  it("says so plainly when sign-in is not configured", async () => {
    const bare = createAcademyHandler(
      { SITE_ORIGIN: SITE },
      { resolveActor: async () => null, repository },
    );
    const res = response();
    await bare(
      request("POST", { body: { action: "lesson", lessonId: LESSON_IDS[0] } }),
      res as never,
    );
    expect(res.statusCode).toBe(503);
  });
});

describe("lesson progress", () => {
  it("offers every lesson the chapter order promises, with no deadlock", async () => {
    /*
     * Walk the course exactly as the page presents it. Gating used to follow
     * the flat syllabus list instead, which orders chapter three's lesson
     * before chapter two's last one — so the course jammed at the end of
     * chapter two and every further attempt returned 409.
     */
    for (const lessonId of PRESENTED_LESSON_IDS) {
      const res = await post(learner.userId, { action: "lesson", lessonId });
      expect(res.statusCode, `lesson ${lessonId} was refused`).toBe(200);
    }
    const record = repository.data.get(`menengai:${learner.userId}`)!.record;
    expect(record.completedLessons.sort()).toEqual([...LESSON_IDS].sort());
  });

  it("records a lesson for the signed-in learner only", async () => {
    const res = await post(learner.userId, {
      action: "lesson",
      lessonId: LESSON_IDS[0],
    });
    expect(res.statusCode).toBe(200);
    expect(
      repository.data.get(`menengai:${learner.userId}`)?.record
        .completedLessons,
    ).toEqual([LESSON_IDS[0]]);
    expect(repository.data.has(`menengai:${secondLearner.userId}`)).toBe(false);
  });

  it("will not let a request jump to the last lesson", async () => {
    const res = await post(learner.userId, {
      action: "lesson",
      lessonId: LESSON_IDS[LESSON_IDS.length - 1],
    });
    expect(res.statusCode).toBe(409);
    expect(
      repository.data.get(`menengai:${learner.userId}`)?.record
        .completedLessons,
    ).toEqual([]);
  });

  it("rejects a lesson id that is not in the course", async () => {
    const res = await post(learner.userId, {
      action: "lesson",
      lessonId: "made-up-lesson",
    });
    expect(res.statusCode).toBe(400);
  });

  it("keeps one learner's progress invisible to another", async () => {
    await completeCourse(learner.userId);
    const mine = await get(learner.userId);
    const theirs = await get(secondLearner.userId);
    expect(
      (mine.body as { summary: { percent: number } }).summary.percent,
    ).toBe(100);
    expect(
      (theirs.body as { summary: { percent: number } }).summary.percent,
    ).toBe(0);
    expect(
      (theirs.body as { record: { completedLessons: string[] } }).record
        .completedLessons,
    ).toEqual([]);
  });
});

describe("scenario checks", () => {
  it("refuses a check before the chapter's lessons are read", async () => {
    const check = SCENARIO_CHECKS[0];
    const res = await post(learner.userId, {
      action: "scenario",
      scenarioId: check.id,
      optionId: check.bestOptionId,
    });
    expect(res.statusCode).toBe(409);
  });

  it("returns the reasoning only after the learner commits to an answer", async () => {
    for (const lessonId of LESSON_IDS.slice(0, 2))
      await post(learner.userId, { action: "lesson", lessonId });
    const check = SCENARIO_CHECKS[0];
    const wrong = check.options.find(
      (option) => option.id !== check.bestOptionId,
    )!;
    const res = await post(learner.userId, {
      action: "scenario",
      scenarioId: check.id,
      optionId: wrong.id,
    });
    expect(res.statusCode).toBe(200);
    const body = res.body as {
      correct: boolean;
      feedback: string;
      bestOptionId: string;
    };
    expect(body.correct).toBe(false);
    expect(body.bestOptionId).toBe(check.bestOptionId);
    expect(body.feedback).toBe(check.feedback);
  });

  it("rejects an option id that is not offered", async () => {
    for (const lessonId of LESSON_IDS.slice(0, 2))
      await post(learner.userId, { action: "lesson", lessonId });
    const res = await post(learner.userId, {
      action: "scenario",
      scenarioId: SCENARIO_CHECKS[0].id,
      optionId: "invented",
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("the assessment", () => {
  it("refuses to grade before every lesson is done", async () => {
    const res = await post(learner.userId, {
      action: "assessment",
      answers: FULL_COURSE.questions.map((q) => q.correctIndex),
    });
    expect(res.statusCode).toBe(409);
  });

  it("grades on the server and ignores anything the browser claims", async () => {
    for (const lessonId of PRESENTED_LESSON_IDS)
      await post(learner.userId, { action: "lesson", lessonId });
    const res = await post(learner.userId, {
      action: "assessment",
      answers: FULL_COURSE.questions.map(() => 0),
      correct: 28,
      passed: true,
      score: 100,
    });
    expect(res.statusCode).toBe(200);
    const body = res.body as { correct: number; passed: boolean };
    const expected = FULL_COURSE.questions.filter(
      (question) => question.correctIndex === 0,
    ).length;
    expect(body.correct).toBe(expected);
    expect(body.passed).toBe(expected >= FULL_COURSE.passMark);
  });

  it("stores a wrong answer as a failed attempt", async () => {
    for (const lessonId of PRESENTED_LESSON_IDS)
      await post(learner.userId, { action: "lesson", lessonId });
    const res = await post(learner.userId, {
      action: "assessment",
      answers: FULL_COURSE.questions.map(
        (question) => (question.correctIndex + 1) % question.options.length,
      ),
    });
    expect((res.body as { passed: boolean }).passed).toBe(false);
    const record = repository.data.get(`menengai:${learner.userId}`)!.record;
    expect(record.passed).toBe(false);
    expect(record.attempts).toBe(1);
  });
});

describe("the proposal and the application", () => {
  it("refuses a proposal before the assessment is passed", async () => {
    const res = await post(learner.userId, {
      action: "proposal",
      proposal: { need: "x".repeat(60) },
    });
    expect(res.statusCode).toBe(409);
  });

  it("refuses an application until the whole course is complete", async () => {
    await fillDraft(learner.userId);
    const res = await post(learner.userId, { action: "apply" });
    expect(res.statusCode).toBe(409);
  });

  it("refuses to send an incomplete draft", async () => {
    await completeCourse(learner.userId);
    await post(learner.userId, {
      action: "draft",
      draft: { fullName: "Amina", email: "nope" },
    });
    const res = await post(learner.userId, { action: "apply" });
    expect(res.statusCode).toBe(422);
  });

  it("carries a learner through to a submitted application", async () => {
    await completeCourse(learner.userId);
    await fillDraft(learner.userId);
    const res = await post(learner.userId, { action: "apply" });
    expect(res.statusCode).toBe(200);
    const body = res.body as { application: MembershipApplication };
    expect(body.application.status).toBe("submitted");
    expect(body.application.submittedAt).toBeTruthy();
    expect(body.application.courseScore).toBe(FULL_COURSE.questions.length);
  });

  it("will not let a learner approve their own application", async () => {
    await completeCourse(learner.userId);
    await fillDraft(learner.userId);
    await post(learner.userId, { action: "apply" });
    const res = await post(learner.userId, {
      action: "review",
      applicationId: `app-${learner.userId}`,
      status: "approved",
    });
    expect(res.statusCode).toBe(403);
    expect(
      repository.data.get(`menengai:${learner.userId}`)?.record,
    ).toBeTruthy();
  });
});

describe("the reviewer queue", () => {
  it("is closed to learners", async () => {
    const res = await get(learner.userId, "/api/academy?view=review");
    expect(res.statusCode).toBe(403);
  });

  it("lists submitted applications for an officer", async () => {
    await completeCourse(learner.userId);
    await fillDraft(learner.userId);
    await post(learner.userId, { action: "apply" });
    const res = await get(officer.userId, "/api/academy?view=review");
    expect(res.statusCode).toBe(200);
    const body = res.body as { queue: { id: string; status: string }[] };
    expect(body.queue).toHaveLength(1);
    expect(body.queue[0].status).toBe("submitted");
  });

  it("walks an application through review without skipping a step", async () => {
    await completeCourse(learner.userId);
    await fillDraft(learner.userId);
    await post(learner.userId, { action: "apply" });
    const id = `app-${learner.userId}`;

    const premature = await post(officer.userId, {
      action: "review",
      applicationId: id,
      status: "approved",
    });
    expect(premature.statusCode).toBe(409);

    const review = await post(officer.userId, {
      action: "review",
      applicationId: id,
      status: "in_review",
    });
    expect(review.statusCode).toBe(200);

    const noNote = await post(officer.userId, {
      action: "review",
      applicationId: id,
      status: "needs_more",
    });
    expect(noNote.statusCode).toBe(422);

    const approved = await post(officer.userId, {
      action: "review",
      applicationId: id,
      status: "approved",
      note: "Dues and buddy agreed at the 24 October fellowship.",
    });
    expect(approved.statusCode).toBe(200);
    const body = approved.body as { application: MembershipApplication };
    expect(body.application.status).toBe("approved");
    expect(body.application.decidedBy).toBe(officer.email);
    expect(body.application.decidedAt).toBeTruthy();
  });
});
