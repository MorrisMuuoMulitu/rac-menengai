/**
 * The membership academy.
 *
 * Six chapters, fourteen lessons, a situation to work through at the end of
 * each chapter, a twenty-eight question assessment and a one-page proposal.
 * Finish all of it and the joining journey unlocks — the club still decides.
 *
 * The page is a view over server state. Nothing is scored here, and nothing
 * is marked complete here; every button posts and waits.
 */

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
import { markTerms, parseInline, toParagraphs } from "../lib/prose";
import { Flashcards } from "../academy/Flashcards";
import { FollowTheClub } from "../academy/FollowTheClub";
import { flashcardsForChapter } from "../../shared/rotaract-academy/flashcards";
import { AccountChip } from "../academy/AccountChip";
import {
  AcademyError,
  answerScenario,
  loadAcademy,
  markLesson,
  saveDraft,
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
  AVAILABILITY_OPTIONS,
  EMPTY_DRAFT,
  FIRST_MONTH_CHECKLIST,
} from "../../shared/rotaract-academy/application";
import {
  PROPOSAL_FIELDS,
  PROPOSAL_MIN_LENGTH,
} from "../../shared/rotaract-academy/proposal";
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
    <p className={`academy-notice ${tone}`} role={tone === "error" ? "alert" : "status"}>
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
            Six chapters, read in order. At the end of each one there is a
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

