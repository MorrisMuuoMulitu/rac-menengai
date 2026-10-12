/**
 * Project detail — one verified story: challenge, action, location, partners,
 * results and the next step.
 */
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  MapPin,
} from "lucide-react";
import { CLUB, PROJECTS, PROJECT_FUNDING, ROTARY } from "../data";
import { ButtonLink, PageMeta, SmartImage } from "../components/ui";
import { FocusIcon } from "../components/icons";
import { ProjectCard } from "../components/cards";
import { OpportunityCard } from "../components/cards";
import NotFoundPage from "./NotFound";
import projectRecords from "../../content/projects.json";
import { PUBLIC_EVENTS, dateLabel } from "../content";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const relatedEvents = PUBLIC_EVENTS.filter(
    (e) => e.projectSlug === slug,
  ).sort((a, b) => b.date.localeCompare(a.date));
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) return <NotFoundPage />;

  const record = projectRecords.find((r) => r.slug === project.slug);
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
          <span className="detail-tag">
            {project.tag} · {record?.status ?? "Archive"}
          </span>
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
            src={project.image || undefined}
            alt={project.caption ?? "Image associated with this archive record"}
            width={1200}
            height={675}
            fallback={project.title}
          />
          {project.caption ? (
            <span className="detail-caption">{project.caption}</span>
          ) : null}
        </div>

        <div className="container detail-body">
          <div className="detail-main">
            <p className="source-note">
              This record is retained from the club website archive. Dates,
              photographs and activity totals need confirmation where an
              original source is not available.
            </p>
            {project.challenge ? (
              <section className="detail-block">
                <h2>The challenge</h2>
                <p>{project.challenge}</p>
              </section>
            ) : null}
            {record && (
              <section className="detail-block">
                <h2>Participation & source</h2>
                <p>{record.role}.</p>
                <p>{record.verification}</p>
                {record.date && <p>Event date: {record.date}</p>}
                {record.sourceUrl && (
                  <a
                    href={record.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read the original report
                  </a>
                )}
              </section>
            )}
            <section className="detail-block">
              <h2>Activity record</h2>
              <p>{project.detail}</p>
            </section>
            {relatedEvents.length > 0 ? (
              <section className="detail-block">
                <h2>Recent activity</h2>
                <p>
                  This programme runs through dated events. Each one has its own
                  record and photographs:
                </p>
                <ul className="project-events">
                  {relatedEvents.map((e) => (
                    <li key={e.slug}>
                      <Link to={`/events/${e.slug}`}>
                        <time dateTime={e.date}>{dateLabel(e.date)}</time>
                        <span className="project-event-title">{e.title}</span>
                        {e.images.length > 0 ? (
                          <img
                            src={e.images[0].thumb}
                            alt=""
                            width={160}
                            height={120}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
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
                <h2>Recorded activities</h2>
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
                  Rotary organises its work around seven areas of focus. This
                  project sits in{" "}
                  {focusAreas.length > 1 ? "two of them" : "one of them"}:
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
                We are a Rotaract club inside{" "}
                <Link to={PROJECT_FUNDING.rotaryHref}>
                  Rotary International
                </Link>
                , part of{" "}
                <Link to={PROJECT_FUNDING.districtHref}>{CLUB.district}</Link>.
              </p>
            </div>
            <div className="detail-aside-card">
              <h3>About the club</h3>
              <p>
                {CLUB.name} serves {CLUB.city} with young leaders, fellowship
                every {CLUB.meeting.dayLabel}, and
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
