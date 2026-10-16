import { describe, expect, it } from "vitest";
import {
  answeredCount,
  clearDraft,
  DRAFT_KEY,
  loadDraft,
  saveDraft,
} from "./assessment-draft";

function memoryStorage(): Pick<Storage, "getItem" | "setItem" | "removeItem"> {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
    removeItem: (key) => void map.delete(key),
  };
}

describe("assessment draft", () => {
  it("keeps separate account drafts when another learner answers or clears theirs", () => {
    const storage = memoryStorage();
    saveDraft("questions-v2", [0, 2], storage, "learner-a");
    saveDraft("questions-v2", [1, null], storage, "learner-b");
    expect(loadDraft("questions-v2", 2, storage, "learner-a")).toEqual([0, 2]);
    clearDraft(storage, "learner-b");
    expect(loadDraft("questions-v2", 2, storage, "learner-a")).toEqual([0, 2]);
    expect(loadDraft("questions-v2", 2, storage, "learner-b")).toBeNull();
  });
  it("round-trips answers for the same curriculum version", () => {
    const storage = memoryStorage();
    const answers = [0, null, 2, null];
    expect(saveDraft("v2", answers, storage)).toBe(true);
    expect(loadDraft("v2", 4, storage)).toEqual(answers);
  });

  it("throws away a draft written for a different course version", () => {
    const storage = memoryStorage();
    saveDraft("v1", [1, 1, 1], storage);
    expect(loadDraft("v2", 3, storage)).toBeNull();
  });

  it("pads and trims to the current question count", () => {
    const storage = memoryStorage();
    saveDraft("v2", [1, 2, 3], storage);
    expect(loadDraft("v2", 5, storage)).toEqual([1, 2, 3, null, null]);
    expect(loadDraft("v2", 2, storage)).toEqual([1, 2]);
  });

  it("ignores malformed entries rather than trusting them", () => {
    const storage = memoryStorage();
    storage.setItem(
      DRAFT_KEY,
      JSON.stringify({ version: "v2", answers: ["a", -1, 1.5, 2] }),
    );
    expect(loadDraft("v2", 4, storage)).toEqual([null, null, null, 2]);
  });

  it("survives corrupt JSON and a storage that refuses to work", () => {
    const storage = memoryStorage();
    storage.setItem(DRAFT_KEY, "{not json");
    expect(loadDraft("v2", 3, storage)).toBeNull();
    expect(loadDraft("v2", 3, null)).toBeNull();
    expect(saveDraft("v2", [1], null)).toBe(false);
    expect(() => clearDraft(null)).not.toThrow();
  });

  it("clears the draft", () => {
    const storage = memoryStorage();
    saveDraft("v2", [1, 2], storage);
    clearDraft(storage);
    expect(loadDraft("v2", 2, storage)).toBeNull();
  });

  it("counts only answered questions", () => {
    expect(answeredCount([0, null, 1, null])).toBe(2);
    expect(answeredCount([])).toBe(0);
  });
});