/** A video that makes no request to YouTube until the learner asks for it. */
function VideoPlate({
  video,
}: {
  video: {
    id: string;
    youtubeId: string;
    title: string;
    why: string;
    reading: { label: string; href: string };
  };
}) {
  const [armed, setArmed] = useState(false);
  return (
    <figure className="academy-video">
      <div className="academy-video-frame">
        {armed ? (
          <iframe
            key={video.id}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1&autoplay=1`}
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
          >
            <span className="academy-video-play" aria-hidden="true">
              <Play size={26} />
            </span>
            <span className="academy-video-load">
              Watch “{video.title}”
              <small>
                Loads from YouTube. Nothing is requested from them until you
                press play.
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
  const unlocked = (target: number) => target <= resumeIndex;

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
    headingRef.current?.focus();
  }, [slug]);

  /*
   * The rail is twenty-four rows tall. Showing only the chapter you are in
   * turns that into something you can read at a glance, and the chapter
   * headings become the switcher.
   */
  const [openRail, setOpenRail] = useState<string[]>([]);
  const currentChapterId =
    data?.course?.chapters.find((item) =>
      item.lessons.some(
        (lesson) =>
          step?.kind === "lesson" && step.lessonId === lesson.id,
      ) || (step?.kind === "scenario" && step.chapterId === item.id),
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
          description="The Rotaract Club of Menengai’s membership course: six chapters, fourteen lessons, a situation to work through and a one-page proposal."
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
  if (!step || index > resumeIndex)
    return <Navigate to={`/membership/academy/${steps[resumeIndex] ? stepSlug(steps[resumeIndex]) : ""}`} replace />;

  const summary = data?.summary;
  const signedIn = Boolean(data?.signedIn);
  const record = data?.record;

  return (
    <>
      <PageMeta
        title="Membership academy"
        description="Six chapters on Rotaract, service and leadership, finished with a practical proposal — the course the Rotaract Club of Menengai asks members to complete."
      />

      <header className="lesson-bar">
        <div className="container lesson-bar-inner">
          <div className="lesson-bar-row">
            <Link className="lesson-bar-back" to="/membership/academy">
              <ArrowLeft size={15} aria-hidden="true" /> Course
            </Link>
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
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="lesson-nav"
                disabled={index >= resumeIndex}
                onClick={() => go(steps[index + 1])}
                aria-label="Next step"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
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
        </div>
      </header>

      {!signedIn ? (
        <section className="academy-signin">
          <div className="container academy-signin-inner">
            <div>
              <h2>Read it now. Keep it when you sign in.</h2>
              <p>
                Every lesson, situation and video on this page is open. An
                account is what makes it yours: your place is saved, your
                answers are marked on the club’s server, and finishing the
                course unlocks the joining steps.
              </p>
              <ul className="academy-signin-list">
                <li>
                  <Check size={16} aria-hidden="true" /> Progress saved on any
                  device you sign in from
                </li>
                <li>
                  <Check size={16} aria-hidden="true" /> Assessment marked by
                  the club, not by your browser
                </li>
                <li>
                  <Check size={16} aria-hidden="true" /> Your proposal reaches
                  the membership team
                </li>
              </ul>
            </div>
            <div className="academy-signin-action">
              {!account.ready ? (
                <p className="academy-hint" role="status">
                  Checking how to sign you in…
                </p>
              ) : account.available ? (
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
                    I already have one
                  </Link>
                </>
              ) : (
                <p className="academy-hint">
                  Sign-in is not switched on for this deployment yet. Ask the
                  membership team for the passcode course, or come to a
                  fellowship and they will walk you through this one.
                </p>
              )}
              <p className="academy-hint">
                We ask for a name and an email address. Nothing else, and
                nothing shared with anyone outside the club.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {error ? (
        <div className="container academy-error-bar">
          <Notice>{error}</Notice>
        </div>
      ) : null}

      <div className="container academy-layout">
        {/* ------------------------------------------------ contents rail -- */}
        <nav className="academy-rail" aria-label="Course contents">
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
                  <ul id={`rail-${item.id}`} hidden={!openRail.includes(item.id)}>
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
                            <span className="academy-rail-mark" aria-hidden="true">
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
                            steps.findIndex(
                              (candidate) =>
                                candidate.kind === "scenario" &&
                                candidate.chapterId === item.id,
                            ) > resumeIndex
                          }
                        >
                          <span className="academy-rail-mark" aria-hidden="true">
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
                <span aria-hidden="true">07</span>Finish
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
                        disabled={stepIndex > resumeIndex}
                        onClick={() => {
                          if (stepIndex <= resumeIndex) go(steps[stepIndex]);
                        }}
                      >
                        <span className="academy-rail-mark" aria-hidden="true">
                          {done ? (
                            <Check size={13} />
                          ) : stepIndex > resumeIndex ? (
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
              <h2 className="academy-step-title" tabIndex={-1} ref={headingRef}>
                {lesson.title}
              </h2>
              <p className="academy-lede">{lesson.summary}</p>

              {/* A chapter's films belong to the chapter, so they open it
                  rather than reappearing on every lesson inside it. */}
              {chapter?.videos.length &&
              chapter.lessons[0]?.id === lesson.id ? (
                <div className="academy-videos">
                  {chapter.videos.map((video) => (
                    <VideoPlate key={video.id} video={video} />
                  ))}
                </div>
              ) : null}

              <section className="academy-objectives">
                <h3>By the end of this lesson</h3>
                <ul>
                  {lessonBody.objectives.map((objective) => (
                    <li key={objective}>{objective}</li>
                  ))}
                </ul>
              </section>

              <div className="academy-prose">
                {(() => {
                  /*
                   * Split the lesson's paragraphs, then mark Rotary's own
                   * vocabulary once per lesson. Doing it across the whole
                   * lesson is what keeps the page from becoming a wall of
                   * bold: each term is picked out at its first mention only.
                   */
                  const prose = markTerms(
                    lessonBody.blocks
                      .filter((block) => block.kind === "p")
                      .flatMap((block) => toParagraphs(block.text ?? "", 2)),
                  );
                  let paragraphIndex = 0;
                  return lessonBody.blocks.map((block, blockIndex) =>
                    block.kind === "p" ? (
                      <Fragment key={blockIndex}>
                        {toParagraphs(block.text ?? "", 2).map(() => {
                          const marked = prose[paragraphIndex++] ?? "";
                          return (
                            <p key={marked}>
                              {parseInline(marked).map((piece, pieceIndex) =>
                                piece.strong ? (
                                  <strong key={pieceIndex}>{piece.text}</strong>
                                ) : (
                                  <Fragment key={pieceIndex}>
                                    {piece.text}
                                  </Fragment>
                                ),
                              )}
                            </p>
                          );
                        })}
                      </Fragment>
                  ) : block.kind === "note" ? (
                    <aside className="academy-note" key={blockIndex}>
                      {block.text}
                    </aside>
                  ) : (
                    <ul key={blockIndex}>
                      {block.items?.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  ),
                  );
                })()}
              </div>

              <section className="academy-activity">
                <h3>
                  <Sparkles size={17} aria-hidden="true" /> Put it into practice
                </h3>
                <p>{lessonBody.activity}</p>
                <p className="academy-hint">
                  Write it, say it out loud, or bring it to a fellowship.
                  Nothing is submitted from this box.
                </p>
              </section>

              {/* One deck per chapter, as a recap before the chapter's check. */}
              {chapter &&
              chapter.lessons[chapter.lessons.length - 1]?.id === lesson.id ? (
                <Flashcards
                  cards={flashcardsForChapter(chapter.id)}
                  chapterTitle={chapter.title}
                />
              ) : null}

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
                    !signedIn ||
                    Boolean(record?.completedLessons.includes(lesson.id))
                  }
                  onClick={() =>
                    void run(
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
                  {record?.completedLessons.includes(lesson.id) ? (
                    <>
                      <Check aria-hidden="true" /> Finished
                    </>
                  ) : (
                    <>
                      Mark finished <ArrowRight aria-hidden="true" />
                    </>
                  )}
                </button>
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
                    if (next.correct) go(steps[Math.min(index + 1, steps.length - 1)]);
                  },
                )
              }
            />
          ) : null}

          {step?.kind === "assessment" ? (
            <AssessmentStep
              key="assessment"
              course={course}
              busy={busy}
              signedIn={signedIn}
              headingRef={headingRef}
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
                    if (next.passed) go(steps[Math.min(index + 1, steps.length - 1)]);
                  },
                )
              }
            />
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
                  (token) => saveDraft(token, draft),
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
  busy,
  signedIn,
  headingRef,
  onAnswer,
}: {
  scenario: {
    id: string;
    situation: string;
    prompt: string;
    options: { id: string; text: string }[];
  };
  busy: boolean;
  signedIn: boolean;
  headingRef: React.RefObject<HTMLHeadingElement>;
  onAnswer: (optionId: string) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <>
      <span className="academy-eyebrow">
        <Sparkles size={15} aria-hidden="true" /> In your shoes
      </span>
      <h2 className="academy-step-title" tabIndex={-1} ref={headingRef}>
        {scenario.prompt}
      </h2>
      <p className="academy-lede">{scenario.situation}</p>
      <fieldset className="academy-choices" disabled={busy || !signedIn}>
        <legend className="academy-hint">
          Pick what you would actually do. There is one answer the club can
          stand behind, and you will see the reasoning either way.
        </legend>
        {scenario.options.map((option) => (
          <label
            key={option.id}
            className={`academy-choice${picked === option.id ? " is-picked" : ""}`}
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
        disabled={!picked || busy || !signedIn}
        onClick={() => picked && onAnswer(picked)}
      >
        Commit to this answer <ArrowRight aria-hidden="true" />
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

function AssessmentStep({
  course,
  busy,
  signedIn,
  headingRef,
  onSubmit,
}: {
  course: NonNullable<AcademyBootstrap["course"]>;
  busy: boolean;
  signedIn: boolean;
  headingRef: React.RefObject<HTMLHeadingElement>;
  onSubmit: (answers: (number | null)[]) => void;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    course.questions.map(() => null),
  );
  const [result, setResult] = useState<GradedResponse | null>(null);

  return (
    <>
      <span className="academy-eyebrow">
        <BadgeCheck size={15} aria-hidden="true" /> Final check
      </span>
      <h2 className="academy-step-title" tabIndex={-1} ref={headingRef}>
        What stayed with you
      </h2>
      <p className="academy-lede">
        {course.questions.length} questions. You need {course.passMark} right.
        Every answer is in the lessons you have just read, and you can sit it
        again as often as you like — the club records your best score.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(answers);
        }}
      >
        <ol className="academy-exam">
          {course.questions.map((question, questionIndex) => {
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
                        onChange={() =>
                          setAnswers((previous) =>
                            previous.map((value, position) =>
                              position === questionIndex ? optionIndex : value,
                            ),
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                  {result ? (
                    <p className="academy-exam-feedback">
                      {verdict ? <Check size={15} aria-hidden="true" /> : null}
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
        <div className="academy-actions">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={busy || !signedIn}
          >
            {result ? "Send again" : "Send my answers"}{" "}
            <Send aria-hidden="true" />
          </button>
          {answers.filter((answer) => answer !== null).length <
          course.questions.length ? (
            <p className="academy-hint">
              {answers.filter((answer) => answer !== null).length} of{" "}
              {course.questions.length} answered — anything you leave out
              counts as wrong.
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
