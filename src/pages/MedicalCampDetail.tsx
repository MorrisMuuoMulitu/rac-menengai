import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Download,
  FileText,
  MapPin,
} from "lucide-react";
import { Gallery } from "../components/Gallery";
import { ButtonLink, PageMeta } from "../components/ui";
import { dateLabel, type PublicEvent } from "../content";

export function MedicalCampDetail({ event }: { event: PublicEvent }) {
  const impact = event.impact ?? [];
  const services = event.services ?? [];
  const video = event.video;
  const report = event.report;
  const heroPhoto = event.images[0];

  return (
    <>
      <PageMeta
        title="Nakuru Free Medical Outreach: 320 people served"
        description="See the impact of the Nakuru Free Medical Outreach on 18 November 2026: 320 people served, 15 blood donations, 18 cervical cancer screenings, 18 partner organisations and more than 70 volunteers."
      />

      <article className="medical-story">
        <header className="medical-hero" aria-labelledby="medical-story-title">
          <div className="container medical-hero-grid">
            <div className="medical-hero-copy">
              <p className="medical-complete">
                <span>Completed</span>
                <time dateTime={event.date}>{dateLabel(event.date)}</time>
              </p>
              <h1 id="medical-story-title">
                Healthcare Within Reach.
                <span>Community at Heart.</span>
              </h1>
              <p className="medical-hero-lead">
                The Rotaract Club of Menengai brought together healthcare
                professionals, partners and volunteers to provide essential
                medical services and support to the Nakuru community.
              </p>
              <dl className="medical-hero-facts">
                <div>
                  <dt>
                    <CalendarDays size={17} aria-hidden="true" />
                    Date
                  </dt>
                  <dd>Wednesday 18 November 2026</dd>
                </div>
                <div>
                  <dt>
                    <MapPin size={17} aria-hidden="true" />
                    Venue
                  </dt>
                  <dd>Railways (Patel Brotherhood Grounds), Nakuru</dd>
                </div>
              </dl>
              <a className="medical-hero-link" href="#impact">
                Explore the impact <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>

            <div className="medical-hero-media">
              <div className="medical-hero-block" aria-hidden="true" />
              {heroPhoto ? (
                <figure className="medical-hero-photo">
                  <img
                    src={heroPhoto.src}
                    srcSet={heroPhoto.srcSet}
                    sizes="(max-width: 760px) 82vw, 430px"
                    alt={heroPhoto.alt}
                    width={heroPhoto.width ?? 576}
                    height={heroPhoto.height ?? 1024}
                    {...{ fetchpriority: "high" }}
                  />
                  <figcaption>
                    A consultation station at Railways on 18 November.
                  </figcaption>
                </figure>
              ) : null}
              <div
                className="medical-hero-result"
                aria-label="320 people served"
              >
                <strong>320</strong>
                <span>people served</span>
              </div>
            </div>
          </div>
        </header>

        <section
          className="medical-impact"
          id="impact"
          aria-labelledby="medical-impact-title"
        >
          <div className="container">
            <div className="medical-section-heading">
              <p className="section-label">The result</p>
              <h2 id="medical-impact-title">Impact at a glance.</h2>
              <p>
                Five measures show the scale and range of the day without
                combining services that count different things.
              </p>
            </div>
            <dl className="medical-impact-grid">
              {impact.map((item) => (
                <div key={item.label}>
                  <dd>{item.value}</dd>
                  <dt>{item.label}</dt>
                  <p>{item.detail}</p>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          className="medical-about"
          aria-labelledby="medical-about-title"
        >
          <div className="container medical-about-grid">
            <div>
              <p className="section-label">About the outreach</p>
              <h2 id="medical-about-title">
                One day. Many hands. Care made easier to reach.
              </h2>
            </div>
            <div className="medical-about-copy">
              {event.story?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {event.outcome ? (
                <div className="medical-outcome">
                  <span>Recorded impact</span>
                  <p>{event.outcome}</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {video ? (
          <section
            className="medical-video-section"
            aria-labelledby="medical-video-title"
          >
            <div className="container medical-video-grid">
              <figure className="medical-video-figure">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={video.poster}
                  aria-label={video.title}
                >
                  <source src={video.src} type="video/mp4" />
                  <p>
                    Your browser cannot play this video.{" "}
                    <a href={video.src}>Open the video file</a>.
                  </p>
                </video>
                <figcaption>{video.caption}</figcaption>
              </figure>
              <div className="medical-video-copy">
                <p className="section-label">From our President</p>
                <h2 id="medical-video-title">
                  Hear the Story.
                  <span>See the Impact.</span>
                </h2>
                <p>
                  Take a look back at our medical outreach and hear directly
                  from our club leadership about the initiative and its impact
                  on the community.
                </p>
                <a className="medical-video-link" href={video.src}>
                  Open the video <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
        ) : null}

        {services.length ? (
          <section
            className="medical-services"
            aria-labelledby="medical-services-title"
          >
            <div className="container">
              <div className="medical-section-heading medical-services-heading">
                <p className="section-label">At the camp</p>
                <h2 id="medical-services-title">What the team provided.</h2>
                <p>
                  These are the services documented for the outreach. They are
                  listed separately because each one is a distinct part of the
                  day.
                </p>
              </div>
              <ul className="medical-services-list">
                {services.map((service) => (
                  <li key={service.title}>
                    <span className="medical-service-mark" aria-hidden="true">
                      <Check size={16} strokeWidth={2.4} />
                    </span>
                    <div>
                      <h3>{service.title}</h3>
                      <p>{service.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {event.images.length ? (
          <section
            className="medical-gallery"
            aria-labelledby="medical-gallery-title"
          >
            <div className="container">
              <div className="medical-gallery-head">
                <div>
                  <p className="section-label">From the field</p>
                  <h2 id="medical-gallery-title">Scenes from the day.</h2>
                </div>
                <p>
                  {event.images.length} photographs supplied by the club, from
                  the welcome area and consultations to the closing group
                  photograph.
                </p>
              </div>
              <Gallery
                photos={event.images}
                label="Scenes from the Nakuru Free Medical Outreach"
                sizes="(max-width: 700px) 88vw, 410px"
              />
              <div className="medical-volunteers">
                <strong>70+</strong>
                <div>
                  <h2>Volunteers who showed up.</h2>
                  <p>
                    Their time, attention and practical support helped make the
                    outreach possible.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {report ? (
          <section
            className="medical-report-section"
            id="partners-report"
            aria-labelledby="medical-report-title"
          >
            <div className="container medical-report-grid">
              <a
                className="medical-report-cover"
                href={report.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${report.title}`}
              >
                <img
                  src={report.preview}
                  alt={`Cover of ${report.title}`}
                  width={900}
                  height={1165}
                  loading="eager"
                  decoding="async"
                />
                <span>
                  Open report <ArrowUpRight size={17} aria-hidden="true" />
                </span>
              </a>

              <div className="medical-report-copy">
                <p className="section-label">Partners' report</p>
                <h2 id="medical-report-title">
                  The full account.
                  <span>From the people who delivered it.</span>
                </h2>
                <p>{report.description}</p>
                <dl>
                  <div>
                    <dt>Prepared by</dt>
                    <dd>{report.preparedBy}</dd>
                  </div>
                  <div>
                    <dt>Published</dt>
                    <dd>{report.publishedDate}</dd>
                  </div>
                  <div>
                    <dt>Report length</dt>
                    <dd>22 pages</dd>
                  </div>
                </dl>

                <div className="medical-report-actions">
                  <a
                    className="btn btn-primary btn-md"
                    href={report.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read the PDF <FileText size={17} aria-hidden="true" />
                  </a>
                  <a
                    className="medical-report-download"
                    href={report.href}
                    download
                  >
                    Download PDF <Download size={17} aria-hidden="true" />
                  </a>
                </div>
                <Link
                  className="medical-report-partners-link"
                  to="/partnerships#partners"
                >
                  See all community partners{" "}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section
          className="medical-record"
          aria-labelledby="medical-record-title"
        >
          <div className="container">
            <div>
              <p className="section-label">Event record</p>
              <h2 id="medical-record-title">Nakuru Free Medical Outreach</h2>
            </div>
            <dl>
              <div>
                <dt>Date</dt>
                <dd>Wednesday 18 November 2026</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>
                  {event.start}–{event.end} EAT
                </dd>
              </div>
              <div>
                <dt>Venue</dt>
                <dd>{event.location}</dd>
              </div>
              <div>
                <dt>Organiser</dt>
                <dd>{event.organizer}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          className="medical-close"
          aria-labelledby="medical-close-title"
        >
          <div className="container">
            <p className="section-label">The work continues</p>
            <h2 id="medical-close-title">
              Service Above Self.
              <span>Impact That Lasts.</span>
            </h2>
            <p>
              Together, we continue building healthier communities through
              service, collaboration and meaningful action.
            </p>
            <div className="medical-close-actions">
              <ButtonLink to="/projects" variant="light">
                Explore our projects <ArrowRight size={18} aria-hidden="true" />
              </ButtonLink>
              <Link to="/partnerships" className="medical-close-link">
                Partner with us <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
