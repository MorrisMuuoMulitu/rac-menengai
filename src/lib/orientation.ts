/**
 * New-member orientation: scoring + progress persistence.
 *
 * Pure/testable logic lives here; the page component only renders it.
 * Storage is always accessed defensively — private-mode browsers, disabled
 * storage or a blocked origin must degrade to in-memory progress rather than
 * crashing the course.
 */

export interface OrientationProgress {
  /** ids of modules the learner marked complete */
  completed: string[];
  /** best quiz score achieved (correct answers) */
  bestScore?: number;
  /** true once the quiz has been passed at least once */
  passed?: boolean;
  /** optional name typed on the completion record */
  name?: string;
  /** ISO date the course was passed */
  date?: string;
}

export interface QuizResult {
  correct: number;
  total: number;
  passed: boolean;
  perQuestion: boolean[];
  unanswered: number[];
}

export const ORIENTATION_STORAGE_KEY = 'rac-menengai.orientation.v1';

export const EMPTY_PROGRESS: OrientationProgress = { completed: [] };

/** Score a quiz attempt. Unanswered questions are counted as incorrect. */
export function scoreQuiz(
  answers: (number | null)[],
  questions: { correctIndex: number }[],
  passMark: number,
): QuizResult {
  const perQuestion = questions.map((q, i) => answers[i] === q.correctIndex);
  const correct = perQuestion.filter(Boolean).length;
  const unanswered = answers.map((a, i) => (a === null || a === undefined ? i : -1)).filter((i) => i >= 0);
  return {
    correct,
    total: questions.length,
    passed: questions.length > 0 && correct >= passMark,
    perQuestion,
    unanswered,
  };
}

/** 0–100, guarding against a zero-length course. */
export function progressPercent(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function defaultStorage(): StorageLike | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    // Probe: Safari private mode throws on write.
    const probe = '__rac_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Read saved progress. Returns empty progress on any failure. */
export function loadProgress(storage: StorageLike | null = defaultStorage()): OrientationProgress {
  if (!storage) return { ...EMPTY_PROGRESS };
  try {
    const raw = storage.getItem(ORIENTATION_STORAGE_KEY);
    if (!raw) return { ...EMPTY_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<OrientationProgress>;
    const completed = Array.isArray(parsed.completed) ? parsed.completed.filter((c): c is string => typeof c === 'string') : [];
    return {
      completed,
      bestScore: typeof parsed.bestScore === 'number' ? parsed.bestScore : undefined,
      passed: parsed.passed === true,
      name: typeof parsed.name === 'string' ? parsed.name : undefined,
      date: typeof parsed.date === 'string' ? parsed.date : undefined,
    };
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

/** Persist progress. Returns false when storage is unavailable (progress stays in memory). */
export function saveProgress(progress: OrientationProgress, storage: StorageLike | null = defaultStorage()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(ORIENTATION_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

/** Clear saved progress. */
export function clearProgress(storage: StorageLike | null = defaultStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(ORIENTATION_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Human date for the completion record (e.g. "24 September 2026"). */
export function completionDate(iso: string = new Date().toISOString()): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  try {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  } catch {
    return d.toDateString();
  }
}