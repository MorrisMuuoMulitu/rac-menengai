/**
 * The membership academy.
 *
 * Seven chapters, twenty lessons, chapter checks, a twenty-question
 * assessment and a practical proposal.
 * Finish all of it and the joining journey unlocks — the club still decides.
 *
 * The page is a view over server state. Nothing is scored here, and nothing
 * is marked complete here; every button posts and waits.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  ExternalLink,
  Film,
  Lightbulb,
  ListChecks,
  Loader2,
  Lock,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { PageMeta } from "../components/ui";
import { CHAPTERS, COURSE_INFO } from "../course-info";
import { useAccount } from "../academy/account";
import { LessonExplorer } from "../academy/LessonExplorer";
import { VideoThumbnail } from "../academy/VideoThumbnail";
import { FourWayPractice, RolePractice } from "../academy/RolePractice";
import { assessmentDraftIdentity } from "../academy/learning-experience";
import { Flashcards } from "../academy/Flashcards";
import { FollowTheClub } from "../academy/FollowTheClub";
import { OrderingActivity } from "../academy/OrderingActivity";
import { flashcardsForChapter } from "../../shared/rotaract-academy/flashcards";
import { orderingForLesson } from "../../shared/rotaract-academy/activities";
import { AccountChip } from "../academy/AccountChip";
import { CompletionCertificate } from "../academy/CompletionCertificate";
import {
  AcademyError,
  answerScenario,
  loadAcademy,
  markLesson,
  saveDraft as saveApplicationDraft,
  saveCertificateDetails,
  saveProposal,
  sendApplication,
  submitAssessment,
  withdrawApplication,
  type AcademyBootstrap,
  type ApplicationDraft,
  type GradedResponse,
  type PracticalProposal,
  type ScenarioResponse,
} from "../lib/academy";
import {
  answeredCount,
  clearDraft,
  loadDraft,
  saveDraft as saveAssessmentDraft,
} from "../lib/assessment-draft";
import {
  AVAILABILITY_OPTIONS,
  EMPTY_DRAFT,
  FIRST_MONTH_CHECKLIST,
} from "../../shared/rotaract-academy/application";
import {
  PROPOSAL_FIELDS,
  PROPOSAL_MIN_LENGTH,
} from "../../shared/rotaract-academy/proposal";
import { videoWatchUrl } from "../../shared/rotaract-academy/videos";
import "../academy.css";
import {
  courseSteps,
  resolveStep,
  stepHref,
  stepIsDone,
  stepSlug,
  type Step,
} from "../academy/steps";

/* ------------------------------------------------------------------ steps -- */

/* ------------------------------------------------------------------ pieces -- */

