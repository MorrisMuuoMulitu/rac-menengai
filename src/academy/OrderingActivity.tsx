/**
 * Put these in order.
 *
 * Move-up and move-down buttons rather than dragging: it works with one thumb
 * on a phone and with a keyboard, and the state is announced by position so a
 * screen reader says "3 of 7" rather than leaving the learner to guess.
 */

import { useState } from "react";
import { ArrowDown, ArrowUp, Check, RotateCcw, X } from "lucide-react";
import {
  shuffled,
  type OrderingActivity as Activity,
} from "../../shared/rotaract-academy/activities";

export function OrderingActivity({ activity }: { activity: Activity }) {
  const [order, setOrder] = useState(() =>
    shuffled(activity.items, activity.lessonId),
  );
  const [result, setResult] = useState<"right" | "wrong" | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    setResult(null);
    setOrder((current) => {
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };

  const check = () =>
    setResult(
      order.every((item, index) => item === activity.items[index])
        ? "right"
        : "wrong",
    );

  const reset = () => {
    setOrder(shuffled(activity.items, activity.lessonId));
    setResult(null);
  };

  return (
    <section className="ordering" aria-labelledby="ordering-title">
      <header className="ordering-head">
        <h3 id="ordering-title">Put it in order</h3>
        <p>{activity.prompt}</p>
      </header>

      <ol className="ordering-list">
        {order.map((item, index) => (
          <li key={item} className="ordering-item">
            <span className="ordering-position" aria-hidden="true">
              {index + 1}
            </span>
            <span className="ordering-text">{item}</span>
            <span className="ordering-move">
              <button
                type="button"
                onClick={() => move(index, index - 1)}
                disabled={index === 0}
                aria-label={`Move "${item}" up, currently position ${index + 1} of ${order.length}`}
              >
                <ArrowUp size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(index, index + 1)}
                disabled={index === order.length - 1}
                aria-label={`Move "${item}" down, currently position ${index + 1} of ${order.length}`}
              >
                <ArrowDown size={16} aria-hidden="true" />
              </button>
            </span>
          </li>
        ))}
      </ol>

      <div className="ordering-actions">
        <button
          type="button"
          className="btn btn-primary btn-md"
          onClick={check}
        >
          Check my order <Check aria-hidden="true" />
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-md"
          onClick={reset}
        >
          <RotateCcw aria-hidden="true" /> Shuffle again
        </button>
      </div>

      <p
        className={`ordering-feedback${result ? ` is-${result}` : ""}`}
        role="status"
        aria-live="polite"
      >
        {result === "right" ? (
          <>
            <Check size={16} aria-hidden="true" /> {activity.feedback}
          </>
        ) : result === "wrong" ? (
          <>
            <X size={16} aria-hidden="true" /> Not yet. Think about what has to
            happen before the next thing can start, then try again.
          </>
        ) : (
          "Move each step until the order reads correctly, then check it."
        )}
      </p>
    </section>
  );
}
