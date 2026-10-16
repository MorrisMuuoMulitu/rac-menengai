import { describe, expect, it } from "vitest";
import {
  ORDERING_ACTIVITIES,
  orderingForLesson,
  shuffled,
} from "./activities";
import { COURSE_INFO } from "./syllabus";

describe("ordering activities", () => {
  it("only attaches activities to lessons that exist", () => {
    const ids = new Set(COURSE_INFO.lessons.map((lesson) => lesson.id));
    for (const activity of ORDERING_ACTIVITIES) {
      expect(ids.has(activity.lessonId), activity.lessonId).toBe(true);
      expect(activity.items.length).toBeGreaterThanOrEqual(4);
      expect(new Set(activity.items).size).toBe(activity.items.length);
      expect(activity.feedback.length).toBeGreaterThan(80);
    }
  });

  it("offers at most one activity per lesson", () => {
    const ids = ORDERING_ACTIVITIES.map((activity) => activity.lessonId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("returns the activity for a lesson, and nothing for the rest", () => {
    expect(orderingForLesson("protocol-meeting")?.lessonId).toBe("protocol-meeting");
    expect(orderingForLesson("roots")).toBeUndefined();
  });
});

describe("shuffling", () => {
  it("keeps every item and never hands back the answer", () => {
    for (const activity of ORDERING_ACTIVITIES) {
      const order = shuffled(activity.items, activity.lessonId);
      expect([...order].sort()).toEqual([...activity.items].sort());
      expect(order).not.toEqual(activity.items);
    }
  });

  it("is stable for the same seed, so two learners see the same puzzle", () => {
    expect(shuffled([1, 2, 3, 4, 5], "seed")).toEqual(
      shuffled([1, 2, 3, 4, 5], "seed"),
    );
  });
});
