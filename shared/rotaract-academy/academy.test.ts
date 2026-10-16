import { describe, expect, it } from "vitest";
import { createCourse } from "./course";
import { CHAPTERS, COURSE_INFO } from "./syllabus";
import { CURRICULUM, chapterForLesson, lessonPosition } from "./curriculum";
import { SCENARIO_CHECKS, scenarioForChapter } from "./scenarios";
import { COURSE_VIDEOS, videoWatchUrl } from "./videos";
import { FLASHCARDS, flashcardsForChapter } from "./flashcards";
import {
  answerKey,
  gradeAttempt,
  normaliseAnswers,
  publicCourse,
} from "./assessment";
import {
  chapterProgress,
  courseStage,
  emptyRecord,
  nextLessonIndex,
  normaliseProposal,
  normaliseRecord,
  outstandingScenarios,
  summarise,
} from "./progress";
import {
  allowedTransitions,
  canTransition,
  isDraftComplete,
  validateDraft,
} from "./application";
import { MENENGAI_LEARNING_PROFILE } from "../../src/club-learning-profile";

const course = createCourse(MENENGAI_LEARNING_PROFILE);

describe("curriculum", () => {
  it("gives every chapter a scenario check with exactly one defensible answer", () => {
    expect(SCENARIO_CHECKS).toHaveLength(CHAPTERS.length);
    for (const chapter of CHAPTERS) {
      const check = scenarioForChapter(chapter.id);
      expect(check, chapter.id).toBeTruthy();
      expect(check!.options.length).toBeGreaterThanOrEqual(3);
      expect(
        check!.options.filter((option) => option.id === check!.bestOptionId),
      ).toHaveLength(1);
      expect(check!.feedback.length).toBeGreaterThan(120);
      expect(new Set(check!.options.map((option) => option.id)).size).toBe(
        check!.options.length,
      );
    }
  });

  it("places every lesson in exactly one chapter", () => {
    const placed = CURRICULUM.flatMap((chapter) =>
      chapter.lessons.map((lesson) => lesson.id),
    );
    expect(new Set(placed).size).toBe(placed.length);
    expect([...placed].sort()).toEqual(
      COURSE_INFO.lessons.map((lesson) => lesson.id).sort(),
    );
    for (const lesson of COURSE_INFO.lessons)
      expect(chapterForLesson(lesson.id), lesson.id).toBeTruthy();
    expect(lessonPosition("roots")).toEqual({
      chapterIndex: 0,
      lessonIndex: 0,
      lessonNumber: 1,
    });
    expect(lessonPosition("next-steps").lessonNumber).toBe(COURSE_INFO.lessons.length);
  });

  it("orders the syllabus exactly as the chapters present it", () => {
    /*
     * These two lists disagreed once: the syllabus put chapter three's lesson
     * before chapter two's last one, and the lesson gate followed the syllabus.
     * The course deadlocked at the end of chapter two. Keep them identical.
     */
    expect(COURSE_INFO.lessons.map((lesson) => lesson.id)).toEqual(
      CURRICULUM.flatMap((chapter) =>
        chapter.lessons.map((lesson) => lesson.id),
      ),
    );
  });

  it("exposes chapters, scenarios and videos on the course payload", () => {
    expect(course.chapters).toHaveLength(CHAPTERS.length);
    expect(course.scenarios).toHaveLength(CHAPTERS.length);
    expect(course.videos.length).toBeGreaterThan(0);
  });
});

describe("flash cards", () => {
  it("gives every chapter a deck drawn from terms it teaches", () => {
    for (const chapter of CHAPTERS) {
      const cards = flashcardsForChapter(chapter.id);
      expect(cards.length, `${chapter.id} has no cards`).toBeGreaterThanOrEqual(3);
      for (const card of cards) {
        expect(card.term.length).toBeGreaterThan(2);
        expect(card.definition.length).toBeGreaterThan(60);
      }
    }
  });

  it("keeps every card in a chapter that exists, with unique terms", () => {
    const chapterIds = new Set(CHAPTERS.map((chapter) => chapter.id));
    for (const card of FLASHCARDS) expect(chapterIds.has(card.chapterId)).toBe(true);
    const terms = FLASHCARDS.map((card) => card.term.toLowerCase());
    expect(new Set(terms).size).toBe(terms.length);
  });
});

