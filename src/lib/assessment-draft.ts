/**
 * The assessment draft, kept in the browser between visits.
 *
 * Twenty-eight questions became forty-two, and losing all of them because a
 * tab closed is the kind of thing that stops someone finishing. This is a
 * draft only: the server still grades the attempt, and a draft never counts as
 * one.
 *
 * Storage is accessed defensively, exactly as the passcode course does it —
 * private browsing, a full quota or a blocked origin must degrade to
 * in-memory rather than throwing.
 */

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const DRAFT_KEY = "rac-menengai.academy.assessment.draft";

function defaultStorage(): StorageLike | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const probe = "__rac_draft_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

interface StoredDraft {
  version: string;
  answers: (number | null)[];
}

/**
 * A draft from a different curriculum version is discarded rather than
 * applied to questions it was not written for.
 */
export function loadDraft(
  version: string,
  questionCount: number,
  storage: StorageLike | null = defaultStorage(),
  scope = "",
): (number | null)[] | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(scope ? `${DRAFT_KEY}:${scope}` : DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredDraft>;
    if (parsed.version !== version || !Array.isArray(parsed.answers))
      return null;
    const answers: (number | null)[] = new Array(questionCount).fill(null);
    for (let index = 0; index < questionCount; index += 1) {
      const value = parsed.answers[index];
      if (typeof value === "number" && Number.isInteger(value) && value >= 0)
        answers[index] = value;
    }
    return answers;
  } catch {
    return null;
  }
}

export function saveDraft(
  version: string,
  answers: (number | null)[],
  storage: StorageLike | null = defaultStorage(),
  scope = "",
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(
      scope ? `${DRAFT_KEY}:${scope}` : DRAFT_KEY,
      JSON.stringify({ version, answers }),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(
  storage: StorageLike | null = defaultStorage(),
  scope = "",
): void {
  if (!storage) return;
  try {
    storage.removeItem(scope ? `${DRAFT_KEY}:${scope}` : DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

/** How many questions have an answer, for the running counter. */
export function answeredCount(answers: (number | null)[]): number {
  return answers.filter((answer) => answer !== null).length;
}
