/**
 * Home page sections in narrative order: hero, trust/proof, what we do,
 * featured impact, current opportunity, leadership preview, stories, final CTA.
 */
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Check, MapPin, Sparkles } from 'lucide-react';
import { CLUB, FEATURED_PROJECT_SLUG, FINAL_CTA, HERO, HERO_IMAGES, LEADERS, NEWS, PARTNERS, PROJECTS, ROTARY, SERVICES, STATS } from '../data';
import { Reveal } from '../hooks';
import { ButtonLink, SectionHeading, SmartImage, StatBar } from './ui';
import { LeaderCard, OpportunityCard, ServiceAreaCard, StoryCard } from './cards';
import { useFellowshipStatus } from './layout';

/* ---------- Hero ---------- */
export function Hero() {
  const fellowshipLine = useFellowshipStatus();
  return (
    <section className="hero" id="top">
      <div className="hero-bg" style={{ backgroundImage: `url('${HERO_IMAGES.background}')` }} aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container hero-inner">
        <span className="hero-eyebrow">
          <Sparkles aria-hidden="true" size={14} />
          {HERO.eyebrow}
        </span>
        <h1>
          A Decade of <em className="hero-accent">{HERO.titleAccent}</em>
        </h1>
        <p className="hero-lead">{HERO.lead}</p>
        <div className="hero-ctas">
          <ButtonLink to="/membership" variant="primary" size="lg">
            {HERO.primaryCta} <ArrowRight aria-hidden="true" />
          </ButtonLink>
          <ButtonLink to="/projects" variant="ghost" size="lg">
            {HERO.secondaryCta}
          </ButtonLink>
        </div>
        <Link to="/membership" className="hero-meeting" aria-label={`${fellowshipLine} — see how to attend`}>
          <CalendarDays aria-hidden="true" size={15} />
          <span>{fellowshipLine}</span>
          <ArrowRight aria-hidden="true" size={15} />
        </Link>
      </div>
    </section>
  );
}

/* ---------- Trust / proof bar ---------- */
export function TrustBar() {
  return (
    <section className="trust" aria-label="Club credibility">
      <div className="container">
        <StatBar stats={STATS} />
      </div>
    </section>
  );
}

