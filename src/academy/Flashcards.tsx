/**
 * A deck of flash cards for the chapter you are reading.
 *
 * Flip to reveal, then move through the deck. Built as a real button with
 * `aria-pressed`, so a screen reader hears "term, collapsed/expanded" rather
 * than a div that changes colour. The flip is a transform that is switched off
 * under `prefers-reduced-motion`.
 */

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { Flashcard } from "../../shared/rotaract-academy/flashcards";

export function Flashcards({
  cards,
  chapterTitle,
}: {
  cards: Flashcard[];
  chapterTitle: string;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  /* A new chapter gets a new deck, starting closed. */
  useEffect(() => {
    setIndex(0);
    setRevealed(false);
  }, [chapterTitle]);

  if (!cards.length) return null;
  const card = cards[index];
  const move = (delta: number) => {
    setRevealed(false);
    setIndex((current) => (current + delta + cards.length) % cards.length);
  };

  return (
    <section className="flashcards" aria-label={`Flash cards for ${chapterTitle}`}>
      <header className="flashcards-head">
        <h3>Flash cards</h3>
        <p>
          {cards.length} terms from this chapter. Say the answer to yourself,
          then flip.
        </p>
      </header>

      <button
        type="button"
        className={`flashcard${revealed ? " is-revealed" : ""}`}
        aria-pressed={revealed}
        onClick={() => setRevealed((open) => !open)}
      >
        <span className="flashcard-face flashcard-front">
          <span className="flashcard-label">Term</span>
          <strong>{card.term}</strong>
          <span className="flashcard-hint">
            {revealed ? "Showing the meaning" : "Tap to reveal"}
          </span>
        </span>
        <span className="flashcard-face flashcard-back" aria-hidden={!revealed}>
          <span className="flashcard-label">Meaning</span>
          <span className="flashcard-definition">{card.definition}</span>
        </span>
      </button>

      <div className="flashcards-controls">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => move(-1)}
        >
          <ChevronLeft size={16} aria-hidden="true" /> Previous
        </button>
        <span className="flashcards-count" aria-live="polite">
          {index + 1} / {cards.length}
        </span>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => move(1)}
        >
          Next <ChevronRight size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="flashcards-reset"
          onClick={() => {
            setIndex(0);
            setRevealed(false);
          }}
        >
          <RotateCcw size={14} aria-hidden="true" /> Start again
        </button>
      </div>
    </section>
  );
}
