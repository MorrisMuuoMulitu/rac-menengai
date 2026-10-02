/**
 * New member orientation — a short course about Rotaract and RAC Menengai,
 * required by the club before induction.
 *
 * No backend: progress lives in localStorage (degrading to in-memory when
 * storage is unavailable) and completion is confirmed by an officer in person.
 * The printable record exists so that hand-off is easy.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, CircleCheck, ExternalLink, Printer, RotateCcw } from 'lucide-react';
import { ORIENTATION } from '../data';
import { ButtonLink, PageHero, PageMeta } from '../components/ui';
import { Reveal } from '../hooks';
import {
  EMPTY_PROGRESS,
  clearProgress,
  completionDate,
  loadProgress,
  progressPercent,
  saveProgress,
  scoreQuiz,
  type OrientationProgress,
  type QuizResult,
} from '../lib/orientation';

type Step = { kind: 'module'; index: number } | { kind: 'quiz' } | { kind: 'done' };

export default function OrientationPage() {
  const { modules, questions, passMark, title, lead, sources, requiredBeforeInduction } = ORIENTATION;

  const [progress, setProgress] = useState<OrientationProgress>(EMPTY_PROGRESS);
  const [storageOk, setStorageOk] = useState(true);
  const [step, setStep] = useState<Step>({ kind: 'module', index: 0 });
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [result, setResult] = useState<QuizResult | null>(null);
  const [name, setName] = useState('');
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const quizRef = useRef<HTMLHeadingElement | null>(null);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  /* Load saved progress once on mount. */
  useEffect(() => {
    const saved = loadProgress();
    setProgress(saved);
    setName(saved.name ?? '');
    // If storage cannot be written, tell the learner rather than pretending.
    setStorageOk(saveProgress(saved));
    if (saved.passed) setStep({ kind: 'done' });
  }, []);

  const persist = (next: OrientationProgress) => {
    setProgress(next);
    setStorageOk(saveProgress(next));
  };

  const totalSteps = modules.length + 1; // modules + quiz
  const completedCount = progress.completed.filter((id) => modules.some((m) => m.id === id)).length + (progress.passed ? 1 : 0);
  const percent = progressPercent(completedCount, totalSteps);

  const currentModule = step.kind === 'module' ? modules[step.index] : null;
  const isLastModule = step.kind === 'module' && step.index === modules.length - 1;

  /* Move focus to the new heading after each step change (screen-reader cue). */
  useEffect(() => {
    if (step.kind === 'module') headingRef.current?.focus();
    if (step.kind === 'quiz') quizRef.current?.focus();
    if (step.kind === 'done') headingRef.current?.focus();
  }, [step]);

  const markModuleComplete = () => {
    if (step.kind !== 'module') return;
    const module = modules[step.index];
    const completed = progress.completed.includes(module.id) ? progress.completed : [...progress.completed, module.id];
    persist({ ...progress, completed });
    if (step.index === modules.length - 1) setStep({ kind: 'quiz' });
    else setStep({ kind: 'module', index: step.index + 1 });
  };

  const chooseModule = (index: number) => setStep({ kind: 'module', index });

  const selectAnswer = (qIndex: number, value: number) => {
    setAnswers((prev) => prev.map((a, i) => (i === qIndex ? value : a)));
  };

  const submitQuiz = () => {
    const scored = scoreQuiz(answers, questions, passMark);
    setResult(scored);
    const best = Math.max(scored.correct, progress.bestScore ?? 0);
    const next: OrientationProgress = {
      ...progress,
      bestScore: best,
      passed: progress.passed || scored.passed,
      date: scored.passed && !progress.passed ? new Date().toISOString() : progress.date,
      name: name.trim() || progress.name,
    };
    persist(next);
    requestAnimationFrame(() => feedbackRef.current?.focus());
  };

  const retake = () => {
    setAnswers(questions.map(() => null));
    setResult(null);
    setStep({ kind: 'quiz' });
  };

  const startOver = () => {
    clearProgress();
    setProgress(EMPTY_PROGRESS);
    setAnswers(questions.map(() => null));
    setResult(null);
    setName('');
    setStep({ kind: 'module', index: 0 });
  };

  const saveName = (value: string) => {
    setName(value);
    persist({ ...progress, name: value.trim() || undefined });
  };

  const answered = useMemo(() => answers.filter((a) => a !== null).length, [answers]);
  const passed = Boolean(progress.passed);

  return (
    <>
      <PageMeta title="New member orientation" description="A short course about Rotaract and the Rotaract Club of Menengai, completed before induction." />
      <PageHero eyebrow="Membership · before induction" title={title} lead={lead}>
        <ButtonLink to="/membership" variant="secondary" size="sm">
          <ArrowLeft aria-hidden="true" /> Back to membership
        </ButtonLink>
      </PageHero>

      <section className="section section-tint">
        <div className="container orientation-layout">
          {/* ---------- Course navigation + progress ---------- */}
          <aside className="orientation-nav no-print" aria-label="Course contents">
            <div className="orientation-progress">
              <div
                className="orientation-progress-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={totalSteps}
                aria-valuenow={completedCount}
                aria-valuetext={`${completedCount} of ${totalSteps} steps complete`}
              >
                <span style={{ width: `${percent}%` }} />
              </div>
              <p className="orientation-progress-text">
                {completedCount} of {totalSteps} steps complete
                {passed ? ' · quiz passed' : ''}
              </p>
              {!storageOk ? (
                <p className="orientation-storage-note" role="status">
                  Your browser isn’t saving progress — keep this tab open until you finish.
                </p>
              ) : null}
            </div>

            <h2 className="orientation-nav-title">Course contents</h2>
            <ol className="orientation-modules">
              {modules.map((m, i) => {
                const done = progress.completed.includes(m.id);
                const current = step.kind === 'module' && step.index === i;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      className={`orientation-module-btn${current ? ' current' : ''}${done ? ' done' : ''}`}
                      onClick={() => chooseModule(i)}
                      aria-current={current ? 'step' : undefined}
                    >
                      <span className="om-status" aria-hidden="true">
                        {done ? <Check /> : String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="om-title">
                        {m.title}
                        <small>{m.minutes} min</small>
                      </span>
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  className={`orientation-module-btn${step.kind === 'quiz' ? ' current' : ''}${passed ? ' done' : ''}`}
                  onClick={() => setStep({ kind: 'quiz' })}
                  aria-current={step.kind === 'quiz' ? 'step' : undefined}
                >
                  <span className="om-status" aria-hidden="true">
                    {passed ? <Check /> : '★'}
                  </span>
                  <span className="om-title">
                    Check your understanding
                    <small>{questions.length} questions</small>
                  </span>
                </button>
              </li>
            </ol>

            {passed ? (
              <button type="button" className="orientation-reset" onClick={startOver}>
                <RotateCcw aria-hidden="true" /> Reset my progress
              </button>
            ) : null}
          </aside>

          {/* ---------- Course body ---------- */}
          <div className="orientation-main">
            {step.kind === 'module' && currentModule ? (
              <Reveal className="orientation-module" as="article">
                <span className="eyebrow">
                  Module {step.index + 1} of {modules.length} · {currentModule.minutes} min
                </span>
                <h2 className="orientation-module-title" tabIndex={-1} ref={headingRef}>
                  {currentModule.title}
                </h2>
                <p className="orientation-module-summary">{currentModule.summary}</p>
                {currentModule.blocks.map((b, i) =>
                  b.kind === 'p' ? (
                    <p key={i}>{b.text}</p>
                  ) : b.kind === 'note' ? (
                    <p className="orientation-note" key={i}>
                      {b.text}
                    </p>
                  ) : (
                    <ul key={i} className="orientation-list">
                      {b.items?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ),
                )}

                <div className="orientation-actions no-print">
                  {step.index > 0 ? (
                    <button className="btn btn-secondary btn-md" type="button" onClick={() => chooseModule(step.index - 1)}>
                      <ArrowLeft aria-hidden="true" /> Previous
                    </button>
                  ) : null}
                  <button className="btn btn-primary btn-md" type="button" onClick={markModuleComplete}>
                    {isLastModule ? 'Finish modules — take the quiz' : 'Mark complete and continue'}{' '}
                    <ArrowRight aria-hidden="true" />
                  </button>
                </div>
              </Reveal>
            ) : null}

            {step.kind === 'quiz' ? (
              <div className="orientation-quiz">
                <span className="eyebrow">Final step</span>
                <h2 className="orientation-module-title" tabIndex={-1} ref={quizRef}>
                  Check your understanding
                </h2>
                <p className="orientation-module-summary">
                  {questions.length} questions. You need {passMark} correct to pass, and you can retake it as many times
                  as you like. Everything is covered in the modules.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitQuiz();
                  }}
                  noValidate
                >
                  {questions.map((q, qi) => {
                    const state = result ? (result.perQuestion[qi] ? 'correct' : 'incorrect') : null;
                    return (
                      <fieldset
                        key={q.id}
                        className={`quiz-q${state ? ` ${state}` : ''}`}
                        aria-describedby={result ? `q-feedback-${q.id}` : undefined}
                      >
                        <legend>
                          <span className="quiz-q-no" aria-hidden="true">
                            {String(qi + 1).padStart(2, '0')}
                          </span>
                          {q.question}
                        </legend>
                        {q.options.map((opt, oi) => (
                          <label className="quiz-option" key={opt}>
                            <input
                              type="radio"
                              name={q.id}
                              value={oi}
                              checked={answers[qi] === oi}
                              onChange={() => selectAnswer(qi, oi)}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                        {result ? (
                          <p className="quiz-feedback" id={`q-feedback-${q.id}`}>
                            {result.perQuestion[qi] ? <Check aria-hidden="true" /> : null}
                            {result.perQuestion[qi] ? 'Correct. ' : `Not quite — the answer is “${q.options[q.correctIndex]}”. `}
                            {q.explanation}
                          </p>
                        ) : null}
                      </fieldset>
                    );
                  })}

                  <div className="orientation-actions no-print">
                    <button className="btn btn-primary btn-lg" type="submit">
                      {result ? 'Submit again' : 'Submit answers'} <Check aria-hidden="true" />
                    </button>
                    {answered < questions.length ? (
                      <p className="form-hint">
                        {answered} of {questions.length} answered — unanswered questions count as incorrect.
                      </p>
                    ) : null}
                  </div>
                </form>

                <div className="quiz-result" ref={feedbackRef} tabIndex={-1} role="status" aria-live="polite">
                  {result ? (
                    <>
                      <h3>
                        You scored {result.correct} of {result.total}
                        {result.passed ? ' — passed' : ' — not passed yet'}
                      </h3>
                      <p>
                        {result.passed
                          ? 'Nicely done. Your completion record is ready below.'
                          : `You need ${passMark} correct to pass. Read the feedback above and try again — there’s no limit on attempts.`}
                      </p>
                      <div className="orientation-actions">
                        {result.passed ? (
                          <button className="btn btn-primary btn-md" type="button" onClick={() => setStep({ kind: 'done' })}>
                            Go to my completion record <ArrowRight aria-hidden="true" />
                          </button>
                        ) : null}
                        <button className="btn btn-secondary btn-md" type="button" onClick={retake}>
                          <RotateCcw aria-hidden="true" /> {result.passed ? 'Retake the quiz' : 'Try again'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="form-hint">Your result will appear here after you submit.</p>
                  )}
                </div>
              </div>
            ) : null}

            {step.kind === 'done' ? (
              <div className="orientation-done">
                <Reveal className="orientation-certificate" as="article">
                  <span className="cert-mark" aria-hidden="true">
                    <CircleCheck />
                  </span>
                  <h2 className="orientation-module-title" tabIndex={-1} ref={headingRef}>
                    Orientation complete
                  </h2>
                  <p className="cert-line">
                    <strong>{ORIENTATION.title}</strong> — Rotaract Club of Menengai, Nakuru, Kenya · Rotary District 9212
                  </p>
                  <dl className="cert-meta">
                    <div>
                      <dt>Name</dt>
                      <dd>{progress.name || '—'}</dd>
                    </div>
                    <div>
                      <dt>Completed</dt>
                      <dd>{completionDate(progress.date ?? new Date().toISOString())}</dd>
                    </div>
                    <div>
                      <dt>Quiz</dt>
                      <dd>
                        {progress.bestScore ?? 0} of {questions.length} correct
                      </dd>
                    </div>
                  </dl>

                  <div className="cert-name no-print">
                    <label htmlFor="cert-name">Add your name to the record</label>
                    <input
                      id="cert-name"
                      type="text"
                      value={name}
                      onChange={(e) => saveName(e.target.value)}
                      placeholder="e.g. Amina Wanjiru"
                      autoComplete="name"
                    />
                  </div>

                  <p className="orientation-note">
                    {requiredBeforeInduction
                      ? 'Our club requires this course before induction. Show this record to an officer — induction is confirmed in person, not by this website.'
                      : 'Show this record to an officer if you’d like it noted — induction is confirmed in person, not by this website.'}
                  </p>

                  <div className="orientation-actions no-print">
                    <button className="btn btn-primary btn-md" type="button" onClick={() => window.print()}>
                      <Printer aria-hidden="true" /> Print / save this record
                    </button>
                    <ButtonLink to="/contact?interest=join-club" variant="secondary" size="md">
                      Tell the club I’ve finished
                    </ButtonLink>
                    <button className="btn btn-secondary btn-md" type="button" onClick={retake}>
                      <RotateCcw aria-hidden="true" /> Retake the quiz
                    </button>
                  </div>
                </Reveal>

                <Reveal className="orientation-sources" as="article">
                  <h3>Go deeper with Rotary</h3>
                  <p>
                    This course covers our club. For the official picture, Rotary publishes its own material — and the
                    Rotary Learning Center has free courses for members.
                  </p>
                  <ul>
                    {sources.map((s) => (
                      <li key={s.href}>
                        <a href={s.href} target="_blank" rel="noopener noreferrer">
                          {s.label} <ExternalLink aria-hidden="true" size={14} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <p className="fine-print no-print">
                  Reviewing later? <Link to="/membership">Back to membership</Link> or revisit any module above.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}