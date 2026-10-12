/**
 * Leadership — current board and the presidents who built the club.
 */
import { ArrowRight } from "lucide-react";
import { LEADERS, PAGE_INTROS } from "../data";
import { ButtonLink, PageHero, PageMeta } from "../components/ui";
import { LeaderCard } from "../components/cards";
import { Reveal } from "../hooks";

export default function LeadershipPage() {
  const intro = PAGE_INTROS.leadership;
  const board = LEADERS.filter((l) => l.kind === "board");
  const past = LEADERS.filter((l) => l.kind === "past" && !l.confirm);

  return (
    <>
      <PageMeta title="Leadership" description={intro.description} />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead} />
      <section className="section section-tint">
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">2026–2027 Rotary year</span>
              <h2 className="sec-title">Reported club presidency</h2>
            </div>
          </Reveal>
          <p className="leadership-verification">
            Joyce’s{" "}
            <a
              href="https://ke.linkedin.com/in/joyce-wanjiku-nguru"
              target="_blank"
              rel="noopener noreferrer"
            >
              public account
            </a>{" "}
            reports her installation on 6–7 June 2026. The full current board
            roster and approved portraits await confirmation from the club.
          </p>
          <div className="leaders-grid">
            {board.map((l, i) => (
              <LeaderCard key={l.name} leader={l} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">Past presidents</span>
              <h2 className="sec-title">Who built the club</h2>
            </div>
          </Reveal>
          <div className="leaders-grid">
            {past.map((l, i) => (
              <LeaderCard key={l.name} leader={l} delay={i * 80} />
            ))}
          </div>
          <div className="section-more">
            <ButtonLink to="/membership" variant="primary" size="sm">
              Attend a fellowship <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
