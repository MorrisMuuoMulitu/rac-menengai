/**
 * Tests for orientation scoring and progress persistence, including the
 * degraded-storage paths (private mode / disabled storage).
 */
import { describe, expect, it } from "vitest";
import {
  EMPTY_PROGRESS,
  resumeStep,
  ORIENTATION_STORAGE_KEY,
  clearProgress,
  completionDate,
  loadProgress,
  progressPercent,
  saveProgress,
  scoreQuiz,
  type OrientationProgress,
} from "./orientation";

const QUESTIONS = [
  { correctIndex: 0 },
  { correctIndex: 1 },
  { correctIndex: 2 },
  { correctIndex: 0 },
];

/** Minimal in-memory Storage stand-in. */
function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => (map.has(k) ? (map.get(k) as string) : null),
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    dump: () => Object.fromEntries(map),
  };
}

/** Storage that throws on every operation (Safari private mode). */
const brokenStorage = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
  removeItem: () => {
    throw new Error("blocked");
  },
};

describe("scoreQuiz", () => {
  it("passes at the pass mark and reports per-question correctness", () => {
    const r = scoreQuiz([0, 1, 2, 0], QUESTIONS, 4);
    expect(r.correct).toBe(4);
    expect(r.passed).toBe(true);
    expect(r.perQuestion).toEqual([true, true, true, true]);
    expect(r.unanswered).toEqual([]);
  });

  it("fails below the pass mark", () => {
    const r = scoreQuiz([0, 1, 2, 3], QUESTIONS, 4);
    expect(r.correct).toBe(3);
    expect(r.passed).toBe(false);
    expect(r.perQuestion).toEqual([true, true, true, false]);
  });

  it("treats unanswered questions as incorrect and reports their indices", () => {
    const r = scoreQuiz([null, 1, null, 0], QUESTIONS, 4);
    expect(r.correct).toBe(2);
    expect(r.passed).toBe(false);
    expect(r.unanswered).toEqual([0, 2]);
  });

  it("is exact at the boundary (passMark - 1 fails, passMark passes)", () => {
    const answers = [0, 1, 2, 9];
    expect(scoreQuiz(answers, QUESTIONS, 4).passed).toBe(false);
    expect(scoreQuiz(answers, QUESTIONS, 3).passed).toBe(true);
  });

  it("never passes an empty course", () => {
    const r = scoreQuiz([], [], 0);
    expect(r.total).toBe(0);
    expect(r.passed).toBe(false);
  });
});

describe("progressPercent", () => {
  it("computes and clamps", () => {
    expect(progressPercent(0, 6)).toBe(0);
    expect(progressPercent(3, 6)).toBe(50);
    expect(progressPercent(6, 6)).toBe(100);
    expect(progressPercent(9, 6)).toBe(100);
  });
  it("guards a zero-length course", () => {
    expect(progressPercent(0, 0)).toBe(0);
  });
});

describe("progress persistence", () => {
  const progress: OrientationProgress = {
    completed: ["welcome", "rotary"],
    bestScore: 8,
    passed: true,
    name: "Amina",
    date: "2026-09-24",
  };

  it("round-trips through storage", () => {
    const s = fakeStorage();
    expect(saveProgress(progress, s)).toBe(true);
    expect(loadProgress(s)).toEqual(progress);
    expect(s.dump()[ORIENTATION_STORAGE_KEY]).toContain("Amina");
  });

  it("returns empty progress when nothing is stored", () => {
    expect(loadProgress(fakeStorage())).toEqual(EMPTY_PROGRESS);
  });

  it("survives corrupt JSON", () => {
    const s = fakeStorage({ [ORIENTATION_STORAGE_KEY]: "{not json" });
    expect(loadProgress(s)).toEqual(EMPTY_PROGRESS);
  });

  it("ignores unexpected shapes", () => {
    const s = fakeStorage({
      [ORIENTATION_STORAGE_KEY]: JSON.stringify({
        completed: "nope",
        passed: "yes",
        bestScore: "x",
      }),
    });
    const p = loadProgress(s);
    expect(p.completed).toEqual([]);
    expect(p.passed).toBe(false); // coerced to a strict boolean
    expect(p.bestScore).toBeUndefined();
  });

  it("degrades gracefully when storage throws (private mode)", () => {
    expect(saveProgress(progress, brokenStorage)).toBe(false);
    expect(loadProgress(brokenStorage)).toEqual(EMPTY_PROGRESS);
    expect(() => clearProgress(brokenStorage)).not.toThrow();
  });

  it("reports unavailable storage instead of crashing", () => {
    expect(loadProgress(null)).toEqual(EMPTY_PROGRESS);
    expect(saveProgress(progress, null)).toBe(false);
    expect(() => clearProgress(null)).not.toThrow();
  });

  it("clears saved progress", () => {
    const s = fakeStorage();
    saveProgress(progress, s);
    clearProgress(s);
    expect(loadProgress(s)).toEqual(EMPTY_PROGRESS);
  });
});

describe("completionDate", () => {
  it("formats a readable date", () => {
    expect(completionDate("2026-09-24T10:00:00.000Z")).toMatch(
      /September 2026/,
    );
  });
  it("returns an empty string for an invalid date", () => {
    expect(completionDate("not-a-date")).toBe("");
  });
});

describe("full course resume", () => {
  it("resumes at the first unfinished lesson and ignores retired lesson ids", () => {
    expect(resumeStep({ completed: ["old", "a"] }, ["a", "b", "c"])).toEqual({
      kind: "module",
      index: 1,
    });
  });
  it("opens the assessment only after every lesson is complete", () => {
    expect(resumeStep({ completed: ["a", "b"] }, ["a", "b"])).toEqual({
      kind: "quiz",
    });
    expect(resumeStep({ completed: ["a"], passed: true }, ["a", "b"])).toEqual({
      kind: "module",
      index: 1,
    });
  });
  it("resumes a completed full course at the record", () => {
    expect(
      resumeStep({ completed: ["a", "b"], passed: true }, ["a", "b"]),
    ).toEqual({ kind: "done" });
  });
});
