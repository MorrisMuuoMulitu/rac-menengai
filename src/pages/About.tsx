/**
 * About — identity, charter history, values, the Rotary connection, timeline.
 */
import { ArrowRight } from "lucide-react";
import { Heart, Star, Users } from "lucide-react";
import {
  ABOUT_IMAGES,
  CLUB,
  DISTRICT,
  MOTHER_CLUB,
  PAGE_INTROS,
  VALUES,
} from "../data";
import { Reveal } from "../hooks";
import { ButtonLink, PageHero, PageMeta } from "../components/ui";

const VALUE_ICONS: Record<string, React.ReactNode> = {
  users: <Users aria-hidden="true" />,
  star: <Star aria-hidden="true" />,
  heart: <Heart aria-hidden="true" />,
};

const MILESTONES = [
  {
    year: "2019",
    title: "Presidency of Terry Muigai",
    text: "A year of growth and service under then-president Terry Muigai.",
  },
  {
    year: "2025",
    title: "Ten years of service",
    text: "The club marks a decade of fellowship and impact across the district.",
  },
] as const;

export default function AboutPage() {
  const intro = PAGE_INTROS.about;
  return (
    <>
      <PageMeta title="About" description={intro.description} />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead} />

      <section className="section">
        <div className="container about-grid">
          <Reveal className="about-visual about-service-visual" as="figure">
            <img
              src={ABOUT_IMAGES.tall}
              alt="Rotaract Club of Menengai members and partners with mother packs outside Bondeni Sub-County Hospital"
              width={1280}
              height={898}
              loading="lazy"
            />
            <figcaption>Mother Pack Project · Bondeni Maternity</figcaption>
          </Reveal>
          <div className="about-copy">
            <Reveal>
              <h2 className="sec-title">
                Nakuru’s home of young leaders in action
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p>
                {CLUB.name} is a member of Rotary International’s global
                Rotaract family — a vibrant club of young professionals and
                students, roughly 18 and over, living the motto{" "}
                <em>{CLUB.motto}</em>. We are sponsored by{" "}
                <strong>{CLUB.sponsor}</strong> and part of {CLUB.district}.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p>
                Our archive records activities including cleaning our rivers,
                welcoming new mothers at Bondeni Maternity, supporting students,
                and hosting Nakuru’s young people in fellowship every Thursday.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div className="about-facts">
                <p>
                  <strong>{CLUB.establishedLabel}</strong> · sponsored by{" "}
                  {CLUB.sponsor}
                </p>
                <p>
                  <strong>Thursday fellowship</strong> ·{" "}
                  {CLUB.meeting.timeLabel} · {CLUB.city.split(",")[0]}
                </p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="about-cta">
                <ButtonLink to="/membership" variant="primary">
                  Attend a fellowship <ArrowRight aria-hidden="true" />
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">What we value</span>
              <h2 className="sec-title">Three values. One purpose.</h2>
            </div>
          </Reveal>
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 80}
                className="value-card"
                as="article"
              >
                <span className="value-icon" aria-hidden="true">
                  {VALUE_ICONS[v.icon] ?? <Star aria-hidden="true" />}
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">The Rotary connection</span>
              <h2 className="sec-title">Same motto. Same areas of focus.</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="rotary-note">
              <p>
                Rotaract is Rotary’s young-leaders arm for adults aged 18 and
                over. We run our own club leadership, supported by our sponsor —
                for us, {CLUB.sponsor} — and we work inside Rotary’s seven areas
                of focus, from the environment to maternal health to
                peacebuilding.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- District 9215 ---------- */}
      <section
        className="section section-tint"
        aria-labelledby="about-district"
      >
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">Our district</span>
              <h2 className="sec-title" id="about-district">
                Part of {CLUB.district}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <p className="lede">
              We belong to {DISTRICT.name} — a district established for{" "}
              {DISTRICT.inauguralYear}, covering {DISTRICT.coverage.join(", ")}.
              More than {DISTRICT.stats[0].value.replace("+", "")} clubs and{" "}
              {DISTRICT.stats[1].value.replace("+", "")} Rotarians serve across
              it, and Rotaractors are brought into project leadership at
              district level.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="district-teaser">
              <ul>
                {DISTRICT.focuses.slice(0, 3).map((f) => (
                  <li key={f.id}>
                    <strong>{f.title}</strong> — {f.text}
                  </li>
                ))}
              </ul>
              <div className="district-actions">
                <ButtonLink
                  to="/about/district-9215"
                  variant="secondary"
                  size="sm"
                >
                  Explore our district <ArrowRight aria-hidden="true" />
                </ButtonLink>
                <ButtonLink to="/leadership" variant="secondary" size="sm">
                  Meet the board <ArrowRight aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head-block">
            <span className="eyebrow">Our mother club</span>
            <h2 className="sec-title">
              Sponsored by the Rotary Club of Nakuru
            </h2>
            <p className="section-lead">{MOTHER_CLUB.summary}</p>
          </div>
          <dl className="mother-club-details">
            <div>
              <dt>Chartered</dt>
              <dd>{MOTHER_CLUB.chartered}</dd>
            </div>
            <div>
              <dt>Meets</dt>
              <dd>
                {MOTHER_CLUB.meetingDay}, {MOTHER_CLUB.meetingTime}
              </dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>{MOTHER_CLUB.venue}</dd>
            </div>
            <div>
              <dt>President</dt>
              <dd>
                {MOTHER_CLUB.president}{" "}
                <span className="mother-club-note">
                  ({MOTHER_CLUB.presidentNote})
                </span>
              </dd>
            </div>
          </dl>
          <div className="section-more">
            <ButtonLink to="/rotary" variant="secondary" size="sm">
              How Rotaract fits into Rotary <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">The journey</span>
              <h2 className="sec-title">From the club archive</h2>
            </div>
          </Reveal>
          <ol className="timeline">
            {MILESTONES.map((m, i) => (
              <Reveal as="li" key={m.title} delay={i * 50}>
                <span className="timeline-year">{m.year}</span>
                <div className="timeline-body">
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <p className="fine-print">
            The exact charter date and anniversary year are awaiting club
            confirmation.
          </p>
          <div className="section-more">
            <ButtonLink to="/awards" variant="secondary" size="sm">
              Awards &amp; recognition <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
