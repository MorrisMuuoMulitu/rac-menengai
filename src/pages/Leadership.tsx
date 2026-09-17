/**
 * Leadership — current board and the presidents who built the club.
 */
import { ArrowRight } from 'lucide-react';
import { LEADERS, PAGE_INTROS } from '../data';
import { ButtonLink, PageHero, PageMeta } from '../components/ui';
import { LeaderCard } from '../components/cards';
import { Reveal } from '../hooks';

export default function LeadershipPage() {
  const intro = PAGE_INTROS.leadership;
  const board = LEADERS.filter((l) => l.kind === 'board');
  const past = LEADERS.filter((l) => l.kind === 'past');

  return (
    <>
      <PageMeta title="Leadership" />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead} />
      <section className="section section-tint">
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">Current leadership</span>
              <h2 className="sec-title">Leading today</h2>
            </div>
          </Reveal>
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