import { useState } from "react";
import { LEADERS } from "../data";

const history = [
  {
    year: "1905",
    title: "Rotary begins",
    text: "Paul Harris and three other professionals meet in Chicago on 23 February. Fellowship becomes a foundation for service.",
  },
  {
    year: "1968",
    title: "Rotaract begins",
    text: "The first Rotaract club is certified on 13 March at the University of North Carolina at Charlotte.",
  },
  {
    year: "2019",
    title: "A membership type",
    text: "Rotary’s Council on Legislation recognises Rotaract clubs as a membership type of Rotary International.",
  },
  {
    year: "2020",
    title: "Greater flexibility",
    text: "From 1 July, the global upper age limit is removed and clubs may organise with or without a sponsor. Clubs can adopt their own age limits through the applicable process.",
  },
];
const family = [
  {
    title: "Rotary",
    detail:
      "Clubs bringing together people with varied experience and professions to serve, build friendships and develop leadership.",
  },
  {
    title: "Rotaract",
    detail:
      "Clubs for adults aged 18 and over. Members organise their own leadership, funds and projects, working with other clubs as partners.",
  },
  {
    title: "Interact",
    detail:
      "Clubs for young people aged 12–18, supported by Rotary sponsors and often based in schools.",
  },
  {
    title: "RYLA",
    detail:
      "Rotary Youth Leadership Awards: a leadership-development programme. Local organisers set eligibility and arrangements.",
  },
  {
    title: "The Foundation",
    detail:
      "Rotary’s charitable foundation supports programmes and grants. Grant participation has its own eligibility and qualification requirements.",
  },
];

export function LessonVisual({ lessonId }: { lessonId: string }) {
  const [selected, setSelected] = useState(0);
  if (lessonId === "roots")
    return (
      <section
        className="history-explorer"
        aria-label="Rotary and Rotaract timeline"
      >
        <p className="visual-instruction">Explore the milestones</p>
        <div className="history-years">
          {history.map((entry, index) => (
            <button
              type="button"
              key={entry.year}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <strong>{entry.year}</strong>
              <span>{entry.title}</span>
            </button>
          ))}
        </div>
        <div className="history-detail" aria-live="polite">
          <strong>{history[selected].title}</strong>
          <p>{history[selected].text}</p>
        </div>
      </section>
    );
  if (lessonId === "family")
    return (
      <section
        className="family-explorer"
        aria-label="Explore the Rotary family"
      >
        <div className="family-root">
          The Rotary family
          <span>
            Clubs, programmes and a foundation. Different ways to participate.
          </span>
        </div>
        <div className="family-branches">
          {family.map((entry, index) => (
            <button
              key={entry.title}
              type="button"
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              {entry.title}
            </button>
          ))}
        </div>
        <div className="family-detail" aria-live="polite">
          <strong>{family[selected].title}</strong>
          <p>{family[selected].detail}</p>
        </div>
        <small>
          These are connections, not a compulsory ladder between programmes.
        </small>
      </section>
    );
  if (lessonId !== "club-leadership" && lessonId !== "structure") return null;
  const board = LEADERS.filter(
    (leader) => leader.kind === "board" && !leader.confirm,
  );
  return (
    <section className="lesson-team" aria-label="Meet Menengai’s board">
      <h3>Meet the people behind the roles</h3>
      <p>Current officers, drawn from the club’s Leadership page.</p>
      <div className="lesson-team-grid">
        {board
          .filter((leader) => leader.group === "executive")
          .slice(0, 3)
          .map((leader) => (
            <a key={leader.slug} href={`/leadership#${leader.slug}`}>
              <img
                src={`${leader.photo}-320.webp`}
                alt={leader.name}
                loading="lazy"
                width={160}
                height={200}
              />
              <strong>{leader.name}</strong>
              <span>{leader.standing ?? leader.portfolio}</span>
              <small>{leader.term}</small>
            </a>
          ))}
      </div>
      <details>
        <summary>Explore the full board</summary>
        <ul>
          {board.map((leader) => (
            <li key={leader.slug}>
              <a href={`/leadership#${leader.slug}`}>
                <strong>{leader.name}</strong>
                <span>{leader.standing ?? leader.portfolio}</span>
              </a>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