describe("videos", () => {
  it("points every video at a chapter that exists and gives a reading alternative", () => {
    const chapterIds = new Set(CHAPTERS.map((chapter) => chapter.id));
    for (const video of COURSE_VIDEOS) {
      expect(chapterIds.has(video.chapterId), video.id).toBe(true);
      expect(video.youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/);
      expect(video.title.length).toBeGreaterThan(3);
      expect(video.why.length).toBeGreaterThan(40);
      expect(video.reading.href.startsWith("https://")).toBe(true);
    }
    expect(new Set(COURSE_VIDEOS.map((video) => video.id)).size).toBe(
      COURSE_VIDEOS.length,
    );
    expect(new Set(COURSE_VIDEOS.map((video) => video.youtubeId)).size).toBe(
      COURSE_VIDEOS.length,
    );
  });

  it("builds a privacy-enhanced embed URL without tracking parameters", () => {
    const url = videoWatchUrl(COURSE_VIDEOS[0]);
    expect(url.startsWith("https://www.youtube-nocookie.com/embed/")).toBe(true);
    expect(url).toContain("rel=0");
  });
});

describe("assessment", () => {
  it("grades a perfect attempt as a pass and a near miss as a fail", () => {
    const key = answerKey(course);
    const perfect = gradeAttempt(key, course);
    expect(perfect.correct).toBe(course.questions.length);
    expect(perfect.passed).toBe(true);

    /* Derived, so adding questions does not silently invalidate the boundary. */
    const allowedWrong = course.questions.length - course.passMark;
    const onTheLine = key.map((answer, index) =>
      index < allowedWrong
        ? (answer + 1) % course.questions[index].options.length
        : answer,
    );
    expect(gradeAttempt(onTheLine, course).passed).toBe(true);

    const nearMiss = gradeAttempt(
      key.map((answer, index) =>
        index <= allowedWrong
          ? (answer + 1) % course.questions[index].options.length
          : answer,
      ),
      course,
    );
    expect(nearMiss.correct).toBe(course.questions.length - allowedWrong - 1);
    expect(nearMiss.passed).toBe(false);
  });

  it("counts skipped, out-of-range and malformed answers as unanswered", () => {
    const result = gradeAttempt([0, 99, null, "a", undefined, 1], course);
    expect(result.unanswered.slice(0, 4)).toEqual([1, 2, 3, 4]);
    expect(result.unanswered).toContain(course.questions.length - 1);
    expect(result.unanswered).toHaveLength(course.questions.length - 2);
    expect(result.perQuestion).toHaveLength(course.questions.length);
    expect(result.perQuestion[1]).toBe(false);
    expect(result.perQuestion[2]).toBe(false);
    expect(result.perQuestion[3]).toBe(false);
    expect(result.perQuestion[4]).toBe(false);
    expect(result.feedback).toHaveLength(course.questions.length);
  });

  it("normalises an answers payload to the exact question count", () => {
    expect(normaliseAnswers([1, 2], course.questions.length)).toHaveLength(
      course.questions.length,
    );
    expect(normaliseAnswers([1, 2], course.questions.length)![2]).toBeNull();
    expect(normaliseAnswers("nope", course.questions.length)).toBeNull();
    expect(
      normaliseAnswers(
        new Array(course.questions.length + 1).fill(0),
        course.questions.length,
      ),
    ).toBeNull();
    expect(normaliseAnswers([-1, 1.5, 2], 3)).toEqual([null, null, 2]);
  });

  it("never leaks the answer key or explanations in the public payload", () => {
    const serialised = JSON.stringify(publicCourse(course));
    expect(serialised).not.toContain("correctIndex");
    expect(serialised).not.toContain("explanation");
    expect(serialised).not.toContain("bestOptionId");
    for (const question of course.questions) {
      expect(serialised).not.toContain(question.explanation.slice(0, 40));
    }
    const parsed = JSON.parse(serialised);
    expect(parsed.questions).toHaveLength(course.questions.length);
    expect(parsed.scenarios).toHaveLength(SCENARIO_CHECKS.length);
    for (const scenario of parsed.scenarios) {
      expect(scenario.options.length).toBeGreaterThan(1);
      expect("feedback" in scenario).toBe(false);
      expect("bestOptionId" in scenario).toBe(false);
    }
    for (const chapter of parsed.chapters) {
      expect(chapter.scenario).toBeTruthy();
      expect("feedback" in chapter.scenario).toBe(false);
    }
  });
});

