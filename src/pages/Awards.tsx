/**
 * Awards — historical records awaiting club confirmation.
 */
import { Award as AwardIcon } from "lucide-react";
import { AWARDS, PAGE_INTROS } from "../data";
import { PageHero, PageMeta } from "../components/ui";
import { Reveal } from "../hooks";

export default function AwardsPage() {
  const intro = PAGE_INTROS.awards;
  return (
    <>
      <PageMeta title="Awards & Recognition" description={intro.description} />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead} />
      <section className="section section-tint">
        <div className="container">
          <p className="fine-print">
            These entries are preserved from the club’s earlier website. Award
            titles, dates and issuing bodies still need club confirmation.
          </p>
          <ul className="awards-grid">
            {AWARDS.map((a, i) => (
              <Reveal
                key={a.title}
                delay={(i % 3) * 70}
                as="li"
                className={`award-card${a.gold ? " gold" : ""}`}
              >
                <span className="award-media">
                  {a.image ? (
                    <img
                      src={a.image}
                      alt={`${a.title} — archive image`}
                      width={640}
                      height={420}
                      loading="lazy"
                    />
                  ) : null}
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
            These are archive entries, not newly verified award announcements.
            District 9215 was established for the 2026/27 Rotary year, building
            on District 9212 — awards dated before that transition carry the
            district name in use at the time.
          </p>
        </div>
      </section>
    </>
  );
}
