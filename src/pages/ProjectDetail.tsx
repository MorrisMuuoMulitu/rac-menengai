/**
 * Project detail — one verified story: challenge, action, location, partners,
 * results and the next step.
 */
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, Check, MapPin } from 'lucide-react';
import { CLUB, PROJECTS, PROJECT_FUNDING, ROTARY } from '../data';
import { ButtonLink, PageMeta, SmartImage } from '../components/ui';
import { FocusIcon } from '../components/icons';
import { ProjectCard } from '../components/cards';
import { OpportunityCard } from '../components/cards';
import NotFoundPage from './NotFound';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) return <NotFoundPage />;

  const more = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 3);
  const focusAreas = (project.areasOfFocus ?? [])
    .map((id) => ROTARY.focuses.find((f) => f.id === id))
    .filter((f): f is (typeof ROTARY.focuses)[number] => Boolean(f));

  return (
    <>
      <PageMeta
        title={project.title}
        description={`${project.summary} — Rotaract Club of Menengai, ${project.location}.`}
      />
      <article className="project-detail">
        <div className="container detail-top">
          <Link to="/projects" className="back-link">
            <ArrowLeft aria-hidden="true" /> All projects
          </Link>
          <span className="detail-tag">{project.tag}</span>
          <h1>{project.title}</h1>
          <div className="detail-meta">
            <span>
              <CalendarDays aria-hidden="true" /> {project.year}
            </span>
            <span>
              <MapPin aria-hidden="true" /> {project.location}
            </span>
          </div>
        </div>

        <div className="container detail-hero-media">
          <SmartImage
            src={project.image}
            alt={`${project.title} — photograph from the project`}
            width={1200}
            height={675}
            fallback={project.title}
          />
          {project.caption ? <span className="detail-caption">{project.caption}</span> : null}
        </div>

        <div className="container detail-body">
          <div className="detail-main">
            {project.challenge ? (
              <section className="detail-block">
                <h2>The challenge</h2>
                <p>{project.challenge}</p>
              </section>
            ) : null}
            <section className="detail-block">
              <h2>What the club did</h2>
              <p>{project.detail}</p>
            </section>
            {project.reached && project.reached.length > 0 ? (
              <section className="detail-block">
                <h2>People & communities reached</h2>
                <ul className="detail-reached">
                  {project.reached.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </section>
            ) : null}
            {project.results && project.results.length > 0 ? (
              <section className="detail-block">
                <h2>Verified outputs & outcomes</h2>
                <ul className="detail-results">
                  {project.results.map((r) => (
                    <li key={r}>
                      <Check aria-hidden="true" /> {r}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {focusAreas.length > 0 ? (
              <section className="detail-block">
                <h2>Where this sits in Rotary</h2>
                <p>
                  Rotary organises its work around seven areas of focus. This project sits in{' '}
                  {focusAreas.length > 1 ? 'two of them' : 'one of them'}:
                </p>
                <ul className="focus-badges">
                  {focusAreas.map((f) => (
                    <li key={f.id}>
                      <Link className="focus-badge" to={`/rotary#${f.id}`}>
                        <span className="focus-badge-icon">
                          <FocusIcon name={f.icon} />
                        </span>
                        {f.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="detail-funding">{PROJECT_FUNDING.note}</p>
              </section>
            ) : null}
            <div className="detail-actions">
              <ButtonLink to="/membership" variant="primary">
                Attend a fellowship <ArrowRight aria-hidden="true" />
              </ButtonLink>
              <ButtonLink to="/contact" variant="secondary">
                Partner on a project like this
              </ButtonLink>
            </div>
          </div>

          <aside className="detail-aside">
            {project.partners && project.partners.length > 0 ? (
              <div className="detail-aside-card">
                <h3>Partners</h3>
                <ul>
                  {project.partners.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="detail-aside-card">
              <h3>Rotary context</h3>
              <p>
                We are a Rotaract club inside{' '}
                <Link to={PROJECT_FUNDING.rotaryHref}>Rotary International</Link>, part of{' '}
                <Link to={PROJECT_FUNDING.districtHref}>{CLUB.district}</Link>.
              </p>
            </div>
            <div className="detail-aside-card">
              <h3>About the club</h3>
              <p>
                {CLUB.name} serves {CLUB.city} with young leaders, fellowship every {CLUB.meeting.dayLabel}, and
                {CLUB.district} behind us.
              </p>
            </div>
          </aside>
        </div>
      </article>

      <section className="section section-tint">
        <div className="container">
          <h2 className="sec-title sec-title-inline">More projects</h2>
          <ul className="projects-grid">
            {more.map((p, i) => (
              <ProjectCard key={p.slug} project={p} delay={i * 70} />
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <OpportunityCard compact />
        </div>
      </section>
    </>
  );
}