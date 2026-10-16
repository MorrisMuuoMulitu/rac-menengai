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

/**
 * What a learner can do after each chapter, in their own words.
 *
 * The dashboard used to repeat the lesson titles as the chapter outcome, which
 * tells you what the chapter is about but not what you will be able to do.
 */
const CHAPTER_OUTCOMES: Record<string, string> = {
  discover:
    "Explain what Rotaract is, who can join, and where it sits in Rotary.",
  club: "Describe how Menengai runs, who does what, and what membership asks of you.",
  protocols:
    "Walk into any Rotary room, follow what is happening, and take part accurately.",
  integrity: "Test a real decision against the Four-Way Test and say why it holds.",
  service:
    "Plan a project from a community’s stated need through to how you will follow it up.",
  lead: "Delegate clearly, handle a disagreement, and tell the story without overclaiming.",
  begin: "Hand the membership team a one-page proposal they can actually decide on.",
};

interface ChapterLesson {
  id: string;
  title: string;
  summary: string;
  minutes: number;
}

/**
 * The course outline, without needing the API.
 *
 * The dashboard has to render something real before the course arrives —
 * otherwise the page is an empty shell for a crawler, and a spinner for anyone
 * on a slow connection. The syllabus is static, so use it.
 */
function staticLessons(chapterId: string): ChapterLesson[] {
  const chapter = CHAPTERS.find((item) => item.id === chapterId);
  if (!chapter) return [];
  return chapter.lessons
    .map((id) => COURSE_INFO.lessons.find((lesson) => lesson.id === id))
    .filter((lesson): lesson is (typeof COURSE_INFO.lessons)[number] =>
      Boolean(lesson),
    )
    .map((lesson) => ({ ...lesson }));
}

function staticChapters() {
  return CHAPTERS.map((chapter) => {
    const lessons = staticLessons(chapter.id);
    return {
      id: chapter.id,
      title: chapter.title,
      description: chapter.description,
      minutes: lessons.reduce((total, lesson) => total + lesson.minutes, 0),
      lessonsTotal: lessons.length,
      lessonsDone: 0,
      scenarioDone: false,
      complete: false,
      current: false,
      entrySlug: lessons[0]?.id ?? "",
    };
  });
}

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
  /* Falls back to the static outline until the course arrives. */
  const chapters = useMemo(
    () => (course ? chapterSummaries(course, data) : staticChapters()),
    [course, data],
  );
  const steps = useMemo(() => courseSteps(course), [course]);
  const resume = course ? resumeSlug(course, data) : (COURSE_INFO.lessons[0]?.id ?? "");
  const summary = data?.summary;
  const earned = badges(data, chapters);
  const lessonsFor = useCallback(
    (chapterId: string): ChapterLesson[] =>
      course?.chapters.find((item) => item.id === chapterId)?.lessons ?? staticLessons(chapterId),
    [course],
  );

  /* Open the chapter the learner is in, so the page explains itself. */
  const currentChapter = chapters.find((chapter) => chapter.current)?.id ?? null;
  useEffect(() => {
    if (currentChapter) setOpenChapter((open) => open ?? currentChapter);
  }, [currentChapter]);

  const toggle = useCallback((id: string) => {
    setOpenChapter((open) => (open === id ? null : id));
  }, []);

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
            {loading ? (
              <p className="dashboard-status" role="status">
                <Loader2 className="academy-spin" size={15} aria-hidden="true" />{" "}
                Opening your progress…
              </p>
            ) : null}
            {!loading && !course ? (
              <p className="academy-notice info">
                {error ||
                  "The interactive course is not open on this deployment yet. The full outline is below."}
              </p>
            ) : null}
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
                  {/* Never "0 of 0" while the course is still loading. */}
                  {summary
                    ? `${summary.completed} of ${summary.total}`
                    : `— of ${COURSE_INFO.lessons.length + CHAPTERS.length + 3}`}
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
              const lessons = lessonsFor(chapter.id);
              const scenario = course?.chapters.find(
                (item) => item.id === chapter.id,
              )?.scenario;
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
                        <strong>By the end of this chapter you can</strong>{" "}
                        {CHAPTER_OUTCOMES[chapter.id] ??
                          "work through the lessons below"}
                      </p>
                      <ol className="chapter-lessons">
                        {lessons.map((lesson) => {
                          const done = Boolean(
                            data?.record?.completedLessons.includes(lesson.id),
                          );
                          const current =
                            stepSlug({
                              kind: "lesson",
                              lessonId: lesson.id,
                            }) === resume;
                          /*
                           * Guests are promised they can read the course, so
                           * nothing is locked to them. Signed in, the course
                           * unlocks in order and everything finished stays
                           * open to revisit.
                           */
                          const reachable = !signedIn || done || current;
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
                        {/* Every chapter has a situation, so the outline shows
                            the row even before the course loads. */}
                        {scenario || !course ? (
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
                                <small>
                                  {scenario?.prompt ??
                                    "A situation to work through at the end of this chapter."}
                                </small>
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

      {/*
        * The curriculum used to be printed in full on the dashboard as well as
        * inside the chapter cards — the same information twice. It stays, but
        * closed, behind a summary a learner can open when they want the whole
        * picture.
        */}
      <section className="section dashboard-syllabus">
        <div className="container">
          <details className="curriculum-panel">
            <summary>
              <span className="eyebrow">Everything on the course</span>
              <strong>View the full curriculum</strong>
              <span className="curriculum-panel-meta">
                {CHAPTERS.length} chapters · {COURSE_INFO.lessons.length} lessons ·{" "}
                {COURSE_INFO.minutes} minutes
              </span>
            </summary>
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
          </details>
        </div>
      </section>
    </>
  );
}
