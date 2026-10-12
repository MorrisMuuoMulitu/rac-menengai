/**
 * Rotary, worldwide — the global picture our club sits inside.
 *
 * Facts are paraphrased from Rotary International and GPEI material and linked
 * in the sources block; Rotary's own copy, images and logo files are not
 * reproduced (see ROTARY.brandNote).
 */
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Heart,
  Info,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import { CLUB, ROTARY } from "../data";
import {
  ButtonLink,
  PageHero,
  PageMeta,
  SectionHeading,
} from "../components/ui";
import { FocusIcon } from "../components/icons";
import { Reveal } from "../hooks";

export default function RotaryPage() {
  const { hash } = useLocation();

  /* Deep links like /rotary#wash land on the matching cause card. */
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <>
      <PageMeta
        title="Rotary, worldwide"
        description="Rotaract Club of Menengai sits inside Rotary International — 1.2 million members in 200+ countries, seven areas of focus, and the polio eradication effort. Here is the wider picture."
      />

      <PageHero
        eyebrow="Rotary International"
        title="Part of a 1.2-million-member network"
        lead={ROTARY.intro}
      >
        <ButtonLink to="/about/district-9215" variant="primary" size="sm">
          Our district: 9215 <ArrowRight aria-hidden="true" />
        </ButtonLink>
        <ButtonLink to="/projects" variant="secondary" size="sm">
          See our projects
        </ButtonLink>
      </PageHero>

      {/* ---------- Scale ---------- */}
      <section className="section section-tint" aria-labelledby="rotary-scale">
        <div className="container">
          <h2 id="rotary-scale" className="sr-only">
            Rotary at a glance
          </h2>
          <div className="stat-band">
            {ROTARY.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 70} className="stat-band-cell">
                <span className="sb-value">{s.value}</span>
                <span className="sb-label">{s.label}</span>
                <span className="sb-note">{s.note}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- What Rotary is + values ---------- */}
      <section className="section" aria-labelledby="rotary-what">
        <div className="container rotary-what">
          <div>
            <Reveal>
              <div className="section-head-block">
                <span className="eyebrow">What Rotary is</span>
                <h2 className="sec-title" id="rotary-what">
                  Local clubs, global reach
                </h2>
              </div>
            </Reveal>
            {ROTARY.what.map((p, i) => (
              <Reveal key={p} delay={i * 70}>
                <p className="lede">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={140}>
              <p className="district-callout">
                <Info aria-hidden="true" /> {ROTARY.asOf}
              </p>
            </Reveal>
          </div>
          <Reveal delay={80} className="values-panel">
            <h3>What members commit to</h3>
            <ul>
              {ROTARY.values.map((v) => (
                <li key={v.title}>
                  <strong>{v.title}</strong>
                  <span>{v.text}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- Seven areas of focus ---------- */}
      <section className="section section-tint" aria-labelledby="rotary-causes">
        <div className="container">
          <SectionHeading
            eyebrow="Seven areas of focus"
            title="Where Rotary concentrates its work"
            lead="These are the causes Rotary funds and organises around — and the framework our own projects are built on. Each one below shows the global picture and what it looks like in Nakuru."
            center
          />
          <div className="cause-grid">
            {ROTARY.focuses.map((f, i) => (
              <Reveal
                key={f.id}
                delay={(i % 3) * 70}
                className="cause-card"
                as="article"
                id={f.id}
              >
                <span className="focus-icon">
                  <FocusIcon name={f.icon} />
                </span>
                <h3>{f.title}</h3>
                <p className="cause-global">{f.global}</p>
                {f.local ? (
                  <p className="cause-local">
                    <MapPin aria-hidden="true" /> In Nakuru: {f.local}
                    {f.projectSlug ? (
                      <>
                        {" "}
                        <Link
                          className="cause-link"
                          to={`/projects/${f.projectSlug}`}
                        >
                          See the project
                        </Link>
                      </>
                    ) : null}
                  </p>
                ) : null}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Polio ---------- */}
      <section className="section" aria-labelledby="rotary-polio">
        <div className="container">
          <Reveal className="polio-card">
            <div className="polio-main">
              <span className="eyebrow">End polio</span>
              <h2 className="sec-title" id="rotary-polio">
                {ROTARY.polio.title}
              </h2>
              <p className="lede">{ROTARY.polio.launch}</p>
              <p className="polio-progress">
                <Shield aria-hidden="true" /> {ROTARY.polio.progress}
              </p>
              <p>{ROTARY.polio.status}</p>
              <p className="polio-why">
                <Heart aria-hidden="true" /> {ROTARY.polio.why}
              </p>
              <a
                className="linked-inline"
                href={ROTARY.polio.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Latest polio figures (GPEI){" "}
                <ExternalLink aria-hidden="true" size={14} />
              </a>
            </div>
            <aside className="polio-aside">
              <h3>Who fights polio together</h3>
              <ul>
                {ROTARY.polio.partners.map((p) => (
                  <li key={p}>
                    <Check aria-hidden="true" /> {p}
                  </li>
                ))}
              </ul>
              <p className="polio-note">
                Rotary is one of the initiative’s founding partners and its
                biggest volunteer army.
              </p>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* ---------- Foundation + Four-Way Test ---------- */}
      <section
        className="section section-tint"
        aria-labelledby="rotary-foundation"
      >
        <div className="container rotary-two-up">
          <Reveal className="foundation-card">
            <span className="eyebrow">Funding the work</span>
            <h2 className="sec-title-sm" id="rotary-foundation">
              {ROTARY.foundation.title}
            </h2>
            <p>{ROTARY.foundation.text}</p>
            <p>{ROTARY.foundation.local}</p>
            <a
              className="linked-inline"
              href={ROTARY.foundation.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ROTARY.foundation.hrefLabel}{" "}
              <ExternalLink aria-hidden="true" size={14} />
            </a>
          </Reveal>
          <Reveal delay={80} className="fourway-card">
            <span className="eyebrow">Ethics in practice</span>
            <h2 className="sec-title-sm">{ROTARY.fourWayTest.title}</h2>
            <p>{ROTARY.fourWayTest.intro}</p>
            <ol className="fourway-list">
              {ROTARY.fourWayTest.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ---------- Programs of Rotary ---------- */}
      <section className="section" aria-labelledby="rotary-programs">
        <div className="container">
          <SectionHeading
            eyebrow="The family of Rotary"
            title="Programmes, and where we fit"
            lead="Rotary is more than Rotary clubs. These are the programmes that make up the family — Rotaract is ours."
            center
          />
          <div className="program-grid">
            {ROTARY.programs.map((p, i) => (
              <Reveal
                key={p.id}
                delay={(i % 3) * 70}
                className={`program-card${p.ours ? " ours" : ""}`}
                as="article"
              >
                <h3>
                  {p.name}
                  {p.ages ? (
                    <span className="program-ages">{p.ages}</span>
                  ) : null}
                </h3>
                <p>{p.text}</p>
                {p.ours ? (
                  <span className="program-badge">That’s us</span>
                ) : null}
              </Reveal>
            ))}
          </div>

          <Reveal delay={80}>
            <div className="engagement-card">
              <h3>The five avenues of service</h3>
              <ul>
                {ROTARY.avenues.map((a) => (
                  <li key={a.title}>
                    <Check aria-hidden="true" />
                    <span>
                      <strong>{a.title}</strong> — {a.text}
                    </span>
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
        aria-labelledby="rotary-sources"
      >
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">Go to the source</span>
              <h2 className="sec-title" id="rotary-sources">
                Where these facts come from
              </h2>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <ul className="link-list">
              {ROTARY.sources.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label} <ExternalLink aria-hidden="true" size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <p className="disclaimer">{ROTARY.brandNote}</p>
          </Reveal>
          <Reveal delay={140}>
            <div className="district-cta">
              <span
                className="district-cta-mark district-cta-icon"
                aria-hidden="true"
              >
                <Users />
              </span>
              <div>
                <p>
                  The global network starts with a local club. Ours meets every{" "}
                  {CLUB.meeting.dayLabel} in {CLUB.city.split(",")[0]} — guests
                  are welcome.
                </p>
                <div className="district-cta-actions">
                  <ButtonLink to="/membership" variant="primary" size="md">
                    Attend a fellowship <ArrowRight aria-hidden="true" />
                  </ButtonLink>
                  <ButtonLink
                    to="/about/district-9215"
                    variant="secondary"
                    size="md"
                  >
                    Our district: 9215
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