function Notice({
  children,
  tone = "error",
}: {
  children: React.ReactNode;
  tone?: "error" | "info" | "good";
}) {
  return (
    <p
      className={`academy-notice ${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {tone === "error" ? (
        <AlertCircle size={18} aria-hidden="true" />
      ) : tone === "good" ? (
        <CircleCheck size={18} aria-hidden="true" />
      ) : (
        <Clock size={18} aria-hidden="true" />
      )}
      <span>{children}</span>
    </p>
  );
}

/**
 * The course structure, rendered straight from the syllabus.
 *
 * This is what the page shows before the API answers, and what a crawler or a
 * reader on a poor connection gets if the API never answers. It carries no
 * questions and no answers, so it is safe to prerender and to serve without a
 * session.
 */
function StaticSyllabus({ note }: { note?: string }) {
  return (
    <>
      <header className="academy-hero">
        <div className="container academy-hero-inner">
          <div>
            <span className="academy-eyebrow">
              <BookOpen size={15} aria-hidden="true" /> Menengai learning
            </span>
            <h1>{COURSE_INFO.title}</h1>
            <p>{COURSE_INFO.lead}</p>
          </div>
          <div className="academy-hero-meta">
            <div>
              <strong>{CHAPTERS.length}</strong>
              <span>chapters</span>
            </div>
            <div>
              <strong>{COURSE_INFO.lessons.length}</strong>
              <span>lessons</span>
            </div>
            <div>
              <strong>{COURSE_INFO.questionCount}</strong>
              <span>questions</span>
            </div>
            <div>
              <strong>{COURSE_INFO.minutes}</strong>
              <span>minutes</span>
            </div>
          </div>
        </div>
      </header>
      <section className="section academy-syllabus-static">
        <div className="container">
          {note ? <Notice tone="info">{note}</Notice> : null}
          <h2 className="academy-step-title">What the course covers</h2>
          <p className="academy-lede">
            Seven chapters, read in order. At the end of each one there is a
            situation to work through, and the course finishes with a short
            assessment and a one-page proposal you write yourself.
          </p>
          <ol className="academy-syllabus-list">
            {CHAPTERS.map((chapter, index) => (
              <li key={chapter.id}>
                <h3>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {chapter.title}
                </h3>
                <p>{chapter.description}</p>
                <ul>
                  {chapter.lessons.map((lessonId) => {
                    const lesson = COURSE_INFO.lessons.find(
                      (entry) => entry.id === lessonId,
                    );
                    if (!lesson) return null;
                    return (
                      <li key={lesson.id}>
                        <strong>{lesson.title}</strong>
                        <span>{lesson.summary}</span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
          <div className="academy-actions">
            <Loader2 className="academy-spin" size={16} aria-hidden="true" />
            <p className="academy-hint" role="status">
              Opening your progress…
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/** A video that makes no player request to YouTube until the learner asks for it. */
function VideoPlate({
  video,
  priority = false,
}: {
  video: {
    id: string;
    youtubeId: string;
    title: string;
    why: string;
    reading: { label: string; href: string };
  };
  priority?: boolean;
}) {
  const [armed, setArmed] = useState(false);
  return (
    <figure className="academy-video">
      <div className="academy-video-frame">
        {armed ? (
          <iframe
            key={video.id}
            src={videoWatchUrl(video, true)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className="academy-video-poster"
            onClick={() => setArmed(true)}
            aria-label={`Play ${video.title}`}
          >
            <VideoThumbnail
              youtubeId={video.youtubeId}
              title={video.title}
              priority={priority}
            />
            <span className="academy-video-shade" aria-hidden="true" />
            <span className="academy-video-play" aria-hidden="true">
              <Play size={26} />
            </span>
            <span className="academy-video-load">
              Watch “{video.title}”
              <small>
                Preview loaded. The video player opens only when you press play.
              </small>
            </span>
          </button>
        )}
      </div>
      <figcaption>
        <strong>{video.title}</strong>
        <span>{video.why}</span>
        <a href={video.reading.href} target="_blank" rel="noopener noreferrer">
          {video.reading.label} <ExternalLink size={13} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------- page -- */

export default function AcademyPage() {
  const account = useAccount();
  const [data, setData] = useState<AcademyBootstrap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [contentsOpen, setContentsOpen] = useState(true);
  const [assessmentResult, setAssessmentResult] =
    useState<GradedResponse | null>(null);
  useEffect(() => {
    setAssessmentResult(null);
  }, [account.email]);
  useEffect(() => {
    if (window.matchMedia("(max-width: 900px)").matches) {
      setContentsOpen(false);
    }
  }, []);
  const [scenarioResult, setScenarioResult] = useState<ScenarioResponse | null>(
    null,
  );
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const { step: slug } = useParams<{ step: string }>();
  const steps = useMemo(() => courseSteps(data?.course), [data?.course]);
  /* The URL is the step. No index in state, so every lesson is linkable. */
  const step = useMemo(
    () => resolveStep(slug, data?.course),
    [slug, data?.course],
  );
  const index = step
    ? steps.findIndex((candidate) => stepSlug(candidate) === stepSlug(step))
    : 0;
  const go = (target: Step) => navigate(stepHref(target));
  /*
   * How far the learner may travel: up to their first unfinished step. Every
   * step is still readable once reached, so a returning learner can look back
   * without losing their place.
   */
  const resumeIndex = useMemo(() => {
    const firstUnfinished = steps.findIndex(
      (candidate) => !stepIsDone(candidate, data),
    );
    /* Everything done: nothing left to unlock, so nothing is locked. */
    return firstUnfinished === -1 ? steps.length - 1 : firstUnfinished;
  }, [steps, data]);
  const unlocked = (target: number) =>
    !data?.signedIn ||
    target <= resumeIndex ||
    Boolean(steps[target] && stepIsDone(steps[target], data));

  /*
   * Read the course as soon as the page opens, and read it again with a
   * session once sign-in has finished starting up. The identity of `account`
   * only changes when something about the account actually changed, so this
   * is two reads at most: one public, one signed in.
   */
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const token = account.ready ? await account.token() : null;
        const next = await loadAcademy(token);
        if (cancelled) return;
        setData(next);
        setError("");
      } catch (cause) {
        if (cancelled) return;
        setError(
          cause instanceof AcademyError
            ? cause.message
            : "We could not load the course. Try again.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [account]);

  /*
   * Move focus to the new heading when the learner moves to another step, so a
   * screen reader is told where they are. Keyed to the URL: the resolved step
   * also changes when the course finishes loading, and focusing then drew a
   * ring around the title for no reason.
   */
  const focusedSlug = useRef<string | null>(null);
  useEffect(() => {
    if (!slug || focusedSlug.current === slug) return;
    focusedSlug.current = slug;
    /* A new step starts with no verdict from the last one on screen. */
    setScenarioResult(null);
    headingRef.current?.focus();
  }, [slug]);

  useEffect(() => {
    if (window.location.hash !== "#certificate" || !data?.record?.passed)
      return;
    const frame = window.requestAnimationFrame(() =>
      document.getElementById("certificate")?.scrollIntoView(),
    );
    return () => window.cancelAnimationFrame(frame);
  }, [data?.record?.passed]);

  /*
   * The rail is twenty-four rows tall. Showing only the chapter you are in
   * turns that into something you can read at a glance, and the chapter
   * headings become the switcher.
   */
  const [openRail, setOpenRail] = useState<string[]>([]);
  const currentChapterId =
    data?.course?.chapters.find(
      (item) =>
        item.lessons.some(
          (lesson) => step?.kind === "lesson" && step.lessonId === lesson.id,
        ) ||
        (step?.kind === "scenario" && step.chapterId === item.id),
    )?.id ?? data?.course?.chapters[0]?.id;
  useEffect(() => {
    if (currentChapterId) setOpenRail([currentChapterId]);
  }, [currentChapterId]);

  const run = async <T,>(
    work: (token: string | null) => Promise<T>,
    apply: (value: T) => void,
  ) => {
    setBusy(true);
    setError("");
    try {
      const token = await account.token();
      apply(await work(token));
    } catch (cause) {
      setError(
        cause instanceof AcademyError
          ? cause.message
          : "That did not go through. Try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const course = data?.course;
  const chapter = useMemo(() => {
    if (!course || !step) return null;
    if (step.kind === "lesson")
      return (
        course.chapters.find((item) =>
          item.lessons.some((lesson) => lesson.id === step.lessonId),
        ) ?? null
      );
    if (step.kind === "scenario")
      return course.chapters.find((item) => item.id === step.chapterId) ?? null;
    return null;
  }, [course, step]);

  const lesson = useMemo(() => {
    if (!course || step?.kind !== "lesson") return null;
    for (const item of course.chapters) {
      const found = item.lessons.find((entry) => entry.id === step.lessonId);
      if (found) return found;
    }
    return null;
  }, [course, step]);

  const lessonBody = useMemo(() => {
    if (!course || !lesson) return null;
    return course.modules.find((module) => module.id === lesson.id) ?? null;
  }, [course, lesson]);

  /* --------------------------------------------------------------- render -- */

  if (loading)
    return (
      <>
        <PageMeta
          title="Membership academy"
          description="Twenty lessons on Rotaract, club leadership and practical service, with activities and a personal service proposal."
        />
        <StaticSyllabus />
      </>
    );

  if (!course)
    return (
      <>
        <PageMeta
          title="Membership academy"
          description="The membership course is unavailable right now."
        />
        <StaticSyllabus
          note={
            error ||
            "The club has not opened the interactive course here yet. The full outline is below, and you can also ask for the passcode course."
          }
        />
      </>
    );

  /*
   * A slug that names nothing, or a step the learner has not reached yet,
   * sends them to where they actually are rather than to a dead end.
   */
  /*
   * A slug that names nothing goes to where the learner actually is. The
   * unlock order only applies to someone with a record to protect: a guest is
   * promised they can read the course, so nothing is locked to them.
   */
  if (!step)
    return (
      <Navigate
        to={`/membership/academy/${steps[resumeIndex] ? stepSlug(steps[resumeIndex]) : ""}`}
        replace
      />
    );
  if (!unlocked(index))
    return (
      <Navigate
        to={`/membership/academy/${stepSlug(steps[resumeIndex])}`}
        replace
      />
    );

  const summary = data?.summary;
  const signedIn = Boolean(data?.signedIn);
  const record = data?.record;
  const nextStep = steps[index + 1];
  const nextTitle = !nextStep
    ? "Course complete"
    : nextStep.kind === "lesson"
      ? course.modules.find((module) => module.id === nextStep.lessonId)?.title
      : nextStep.kind === "scenario"
        ? "Chapter practice check"
        : nextStep.kind === "assessment"
          ? "Final assessment"
          : nextStep.kind === "proposal"
            ? "Your service proposal"
            : "Membership journey";

  return (
    <>
      <PageMeta
        title="Membership academy"
        description="Seven chapters on Rotaract, service and leadership, with activities, feedback and a practical service proposal."
      />

      <header className="lesson-bar">
        <div className="container lesson-bar-inner">
          <div className="lesson-bar-row">
            <Link className="lesson-bar-back" to="/membership/academy">
              <ArrowLeft size={15} aria-hidden="true" /> Course
            </Link>
            <button
              type="button"
              className="lesson-contents-toggle"
              aria-expanded={contentsOpen}
              aria-controls="lesson-contents"
              onClick={() => setContentsOpen((open) => !open)}
            >
              {contentsOpen ? "Hide contents" : "Contents"}
            </button>
            <p className="lesson-bar-where">
              {chapter ? `${chapter.title} · ` : ""}
              <strong>
                Step {index + 1} of {steps.length}
              </strong>
            </p>
            <div className="lesson-bar-controls">
              <button
                type="button"
                className="lesson-nav"
                disabled={index === 0}
                onClick={() => go(steps[index - 1])}
                aria-label="Previous step"
              >
                <ChevronLeft size={18} aria-hidden="true" /> Previous
              </button>
              <button
                type="button"
                className="lesson-nav"
                disabled={index >= steps.length - 1 || !unlocked(index + 1)}
                onClick={() => go(steps[index + 1])}
                aria-label={`Next: ${nextTitle}`}
              >
                <span className="lesson-next-title">Next: {nextTitle}</span>
                {/* Phones get the short label; the title is clipped otherwise. */}
                <span className="lesson-next-short">Next</span>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <p className="lesson-overall-progress">
            Course progress: {summary?.percent ?? 0}% ·{" "}
            {summary?.completed ?? 0} of {steps.length} steps complete
          </p>
          <div
            className="lesson-bar-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={summary?.total ?? 0}
            aria-valuenow={summary?.completed ?? 0}
            aria-valuetext={`${summary?.completed ?? 0} of ${summary?.total ?? 0} steps complete`}
          >
            <span style={{ width: `${summary?.percent ?? 0}%` }} />
          </div>
          <label className="lesson-jump">
            Jump to a step
            <select
              aria-label="Jump to a step"
              value={slug}
              onChange={(event) =>
                navigate(`/membership/academy/${event.target.value}`)
              }
            >
              {steps.map((item, at) => (
                <option
                  key={stepSlug(item)}
                  value={stepSlug(item)}
                  disabled={!unlocked(at)}
                >
                  {at + 1}.{" "}
                  {item.kind === "lesson"
                    ? course.modules.find(
                        (module) => module.id === item.lessonId,
                      )?.title
                    : item.kind === "scenario"
                      ? `${course.chapters.find((chapter) => chapter.id === item.chapterId)?.title}: practice check`
                      : item.kind === "assessment"
                        ? "Final assessment"
                        : item.kind === "proposal"
                          ? "My service proposal"
                          : "Membership journey"}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      {!signedIn ? (
        <section className="academy-signin">
          <div className="container academy-signin-inner">
            <div>
              <p>
                Explore freely. Create an account to save progress and complete
                the course.
              </p>
            </div>
            <div className="academy-signin-action">
              {!account.ready || account.available ? (
                /*
                 * A link, not Clerk's modal. The modal is an overlay that
                 * decides for itself whether to render, and when it declined
                 * the button silently did nothing. A page cannot fail quietly.
                 */
                <>
                  <Link
                    className="btn btn-primary btn-lg"
                    to="/membership/register"
                  >
                    Create an account <ArrowRight aria-hidden="true" />
                  </Link>
                  <Link
                    className="btn btn-secondary btn-md"
                    to="/membership/sign-in"
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <p className="academy-hint">
                  Sign-in is not switched on for this deployment yet. Ask the
                  membership team for the passcode course, or come to a
                  fellowship and they will walk you through this one.
                </p>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {error ? (
        <div className="container academy-error-bar">
          <Notice>{error}</Notice>
        </div>
      ) : null}

      <div
        className={`container academy-layout${contentsOpen ? "" : " is-focused"}`}
      >
        {/* ------------------------------------------------ contents rail -- */}
        <nav
          id="lesson-contents"
          className="academy-rail"
          aria-label="Course contents"
          hidden={!contentsOpen}
        >
          <h2 className="academy-rail-title">Contents</h2>
          <ol>
            {course.chapters.map((item, chapterIndex) => {
              const progress = data?.chapters?.find(
                (entry) => entry.id === item.id,
              );
              return (
                <li key={item.id} className="academy-rail-chapter">
                  <button
                    type="button"
                    className="academy-rail-chapter-title"
                    aria-expanded={openRail.includes(item.id)}
                    aria-controls={`rail-${item.id}`}
                    onClick={() =>
                      setOpenRail((open) =>
                        open.includes(item.id)
                          ? open.filter((id) => id !== item.id)
                          : [...open, item.id],
                      )
                    }
                  >
                    <span aria-hidden="true">
                      {String(chapterIndex + 1).padStart(2, "0")}
                    </span>
                    {item.title}
                    {progress?.state === "complete" ? (
                      <BadgeCheck size={15} aria-label="Chapter complete" />
                    ) : null}
                  </button>
                  <ul
                    id={`rail-${item.id}`}
                    hidden={!openRail.includes(item.id)}
                  >
                    {item.lessons.map((entry) => {
                      const done = record?.completedLessons.includes(entry.id);
                      const active =
                        step?.kind === "lesson" && step.lessonId === entry.id;
                      const stepIndex = steps.findIndex(
                        (candidate) =>
                          candidate.kind === "lesson" &&
                          candidate.lessonId === entry.id,
                      );
                      return (
                        <li key={entry.id}>
                          <button
                            type="button"
                            className={`academy-rail-item${active ? " is-current" : ""}${done ? " is-done" : ""}`}
                            aria-current={active ? "step" : undefined}
                            onClick={() => {
                              if (unlocked(stepIndex) || done)
                                go(steps[stepIndex]);
                            }}
                            disabled={!unlocked(stepIndex) && !done}
                          >
                            <span
                              className="academy-rail-mark"
                              aria-hidden="true"
                            >
                              {done ? <Check size={13} /> : entry.minutes}
                            </span>
                            {entry.title}
                          </button>
                        </li>
                      );
                    })}
                    {item.scenario ? (
                      <li>
                        <button
                          type="button"
                          className={`academy-rail-item academy-rail-check${step?.kind === "scenario" && step.chapterId === item.id ? " is-current" : ""}${stepIsDone({ kind: "scenario", chapterId: item.id }, data) ? " is-done" : ""}`}
                          onClick={() => {
                            const stepIndex = steps.findIndex(
                              (candidate) =>
                                candidate.kind === "scenario" &&
                                candidate.chapterId === item.id,
                            );
                            if (unlocked(stepIndex)) go(steps[stepIndex]);
                          }}
                          disabled={
                            !unlocked(
                              steps.findIndex(
                                (candidate) =>
                                  candidate.kind === "scenario" &&
                                  candidate.chapterId === item.id,
                              ),
                            )
                          }
                        >
                          <span
                            className="academy-rail-mark"
                            aria-hidden="true"
                          >
                            {stepIsDone(
                              { kind: "scenario", chapterId: item.id },
                              data,
                            ) ? (
                              <Check size={13} />
                            ) : (
                              <Sparkles size={12} />
                            )}
                          </span>
                          In your shoes
                        </button>
                      </li>
                    ) : null}
                  </ul>
                </li>
              );
            })}
            <li className="academy-rail-chapter">
              <p className="academy-rail-chapter-title">
                <span aria-hidden="true">✓</span>Finish
              </p>
              <ul>
                {(
                  [
                    ["assessment", "Personal assessment"],
                    ["proposal", "Your first proposal"],
                    ["join", "Joining the club"],
                  ] as const
                ).map(([kind, label]) => {
                  const stepIndex = steps.findIndex(
                    (candidate) => candidate.kind === kind,
                  );
                  const done = stepIsDone({ kind } as Step, data);
                  const active = step?.kind === kind;
                  return (
                    <li key={kind}>
                      <button
                        type="button"
                        className={`academy-rail-item${active ? " is-current" : ""}${done ? " is-done" : ""}`}
                        aria-current={active ? "step" : undefined}
                        disabled={!unlocked(stepIndex)}
                        onClick={() => {
                          if (unlocked(stepIndex)) go(steps[stepIndex]);
                        }}
                      >
                        <span className="academy-rail-mark" aria-hidden="true">
                          {done ? (
                            <Check size={13} />
                          ) : !unlocked(stepIndex) ? (
                            <Lock size={12} />
                          ) : (
                            "•"
                          )}
                        </span>
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ol>
        </nav>

        {/* ------------------------------------------------------ the step -- */}
        <article className="academy-step">
          <p className="academy-stepof">
            Step {index + 1} of {steps.length}
            {chapter ? ` · ${chapter.title}` : ""}
          </p>

          {step?.kind === "lesson" && lesson && lessonBody ? (
            <>
              <header className="lesson-heading">
                <div className="lesson-heading-where">
                  {chapter ? (
                    <>
                      <span>{chapter.title}</span>
                      <i aria-hidden="true" />
                      <span>
                        Lesson{" "}
                        {chapter.lessons.findIndex(
                          (entry) => entry.id === lesson.id,
                        ) + 1}{" "}
                        of {chapter.lessons.length}
                      </span>
                    </>
                  ) : (
                    <span>Membership course</span>
                  )}
                </div>
                <h1
                  className="academy-step-title"
                  tabIndex={-1}
                  ref={headingRef}
                >
                  {lesson.title}
                </h1>
                <p className="academy-lede">{lesson.summary}</p>
                <div className="lesson-heading-meta">
                  <span>
                    <Clock size={15} aria-hidden="true" /> About{" "}
                    {lesson.minutes} minutes
                  </span>
                  <span>
                    <ListChecks size={15} aria-hidden="true" />{" "}
                    {lessonBody.objectives.length} learning goals
                  </span>
                  {record?.completedLessons.includes(lesson.id) ? (
                    <span className="is-done">
                      <BadgeCheck size={15} aria-hidden="true" /> Completed
                    </span>
                  ) : null}
                </div>
              </header>

              <aside
                className="lesson-study-rhythm"
                aria-label="How to study this lesson"
              >
                <div className="lesson-study-rhythm-title">
                  <Lightbulb size={18} aria-hidden="true" />
                  <strong>Your reading rhythm</strong>
                </div>
                <ol>
                  <li>
                    <span>1</span> Read the idea and work through the example.
                  </li>
                  <li>
                    <span>2</span> Pause and ask how it would work at Menengai.
                  </li>
                  <li>
                    <span>3</span> Use the practice before you mark the lesson
                    finished.
                  </li>
                </ol>
              </aside>

              {/* A chapter's films belong to the chapter, so they open it
                  rather than reappearing on every lesson inside it. The
                  previews load with the page; YouTube itself waits for play. */}
              {chapter?.videos.length &&
              chapter.lessons[0]?.id === lesson.id ? (
                <section
                  className="lesson-media"
                  aria-labelledby="lesson-media-title"
                >
                  <div className="lesson-media-head">
                    <span>
                      <Film size={15} aria-hidden="true" /> Film break
                    </span>
                    <h2 id="lesson-media-title">Rotary in its own words</h2>
                    <p>
                      Optional context from Rotary International. The preview is
                      ready now; the player loads only when you press play.
                    </p>
                  </div>
                  <div className="academy-videos">
                    {chapter.videos.map((video, index) => (
                      <VideoPlate
                        key={video.id}
                        video={video}
                        priority={index === 0}
                      />
                    ))}
                  </div>
                </section>
              ) : null}

              <LessonExplorer
                key={`reading-${lesson.id}`}
                lessonId={lesson.id}
                blocks={lessonBody.blocks}
                objectives={lessonBody.objectives}
                activity={lessonBody.activity}
              />
              {(lesson.id === "structure" ||
                lesson.id === "club-leadership") && (
                <RolePractice key={`roles-${lesson.id}`} />
              )}
              {(lesson.id === "protocol-ethics" || lesson.id === "ethics") && (
                <FourWayPractice key={`four-way-${lesson.id}`} />
              )}

              {/* An activity, where the lesson has one, before the recap. */}
              {orderingForLesson(lesson.id) ? (
                <OrderingActivity
                  key={`order-${lesson.id}`}
                  activity={orderingForLesson(lesson.id)!}
                />
              ) : null}

              {/* One deck per chapter, as a recap before the chapter's check. */}
              {chapter &&
              chapter.lessons[chapter.lessons.length - 1]?.id === lesson.id ? (
                <Flashcards
                  cards={flashcardsForChapter(chapter.id)}
                  chapterTitle={chapter.title}
                />
              ) : null}

              <aside
                className="lesson-source-links"
                aria-label="Further reading"
              >
                <strong>Go to the source</strong>
                <a
                  href="https://www.rotary.org/en/get-involved/our-clubs/rotaract-clubs"
                  target="_blank"
                  rel="noreferrer"
                >
                  Rotary International: Rotaract clubs{" "}
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
                {chapter?.id === "protocols" || chapter?.id === "integrity" ? (
                  <a
                    href="https://blog.rotary.org/2026/04/09/the-four-way-test-a-road-map-we-need-now-more-than-ever/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Rotary: applying the Four-Way Test{" "}
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                ) : chapter?.id === "service" ? (
                  <a
                    href="https://www.rotary.org/our-work"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Rotary’s work and causes{" "}
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                ) : null}
              </aside>

              <div className="lesson-finish-bar">
                <div className="lesson-finish-next">
                  <span>Next on the route</span>
                  <strong>{nextTitle}</strong>
                  <small>
                    {record?.completedLessons.includes(lesson.id)
                      ? "You can revisit this lesson whenever you need it."
                      : signedIn
                        ? "Finish the practice, then save this lesson to your record."
                        : "Explore now. Sign in when you want the club to keep your place."}
                  </small>
                </div>
                <div className="academy-actions">
                  {index > 0 ? (
                    <button
                      type="button"
                      className="btn btn-secondary btn-md"
                      onClick={() => go(steps[index - 1])}
                    >
                      <ArrowLeft aria-hidden="true" /> Back
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn-primary btn-md"
                    disabled={
                      busy ||
                      (Boolean(record?.completedLessons.includes(lesson.id)) &&
                        !unlocked(index + 1))
                    }
                    onClick={() =>
                      !signedIn || record?.completedLessons.includes(lesson.id)
                        ? go(steps[Math.min(index + 1, steps.length - 1)])
                        : void run(
                            (token) => markLesson(token, lesson.id),
                            (next) => {
                              setData((previous) =>
                                previous
                                  ? {
                                      ...previous,
                                      record: next.record,
                                      summary: next.summary,
                                      chapters: next.chapters,
                                    }
                                  : previous,
                              );
                              go(steps[Math.min(index + 1, steps.length - 1)]);
                            },
                          )
                    }
                  >
                    {!signedIn ||
                    record?.completedLessons.includes(lesson.id) ? (
                      <>
                        Continue <ArrowRight aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        Mark finished <ArrowRight aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </div>
              {!signedIn ? (
                <p className="academy-hint">
                  Sign in above to mark this lesson finished and keep your
                  place.
                </p>
              ) : null}
            </>
          ) : null}

          {step?.kind === "scenario" && chapter?.scenario ? (
            <ScenarioStep
              key={chapter.scenario.id}
              scenario={chapter.scenario}
              result={scenarioResult}
              busy={busy}
              signedIn={signedIn}
              headingRef={headingRef}
              onAnswer={(optionId) =>
                run(
                  (token) =>
                    answerScenario(token, chapter.scenario!.id, optionId),
                  (next: ScenarioResponse) => {
                    setData((previous) =>
                      previous
                        ? {
                            ...previous,
                            record: next.record,
                            summary: next.summary,
                          }
                        : previous,
                    );
                    /*
                     * Show the result rather than sliding past it. The copy
                     * promised the reasoning either way, and advancing on a
                     * correct answer meant the learner never saw any of it.
                     */
                    setScenarioResult(next);
                  },
                )
              }
              onContinue={() =>
                go(steps[Math.min(index + 1, steps.length - 1)])
              }
            />
          ) : null}

          {step?.kind === "assessment" ? (
            <>
              <AssessmentStep
                key={assessmentDraftIdentity(
                  course.version,
                  account.email ?? "guest",
                  course.questions,
                )}
                course={course}
                record={data?.record}
                busy={busy}
                signedIn={signedIn}
                headingRef={headingRef}
                result={assessmentResult}
                draftIdentity={assessmentDraftIdentity(
                  course.version,
                  account.email ?? "guest",
                  course.questions,
                )}
                onContinue={() =>
                  go(steps[Math.min(index + 1, steps.length - 1)])
                }
                onRetry={() => setAssessmentResult(null)}
                onSubmit={(answers) =>
                  run(
                    (token) => submitAssessment(token, answers),
                    (next: GradedResponse) => {
                      setData((previous) =>
                        previous
                          ? {
                              ...previous,
                              record: next.record,
                              summary: next.summary,
                            }
                          : previous,
                      );
                      setAssessmentResult(next);
                    },
                  )
                }
              />
              {record?.passed ? (
                <CompletionCertificate
                  name={
                    record.certificateName ?? data?.actor?.displayName ?? ""
                  }
                  email={account.email}
                  photo={record.certificatePhoto}
                  completedAt={
                    record.completedAt ?? record.passedAt ?? record.updatedAt
                  }
                  score={record.bestScore}
                  total={course.questions.length}
                  certificateNumber={record.certificateNumber}
                  busy={busy}
                  onSave={(name, photo) =>
                    run(
                      (token) => saveCertificateDetails(token, name, photo),
                      (next) => {
                        setData((previous) =>
                          previous
                            ? {
                                ...previous,
                                record: next.record,
                                summary: next.summary,
                              }
                            : previous,
                        );
                      },
                    )
                  }
                />
              ) : null}
            </>
          ) : null}

          {step?.kind === "proposal" ? (
            <ProposalStep
              key="proposal"
              busy={busy}
              signedIn={signedIn}
              existing={record?.proposal ?? null}
              headingRef={headingRef}
              onSave={(proposal) =>
                run(
                  (token) => saveProposal(token, proposal),
                  (next) => {
                    setData((previous) =>
                      previous
                        ? {
                            ...previous,
                            record: next.record,
                            summary: next.summary,
                          }
                        : previous,
                    );
                    go(steps[Math.min(index + 1, steps.length - 1)]);
                  },
                )
              }
            />
          ) : null}

          {step?.kind === "join" ? (
            <JoinStep
              key="join"
              data={data}
              busy={busy}
              signedIn={signedIn}
              headingRef={headingRef}
              onSaveDraft={(draft) =>
                run(
                  (token) => saveApplicationDraft(token, draft),
                  (next) =>
                    setData((previous) =>
                      previous
                        ? { ...previous, application: next.application }
                        : previous,
                    ),
                )
              }
              onSend={() =>
                run(sendApplication, (next) =>
                  setData((previous) =>
                    previous
                      ? {
                          ...previous,
                          application: next.application,
                          statusLabel: next.statusLabel,
                        }
                      : previous,
                  ),
                )
              }
              onWithdraw={() =>
                run(withdrawApplication, (next) =>
                  setData((previous) =>
                    previous
                      ? { ...previous, application: next.application }
                      : previous,
                  ),
                )
              }
            />
          ) : null}

          {busy ? (
            <p className="academy-saving" role="status">
              <Loader2 className="academy-spin" size={16} aria-hidden="true" />{" "}
              Saving…
            </p>
          ) : null}
        </article>
      </div>
    </>
  );
}

/* --------------------------------------------------------------- scenario -- */

function ScenarioStep({
  scenario,
  result,
  busy,
  signedIn,
  headingRef,
  onAnswer,
  onContinue,
}: {
  scenario: {
    id: string;
    situation: string;
    prompt: string;
    options: { id: string; text: string }[];
  };
  result: ScenarioResponse | null;
  busy: boolean;
  signedIn: boolean;
  headingRef: React.RefObject<HTMLHeadingElement>;
  onAnswer: (optionId: string) => void;
  onContinue: () => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const best = scenario.options.find(
    (option) => option.id === result?.bestOptionId,
  );
  return (
    <>
      <span className="academy-eyebrow">
        <Sparkles size={15} aria-hidden="true" /> In your shoes
      </span>
      <h2 className="academy-step-title" tabIndex={-1} ref={headingRef}>
        {scenario.prompt}
      </h2>
      <p className="academy-lede">{scenario.situation}</p>

      {result ? (
        <div
          className={`scenario-result is-${result.correct ? "right" : "wrong"}`}
          role="status"
          aria-live="polite"
        >
          <p className="scenario-verdict">
            {result.correct ? (
              <>
                <CircleCheck size={20} aria-hidden="true" /> Right — that is the
                answer the club can stand behind.
              </>
            ) : (
              <>
                <AlertCircle size={20} aria-hidden="true" /> Not quite. The
                answer the club would give is below.
              </>
            )}
          </p>
          {!result.correct && best ? (
            <p className="scenario-best">
              <strong>The club’s answer</strong> {best.text}
            </p>
          ) : null}
          <p className="scenario-why">{result.feedback}</p>
          <div className="scenario-result-actions">
            {result.correct ? (
              <button
                type="button"
                className="btn btn-primary btn-md"
                onClick={onContinue}
              >
                Continue <ArrowRight aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary btn-md"
                onClick={() => setPicked(null)}
              >
                <RotateCcw aria-hidden="true" /> Try again
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* The choices stay available while they are still choosing or retrying. */}
      <fieldset className="academy-choices" disabled={busy || !signedIn}>
        <legend className="academy-hint">
          Pick what you would actually do. There is one answer the club can
          stand behind, and you will see the reasoning either way.
        </legend>
        {scenario.options.map((option) => (
          <label
            key={option.id}
            className={`academy-choice${picked === option.id ? " is-picked" : ""}${
              result && best?.id === option.id ? " is-best" : ""
            }`}
          >
            <input
              type="radio"
              name={scenario.id}
              value={option.id}
              checked={picked === option.id}
              onChange={() => setPicked(option.id)}
            />
            <span>{option.text}</span>
          </label>
        ))}
      </fieldset>
      <button
        type="button"
        className="btn btn-primary btn-md"
        disabled={!picked || busy || !signedIn || Boolean(result?.correct)}
        onClick={() => picked && onAnswer(picked)}
      >
        {result ? "Send this answer" : "Commit to this answer"}{" "}
        <ArrowRight aria-hidden="true" />
      </button>
      {!signedIn ? (
        <p className="academy-hint">
          Sign in above to answer and see how the club would read it.
        </p>
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------- assessment -- */

export function AssessmentStep({
  course,
  record,
  busy,
  signedIn,
  headingRef,
  result,
  draftIdentity,
  onContinue,
  onRetry,
  onSubmit,
}: {
  course: NonNullable<AcademyBootstrap["course"]>;
  record: AcademyBootstrap["record"];
  busy: boolean;
  signedIn: boolean;
  headingRef: React.RefObject<HTMLHeadingElement>;
  result: GradedResponse | null;
  draftIdentity: string;
  onContinue: () => void;
  onRetry: () => void;
  onSubmit: (answers: (number | null)[]) => void;
}) {
  /*
   * The draft is restored from the browser, so closing a tab halfway through
   * forty-two questions does not throw the answers away. It is only ever a
   * draft: the server grades the attempt and keeps the record.
   */
  const [answers, setAnswers] = useState<(number | null)[]>(
    () =>
      loadDraft(
        draftIdentity,
        course.questions.length,
        undefined,
        draftIdentity,
      ) ?? course.questions.map(() => null),
  );
  const [draftSaved, setDraftSaved] = useState(true);
  const [retaking, setRetaking] = useState(false);
  const [groupIndex, setGroupIndex] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  const update = (index: number, value: number) => {
    setAnswers((previous) => {
      const next = previous.map((entry, at) => (at === index ? value : entry));
      setDraftSaved(
        saveAssessmentDraft(draftIdentity, next, undefined, draftIdentity),
      );
      return next;
    });
  };

  const answered = answeredCount(answers);
  /* Group the paper by chapter, so forty-two questions read as seven sets. */
  const groups = course.chapters
    .map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      questions: course.questions
        .map((question, index) => ({ question, index }))
        .filter(({ question }) =>
          chapter.lessons.some((lesson) => lesson.id === question.lessonId),
        ),
    }))
    .filter((group) => group.questions.length > 0);

  const alreadyPassed = Boolean(record?.passed) && !retaking && !result;

  if (alreadyPassed)
    return (
      <>
        <span className="academy-eyebrow">
          <BadgeCheck size={15} aria-hidden="true" /> Final check
        </span>
        <h2 className="academy-step-title" tabIndex={-1} ref={headingRef}>
          You have passed this assessment
        </h2>
        <div className="assessment-passed" role="status">
          <p className="assessment-passed-score">
            {(record?.bestScore ?? 0) <= course.questions.length
              ? `${record?.bestScore ?? 0} of ${course.questions.length} correct`
              : "Pass recorded on an earlier assessment"}
          </p>
          <p>
            Passed{" "}
            {record?.passedAt
              ? new Date(record.passedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : ""}
            {record?.attempts
              ? ` · ${record.attempts} attempt${record.attempts === 1 ? "" : "s"}`
              : ""}
          </p>
          <p className="academy-hint">
            You need {course.passMark} correct to pass. The club keeps your best
            score, so sitting it again can only help.
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-md"
            onClick={() => {
              setRetaking(true);
              setAnswers(course.questions.map(() => null));
              clearDraft(undefined, draftIdentity);
            }}
          >
            <RotateCcw aria-hidden="true" /> Sit it again
          </button>
        </div>
      </>
    );

  return (
    <>
      <span className="academy-eyebrow">
        <BadgeCheck size={15} aria-hidden="true" /> Final check
      </span>
      <h2 className="academy-step-title" tabIndex={-1} ref={headingRef}>
        Your final assessment
      </h2>
      <p className="academy-lede">
        {course.questions.length} questions. You need {course.passMark} right.
        Every answer is in the lessons you have just read, and you can sit it
        again as often as you like — the club records your best score.
      </p>
      {result ? (
        <div
          ref={resultRef}
          tabIndex={-1}
          className={`assessment-outcome ${result.passed ? "is-pass" : "is-retry"}`}
          role="status"
        >
          <strong>
            {result.passed
              ? "Assessment passed"
              : "Keep going. Review your answers below."}
          </strong>
          <p>
            {result.correct} of {result.total} correct. Pass mark:{" "}
            {result.passMark}.
          </p>
          <p>
            Each answer below shows whether you got it right and explains why.
          </p>
          {result.passed && (
            <button
              type="button"
              className="btn btn-primary btn-md"
              onClick={onContinue}
            >
              Continue to my service proposal <ArrowRight size={18} />
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary btn-md"
            onClick={() => {
              onRetry();
              setRetaking(true);
              setGroupIndex(0);
            }}
          >
            Review and try again
          </button>
        </div>
      ) : (
        <div className="assessment-session-status">
          <strong>
            {answered} of {course.questions.length} answered
          </strong>
          <span>
            {draftSaved
              ? "Draft kept in this browser for your account"
              : "Draft could not be saved. Keep this tab open."}
          </span>
          <progress
            max={course.questions.length}
            value={answered}
            aria-label="Assessment answers"
          />
        </div>
      )}
      {!result && (
        <nav
          className="assessment-section-nav"
          aria-label="Assessment sections"
        >
          {groups.map((group, at) => (
            <button
              type="button"
              key={group.id}
              aria-current={at === groupIndex ? "step" : undefined}
              onClick={() => setGroupIndex(at)}
            >
              {at + 1}. {group.title}
            </button>
          ))}
        </nav>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(answers);
        }}
      >
        <ol className="academy-exam">
          {groups.map((group) => (
            <li
              key={group.id}
              className="assessment-group"
              hidden={!result && groups.indexOf(group) !== groupIndex}
            >
              <h3 className="assessment-group-title">
                {group.title}
                <span>
                  {group.questions.length}{" "}
                  {group.questions.length === 1 ? "question" : "questions"}
                </span>
              </h3>
              <ol className="assessment-group-questions">
                {group.questions.map(({ question, index: questionIndex }) => {
                  const verdict = result?.perQuestion[questionIndex];
                  return (
                    <li
                      key={question.id}
                      className={`academy-exam-q${result ? (verdict ? " is-right" : " is-wrong") : ""}`}
                    >
                      <fieldset>
                        <legend>
                          <span aria-hidden="true">
                            {String(questionIndex + 1).padStart(2, "0")}
                          </span>
                          {question.question}
                        </legend>
                        {question.options.map((option, optionIndex) => (
                          <label key={option} className="academy-exam-option">
                            <input
                              type="radio"
                              name={question.id}
                              checked={answers[questionIndex] === optionIndex}
                              disabled={Boolean(result) || busy}
                              onChange={() =>
                                update(questionIndex, optionIndex)
                              }
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                        {result ? (
                          <p className="academy-exam-feedback">
                            <strong>
                              {verdict ? "Correct. " : "Not quite. "}
                            </strong>
                            {verdict ? (
                              <Check size={15} aria-hidden="true" />
                            ) : null}
                            {
                              result.feedback.find(
                                (entry) => entry.id === question.id,
                              )?.explanation
                            }
                          </p>
                        ) : null}
                      </fieldset>
                    </li>
                  );
                })}
              </ol>
            </li>
          ))}
        </ol>
        <div className="academy-actions">
          {!result && groupIndex < groups.length - 1 && (
            <button
              type="button"
              className="btn btn-secondary btn-md"
              onClick={() => setGroupIndex(groupIndex + 1)}
            >
              Next section <ArrowRight size={18} />
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={
              busy ||
              !signedIn ||
              answered !== course.questions.length ||
              Boolean(result)
            }
          >
            {result ? "Send again" : "Send my answers"}{" "}
            <Send aria-hidden="true" />
          </button>
          {answers.filter((answer) => answer !== null).length <
          course.questions.length ? (
            <p className="academy-hint">
              {answers.filter((answer) => answer !== null).length} of{" "}
              {course.questions.length} answered. Answer every question before
              submitting.
            </p>
          ) : null}
        </div>
      </form>
      {!signedIn ? (
        <p className="academy-hint">
          Sign in above to sit the assessment. It is marked on the club’s
          server, and your browser never sees the answers.
        </p>
      ) : null}
    </>
  );
}

/* --------------------------------------------------------------- proposal -- */

function ProposalStep({
  busy,
  signedIn,
  existing,
  headingRef,
  onSave,
}: {
  busy: boolean;
  signedIn: boolean;
  existing: PracticalProposal | null;
  headingRef: React.RefObject<HTMLHeadingElement>;
  onSave: (proposal: PracticalProposal) => void;
}) {
  const [draft, setDraft] = useState<PracticalProposal>(
    () =>
      existing ?? {
        need: "",
        objective: "",
        host: "",
        roles: "",
        resources: "",
        risks: "",
        followUp: "",
        openQuestions: "",
      },
  );
  const short = PROPOSAL_FIELDS.filter(
    (field) => draft[field.key].trim().length < PROPOSAL_MIN_LENGTH,
  );

  return (
    <>
      <span className="academy-eyebrow">
        <Sparkles size={15} aria-hidden="true" /> Your first contribution
      </span>
      <h2 className="academy-step-title" tabIndex={-1} ref={headingRef}>
        One page the club can act on
      </h2>
      <p className="academy-lede">
        Eight boxes. Keep each one to a couple of sentences — this is the note
        you would hand round at a fellowship, not a funding application. If you
        do not know something yet, say so in the last box.
      </p>
      <form
        className="academy-proposal"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(
            Object.fromEntries(
              PROPOSAL_FIELDS.map((field) => [
                field.key,
                draft[field.key].trim(),
              ]),
            ) as unknown as PracticalProposal,
          );
        }}
      >
        {PROPOSAL_FIELDS.map((field) => {
          const value = draft[field.key];
          return (
            <label key={field.key} className="academy-field">
              <span className="academy-field-label">{field.label}</span>
              <span className="academy-hint">{field.hint}</span>
              <textarea
                value={value}
                rows={field.key === "openQuestions" ? 3 : 4}
                maxLength={2000}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    [field.key]: event.target.value,
                  }))
                }
              />
              <span className="academy-count">
                {value.trim().length}/{PROPOSAL_MIN_LENGTH}
              </span>
            </label>
          );
        })}
        <div className="academy-actions">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={busy || short.length > 0 || !signedIn}
          >
            {existing ? "Update my proposal" : "Save my proposal"}{" "}
            <ArrowRight aria-hidden="true" />
          </button>
          {short.length ? (
            <p className="academy-hint">
              {short.length} box{short.length === 1 ? "" : "es"} still need at
              least {PROPOSAL_MIN_LENGTH} characters.
            </p>
          ) : null}
        </div>
      </form>
    </>
  );
}

/* ------------------------------------------------------------------- join -- */

function JoinStep({
  data,
  busy,
  signedIn,
  headingRef,
  onSaveDraft,
  onSend,
  onWithdraw,
}: {
  data: AcademyBootstrap | null;
  busy: boolean;
  signedIn: boolean;
  headingRef: React.RefObject<HTMLHeadingElement>;
  onSaveDraft: (draft: ApplicationDraft) => void;
  onSend: () => void;
  onWithdraw: () => void;
}) {
  const application = data?.application ?? null;
  const [draft, setDraft] = useState<ApplicationDraft>(() => ({
    ...EMPTY_DRAFT,
    ...(application
      ? {
          fullName: application.fullName,
          email: application.email,
          phone: application.phone,
          profession: application.profession,
          location: application.location,
          motivation: application.motivation,
          availability: application.availability,
        }
      : {}),
    ...(data?.actor?.displayName ? { fullName: data.actor.displayName } : {}),
  }));
  const sent =
    application?.status === "submitted" ||
    application?.status === "in_review" ||
    application?.status === "approved" ||
    application?.status === "needs_more";

  return (
    <>
      <span className="academy-eyebrow">
        <UserRoundCheck size={15} aria-hidden="true" /> Ready
      </span>
      <h2 className="academy-step-title" tabIndex={-1} ref={headingRef}>
        Course finished. Here is what happens next.
      </h2>
      <p className="academy-lede">
        You have read the lessons, worked through the situations, passed the
        assessment and written a proposal. That is the club’s learning
        requirement met — and it is not membership yet. A person from the
        membership team reads this and comes back to you.
      </p>

      <section className="academy-checklist">
        <h3>Your first month</h3>
        <p className="academy-hint">
          These are the club’s tasks, not the course’s. Nobody ticks them on a
          website.
        </p>
        <ul>
          {FIRST_MONTH_CHECKLIST.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong>
              <span>{task.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <FollowTheClub />

      {sent ? (
        <section className="academy-sent">
          <CircleCheck size={28} aria-hidden="true" />
          <h3>{data?.statusLabel ?? "With the membership team"}</h3>
          <p>
            Sent{" "}
            {application?.submittedAt
              ? new Date(application.submittedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : ""}
            {application?.decidedBy
              ? ` · read by ${application.decidedBy}`
              : ""}
          </p>
          {application?.decisionNote ? (
            <p className="academy-note">{application.decisionNote}</p>
          ) : null}
          {application?.status !== "approved" ? (
            <button
              type="button"
              className="btn btn-secondary btn-md"
              disabled={busy}
              onClick={onWithdraw}
            >
              <RotateCcw aria-hidden="true" /> Withdraw my application
            </button>
          ) : (
            <p>
              Welcome. Someone from the club will be in touch about dues,
              committees and your first project.
            </p>
          )}
        </section>
      ) : (
        <form
          className="academy-application"
          onSubmit={(event) => {
            event.preventDefault();
            onSend();
          }}
        >
          <h3>Tell the membership team about you</h3>
          <div className="academy-field-row">
            {(
              [
                ["fullName", "Full name", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "tel"],
                ["profession", "What you do", "text"],
                ["location", "Where you are based", "text"],
              ] as const
            ).map(([key, label, type]) => (
              <label key={key} className="academy-field">
                <span className="academy-field-label">{label}</span>
                <input
                  type={type}
                  value={draft[key]}
                  autoComplete={
                    key === "fullName"
                      ? "name"
                      : key === "email"
                        ? "email"
                        : key === "phone"
                          ? "tel"
                          : "off"
                  }
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      [key]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>
          <label className="academy-field">
            <span className="academy-field-label">
              Which parts of club life fit your week?
            </span>
            <select
              value={draft.availability}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  availability: event.target.value,
                }))
              }
            >
              <option value="">Choose one…</option>
              {AVAILABILITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="academy-field">
            <span className="academy-field-label">
              Why Menengai, and what would you like to work on?
            </span>
            <span className="academy-hint">
              A real paragraph beats a polished one. Tell them what you would
              turn up for.
            </span>
            <textarea
              rows={6}
              maxLength={2000}
              value={draft.motivation}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  motivation: event.target.value,
                }))
              }
            />
          </label>
          <div className="academy-actions">
            <button
              type="button"
              className="btn btn-secondary btn-md"
              disabled={busy || !signedIn}
              onClick={() => onSaveDraft(draft)}
            >
              Save without sending
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={busy || !signedIn}
            >
              Send to the membership team <Send aria-hidden="true" />
            </button>
          </div>
          {!signedIn ? (
            <p className="academy-hint">
              Sign in above so the club knows who sent this.
            </p>
          ) : null}
        </form>
      )}
    </>
  );
}
