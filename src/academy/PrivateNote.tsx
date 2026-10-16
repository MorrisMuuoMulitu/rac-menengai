import { useEffect, useState } from "react";
import { LockKeyhole, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccount, type Account } from "./account";
import { loadLessonNote, saveLessonNote } from "../lib/academy";
import {
  readNoteDraft,
  writeNoteDraft,
  acknowledgeNoteDraft,
} from "./note-drafts";

export function PrivateNote({
  lessonId,
  activity,
}: {
  lessonId: string;
  activity: string;
}) {
  const account = useAccount();
  return (
    <NoteEditor
      key={`${account.email ?? "guest"}:${lessonId}`}
      lessonId={lessonId}
      activity={activity}
      account={account}
    />
  );
}

function NoteEditor({
  lessonId,
  activity,
  account,
}: {
  lessonId: string;
  activity: string;
  account: Account;
}) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [hasSaved, setHasSaved] = useState(false);
  const owner = account.email ?? "";
  useEffect(() => {
    let cancelled = false;
    if (!account.ready || !account.signedIn) return;
    setLoading(true);
    setError("");
    void (async () => {
      try {
        const token = await account.token();
        if (!token) throw new Error("Sign in again to open your note.");
        const result = await loadLessonNote(token, lessonId);
        if (!cancelled) {
          const draft = readNoteDraft(owner, lessonId);
          setText(draft ?? result.note?.text ?? "");
          setSaved(result.note?.text ?? "");
          setHasSaved(Boolean(result.note));
          if (draft === result.note?.text)
            acknowledgeNoteDraft(owner, lessonId, draft);
          setLoaded(true);
        }
      } catch (cause) {
        if (!cancelled)
          setError(
            cause instanceof Error
              ? cause.message
              : "Your note could not be opened.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [account.ready, account.signedIn, account.email, lessonId, reload]);

  const dirty = text !== saved;
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const save = async () => {
    if (!loaded || !dirty || saving || !account.signedIn) return;
    const value = text;
    setSaving(true);
    setError("");
    try {
      const token = await account.token();
      if (!token)
        throw new Error(
          "Sign in again before saving. Your text is still here.",
        );
      await saveLessonNote(token, lessonId, value, owner);
      setSaved(value);
      setHasSaved(true);
      acknowledgeNoteDraft(owner, lessonId, value);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Not saved. Try again; your text is still here.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="lesson-reflection">
      <h3>
        <LockKeyhole size={18} aria-hidden="true" /> Your private notebook
      </h3>
      <p>{activity}</p>
      {!account.signedIn ? (
        <p>
          <Link to="/membership/sign-in">Sign in</Link> to keep a personal note
          for this lesson.
        </p>
      ) : (
        <>
          <label htmlFor="lesson-note">
            Try an answer or jot down a question
          </label>
          <textarea
            id="lesson-note"
            rows={3}
            maxLength={2000}
            value={text}
            disabled={!loaded || loading}
            onChange={(event) => {
              setText(event.target.value);
              writeNoteDraft(owner, lessonId, event.target.value);
            }}
            onBlur={() => void save()}
            placeholder="Your reflection or question…"
          />
          <div className="note-save-row">
            <button
              type="button"
              className="btn btn-secondary btn-md"
              disabled={!loaded || loading || saving || !dirty}
              onClick={() => void save()}
            >
              <Save size={16} />
              {saving ? "Saving…" : "Save note"}
            </button>
            <span role="status">
              {loading
                ? "Opening your note…"
                : saving
                  ? "Saving your note…"
                  : dirty
                    ? "Unsaved draft"
                    : loaded
                      ? hasSaved
                        ? "Saved to your account"
                        : "No note saved yet"
                      : ""}
            </span>
            <small>{text.length}/2000</small>
          </div>
          {error && (
            <p className="academy-notice error" role="alert">
              {error}
              {!loaded && (
                <button
                  type="button"
                  onClick={() => setReload((value) => value + 1)}
                >
                  Try opening again
                </button>
              )}
            </p>
          )}
          <small>
            Private to your learning account. Saves when you leave the text
            field or choose Save note. It is not included in your membership
            application.
          </small>
        </>
      )}
    </section>
  );
}
