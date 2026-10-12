/**
 * Our district — Rotary District 9215.
 *
 * Rich, sourced content about the district the club now belongs to. Everything
 * is paraphrased from the district's own website (see DISTRICT.asOf) and the
 * page links out rather than copying district material.
 */
import { ArrowRight, Check, ExternalLink, Info, MapPin } from "lucide-react";
import { CLUB, DISTRICT } from "../data";
import {
  ButtonLink,
  PageHero,
  PageMeta,
  SectionHeading,
} from "../components/ui";
import { FocusIcon } from "../components/icons";
import { Reveal } from "../hooks";

export default function DistrictPage() {
  return (
    <>
      <PageMeta
        title={`Rotary District ${DISTRICT.number}`}
        description={`Rotary District ${DISTRICT.number} covers West of Nairobi, Western Kenya and South Sudan — 100+ clubs and 3,000+ Rotarians. How the Rotaract Club of Menengai fits in.`}
      />

      <PageHero
        eyebrow={DISTRICT.name}
        title="Our district: new, and already 100 clubs strong"
        lead={DISTRICT.intro}
      >
        <ButtonLink to="/membership" variant="primary" size="sm">
          Attend a fellowship <ArrowRight aria-hidden="true" />
        </ButtonLink>
        <ButtonLink to="/projects" variant="secondary" size="sm">
          See our projects
        </ButtonLink>
      </PageHero>

      {/* ---------- Scale ---------- */}
      <section
        className="section section-tint"
        aria-labelledby="district-scale"
      >
        <div className="container">
          <h2 id="district-scale" className="sr-only">
            District 9215 at a glance
          </h2>
          <div className="stat-band">
            {DISTRICT.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 70} className="stat-band-cell">
                <span className="sb-value">{s.value}</span>
                <span className="sb-label">{s.label}</span>
                <span className="sb-note">{s.note}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Story + coverage ---------- */}
      <section className="section" aria-labelledby="district-story">
        <div className="container district-story-grid">
          <div>
            <Reveal>
              <div className="section-head-block">
                <span className="eyebrow">A new district</span>
                <h2 className="sec-title" id="district-story">
                  Established for {DISTRICT.inauguralYear}, built on{" "}
                  {DISTRICT.predecessor}
                </h2>
              </div>
            </Reveal>
            {DISTRICT.story.map((p, i) => (
              <Reveal key={p} delay={i * 70}>
                <p className="lede">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={140}>
              <p className="district-callout">
                <Info aria-hidden="true" /> {DISTRICT.asOf}
              </p>
            </Reveal>
          </div>
          <Reveal delay={80} className="district-coverage">
            <h3>
              <MapPin aria-hidden="true" /> Where the district serves
            </h3>
            <ul>
              {DISTRICT.coverage.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="district-coverage-note">
              Our club is in {CLUB.city.split(",")[0]} — one of the towns inside
              this district, serving with Rotarians across the region.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Leadership + RI context ---------- */}
      <section
        className="section section-tint"
        aria-labelledby="district-leadership"
      >
        <div className="container district-leaders">
          <Reveal className="dg-card">
            <span className="leader-avatar" aria-hidden="true">
              {DISTRICT.dg.initials}
            </span>
            <div>
              <span className="eyebrow">District leadership</span>
              <h2 className="sec-title-sm" id="district-leadership">
                {DISTRICT.dg.name}
              </h2>
              <p className="leader-role">{DISTRICT.dg.role}</p>
              <ul className="dg-bio">
                {DISTRICT.dg.bio.map((b) => (
                  <li key={b}>
                    <Check aria-hidden="true" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={80} className="theme-card">
            <span className="eyebrow">Rotary this year</span>
            <h2 className="sec-title-sm">{DISTRICT.ri.theme}</h2>
            <p>{DISTRICT.ri.text}</p>
            <p className="theme-president">
              Rotary International President:{" "}
              <strong>{DISTRICT.ri.president}</strong>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Focus areas ---------- */}
      <section className="section" aria-labelledby="district-focus">
        <div className="container">
          <SectionHeading
            eyebrow="What the district focuses on"
            title="Seven priorities — and where we plug in"
            lead="The district works inside Rotary’s areas of focus with a regional accent. Here is what that looks like on the ground, and how our club contributes."
            center
          />
          <div className="focus-grid">
            {DISTRICT.focuses.map((f, i) => (
              <Reveal
                key={f.id}
                delay={(i % 3) * 70}
                className="focus-card"
                as="article"
              >
                <span className="focus-icon">
                  <FocusIcon name={f.icon} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Our place / mapping ---------- */}
      <section
        className="section section-tint"
        aria-labelledby="district-our-place"
      >
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">Our place in it</span>
              <h2 className="sec-title" id="district-our-place">
                Club projects, district priorities
              </h2>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <p className="lede district-mapping-intro">
              {DISTRICT.ourPlace.text}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <table className="mapping-table">
              <caption className="sr-only">
                How RAC Menengai service areas map to District 9215 priorities
              </caption>
              <thead>
                <tr>
                  <th scope="col">Our service area</th>
                  <th scope="col">District priority</th>
                </tr>
              </thead>
              <tbody>
                {DISTRICT.ourPlace.mapping.map((m) => (
                  <tr key={m.club}>
                    <th scope="row">{m.club}</th>
                    <td>{m.district}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* ---------- Events + engagement ---------- */}
      <section className="section" aria-labelledby="district-events">
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">District life</span>
              <h2 className="sec-title" id="district-events">
                Events and ways to take part
              </h2>
            </div>
          </Reveal>
          <div className="district-events">
            {DISTRICT.events.map((e, i) => (
              <Reveal
                key={e.id}
                delay={i * 80}
                className="event-card"
                as="article"
              >
                <span className="event-when">{e.when}</span>
                <h3>{e.title}</h3>
                {e.where ? <p className="event-where">{e.where}</p> : null}
                <p>{e.text}</p>
                {e.href ? (
                  <a
                    className="linked-inline"
                    href={e.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Details on the district site{" "}
                    <ExternalLink aria-hidden="true" size={14} />
                  </a>
                ) : null}
              </Reveal>
            ))}
          </div>

          <Reveal delay={80}>
            <div className="engagement-card">
              <h3>How members take part beyond the club</h3>
              <ul>
                {DISTRICT.engagement.map((g) => (
                  <li key={g}>
                    <Check aria-hidden="true" /> {g}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Sources ---------- */}
      <section
        className="section section-tint"
        aria-labelledby="district-sources"
      >
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">Go to the source</span>
              <h2 className="sec-title" id="district-sources">
                District links
              </h2>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <ul className="link-list">
              {DISTRICT.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label} <ExternalLink aria-hidden="true" size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <p className="disclaimer">{DISTRICT.disclaimer}</p>
          </Reveal>
          <Reveal delay={140}>
            <div className="district-cta">
              <div>
                <p>
                  Curious about Rotaract in Nakuru? We meet every{" "}
                  {CLUB.meeting.dayLabel}, {CLUB.meeting.timeLabel} — guests are
                  welcome.
                </p>
                <div className="district-cta-actions">
                  <ButtonLink to="/membership" variant="primary" size="md">
                    Attend a fellowship <ArrowRight aria-hidden="true" />
                  </ButtonLink>
                  <ButtonLink to="/about" variant="secondary" size="md">
                    About our club
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
