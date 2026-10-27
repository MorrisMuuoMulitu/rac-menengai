import { useEffect, useRef, useState } from "react";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { ButtonLink, PageHero, PageMeta } from "../components/ui";
import { COURSE_INFO, type FullCourse } from "../course-info";
import CoursePlayer from "./CoursePlayer";

export default function OrientationPage() {
  const [course, setCourse] = useState<FullCourse | null>(null);
  const [expiresAt, setExpiresAt] = useState(0);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/orientation", {
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = await response.json();
        if (response.ok && body.course?.version === COURSE_INFO.version) {
          setExpiresAt(body.expiresAt);
          setCourse(body.course);
        } else if (response.status !== 401)
          setError(
            body.error ?? "Course access is unavailable. Please try again.",
          );
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("Could not check course access. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setChecking(false);
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!course || !expiresAt) return;
    const expire = () => {
      setCourse(null);
      setError("Your session has ended. Enter the passcode to continue.");
    };
    const timer = window.setTimeout(
      expire,
      Math.max(0, expiresAt - Date.now()),
    );
    const visible = () => {
      if (Date.now() >= expiresAt) expire();
    };
    document.addEventListener("visibilitychange", visible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [course, expiresAt]);
  async function unlock(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/orientation", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
        cache: "no-store",
      });
      const body = await response.json();
      if (response.ok && body.course?.version === COURSE_INFO.version) {
        setExpiresAt(body.expiresAt);
        setPasscode("");
        setCourse(body.course);
      } else {
        setError(
          body.error ?? "Could not unlock the course. Please try again.",
        );
        input.current?.focus();
      }
    } catch {
      setError(
        "Could not reach the course. Check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function lock() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/orientation", {
        method: "DELETE",
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!response.ok) throw new Error();
      setCourse(null);
    } catch {
      setError("Could not lock this session. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (course)
    return (
      <>
        <div className="course-access-bar">
          <div className="container">
            <span>
              <ShieldCheck size={18} aria-hidden="true" /> Course unlocked for
              this session
            </span>
            <button type="button" onClick={lock} disabled={busy}>
              Lock course
            </button>
          </div>
          {error ? <p role="alert">{error}</p> : null}
        </div>
        <CoursePlayer course={course} />
      </>
    );
  return (
    <>
      <PageMeta
        title="New member orientation"
        robots="noindex"
        description="A passcode-protected Rotaract course for Menengai members and prospective members. Ask the membership team for access."
      />
      <PageHero
        eyebrow="Menengai learning"
        title={COURSE_INFO.title}
        lead={COURSE_INFO.lead}
      >
        <ButtonLink to="/membership" variant="secondary" size="sm">
          <ArrowLeft aria-hidden="true" /> Back to membership
        </ButtonLink>
      </PageHero>
      <section className="section section-tint">
        <div className="container course-gate-layout">
          <div>
            <h2 className="sec-title">
              A proper introduction.
              <br />A practical next step.
            </h2>
            <p className="section-lead">
              {COURSE_INFO.lessons.length} lessons, reflection activities and a{" "}
              {COURSE_INFO.questionCount}-question assessment. Learn the
              movement, then put it to work in your own club.
            </p>
            <ul className="course-gate-topics">
              <li>Rotary’s story, structure and programmes</li>
              <li>Service planning, safeguarding and accountability</li>
              <li>Leadership, communication and your first project</li>
            </ul>
            <ButtonLink
              to="/membership#syllabus-title"
              variant="secondary"
              size="sm"
            >
              View the full syllabus
            </ButtonLink>
          </div>
          <div className="course-gate">
            <LockKeyhole size={32} aria-hidden="true" />
            <h2>Course access</h2>
            <p>
              The course is locked for now. Ask the membership team for a
              passcode.
            </p>
            {checking ? (
              <p role="status">Checking your session…</p>
            ) : (
              <form onSubmit={unlock}>
                <label htmlFor="course-passcode">Passcode</label>
                <input
                  ref={input}
                  id="course-passcode"
                  type="password"
                  autoComplete="current-password"
                  value={passcode}
                  onChange={(event) => setPasscode(event.target.value)}
                  required
                  maxLength={128}
                  aria-describedby={error ? "course-access-error" : undefined}
                  disabled={busy}
                />
                {error ? (
                  <p
                    className="course-access-error"
                    id="course-access-error"
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={busy || !passcode}
                >
                  {busy ? "Unlocking…" : "Unlock course"}
                </button>
              </form>
            )}
            <p className="form-hint">
              Access lasts up to four hours. You can lock the course again at
              any time. Your learning progress stays in this browser.
            </p>
            <ButtonLink
              to="/contact?interest=join-club"
              variant="secondary"
              size="sm"
            >
              Ask the membership team
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
