/**
 * Awards — verified recognition from Rotary District 9212 and partners.
 */
import { Award as AwardIcon } from 'lucide-react';
import { AWARDS, PAGE_INTROS } from '../data';
import { PageHero, PageMeta } from '../components/ui';
import { Reveal } from '../hooks';

export default function AwardsPage() {
  const intro = PAGE_INTROS.awards;
  return (
    <>
      <PageMeta title="Awards & Recognition" description={intro.description} />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead} />
      <section className="section section-tint">
        <div className="container">
          <ul className="awards-grid">
            {AWARDS.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 70} as="li" className={`award-card${a.gold ? ' gold' : ''}`}>
                <span className="award-media">
                  {a.image ? <img src={a.image} alt={`${a.title} — photograph`} width={640} height={420} loading="lazy" /> : null}
                </span>
                <span className="award-body">
                  <span className="award-badge">
                    <AwardIcon aria-hidden="true" /> {a.tag}
                  </span>
                  <h2>{a.title}</h2>
                  <span className="award-year">{a.year}</span>
                </span>
              </Reveal>
            ))}
          </ul>
          <p className="fine-print">
            Recognition records come from district and county sources and the club’s own archive; confirmations tracked
            in the content audit.
          </p>
        </div>
      </section>
    </>
  );
}