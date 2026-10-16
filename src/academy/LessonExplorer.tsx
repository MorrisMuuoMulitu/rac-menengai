import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check } from "lucide-react";
import { lessonSections } from "./learning-experience";
import {
  PROTOCOL_LEVEL_LABEL,
  type OrientationBlock,
} from "../../shared/rotaract-academy/types";
import { markTerms, parseInline, toParagraphs } from "../lib/prose";
import { LESSON_DESIGN } from "./lesson-design";
import { QuickCheck } from "./QuickCheck";
import { PrivateNote } from "./PrivateNote";
import { LessonVisual } from "./LessonVisual";

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
  activity,
}: {
  lessonId: string;
  blocks: OrientationBlock[];
  objectives: string[];
  activity: string;
}) {
  const sections = lessonSections(blocks);
  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState<number[]>([0]);
  const design = LESSON_DESIGN[lessonId];
  const focus = useRef<HTMLDivElement>(null);
  const move = (next: number) => {
    setIndex(next);
    setSeen((previous) =>
      previous.includes(next) ? previous : [...previous, next],
    );
    focus.current?.focus({ preventScroll: true });
  };
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
        <summary>Prefer to read everything together?</summary>
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
      <PrivateNote lessonId={lessonId} activity={activity} />
    </section>
  );
}
