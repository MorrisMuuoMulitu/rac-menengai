import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PUBLIC_EVENTS, dateLabel } from "../content";
import { PageHero, PageMeta, ButtonLink } from "../components/ui";
import { fellowship, fellowshipStatus } from "../lib/fellowship";
import { FELLOWSHIP_OVERRIDE } from "../data";
import { downloadCalendar } from "../lib/events";
import NotFoundPage from "./NotFound";
export default function EventsPage() {
  const [view, setView] = useState<"upcoming" | "past">("upcoming");
  const now = new Date();
  const records = PUBLIC_EVENTS.filter((e) =>
    view === "past"
      ? new Date(`${e.date}T23:59:59+03:00`) < now
      : new Date(`${e.date}T23:59:59+03:00`) >= now,
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
        title="Come along."
        lead="Meet the club at fellowship. Take part in a project. Start with a conversation."
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
          <div className="event-records" aria-live="polite">
            {records.length ? (
              records.map((e) => (
                <Link
                  className="event-record"
                  to={`/events/${e.slug}`}
                  key={e.slug}
                >
                  <time dateTime={e.date}>{dateLabel(e.date)}</time>
                  <div>
                    <h2>{e.title}</h2>
                    <p>{e.location}</p>
                  </div>
                  <span>{view === "past" ? "Completed" : "View event"}</span>
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
        <h2>Thursday, 5:30–6:30 PM</h2>
        <p>Nakuru · Africa/Nairobi (EAT)</p>
        <p>Guests are welcome. Ask for the venue before travelling.</p>
        {state.kind === "override" && <p role="status">{state.message}</p>}
      </div>
      <div>
        <a
          className="btn btn-primary btn-md"
          href="mailto:menengairc@gmail.com?subject=Fellowship%20venue%20and%20visit"
        >
          Ask for the venue
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
                location: "Nakuru, Kenya; confirm venue with club",
                description:
                  "Thursday fellowship, 17:30–18:30 EAT. Confirm the venue with menengairc@gmail.com before visiting.",
                status: "scheduled",
              });
              setFeedback(
                "Calendar file prepared. Confirm the venue with the club before attending.",
              );
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
  const past = new Date(`${event.date}T23:59:59+03:00`) < new Date();
  return (
    <>
      <PageMeta title={event.title} description={event.description} />
      <PageHero
        eyebrow={past ? "Past event" : "Event"}
        title={event.title}
        lead={event.description}
      />
      <section className="section">
        <div className="container article-body">
          <Link to="/events">Back to events</Link>
          <dl className="event-details">
            <div>
              <dt>Date</dt>
              <dd>{dateLabel(event.date)}</dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>{event.location}</dd>
            </div>
            <div>
              <dt>Organiser</dt>
              <dd>{event.organizer}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{past ? "Completed" : event.status}</dd>
            </div>
          </dl>
          <p>
            Exact start and end times were not recorded in the source. Calendar
            export is available only for events with confirmed times.
          </p>
          <p>
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
              Original event report
            </a>
          </p>
          <ButtonLink to={`/news/${event.storySlug}`} variant="secondary">
            Read the event story
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
