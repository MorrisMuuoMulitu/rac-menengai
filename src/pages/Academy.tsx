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
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Lightbulb,
  ListChecks,
  Loader2,
  Lock,
  Play,
  Route,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { PageMeta } from "../components/ui";
import { useAccount } from "../academy/account";
import { AccountChip } from "../academy/AccountChip";
import { CertificateDownloadButton } from "../academy/CertificateDownloadButton";
import { LearnerProfileSetup } from "../academy/LearnerProfileSetup";
import { VideoThumbnail } from "../academy/VideoThumbnail";
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
  saveOwnLearnerProfile,
  type AcademyBootstrap,
} from "../lib/academy";
import { CHAPTERS, COURSE_INFO } from "../course-info";
import { COURSE_VIDEOS } from "../../shared/rotaract-academy/videos";
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
  integrity:
    "Test a real decision against the Four-Way Test and say why it holds.",
  service:
    "Plan a project from a community’s stated need through to how you will follow it up.",
  lead: "Delegate clearly, handle a disagreement, and tell the story without overclaiming.",
  begin:
    "Hand the membership team a one-page proposal they can actually decide on.",
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
function badges(
  data: AcademyBootstrap | null,
  chapters: ReturnType<typeof chapterSummaries>,
) {
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
  const [profileBusy, setProfileBusy] = useState(false);

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
  const resume = course
    ? resumeSlug(course, data)
    : (COURSE_INFO.lessons[0]?.id ?? "");
  const summary = data?.summary;
  const record = data?.record;
  const earned = badges(data, chapters);
  const lessonsFor = useCallback(
    (chapterId: string): ChapterLesson[] =>
      course?.chapters.find((item) => item.id === chapterId)?.lessons ??
      staticLessons(chapterId),
    [course],
  );

  /* Open the chapter the learner is in, so the page explains itself. */
  const currentChapterId =
    chapters.find((chapter) => chapter.current)?.id ?? null;
  useEffect(() => {
    if (currentChapterId) setOpenChapter((open) => open ?? currentChapterId);
  }, [currentChapterId]);

  const toggle = useCallback((id: string) => {
    setOpenChapter((open) => (open === id ? null : id));
  }, []);

  const signedIn = Boolean(data?.signedIn);
  const percent = summary?.percent ?? 0;
  const completedChapters = chapters.filter(
    (chapter) => chapter.complete,
  ).length;
  const currentChapter =
    chapters.find((chapter) => chapter.current) ??
    (percent < 100 ? (chapters[0] ?? null) : null);
  const currentChapterIndex = currentChapter
    ? Math.max(
        0,
        chapters.findIndex((chapter) => chapter.id === currentChapter.id),
      )
    : 0;
  const resumeStep = steps.find((step) => stepSlug(step) === resume);
  const resumeLesson = COURSE_INFO.lessons.find(
    (courseLesson) =>
      courseLesson.id ===
      (resumeStep?.kind === "lesson" ? resumeStep.lessonId : resume),
  );
  const resumeChapter =
    resumeStep?.kind === "scenario"
      ? course?.chapters.find((chapter) => chapter.id === resumeStep.chapterId)
      : undefined;
  const nextTitle =
    resumeLesson?.title ??
    (resumeStep?.kind === "scenario"
      ? `In your shoes: ${resumeChapter?.title ?? "chapter practice"}`
      : resumeStep?.kind === "assessment"
        ? "Your final assessment"
        : resumeStep?.kind === "proposal"
          ? "Your first service proposal"
          : resumeStep?.kind === "join"
            ? "Contact the membership team (optional)"
            : (COURSE_INFO.lessons[0]?.title ?? "The membership course"));
  const nextSummary =
    resumeLesson?.summary ??
    (resumeStep?.kind === "assessment"
      ? `${COURSE_INFO.questionCount} questions, with ${COURSE_INFO.passMark} needed to pass.`
      : resumeStep?.kind === "proposal"
        ? "Turn the course into one practical page the club can act on."
        : resumeStep?.kind === "join"
          ? "Your first month, club dues and the application the membership team reads."
          : "Work through the situation before moving to the next part of the course.");
  const nextMeta = resumeLesson
    ? `${resumeLesson.minutes} min next`
    : resumeStep?.kind === "assessment"
      ? `${COURSE_INFO.questionCount} questions`
      : "Final step";
  const featuredVideo =
    COURSE_VIDEOS.find((video) => video.chapterId === currentChapter?.id) ??
    COURSE_VIDEOS[0];
  const learnerName = data?.actor?.displayName?.split(" ")[0];
  const profileNeeded = Boolean(
    signedIn && data?.profile && !data.profile.complete,
  );

  const saveProfile = async (phone: string, officialName: string) => {
    setProfileBusy(true);
    setError("");
    try {
      const next = await saveOwnLearnerProfile(
        await account.token(),
        phone,
        officialName,
      );
      setData((previous) =>
        previous
          ? {
              ...previous,
              record: next.record,
              profile: next.profile,
            }
          : previous,
      );
    } catch (cause) {
      setError(
        cause instanceof AcademyError
          ? cause.message
          : "Your learner details could not be saved.",
      );
    } finally {
      setProfileBusy(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Membership academy"
        description="Seven chapters and twenty lessons on Rotaract, club leadership and service, with practice activities and a personal service proposal."
      />

      <header className="dashboard-hero study-hero">
        <div className="study-hero-watermark" aria-hidden="true">
          Learn
        </div>
        <div className="container dashboard-hero-inner">
          <div className="dashboard-hero-copy">
            <span className="academy-eyebrow">
              <Route size={15} aria-hidden="true" /> The Menengai course
            </span>
            <h1>
              {signedIn && learnerName
                ? `${learnerName}, take the next step.`
                : "Learn the club. Then help run it."}
            </h1>
            <p>
              {signedIn
                ? percent === 0
                  ? "Your route starts with the people and purpose behind Rotaract. The first chapter takes about ten minutes."
                  : percent === 100
                    ? "You have completed the course route. Download your certificate, or contact the membership team only if you need to."
                    : `You are ${percent}% through the course. ${completedChapters} of ${chapters.length} chapters are complete, and your place is saved.`
                : "A practical course in Rotaract, club life, meetings and service. Read at your pace now, then create an account when you want the club to keep your progress."}
            </p>

            <div className="dashboard-actions">
              {signedIn ? (
                profileNeeded ? (
                  <a
                    className="btn btn-primary btn-lg"
                    href="#learner-profile-setup"
                  >
                    <UserRoundCheck size={16} aria-hidden="true" />
                    Set up learner record
                  </a>
                ) : (
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
                )
              ) : (
                <>
                  <Link
                    className="btn btn-primary btn-lg"
                    to="/membership/academy/roots"
                  >
                    Explore the first lesson
                  </Link>
                  <Link
                    className="btn btn-secondary btn-md"
                    to="/membership/register"
                  >
                    Create an account
                  </Link>
                </>
              )}
              {signedIn && summary?.assessmentPassed ? (
                <Link
                  className="btn btn-secondary btn-md"
                  to="/membership/academy/assessment#certificate"
                >
                  <Award size={16} aria-hidden="true" /> View certificate
                </Link>
              ) : null}
              <Link className="btn btn-secondary btn-md" to="/membership">
                How to join the club
              </Link>
            </div>
            {loading ? (
              <p className="dashboard-status" role="status">
                <Loader2
                  className="academy-spin"
                  size={15}
                  aria-hidden="true"
                />{" "}
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

          <aside className="study-desk" aria-label="Your next study session">
            <div className="study-desk-head">
              <span>{signedIn ? "Your study desk" : "Start here"}</span>
              {signedIn ? <AccountChip tone="light" /> : null}
            </div>

            <Link
              className="study-desk-poster"
              to={`/membership/academy/${resume}`}
              aria-label={`Open ${nextTitle}`}
            >
              <VideoThumbnail
                youtubeId={featuredVideo.youtubeId}
                title={featuredVideo.title}
                priority
              />
              <span className="study-desk-poster-shade" aria-hidden="true" />
              <span className="study-desk-poster-label">
                <Play size={15} aria-hidden="true" />
                Film preview
              </span>
              <span className="study-desk-poster-title">
                {featuredVideo.title}
              </span>
            </Link>

            <div className="study-desk-next">
              <span>
                {currentChapter
                  ? `Chapter ${String(currentChapterIndex + 1).padStart(2, "0")} / ${currentChapter.title}`
                  : "Course complete"}
              </span>
              <strong>{nextTitle}</strong>
              <p>{nextSummary}</p>
            </div>

            <div
              className="study-desk-route"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label="Course completion"
            >
              <div className="study-desk-route-head">
                <span>{percent}% complete</span>
                <span>
                  {completedChapters}/{chapters.length} chapters
                </span>
              </div>
              <div className="study-desk-route-track">
                <span
                  style={
                    { "--study-progress": `${percent}%` } as React.CSSProperties
                  }
                />
                {chapters.map((chapter, index) => (
                  <i
                    key={chapter.id}
                    className={
                      chapter.complete
                        ? "is-done"
                        : chapter.current
                          ? "is-current"
                          : ""
                    }
                    aria-hidden="true"
                    style={
                      {
                        "--route-position": `${(index / Math.max(1, chapters.length - 1)) * 100}%`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            </div>

            <div className="study-desk-foot">
              <span>
                <Clock size={14} aria-hidden="true" />
                {nextMeta}
              </span>
              <Link to={`/membership/academy/${resume}`}>
                {percent === 100
                  ? "Review"
                  : percent > 0
                    ? "Continue"
                    : "Begin"}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>

        {data?.actor?.reviewer ? (
          <div className="container study-hero-admin">
            <span>Club desk</span>
            <Link to="/membership/queue">Applications</Link>
            <Link to="/membership/learners">Learners</Link>
            <Link to="/membership/enquiries">Enquiries</Link>
          </div>
        ) : null}
      </header>

      {data?.profile ? (
        <LearnerProfileSetup
          profile={data.profile}
          busy={profileBusy}
          onSave={(phone, officialName) =>
            void saveProfile(phone, officialName)
          }
        />
      ) : null}

      {record?.passed &&
      data?.profile?.complete &&
      summary?.stage === "complete" ? (
        <section
          className="certificate-ready-panel"
          aria-labelledby="certificate-ready-title"
        >
          <div className="container certificate-ready-inner">
            <div>
              <span>Course complete</span>
              <h2 id="certificate-ready-title">Your certificate is ready.</h2>
              <p>
                Download it here now, or return to this dashboard whenever you
                need another copy.
              </p>
            </div>
            <div className="certificate-ready-actions">
              <CertificateDownloadButton
                name={
                  record.certificateName ?? data.actor?.displayName ?? "Learner"
                }
                photo={record.certificatePhoto}
                completedAt={
                  record.completedAt ?? record.passedAt ?? record.updatedAt
                }
                score={record.bestScore}
                total={course?.questions.length ?? COURSE_INFO.questionCount}
                certificateNumber={record.certificateNumber}
              />
              <Link
                className="btn btn-secondary btn-md"
                to="/membership/academy/join"
              >
                Contact membership team
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section
        className="academy-study-guide"
        aria-labelledby="study-guide-title"
      >
        <div className="container">
          <div className="academy-study-guide-head">
            <div>
              <span className="eyebrow">The study loop</span>
              <h2 id="study-guide-title">Short sessions. Real practice.</h2>
            </div>
            <p>
              Each lesson follows the same rhythm, so you always know what to do
              next. Nothing asks you to guess whether you have finished.
            </p>
          </div>
          <ol className="academy-study-guide-steps">
            <li>
              <span className="academy-study-guide-icon" aria-hidden="true">
                <BookOpen size={19} />
              </span>
              <div>
                <strong>1. Learn the idea</strong>
                <span>Read the short lesson and the highlighted examples.</span>
              </div>
            </li>
            <li>
              <span className="academy-study-guide-icon" aria-hidden="true">
                <ListChecks size={19} />
              </span>
              <div>
                <strong>2. Practise it</strong>
                <span>
                  Use the scenario, ordering task, or flashcards to test
                  yourself.
                </span>
              </div>
            </li>
            <li>
              <span className="academy-study-guide-icon" aria-hidden="true">
                <CheckCircle2 size={19} />
              </span>
              <div>
                <strong>3. Mark the step complete</strong>
                <span>
                  Come back whenever you need a refresher — your place is saved.
                </span>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="section dashboard-path">
        <div className="container">
          <div className="section-head-block">
            <span className="eyebrow">The learning path</span>
            <h2 className="sec-title">Your learning path</h2>
            <p className="section-lead">
              Each chapter ends with a situation to work through. Finish all{" "}
              {CHAPTERS.length}, pass the {COURSE_INFO.questionCount}-question
              assessment and write your proposal. Contacting the membership team
              remains optional.
            </p>
          </div>

          <ol
            className="chapter-cards"
            style={{ "--route-growth": `${percent}%` } as React.CSSProperties}
          >
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
                        {chapter.complete ? (
                          <Check size={17} />
                        ) : (
                          String(index + 1).padStart(2, "0")
                        )}
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

                  <div
                    className="chapter-card-progress"
                    aria-label={`${chapter.lessonsDone} of ${chapter.lessonsTotal} lessons complete`}
                  >
                    <span
                      style={{
                        width: `${chapter.lessonsTotal ? (chapter.lessonsDone / chapter.lessonsTotal) * 100 : 0}%`,
                      }}
                    />
                  </div>

                  {open ? (
                    <div
                      className="chapter-card-body"
                      id={`chapter-${chapter.id}`}
                    >
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
                                  <span
                                    className="chapter-lesson-mark"
                                    aria-hidden="true"
                                  >
                                    {done ? (
                                      <BadgeCheck size={15} />
                                    ) : (
                                      index + 1
                                    )}
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
                                  <span
                                    className="chapter-lesson-mark"
                                    aria-hidden="true"
                                  >
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
                              <span
                                className="chapter-lesson-mark"
                                aria-hidden="true"
                              >
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
                          <ArrowRight size={15} aria-hidden="true" />
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
            <h2 className="sec-title">
              Assessment, proposal, and your next step
            </h2>
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
                  title: "Membership team (optional)",
                  detail:
                    "Already a member? Finish with your certificate. Want to join or continue a membership conversation? Contact the team.",
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
                      <BadgeCheck size={15} aria-hidden="true" />{" "}
                      {item.slug === "join" ? "Optional" : "Done — review"}
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
                {CHAPTERS.length} chapters · {COURSE_INFO.lessons.length}{" "}
                lessons · {COURSE_INFO.minutes} minutes
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