/* ---------- What we do ---------- */
export function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHeading eyebrow="What we do" title="Four ways we serve Nakuru" lead="Every project sits inside Rotary’s global areas of focus — delivered with local context, local partners and a lot of heart." center />
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <ServiceAreaCard key={s.id} area={s} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Featured impact story ---------- */
export function FeaturedImpact() {
  const project = PROJECTS.find((p) => p.slug === FEATURED_PROJECT_SLUG) ?? PROJECTS[0];
  return (
    <section className="section featured" id="featured">
      <div className="container featured-grid">
        <Reveal className="featured-media" as="div">
          <SmartImage
            src={project.image}
            alt={`${project.title} — club members during the project`}
            width={800}
            height={920}
            loading="lazy"
            fallback={project.title}
          />
          <span className="featured-caption">{project.title} · {project.year}</span>
        </Reveal>
        <div className="featured-copy">
          <SectionHeading dark eyebrow="Featured impact" title={project.title} lead={project.challenge} />
          <p className="featured-detail">{project.detail}</p>
          <div className="featured-meta">
            <span>
              <MapPin aria-hidden="true" /> {project.location}
            </span>
            {project.partners && project.partners.length > 0 ? (
              <p className="featured-partners">
                <strong>With:</strong> {project.partners.join(' · ')}
              </p>
            ) : null}
          </div>
          {project.results ? (
            <ul className="featured-results">
              {project.results.map((r) => (
                <li key={r}>
                  <Check aria-hidden="true" /> {r}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="featured-actions">
            <ButtonLink to={`/projects/${project.slug}`} variant="primary">
              Read the project story <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to="/projects" variant="ghost">
              All projects
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Current opportunity ---------- */
export function OpportunitySection() {
  return (
    <section className="section opportunity" id="opportunity">
      <div className="container opportunity-layout">
        <SectionHeading
          eyebrow="Current opportunity"
          title="Join us this Thursday"
          lead="No application, no pressure. Come as a guest, meet the members, see the work — then decide."
        />
        <OpportunityCard />
        <div className="opportunity-links">
          <Link to="/membership" className="linked-inline">
            See how joining works <ArrowRight aria-hidden="true" />
          </Link>
          <Link to="/news" className="linked-inline">
            Recent club moments <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Leadership preview ---------- */
export function LeadershipPreview() {
  const preview = LEADERS.filter((l) => l.kind === 'board').concat(LEADERS.find((l) => l.name === 'John Brodrick') ?? []).slice(0, 3);
  return (
    <section className="section leadership" id="leadership">
      <div className="container">
        <SectionHeading eyebrow="The people" title="Leadership that leads with heart" center />
        <div className="leaders-grid">
          {preview.map((l, i) => (
            <LeaderCard key={l.name} leader={l} delay={i * 80} linkTo="/leadership" />
          ))}
        </div>
        <div className="section-more">
          <ButtonLink to="/leadership" variant="secondary" size="sm">
            Meet the full team <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* ---------- Stories preview ---------- */
export function StoriesPreview() {
  return (
    <section className="section stories" id="stories">
      <div className="container">
        <SectionHeading eyebrow="Stories" title="Club updates & recent moments" lead="Straight from the club — service, fellowship and partnerships in Nakuru." />
        <ul className="stories-grid">
          {NEWS.slice(0, 3).map((n, i) => (
            <StoryCard key={n.title} story={n} delay={i * 80} to="/news" />
          ))}
        </ul>
        <div className="section-more">
          <ButtonLink to="/news" variant="secondary" size="sm">
            All stories <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}


/* ---------- Rotary at a glance (home band) ---------- */
export function RotaryBand() {
  return (
    <section className="section section-tint" aria-labelledby="rotary-band-title">
      <div className="container">
        <Reveal>
          <div className="section-head-block center-block">
            <span className="eyebrow">Backed by Rotary</span>
            <h2 className="sec-title" id="rotary-band-title">
              Local projects, global network
            </h2>
            <p className="sec-lead">
              Our club sits inside Rotary International — 1.2 million members in more than 200 countries and geographical
              areas, seven areas of focus, and the polio eradication effort behind it all.
            </p>
          </div>
        </Reveal>
        <div className="stat-band">
          {ROTARY.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 70} className="stat-band-cell">
              <span className="sb-value">{s.value}</span>
              <span className="sb-label">{s.label}</span>
              <span className="sb-note">{s.note}</span>
            </Reveal>
          ))}
        </div>
        <div className="section-more">
          <ButtonLink to="/rotary" variant="secondary" size="sm">
            Explore Rotary worldwide <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
export function FinalCta() {
  return (
    <section className="section finalcta" id="join">
      <div className="container finalcta-inner">
        <Reveal>
          <h2>{FINAL_CTA.headline}</h2>
          <p className="finalcta-lead">{FINAL_CTA.lead}</p>
          <div className="finalcta-actions">
            <ButtonLink to="/membership" variant="primary" size="lg">
              Attend a fellowship <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to="/contact?interest=partner-project" variant="light" size="lg">
              Partner with us
            </ButtonLink>
            <ButtonLink to="/contact?interest=support-project" variant="light" size="lg">
              Support a project
            </ButtonLink>
          </div>
          <p className="finalcta-note">
            {CLUB.city} · {CLUB.district} · Guests always welcome
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* Partners strip (shared: used on home + pages that need it) */
export function PartnersStrip() {
  return (
    <section className="section partners-strip" aria-label="Our partners">
      <div className="container">
        <SectionHeading eyebrow="Our community" title="Who we serve alongside" center />
        <ul className="partner-list">
          {PARTNERS.map((p) => (
            <li key={p.name} className="partner-chip">
              {p.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}