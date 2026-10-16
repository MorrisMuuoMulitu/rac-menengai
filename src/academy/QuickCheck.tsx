import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { LESSON_DESIGN } from "./lesson-design";

export function QuickCheck({ lessonId }: { lessonId: string }) {
  const check = LESSON_DESIGN[lessonId]?.check;
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  if (!check) return null;
  return (
    <section className="lesson-quick-check" aria-labelledby="quick-check-title">
      <p className="lesson-section-label">Quick practice · no marks</p>
      <h3 id="quick-check-title">{check.question}</h3>
      <fieldset>
        <legend className="sr-only">Choose an answer</legend>
        {check.options.map((option, index) => (
          <label
            key={option}
            className={`practice-choice${picked === index ? " is-picked" : ""}`}
          >
            <input
              type="radio"
              name={`practice-${lessonId}`}
              value={index}
              checked={picked === index}
              disabled={checked}
              onChange={() => setPicked(index)}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      <div className="academy-actions">
        {!checked ? (
          <button
            type="button"
            className="btn btn-primary btn-md"
            disabled={picked === null}
            onClick={() => setChecked(true)}
          >
            <CheckCircle2 size={18} /> Check answer
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-secondary btn-md"
            onClick={() => {
              setChecked(false);
              setPicked(null);
            }}
          >
            <RotateCcw size={18} /> Try again
          </button>
        )}
      </div>
      {checked && (
        <div
          className={`quick-check-feedback ${picked === check.correct ? "is-correct" : "is-retry"}`}
          role="status"
        >
          <strong>
            {picked === check.correct ? "Correct." : "Not quite."}
          </strong>
          {picked !== check.correct && (
            <p>
              <b>Best answer:</b> {check.options[check.correct]}
            </p>
          )}
          <p>{check.explanation}</p>
        </div>
      )}
    </section>
  );
}
