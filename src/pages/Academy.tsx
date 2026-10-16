/**
 * The academy dashboard.
 *
 * This is what a learner meets first: where they are, what is left, and one
 * obvious button to carry on. The course used to open on its own syllabus,
 * which meant a new person had to read the whole thing to find the start.
 *
 * The full syllabus is still here — inside the chapter cards, in order, with
 * the lesson states — so nothing was lost by moving it.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BadgeCheck,
  BookOpen,
  ChevronDown,
  Clock,
  Loader2,
  Lock,
  Play,
  Sparkles,
} from "lucide-react";
import { PageMeta } from "../components/ui";
import { useAccount } from "../academy/account";
import { AccountChip } from "../academy/AccountChip";
import {
  chapterSummaries,
  courseSteps,
  resumeSlug,
  stepIsDone,
  stepSlug,
  type Step,
} from "../academy/steps";
import {
  AcademyError,
  loadAcademy,
  type AcademyBootstrap,
} from "../lib/academy";
import { CHAPTERS, COURSE_INFO } from "../course-info";
import "../academy.css";

/** Badges are derived from the record, never stored twice. */
function badges(data: AcademyBootstrap | null, chapters: ReturnType<typeof chapterSummaries>) {
  const record = data?.record;
  const summary = data?.summary;
  if (!record || !summary) return [];
  return [
    {
      id: "started",
      label: "First step",
      detail: "You have started the course.",
      earned: record.completedLessons.length > 0,
      Icon: Play,
    },
    {
      id: "chapter",
      label: "Chapter complete",
      detail: "You finished a whole chapter and its check.",
      earned: chapters.some((chapter) => chapter.complete),
      Icon: BadgeCheck,
    },
    {
      id: "halfway",
      label: "Halfway",
      detail: "Half the course is behind you.",
      earned: summary.percent >= 50,
      Icon: Sparkles,
    },
    {
      id: "assessment",
      label: "Assessed",
      detail: `You passed the ${COURSE_INFO.questionCount}-question assessment.`,
      earned: summary.assessmentPassed,
      Icon: Award,
    },
    {
      id: "proposal",
      label: "Planner",
      detail: "You wrote a one-page service proposal.",
      earned: summary.proposalSubmitted,
      Icon: BookOpen,
    },
    {
      id: "finished",
      label: "Course complete",
      detail: "Everything is done and the joining steps are open.",
      earned: summary.canApply,
      Icon: BadgeCheck,
    },
  ];
}