describe("progress", () => {
  const lessonIds = course.modules.map((module) => module.id);

  it("counts a chapter complete only when its lessons and check are done", () => {
    const chapter = CHAPTERS[3];
    let record = emptyRecord(course.version);
    expect(chapterProgress(record, chapter).state).toBe("not-started");

    record = {
      ...record,
      completedLessons: [...chapter.lessons],
    };
    expect(chapterProgress(record, chapter).state).toBe("in-progress");

    const check = scenarioForChapter(chapter.id)!;
    record = {
      ...record,
      scenarioAnswers: { [check.id]: check.bestOptionId },
    };
    const progress = chapterProgress(record, chapter);
    expect(progress.state).toBe("complete");
    expect(progress.scenarioCorrect).toBe(true);
  });

  it("moves the learner through lessons, assessment, proposal and completion", () => {
    let record = emptyRecord(course.version);
    expect(courseStage(record, course)).toBe("lessons");
    expect(nextLessonIndex(record, course.modules)).toBe(0);

    record = { ...record, completedLessons: [...lessonIds] };
    expect(courseStage(record, course)).toBe("assessment");
    expect(nextLessonIndex(record, course.modules)).toBe(lessonIds.length - 1);

    record = { ...record, passed: true };
    expect(courseStage(record, course)).toBe("proposal");
    expect(summarise(record, course).canApply).toBe(false);

    record = {
      ...record,
      scenarioAnswers: Object.fromEntries(
        SCENARIO_CHECKS.map((check) => [check.id, check.bestOptionId]),
      ),
      proposal: {
        need: "x".repeat(40),
        objective: "x".repeat(40),
        host: "x".repeat(40),
        roles: "x".repeat(40),
        resources: "x".repeat(40),
        risks: "x".repeat(40),
        followUp: "x".repeat(40),
        openQuestions: "x".repeat(40),
      },
    };
    const summary = summarise(record, course);
    expect(summary.canApply).toBe(true);
    expect(summary.percent).toBe(100);
    /* The rail counts the same steps the bar does. */
    expect(summary.total).toBe(
      course.modules.length + SCENARIO_CHECKS.length + 3,
    );
    expect(summary.completed).toBe(summary.total);
    expect(courseStage(record, course)).toBe("complete");
    expect(outstandingScenarios(record)).toEqual([]);
  });

  it("lists the chapters whose scenario is still unanswered or wrong", () => {
    const check = SCENARIO_CHECKS[0];
    const record = {
      ...emptyRecord(course.version),
      scenarioAnswers: { [check.id]: "definitely-not-an-option" },
    };
    expect(outstandingScenarios(record)).toContain(check.chapterId);
  });

  it("refuses a proposal with empty or oversized fields", () => {
    expect(normaliseProposal(null)).toBeNull();
    expect(
      normaliseProposal({
        need: "too short",
        objective: "x".repeat(40),
        host: "x".repeat(40),
        roles: "x".repeat(40),
        resources: "x".repeat(40),
        risks: "x".repeat(40),
        followUp: "x".repeat(40),
        openQuestions: "x".repeat(40),
      }),
    ).toBeNull();
    expect(
      normaliseProposal({
        need: "x".repeat(40),
        objective: "x".repeat(40),
        host: "x".repeat(40),
        roles: "x".repeat(40),
        resources: "x".repeat(40),
        risks: "x".repeat(40),
        followUp: "x".repeat(40),
        openQuestions: "x".repeat(3000),
      }),
    ).toBeNull();
  });

  it("throws away progress from a different curriculum version", () => {
    const record = normaliseRecord(
      {
        courseVersion: "2025.full.v1",
        completedLessons: lessonIds,
        passed: true,
        bestScore: 28,
      },
      course.version,
      lessonIds,
    );
    expect(record.passed).toBe(false);
    expect(record.completedLessons).toEqual([]);
  });

  it("drops lessons and scenario options that are not part of this course", () => {
    const check = SCENARIO_CHECKS[0];
    const record = normaliseRecord(
      {
        courseVersion: course.version,
        completedLessons: [lessonIds[0], "invented-lesson"],
        scenarioAnswers: { [check.id]: "invented-option" },
        bestScore: -4,
        attempts: "many",
      },
      course.version,
      lessonIds,
    );
    expect(record.completedLessons).toEqual([lessonIds[0]]);
    expect(record.scenarioAnswers).toEqual({});
    expect(record.bestScore).toBe(0);
    expect(record.attempts).toBe(0);
  });

  it("carries a merged lesson forward instead of forgetting it", () => {
    /*
     * `meeting` and `protocol-brand` were merged into other lessons. A learner
     * who had finished them must not be told they had not.
     */
    const record = normaliseRecord(
      {
        courseVersion: course.version,
        completedLessons: ["meeting", "protocol-brand", "roots"],
        passed: false,
      },
      course.version,
      lessonIds,
    );
    expect(record.completedLessons.sort()).toEqual(
      ["protocol-meeting", "public-image", "roots"].sort(),
    );
  });

  it("does not double-count when both the old and new id are present", () => {
    const record = normaliseRecord(
      {
        courseVersion: course.version,
        completedLessons: ["meeting", "protocol-meeting"],
      },
      course.version,
      lessonIds,
    );
    expect(record.completedLessons).toEqual(["protocol-meeting"]);
  });
});

