import { describe, expect, it } from "vitest";
import {
  emptyRecord,
  learnerCohort,
  NUDGE_AFTER_DAYS,
  withProgressStamp,
} from "./progress.js";

const NOW = new Date("2026-10-16T09:00:00.000Z");
const daysAgo = (days: number) =>
  new Date(NOW.getTime() - days * 86_400_000).toISOString();

describe("learner cohorts for the officer view", () => {
  it("treats an empty record as not started, whatever its timestamps say", () => {
    expect(
      learnerCohort({
        completed: 0,
        total: 30,
        lastActiveAt: daysAgo(1),
        now: NOW,
      }).cohort,
    ).toBe("not-started");
  });

  it("treats a finished course as done even after a long silence", () => {
    const result = learnerCohort({
      completed: 30,
      total: 30,
      lastActiveAt: daysAgo(400),
      now: NOW,
    });
    expect(result.cohort).toBe("done");
    expect(result.daysIdle).toBe(400);
  });

  it("marks a started course as in progress while they are still moving", () => {
    const result = learnerCohort({
      completed: 5,
      total: 30,
      lastActiveAt: daysAgo(NUDGE_AFTER_DAYS - 1),
      now: NOW,
    });
    expect(result.cohort).toBe("in-progress");
    expect(result.daysIdle).toBe(NUDGE_AFTER_DAYS - 1);
  });

  it("flags a stalled learner exactly on the threshold", () => {
    expect(
      learnerCohort({
        completed: 5,
        total: 30,
        lastActiveAt: daysAgo(NUDGE_AFTER_DAYS),
        now: NOW,
      }).cohort,
    ).toBe("needs-nudge");
  });

  it("never reports a negative idle count for a clock that ran ahead", () => {
    const result = learnerCohort({
      completed: 5,
      total: 30,
      lastActiveAt: new Date(NOW.getTime() + 3 * 86_400_000).toISOString(),
      now: NOW,
    });
    expect(result.daysIdle).toBe(0);
    expect(result.cohort).toBe("in-progress");
  });

  it("keeps a learner without a usable timestamp in progress, not stalled", () => {
    for (const lastActiveAt of [null, "", "not-a-date"]) {
      const result = learnerCohort({
        completed: 5,
        total: 30,
        lastActiveAt,
        now: NOW,
      });
      expect(result.daysIdle, String(lastActiveAt)).toBeNull();
      expect(result.cohort, String(lastActiveAt)).toBe("in-progress");
    }
  });

  it("does not call an untouched course finished when the count is empty", () => {
    expect(
      learnerCohort({ completed: 0, total: 0, lastActiveAt: null, now: NOW })
        .cohort,
    ).toBe("not-started");
  });
});

it("stamps the progress time without disturbing anything else on the record", () => {
  const before = {
    ...emptyRecord("2026.academy.v2"),
    completedLessons: ["roots"],
    bestScore: 12,
  };
  const after = withProgressStamp(before, NOW);
  expect(after.updatedAt).toBe(NOW.toISOString());
  expect(after.completedLessons).toEqual(["roots"]);
  expect(after.bestScore).toBe(12);
  expect(before.updatedAt).toBeNull();
});
