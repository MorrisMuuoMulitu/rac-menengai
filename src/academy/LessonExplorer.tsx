import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  Eye,
} from "lucide-react";
import { lessonSections } from "../../shared/rotaract-academy/sections";
import {
  PROTOCOL_LEVEL_LABEL,
  type OrientationBlock,
} from "../../shared/rotaract-academy/types";
import { markTerms, parseInline, toParagraphs } from "../lib/prose";
import { LESSON_DESIGN } from "./lesson-design";
import { QuickCheck } from "./QuickCheck";
import { LessonVisual } from "./LessonVisual";
import type { LessonSectionProgress } from "../../shared/rotaract-academy/progress";

function Reading({ blocks }: { blocks: OrientationBlock[] }) {
  return (
    <div className="academy-prose">
      {blocks.map((block, index) => {
        if (block.kind === "list")
          return (
            <ul key={index}>
              {block.items?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        if (block.kind === "note")
          return (
            <aside className="academy-note" key={index}>
              {block.text}
            </aside>
          );
        if (block.kind === "tag")
          return (
            <aside
              className={`protocol-tag is-${block.level ?? "example"}`}
              key={index}
            >
              <strong>{PROTOCOL_LEVEL_LABEL[block.level ?? "example"]}</strong>
              <p>{block.text}</p>
              {block.source && <cite>{block.source}</cite>}
            </aside>
          );
        return markTerms(toParagraphs(block.text ?? "", 2)).map(
          (paragraph, at) => (
            <p key={`${index}-${at}`}>
              {parseInline(paragraph).map((piece, i) =>
                piece.strong ? (
                  <strong key={i}>{piece.text}</strong>
                ) : (
                  piece.text
                ),
              )}
            </p>
          ),
        );
      })}
    </div>
  );
}

export function LessonExplorer({
  lessonId,
  blocks,
  objectives,
  initialSection = 0,
  sectionProgress,
  onSectionPosition,
}: {
  lessonId: string;
  blocks: OrientationBlock[];
  objectives: string[];
  initialSection?: number;
  sectionProgress?: LessonSectionProgress;
  onSectionPosition?: (sectionIndex: number, completed: boolean) => void;
}) {
  const sections = lessonSections(blocks);
  const startingSection = Math.max(
    0,
    Math.min(initialSection, Math.max(0, sections.length - 1)),
  );
  const [index, setIndex] = useState(startingSection);
  const [seen, setSeen] = useState<number[]>([
    ...new Set([
      ...(sectionProgress?.completedSections ?? []),
      startingSection,
    ]),
  ]);
  const [revealed, setRevealed] = useState(false);
  const [locallyReviewed, setLocallyReviewed] = useState<number[]>([]);
  const design = LESSON_DESIGN[lessonId];
  const focus = useRef<HTMLDivElement>(null);
  const savedInitial = useRef(false);
  const move = (next: number) => {
    setIndex(next);
    setRevealed(false);
    setSeen((previous) =>
      previous.includes(next) ? previous : [...previous, next],
    );
    onSectionPosition?.(next, false);
    focus.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    if (savedInitial.current) return;
    savedInitial.current = true;
    if (sectionProgress?.lastSection !== startingSection)
      onSectionPosition?.(startingSection, false);
  }, [onSectionPosition, sectionProgress?.lastSection, startingSection]);
  useEffect(() => {
    if (startingSection === 0) return;
    const frame = window.requestAnimationFrame(() =>
      focus.current?.scrollIntoView({ block: "start" }),
    );
    return () => window.cancelAnimationFrame(frame);
  }, [startingSection]);

  const sectionReference = toParagraphs(
    (sections[index] ?? [])
      .flatMap((block) => [block.text ?? "", ...(block.items ?? [])])
      .filter(Boolean)
      .join(" "),
    2,
  )[0];
  const reviewed =
    locallyReviewed.includes(index) ||
    (sectionProgress?.completedSections.includes(index) ?? false);
  const sectionTitle = design?.sections[index] ?? `Section ${index + 1}`;

  return (
    <section className="lesson-explorer" aria-label="Lesson workspace">
      <div className="lesson-section-picker" aria-label="Reading sections">
        {sections.map((_, at) => (
          <button
            key={at}
            type="button"
            onClick={() => move(at)}
            aria-current={index === at ? "step" : undefined}
            aria-label={`Read ${design?.sections[at] ?? `section ${at + 1}`}`}
          >
            {seen.includes(at) && at !== index ? (
              <Check size={16} aria-hidden="true" />
            ) : null}
            {design?.sections[at] ?? `Part ${at + 1}`}
          </button>
        ))}
      </div>
      <div className="lesson-reading-panel" ref={focus} tabIndex={-1}>
        <p className="lesson-section-label" aria-live="polite">
          {design?.sections[index] ?? "Read"} · {index + 1} of {sections.length}
        </p>
        {index === 0 && <LessonVisual key={lessonId} lessonId={lessonId} />}
        {!((lessonId === "roots" || lessonId === "family") && index === 0) && (
          <Reading blocks={sections[index] ?? []} />
        )}
      </div>

      <section
        className="lesson-section-check"
        aria-labelledby={`section-check-${lessonId}-${index}`}
      >
        <div className="lesson-section-check-head">
          <span>Pause and check</span>
          <small>
            Section {index + 1} of {sections.length}
          </small>
        </div>
        <h3 id={`section-check-${lessonId}-${index}`}>
          Can you explain “{sectionTitle}” in one sentence?
        </h3>
        <p>
          Say the main idea before you look back. Then reveal a key passage and
          compare it with your answer.
        </p>
        {revealed ? (
          <div className="lesson-section-reference" role="status">
            <strong>Key passage</strong>
            <p>
              {sectionReference ||
                "Use the reading above to explain this idea in your own words."}
            </p>
          </div>
        ) : null}
        <div className="lesson-section-check-actions">
          {!revealed ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setRevealed(true)}
            >
              <Eye size={16} aria-hidden="true" /> Reveal key passage
            </button>
          ) : reviewed ? (
            <span className="lesson-section-reviewed">
              <BadgeCheck size={16} aria-hidden="true" /> Section reviewed
            </span>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setSeen((previous) =>
                  previous.includes(index) ? previous : [...previous, index],
                );
                setLocallyReviewed((previous) =>
                  previous.includes(index) ? previous : [...previous, index],
                );
                onSectionPosition?.(index, true);
              }}
            >
              <Check size={16} aria-hidden="true" /> I checked this section
            </button>
          )}
        </div>
      </section>

      <div className="lesson-section-controls">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => move(index - 1)}
        >
          <ArrowLeft size={18} /> Previous idea
        </button>
        <span>
          {seen.length}/{sections.length} explored
        </span>
        <button
          type="button"
          disabled={index === sections.length - 1}
          onClick={() => move(index + 1)}
        >
          Next idea <ArrowRight size={18} />
        </button>
      </div>
      <details className="lesson-full-reading">
        <summary>
          <span>Prefer to read everything together?</span>
          <small>Optional</small>
        </summary>
        <Reading blocks={blocks} />
      </details>
      <details className="lesson-goals-compact">
        <summary>
          <BookOpen size={16} aria-hidden="true" /> Learning goals
        </summary>
        <ul>
          {objectives.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
      </details>
      <QuickCheck key={`check-${lessonId}`} lessonId={lessonId} />
    </section>
  );
}
