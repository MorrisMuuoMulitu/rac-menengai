import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PUBLIC_EVENTS, dateLabel } from "../content";
import { PageHero, PageMeta, ButtonLink } from "../components/ui";
import { fellowship, fellowshipStatus } from "../lib/fellowship";
import { FELLOWSHIP_OVERRIDE, PROJECTS } from "../data";
import { downloadCalendar, initialEventView } from "../lib/events";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import NotFoundPage from "./NotFound";
import { Gallery } from "../components/Gallery";
import { MedicalCampDetail } from "./MedicalCampDetail";
export default function EventsPage() {
  const [view, setView] = useState<"upcoming" | "past">(() =>
    initialEventView(PUBLIC_EVENTS),
  );
  const now = new Date();
  const records = PUBLIC_EVENTS.filter((e) =>
    view === "past"
      ? e.status === "completed" || new Date(`${e.date}T23:59:59+03:00`) < now
      : e.status !== "cancelled" &&
        e.status !== "completed" &&
        new Date(`${e.date}T23:59:59+03:00`) >= now,
  ).sort((a, b) =>
    view === "past"
      ? b.date.localeCompare(a.date)
      : a.date.localeCompare(b.date),
  );
  return (
    <>
      <PageMeta
        title="Events & fellowship"
        description="Plan a visit to Menengai’s Thursday fellowship in Nakuru and explore the club’s past community events."
      />
      <PageHero
        eyebrow="Events & fellowship"
        title="What happened, and when."
        lead="The record of club life — fellowships, distributions, school visits and camps, each with its own photographs. The programmes behind them live on Projects."
      />
      <section className="section">
        <div className="container">
          <FellowshipVisit />
          <div
            className="filter-row event-tabs"
            role="group"
            aria-label="Choose event archive"
          >
            {(["upcoming", "past"] as const).map((v) => (
              <button
                className={`filter-btn${view === v ? " active" : ""}`}
                key={v}
                aria-pressed={view === v}
                onClick={() => setView(v)}
              >
                {v === "past" ? "Past events" : "Upcoming events"}
              </button>
            ))}
          </div>
          <p className="page-crosslink">
            These are occasions, one at a time. For the ongoing work they belong
            to, see <Link to="/projects">our programmes</Link>.
          </p>
          <div className="event-records" aria-live="polite">
            {records.length ? (
              records.map((e) => (
                <Link
                  className={`event-record${e.images.length ? " event-record--photo" : ""}`}
                  to={`/events/${e.slug}`}
                  key={e.slug}
                >
                  {e.images[0] && (
                    <img
                      className="event-record-photo"
                      src={e.images[0].thumb || e.images[0].src}
                      alt={e.images[0].alt}
                      width={240}
                      height={180}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <time dateTime={e.date || undefined}>
                    {dateLabel(e.date)}
                  </time>
                  <div>
                    <h2>{e.title}</h2>
                    <p>
                      {e.location}
                      {e.partners.length
                        ? e.partners.length <= 2
                          ? ` · with the ${e.partners.join(" and the ")}`
                          : ` · with the ${e.partners[0]} and ${e.partners.length - 1} other partners`
                        : ""}
                    </p>
                  </div>
                  <span className="event-record-action">
                    View event <ArrowUpRight size={17} aria-hidden="true" />
                  </span>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <h2>No additional events announced here.</h2>
                <p>
                  Weekly fellowship continues. Check with the club for the
                  latest programme.
                </p>
                <ButtonLink to="/contact" variant="secondary">
                  Ask about activities
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
export function FellowshipVisit() {
  const state = fellowshipStatus(new Date(), {
    ...fellowship,
    override: FELLOWSHIP_OVERRIDE,
  });
  const [feedback, setFeedback] = useState("");
  return (
    <div className="fellowship-visit">
      <div>
        <p className="section-label">Weekly fellowship</p>
        <h2>Thursday, 5:00–7:00 PM</h2>
        <p>Nakuru Athletic Club, Nakuru · Africa/Nairobi (EAT)</p>
        <p>
          Guests are welcome at Nakuru Athletic Club — just come along on a
          Thursday.
        </p>
        <p className="recurring-note">
          <strong>Book Club Review</strong> every second Sunday of the month:
          reading, learning and fellowship with members.
        </p>
        {state.kind === "override" && <p role="status">{state.message}</p>}
      </div>
      <div>
        <a
          className="btn btn-primary btn-md"
          href="mailto:menengairc@gmail.com?subject=Coming%20to%20a%20Thursday%20fellowship"
        >
          Tell us you’re coming
        </a>
        {state.kind !== "override" && (
          <button
            className="btn btn-secondary btn-md"
            onClick={() => {
              const current = fellowshipStatus(new Date(), {
                ...fellowship,
                override: FELLOWSHIP_OVERRIDE,
              });
              if (current.kind === "override") return;
              downloadCalendar({
                slug: `fellowship-${current.start.toISOString().slice(0, 10)}`,
                title: "Rotaract Club of Menengai fellowship",
                start: current.start.toISOString(),
                end: current.end.toISOString(),
                location: "Nakuru Athletic Club, Nakuru",
                description:
                  "Thursday fellowship, 17:00–19:00 EAT at Nakuru Athletic Club. Guests are welcome.",
                status: "scheduled",
              });
              setFeedback("Calendar file prepared for Nakuru Athletic Club.");
            }}
          >
            Add next fellowship to calendar
          </button>
        )}
        <p role="status" className="form-hint">
          {feedback}
        </p>
      </div>
    </div>
  );
}
export function EventDetail() {
  const { slug } = useParams();
  const event = PUBLIC_EVENTS.find((e) => e.slug === slug);
  if (!event) return <NotFoundPage />;
  const programme = event.projectSlug
    ? PROJECTS.find((p) => p.slug === event.projectSlug)
    : undefined;
  if (event.slug === "medical-camp-2026") {
    return <MedicalCampDetail event={event} />;
  }
  const past =
    event.status === "completed" ||
    new Date(`${event.date}T23:59:59+03:00`) < new Date();
  return (
    <>
      <PageMeta title={event.title} description={event.description} />
      <PageHero
        eyebrow={past ? "Past event" : "Upcoming event"}
        title={event.title}
        lead={event.description}
      />
      <section className="section">
        <div className="container">
          <Link to="/events">Back to events</Link>
          {/* Club-supplied photograph: sits full width above the record, at the
              container's measure rather than the prose column's. */}
          {event.image ? (
            <figure className="event-hero-photo">
              <a
                className="event-photo-link"
                href={event.image}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open the full-size image of ${event.title}`}
              >
                <img
                  src={event.image}
                  srcSet={event.images[0]?.srcSet}
                  sizes="(max-width: 700px) 100vw, 1080px"
                  alt={event.images[0]?.alt ?? event.title}
                  width={event.images[0]?.width ?? 1280}
                  height={event.images[0]?.height ?? 962}
                  {...{ fetchpriority: "high" }}
                />
                <span className="event-photo-open">
                  View full size <Maximize2 size={15} aria-hidden="true" />
                </span>
              </a>
            </figure>
          ) : null}
        </div>
        <div className="container article-body">
          <dl className="event-details">
            <div>
              <dt>Date</dt>
              <dd>{dateLabel(event.date)}</dd>
            </div>
            {event.start ? (
              <div>
                <dt>Time</dt>
                <dd>
                  {event.start}
                  {event.end ? `–${event.end}` : ""}
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Venue</dt>
              <dd>{event.location}</dd>
            </div>
            <div>
              <dt>Organiser</dt>
              <dd>{event.organizer}</dd>
            </div>
            {event.partners.length ? (
              <div>
                <dt>With</dt>
                <dd>{event.partners.join(", ")}</dd>
              </div>
            ) : null}
            <div>
              <dt>Status</dt>
              <dd>{past ? "Completed" : "Scheduled"}</dd>
            </div>
          </dl>
          {event.story?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {event.outcome ? (
            <section aria-label="Event outcome">
              <h2>
                {event.slug === "india-friendship-exchange-2026"
                  ? "What the exchange brought to Menengai"
                  : "The outcome"}
              </h2>
              <p>{event.outcome}</p>
            </section>
          ) : null}
          <p>
            {event.start
              ? `Confirmed times: ${event.start}${event.end ? `–${event.end}` : ""}.`
              : "Exact start and end times were not recorded in the source. Calendar export is available only for events with confirmed times."}
          </p>
          {/* Records differ: some cite an external report, others come from the
              club's own bulletin. Render only what the record actually has. */}
          <p>
            {event.sourceUrl?.startsWith("http") ? (
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Original event report
              </a>
            ) : (
              <span className="fine-print">{event.approval}</span>
            )}
          </p>
          {programme ? (
            <p className="event-programme">
              Part of the{" "}
              <Link to={`/projects/${programme.slug}`}>{programme.title}</Link>{" "}
              programme.
            </p>
          ) : null}
        </div>
        {event.images.length > 1 ? (
          <div className="container">
            <div className="event-gallery-block">
              <h2 className="event-gallery-title">
                {event.slug === "india-friendship-exchange-2026"
                  ? "Photographs from the exchange"
                  : "Photographs from the day"}
                <span>{event.images.length} images · supplied by the club</span>
              </h2>
              <Gallery
                photos={event.images}
                label={`Photographs from ${event.title}`}
              />
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