describe("application", () => {
  const valid = {
    fullName: "Amina Wanjiru",
    email: "amina@example.com",
    phone: "+254 700 000 000",
    profession: "Civil engineer",
    location: "Nakuru",
    motivation: "x".repeat(120),
    availability: "Weekday evenings",
  };

  it("accepts a complete draft and reports each missing field", () => {
    expect(validateDraft(valid)).toEqual({});
    expect(isDraftComplete(valid)).toBe(true);

    const errors = validateDraft({ ...valid, email: "not-an-email" });
    expect(errors.email).toBeTruthy();
    expect(isDraftComplete({ ...valid, motivation: "" })).toBe(false);
  });

  it("rejects a short motivation and an out-of-range phone", () => {
    const errors = validateDraft({
      ...valid,
      motivation: "I like it",
      phone: "123",
    });
    expect(errors.motivation).toBeTruthy();
    expect(errors.phone).toBeTruthy();
  });

  it("only lets an officer move an application forward in legal steps", () => {
    expect(canTransition("submitted", "in_review")).toBe(true);
    expect(canTransition("in_review", "approved")).toBe(true);
    expect(canTransition("in_review", "needs_more")).toBe(true);
    expect(canTransition("draft", "approved")).toBe(false);
    expect(canTransition("submitted", "approved")).toBe(false);
    expect(allowedTransitions("approved")).toEqual([]);
    expect(allowedTransitions("withdrawn")).toEqual(["submitted"]);
  });
});
