type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const memory = new Map<string, string>();
function browserStorage(): StorageLike | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}
function key(owner: string, lessonId: string) {
  return `rac-menengai.note-draft:${encodeURIComponent(owner)}:${encodeURIComponent(lessonId)}`;
}

export function readNoteDraft(
  owner: string,
  lessonId: string,
  storage = browserStorage(),
): string | null {
  const id = key(owner, lessonId);
  if (memory.has(id)) return memory.get(id)!;
  try {
    const value = storage?.getItem(id);
    return typeof value === "string" ? value.slice(0, 2000) : null;
  } catch {
    return null;
  }
}
export function writeNoteDraft(
  owner: string,
  lessonId: string,
  text: string,
  storage = browserStorage(),
): void {
  const id = key(owner, lessonId);
  memory.set(id, text);
  try {
    storage?.setItem(id, text);
  } catch {
    /* Memory still protects drafts during internal navigation. */
  }
}
export function acknowledgeNoteDraft(
  owner: string,
  lessonId: string,
  savedText: string,
  storage = browserStorage(),
): void {
  if (readNoteDraft(owner, lessonId, storage) !== savedText) return;
  const id = key(owner, lessonId);
  memory.delete(id);
  try {
    storage?.removeItem(id);
  } catch {
    /* Saving to the account already succeeded. */
  }
}
