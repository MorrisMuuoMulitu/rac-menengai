import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

const tasks = [
  {
    prompt: "You need the record of a decision made at fellowship.",
    role: "Secretary",
    why: "The secretary supports minutes and club records.",
  },
  {
    prompt: "You need to reconcile a project expense and obtain a receipt.",
    role: "Treasurer",
    why: "The treasurer maintains financial records and explains payment arrangements.",
  },
  {
    prompt:
      "You want to join a project team and understand the volunteer briefing.",
    role: "Service lead",
    why: "The service lead coordinates the project and its volunteers.",
  },
  {
    prompt:
      "You have an idea for the club’s direction and need to discuss it with the chair.",
    role: "President",
    why: "The president guides the club’s work and chairs its meetings. Decisions still follow the club’s governing documents.",
  },
];
const roles = ["President", "Secretary", "Treasurer", "Service lead"];

export function RolePractice() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  return (
    <section className="role-practice" aria-labelledby="role-practice-title">
      <h3 id="role-practice-title">Who would you ask?</h3>
      <p>
        Match each situation to a role. This is practice; it does not affect
        your assessment.
      </p>
      <div className="role-practice-grid">
        {tasks.map((task, index) => (
          <div key={task.prompt}>
            <label htmlFor={`role-${index}`}>{task.prompt}</label>
            <select
              id={`role-${index}`}
              value={answers[index] ?? ""}
              onChange={(event) => {
                setAnswers((previous) => ({
                  ...previous,
                  [index]: event.target.value,
                }));
                setChecked(false);
              }}
            >
              <option value="">Choose a role</option>
              {roles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
            {checked && (
              <p
                className={
                  answers[index] === task.role
                    ? "practice-correct"
                    : "practice-retry"
                }
              >
                <strong>
                  {answers[index] === task.role
                    ? "Correct. "
                    : `Try ${task.role.toLowerCase()}. `}
                </strong>
                {task.why}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="academy-actions">
        <button
          type="button"
          className="btn btn-primary btn-md"
          disabled={
            Object.keys(answers).filter((key) => answers[Number(key)])
              .length !== tasks.length
          }
          onClick={() => setChecked(true)}
        >
          <CheckCircle2 size={18} /> Check my matches
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-md"
          onClick={() => {
            setAnswers({});
            setChecked(false);
          }}
        >
          <RotateCcw size={18} /> Reset
        </button>
      </div>
      <div role="status" className="practice-score">
        {checked
          ? `${tasks.filter((task, index) => answers[index] === task.role).length} of ${tasks.length} matched correctly. Read the feedback beside each situation.`
          : ""}
      </div>
    </section>
  );
}

const lenses = [
  {
    label: "Truth",
    question: "Is it the truth?",
    prompt: "What can we prove, and what are we still assuming?",
    example:
      "Report the number of packs actually delivered. Separate the target from the result.",
  },
  {
    label: "Fairness",
    question: "Is it fair to all concerned?",
    prompt: "Who is affected, and have they had a fair say?",
    example:
      "Ask the host community about its priorities before deciding who receives support.",
  },
  {
    label: "Goodwill",
    question: "Will it build goodwill and better friendships?",
    prompt:
      "Will this strengthen trust, including with people outside the room?",
    example:
      "Give partners accurate credit and discuss a disagreement respectfully.",
  },
  {
    label: "Benefit",
    question: "Will it be beneficial to all concerned?",
    prompt: "What useful change will remain after our activity?",
    example:
      "Plan follow-up with the host, rather than treating the group photo as the outcome.",
  },
];

export function FourWayPractice() {
  const [index, setIndex] = useState(0);
  return (
    <section
      className="four-way-practice"
      aria-labelledby="four-way-practice-title"
    >
      <h3 id="four-way-practice-title">Apply the Four-Way Test</h3>
      <p>
        Your team is preparing a project update for a donor. Explore each
        question before you publish.
      </p>
      <div className="four-way-lenses" aria-label="Ethical questions">
        {lenses.map((lens, at) => (
          <button
            type="button"
            key={lens.label}
            aria-pressed={index === at}
            onClick={() => setIndex(at)}
          >
            {at + 1}. {lens.label}
          </button>
        ))}
      </div>
      <div className="four-way-example" aria-live="polite">
        <h4>{lenses[index].question}</h4>
        <p>
          <strong>Ask yourself:</strong> {lenses[index].prompt}
        </p>
        <p>
          <em>In practice:</em> {lenses[index].example}
        </p>
      </div>
      <small>Practice examples, not additional Rotary rules.</small>
    </section>
  );
}
