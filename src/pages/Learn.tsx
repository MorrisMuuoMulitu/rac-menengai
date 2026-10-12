import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Search, X } from "lucide-react";
import { ButtonLink, PageMeta, SmartImage } from "../components/ui";
import { GLOSSARY, LEARNING_SOURCES, PROJECT_JOURNEY } from "../learning";
import { filterGlossary } from "../lib/glossary";
import { PUBLIC_EVENTS, dateLabel } from "../content";
import { ROTARY } from "../data";

export default function LearnPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const terms = filterGlossary(GLOSSARY, query, category);
  const stories = [
    "mother-pack-kabatini-august-2026",
    "art-day-pangani-2026",
    "mazingira-day-pangani-2026",
  ]
    .map((slug) => PUBLIC_EVENTS.find((event) => event.slug === slug))
    .filter((event): event is (typeof PUBLIC_EVENTS)[number] => Boolean(event));
  return (
    <>
      <PageMeta
        title="Learn about Rotaract"
        description="A plain-language Rotaract glossary, a short history and real service stories from Menengai in Nakuru."
      />
      <section className="learn-hero">
        <div className="container learn-hero-grid">
          <div className="learn-hero-copy">
            <p className="learn-kicker">
              <BookOpen size={20} aria-hidden="true" /> Get to know Rotaract
            </p>
            <h1>
              Big on service.
              <br />
              Easy to understand.
            </h1>
            <p>
              New to the club? Start here. Find the words, meet the movement and
              see what service looks like in Nakuru.
            </p>
            <div className="learn-hero-actions">
              <a className="btn btn-primary btn-md" href="#glossary">
                Explore the glossary
              </a>
              <ButtonLink
                to="/membership#first-visit"
                variant="secondary"
                size="md"
              >
                Plan your first visit
              </ButtonLink>
            </div>
            <nav className="learn-jump" aria-label="On this page">
              <a href="#service">Service in practice</a>
              <a href="#history">A short history</a>
              <Link to="/membership/orientation">Take the course</Link>
            </nav>
          </div>
          <figure className="learn-hero-photo">
            <SmartImage
              src={stories[1]?.images[0]?.src}
              alt={
                stories[1]?.images[0]?.alt ??
                "Art day at Pangani Special School"
              }
              width={800}
              height={650}
              fallback="Menengai in the community"
            />
            <figcaption>
              Learn together. Serve together.
              <Link to="/events/art-day-pangani-2026">
                Art day at Pangani <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </figcaption>
          </figure>
        </div>
      </section>
      <section
        className="section"
        id="glossary"
        aria-labelledby="glossary-title"
      >
        <div className="container glossary-layout">
          <div className="glossary-intro">
            <h2 id="glossary-title" className="sec-title">
              The words you’ll hear.
            </h2>
            <p>
              Acronyms should never be the thing that keeps you out of the
              conversation.
            </p>
            <p className="glossary-help">
              Try “DRR”, “fellowship” or “service”.
            </p>
            <Link to="/leadership">
              Meet the people behind the titles{" "}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="glossary-body">
            <label className="glossary-label" htmlFor="glossary-search">
              Find a word or acronym
            </label>
            <div className="glossary-search">
              <Search aria-hidden="true" size={21} />
              <input
                id="glossary-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the glossary"
                autoComplete="off"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear glossary search"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <div
              className="glossary-filters"
              role="group"
              aria-label="Glossary topics"
            >
              {["All", "Club life", "People", "Service"].map((topic) => (
                <button
                  type="button"
                  aria-pressed={category === topic}
                  onClick={() => setCategory(topic)}
                  key={topic}
                >
                  {topic}
                </button>
              ))}
            </div>
            <p className="glossary-count" role="status" aria-live="polite">
              {terms.length} {terms.length === 1 ? "term" : "terms"}
              {category !== "All" ? ` in ${category.toLowerCase()}` : ""}
            </p>
            {terms.length ? (
              <dl className="glossary-entries">
                {terms.map((entry) => (
                  <div key={entry.term}>
                    <dt>
                      {entry.term}
                      {entry.abbreviation ? (
                        <span>{entry.abbreviation}</span>
                      ) : null}
                    </dt>
                    <dd>{entry.definition}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="glossary-empty">
                <h3>No matching terms</h3>
                <p>Try a shorter word, or show every topic.</p>
                <button
                  className="btn btn-secondary btn-sm"
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                  }}
                >
                  Show all terms
                </button>
              </div>
            )}
            <p className="learn-source">
              Definitions adapted from{" "}
              <a
                href={LEARNING_SOURCES.rotaract}
                target="_blank"
                rel="noopener noreferrer"
              >
                Rotary’s Rotaract guidance
              </a>
              ,{" "}
              <a
                href={LEARNING_SOURCES.district}
                target="_blank"
                rel="noopener noreferrer"
              >
                District 9215
              </a>{" "}
              and our club information.{" "}
              <Link to="/rotary">Explore Rotary’s programmes and values.</Link>
            </p>
          </div>
        </div>
      </section>
      <section
        className="section section-tint"
        id="service"
        aria-labelledby="service-title"
      >
        <div className="container">
          <div className="learn-section-head">
            <h2 className="sec-title" id="service-title">
              From a need to a day of action.
            </h2>
            <p>
              A useful way to think about a service project, from the first
              conversation to the follow-up.
            </p>
          </div>
          <ol className="service-journey">
            {PROJECT_JOURNEY.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="service-distinction">
            <h3>Doing something is the start.</h3>
            <p>
              Packs delivered, seedlings planted and an art day held are
              activities we can record. Better health, surviving trees and
              lasting confidence need follow-up evidence. Follow-up helps us
              understand what lasts and what needs more work.
            </p>
          </div>
          <div className="learn-section-head learn-stories-head">
            <h3>See it in Menengai.</h3>
            <Link to="/projects">
              All projects <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="learn-stories">
            {stories.map((event) => (
              <Link
                className="learn-story"
                key={event.slug}
                to={`/events/${event.slug}`}
              >
                <div className="learn-story-photo">
                  <SmartImage
                    src={event.images[0]?.thumb}
                    alt={event.images[0]?.alt ?? event.title}
                    width={640}
                    height={480}
                    fallback={event.title}
                  />
                </div>
                <div className="learn-story-copy">
                  <time dateTime={event.date}>{dateLabel(event.date)}</time>
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
                  <span>
                    See the photo story{" "}
                    <ArrowRight size={18} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="service-framework">
            <div>
              <h3>Two ways to describe service.</h3>
              <p>
                The avenues describe <strong>how we serve</strong>. The areas of
                focus describe <strong>the cause we address</strong>.
              </p>
            </div>
            <div>
              <h4>Five avenues</h4>
              <ul>
                {ROTARY.avenues.map((avenue) => (
                  <li key={avenue.title}>{avenue.title}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Seven areas of focus</h4>
              <ul>
                {ROTARY.focuses.map((focus) => (
                  <li key={focus.id}>
                    <Link to={`/rotary#${focus.id}`}>{focus.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="learn-source">
            Read more about{" "}
            <a
              href={LEARNING_SOURCES.causes}
              target="_blank"
              rel="noopener noreferrer"
            >
              Rotary’s causes
            </a>
            . Want to bring a skill or an idea?{" "}
            <Link to="/partnerships">Find a way to work with us.</Link>
          </p>
        </div>
      </section>
      <section className="section" id="history" aria-labelledby="history-title">
        <div className="container learn-history-layout">
          <div>
            <h2 className="sec-title" id="history-title">
              A movement that keeps moving.
            </h2>
            <p>A few moments that explain the Rotaract you’re joining today.</p>
            <Link to="/about">
              Read Menengai’s own story{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <ol className="learn-timeline">
            <li>
              <time dateTime="1968-03-13">13 March 1968</time>
              <h3>The first Rotaract club</h3>
              <p>
                Rotary certified its first Rotaract club at the University of
                North Carolina at Charlotte.
              </p>
              <a
                href={LEARNING_SOURCES.history}
                target="_blank"
                rel="noopener noreferrer"
              >
                Rotary’s historical account
              </a>
            </li>
            <li>
              <time dateTime="2019">2019</time>
              <h3>A place in Rotary’s membership</h3>
              <p>
                The Council on Legislation recognised Rotaract clubs as a
                membership type of Rotary International.
              </p>
              <a
                href={LEARNING_SOURCES.policy}
                target="_blank"
                rel="noopener noreferrer"
              >
                Rotary’s policy update
              </a>
            </li>
            <li>
              <time dateTime="2020-07-01">1 July 2020</time>
              <h3>More room to build a club</h3>
              <p>
                Rotary removed the upper age limit and the mandatory sponsor
                requirement. Clubs may set an upper age limit in their own
                bylaws. Menengai’s sponsor remains the Rotary Club of Nakuru.
              </p>
              <a
                href={LEARNING_SOURCES.policy}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the policy changes
              </a>
            </li>
            <li>
              <time dateTime="2026">2026/27</time>
              <h3>Our district’s next chapter</h3>
              <p>
                Menengai is part of District 9215, covering west of Nairobi,
                western Kenya and South Sudan.
              </p>
              <Link to="/about/district-9215">Meet our district</Link>
            </li>
          </ol>
        </div>
      </section>
      <section className="learn-course">
        <div className="container">
          <div>
            <BookOpen aria-hidden="true" size={32} />
            <h2>Get to know your club.</h2>
            <p>
              Six short modules. Nine questions. Your own pace.
              <br />
              Pick up where you left off in this browser.
            </p>
          </div>
          <ButtonLink to="/membership/orientation" variant="primary" size="lg">
            Start the orientation <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