export default function AcademyPage() {
  const account = useAccount();
  const [data, setData] = useState<AcademyBootstrap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openChapter, setOpenChapter] = useState<string | null>(null);

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

  const course = data?.course;
  const chapters = useMemo(() => chapterSummaries(course, data), [course, data]);
  const steps = useMemo(() => courseSteps(course), [course]);
  const resume = resumeSlug(course, data);
  const summary = data?.summary;
  const earned = badges(data, chapters);

  /* Open the chapter the learner is in, so the page explains itself. */
  const currentChapter = chapters.find((chapter) => chapter.current)?.id ?? null;
  useEffect(() => {
    if (currentChapter) setOpenChapter((open) => open ?? currentChapter);
  }, [currentChapter]);

  const toggle = useCallback((id: string) => {
    setOpenChapter((open) => (open === id ? null : id));
  }, []);

  if (loading)
    return (
      <>
        <PageMeta
          title="Membership academy"
          description="The Rotaract Club of Menengai’s membership course."
        />
        <div className="academy-loading" role="status">
          <Loader2 className="academy-spin" aria-hidden="true" />
          <p>Opening your course…</p>
        </div>
      </>
    );

  if (!course)
    return (
      <>
        <PageMeta
          title="Membership academy"
          description="The membership course is unavailable right now."
        />
        <section className="section academy-narrow">
          <div className="container">
            <h1 className="academy-h1">The course is not open yet</h1>
            <p className="academy-notice info">
              {error || "The club has not published the course here yet."}
            </p>
            <p>
              While it is being set up you can read{" "}
              <Link to="/learn">how Rotaract works</Link>, or{" "}
              <Link to="/membership">start with a visit</Link>.
            </p>
          </div>
        </section>
      </>
    );

  const signedIn = Boolean(data?.signedIn);
  const percent = summary?.percent ?? 0;

  return (
    <>
      <PageMeta
        title="Membership academy"
        description="Six chapters and fifteen lessons on Rotaract, service and leadership, with a situation to work through in every chapter and a one-page proposal at the end."
      />

      <header className="dashboard-hero">
        <div className="container dashboard-hero-inner">
          <div className="dashboard-hero-copy">
            <span className="academy-eyebrow">
              <BookOpen size={15} aria-hidden="true" /> Menengai learning
            </span>
            <h1>
              {signedIn && data?.actor?.displayName
                ? `Welcome back, ${data.actor.displayName.split(" ")[0]}`
                : "The membership course"}
            </h1>
            <p>
              {signedIn
                ? percent === 0
                  ? "You have not started yet. Chapter one takes about ten minutes."
                  : percent === 100
                    ? "Every lesson, check and the proposal are done. The joining steps are open below."
                    : `You are ${percent}% of the way through. Pick up where you left off — the next step takes a few minutes.`
                : "Fifteen lessons across six chapters, a situation to work through in each one, and a one-page proposal at the end. Read it without an account; sign in to keep your place."}
            </p>

            <div className="dashboard-actions">
              {signedIn ? (
                <Link
                  className="btn btn-primary btn-lg"
                  to={`/membership/academy/${resume}`}
                >
                  <Play size={16} aria-hidden="true" />
                  {percent === 0
                    ? "Start chapter one"
                    : percent === 100
                      ? "Review the course"
                      : "Continue where I left off"}
                </Link>
              ) : (
                <>
                  <Link
                    className="btn btn-primary btn-lg"
                    to="/membership/register"
                  >
                    Create an account
                  </Link>
                  <Link className="btn btn-secondary btn-md" to="/membership/sign-in">
                    I already have one
                  </Link>
                </>
              )}
              <Link className="btn btn-secondary btn-md" to="/membership">
                How to join the club
              </Link>
            </div>
          </div>

          <aside className="dashboard-progress" aria-label="Your progress">
            {signedIn ? <AccountChip /> : null}
            <div
              className="dashboard-ring"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={summary?.total ?? 0}
              aria-valuenow={summary?.completed ?? 0}
              aria-valuetext={`${summary?.completed ?? 0} of ${summary?.total ?? 0} steps complete`}
              style={{ ["--done" as string]: `${percent}%` }}
            >
              <span className="dashboard-ring-value">{percent}%</span>
              <span className="dashboard-ring-label">complete</span>
            </div>
            <dl className="dashboard-stats">
              <div>
                <dt>Steps done</dt>
                <dd>
                  {summary?.completed ?? 0} of {summary?.total ?? steps.length}
                </dd>
              </div>
              <div>
                <dt>Chapters</dt>
                <dd>
                  {chapters.filter((chapter) => chapter.complete).length} of{" "}
                  {chapters.length}
                </dd>
              </div>
              <div>
                <dt>Course time</dt>
                <dd>{COURSE_INFO.minutes} minutes</dd>
              </div>
            </dl>
            {data?.actor?.reviewer ? (
              <Link className="academy-review-link" to="/membership/queue">
                Review applications
              </Link>
            ) : null}
          </aside>
        </div>
      </header>

      <section className="section dashboard-path">
        <div className="container">
          <div className="section-head-block">
            <span className="eyebrow">The learning path</span>
            <h2 className="sec-title">Six chapters, in order</h2>
            <p className="section-lead">
              Each chapter ends with a situation to work through. Finish all six,
              pass the {COURSE_INFO.questionCount}-question assessment, write
              your proposal, and the joining steps open.
            </p>
          </div>

          <ol className="chapter-cards">
            {chapters.map((chapter, index) => {
              const full = course.chapters.find((item) => item.id === chapter.id);
              const open = openChapter === chapter.id;
              const state = chapter.complete
                ? "done"
                : chapter.current
                  ? "current"
                  : chapter.lessonsDone > 0
                    ? "started"
                    : "upcoming";
              return (
                <li
                  key={chapter.id}
                  className={`chapter-card is-${state}${open ? " is-open" : ""}`}
                >
                  <h3 className="chapter-card-head">
                    <button
                      type="button"
                      className="chapter-card-toggle"
                      aria-expanded={open}
                      aria-controls={`chapter-${chapter.id}`}
                      onClick={() => toggle(chapter.id)}
                    >
                      <span className="chapter-card-no" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="chapter-card-title">
                        <strong>{chapter.title}</strong>
                        <small>{chapter.description}</small>
                      </span>
                      <span className="chapter-card-meta">
                        <span className="chapter-card-state">
                          {chapter.complete ? (
                            <>
                              <BadgeCheck size={15} aria-hidden="true" /> Done
                            </>
                          ) : state === "upcoming" ? (
                            <>
                              <Lock size={13} aria-hidden="true" /> Not started
                            </>
                          ) : (
                            `${chapter.lessonsDone}/${chapter.lessonsTotal} lessons`
                          )}
                        </span>
                        <span className="chapter-card-time">
                          <Clock size={14} aria-hidden="true" />
                          {chapter.minutes} min
                        </span>
                        <ChevronDown
                          size={18}
                          aria-hidden="true"
                          className="chapter-card-chevron"
                        />
                      </span>
                    </button>
                  </h3>

                  {open ? (
                    <div className="chapter-card-body" id={`chapter-${chapter.id}`}>
                      <p className="chapter-card-objectives">
                        <strong>By the end of this chapter</strong>{" "}
                        {full?.lessons
                          .map((lesson) => lesson.title.toLowerCase())
                          .join(", ")}
                        .
                      </p>
                      <ol className="chapter-lessons">
                        {full?.lessons.map((lesson) => {
                          const done = Boolean(
                            data?.record?.completedLessons.includes(lesson.id),
                          );
                          const current =
                            stepSlug({
                              kind: "lesson",
                              lessonId: lesson.id,
                            }) === resume;
                          const reachable = done || current;
                          return (
                            <li key={lesson.id}>
                              {reachable ? (
                                <Link
                                  className={`chapter-lesson${done ? " is-done" : ""}${current ? " is-current" : ""}`}
                                  to={`/membership/academy/${lesson.id}`}
                                >
                                  <span className="chapter-lesson-mark" aria-hidden="true">
                                    {done ? <BadgeCheck size={15} /> : index + 1}
                                  </span>
                                  <span className="chapter-lesson-body">
                                    <strong>{lesson.title}</strong>
                                    <small>{lesson.summary}</small>
                                  </span>
                                  <span className="chapter-lesson-time">
                                    {lesson.minutes} min
                                  </span>
                                </Link>
                              ) : (
                                <span className="chapter-lesson is-locked">
                                  <span className="chapter-lesson-mark" aria-hidden="true">
                                    <Lock size={13} />
                                  </span>
                                  <span className="chapter-lesson-body">
                                    <strong>{lesson.title}</strong>
                                    <small>{lesson.summary}</small>
                                  </span>
                                  <span className="chapter-lesson-time">
                                    {lesson.minutes} min
                                  </span>
                                </span>
                              )}
                            </li>
                          );
                        })}
                        {full?.scenario ? (
                          <li>
                            <Link
                              className="chapter-lesson chapter-lesson-check"
                              to={`/membership/academy/check-${chapter.id}`}
                            >
                              <span className="chapter-lesson-mark" aria-hidden="true">
                                <Sparkles size={13} />
                              </span>
                              <span className="chapter-lesson-body">
                                <strong>In your shoes</strong>
                                <small>{full.scenario.prompt}</small>
                              </span>
                              <span className="chapter-lesson-time">
                                {chapter.scenarioDone ? "Done" : "Discussion"}
                              </span>
                            </Link>
                          </li>
                        ) : null}
                      </ol>
                      <p className="chapter-card-foot">
                        <Link
                          className="btn btn-secondary btn-sm"
                          to={`/membership/academy/${chapter.entrySlug}`}
                        >
                          {chapter.complete
                            ? "Revisit this chapter"
                            : chapter.lessonsDone > 0
                              ? "Continue this chapter"
                              : "Open this chapter"}
                        </Link>
                      </p>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section section-tint dashboard-finish">
        <div className="container">
          <div className="section-head-block">
            <span className="eyebrow">At the end</span>
            <h2 className="sec-title">Assessment, proposal, and joining</h2>
          </div>
          <ol className="finish-cards">
            {(
              [
                {
                  slug: "assessment",
                  title: "The assessment",
                  detail: `${COURSE_INFO.questionCount} questions, marked on the club’s server. ${COURSE_INFO.passMark} correct to pass, and you can sit it again.`,
                  Icon: Award,
                  step: { kind: "assessment" } as Step,
                },
                {
                  slug: "proposal",
                  title: "Your first proposal",
                  detail:
                    "One page the club can act on: the need, the host, roles, resources, risks and how you will follow up.",
                  Icon: BookOpen,
                  step: { kind: "proposal" } as Step,
                },
                {
                  slug: "join",
                  title: "Joining the club",
                  detail:
                    "Your first month, the dues, and the application the membership team reads.",
                  Icon: BadgeCheck,
                  step: { kind: "join" } as Step,
                },
              ] as const
            ).map((item) => {
              const done = stepIsDone(item.step, data);
              return (
                <li key={item.slug} className={done ? "is-done" : ""}>
                  <span className="finish-card-icon" aria-hidden="true">
                    <item.Icon size={20} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                  {done ? (
                    <Link
                      className="btn btn-secondary btn-sm"
                      to={`/membership/academy/${item.slug}`}
                    >
                      <BadgeCheck size={15} aria-hidden="true" /> Done — review
                    </Link>
                  ) : (
                    <Link
                      className="btn btn-secondary btn-sm"
                      to={`/membership/academy/${item.slug}`}
                    >
                      Open
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {signedIn ? (
        <section className="section dashboard-badges">
          <div className="container">
            <div className="section-head-block">
              <span className="eyebrow">Your record</span>
              <h2 className="sec-title">What you have done so far</h2>
              <p className="section-lead">
                Kept against your account on the club’s server, not in this
                browser. These are the club’s own markers, not a Rotary
                qualification.
              </p>
            </div>
            <ul className="badge-grid">
              {earned.map(({ id, label, detail, earned: has, Icon }) => (
                <li key={id} className={has ? "is-earned" : ""}>
                  <span className="badge-icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <strong>{label}</strong>
                  <small>{detail}</small>
                  <span className="badge-state">
                    {has ? "Earned" : "Not yet"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section dashboard-syllabus">
        <div className="container">
          <div className="section-head-block">
            <span className="eyebrow">Everything on the course</span>
            <h2 className="sec-title">The full syllabus</h2>
          </div>
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
        </div>
      </section>
    </>
  );
}
