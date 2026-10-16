import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Clock, MapPin } from "lucide-react";
import { PageMeta, ButtonLink } from "../components/ui";
import { PUBLIC_EVENTS, dateLabel } from "../content";
import HeroGallery from "../components/HeroGallery";

/** Current club photographs link to their event records. */
const HERO_LEAD = [
  {
    title: "Welcoming our new members",
    src: "/images/events/nakuru-region-district-governor-meeting-inductions/menengai-induction-members-lineup.webp",
    srcSet:
      "/images/events/nakuru-region-district-governor-meeting-inductions/menengai-induction-members-lineup-560.webp 560w, /images/events/nakuru-region-district-governor-meeting-inductions/menengai-induction-members-lineup.webp 1600w",
    alt: "New members with the District Governor during Menengai’s September induction",
    href: "/events/new-member-induction-2026",
  },
  {
    title: "Mazingira Day at Pangani",
    src: "/images/events/mazingira-day-pangani-2026/mazingira-2026-group-photo.webp",
    alt: "The club with learners at Pangani Special School on Mazingira Day",
    href: "/events/mazingira-day-pangani-2026",
  },
  {
    title: "Mother packs at Kabatini",
    src: "/images/events/mother-pack-kabatini-2026/kabatini-2026-group-with-packs.webp",
    alt: "The club and the Rotaract Club of Bahati with mother packs at Kabatini Maternity",
    href: "/events/mother-pack-kabatini-august-2026",
  },
  {
    title: "Art Day at Pangani",
    src: "/images/events/pangani-art-day-2026/pangani-art-day-2026-drawings-held-up.webp",
    alt: "Learners hold up their drawings at the art day, Pangani Special School",
    href: "/events/art-day-pangani-2026",
  },
  {
    title: "Presidential Installation",
    src: "/images/events/installation-2026/installation-2026-group-photo.webp",
    alt: "Members and guests at the club's Presidential Installation",
    href: "/events/presidential-installation-june-2026",
  },
];

const HERO_STRIP = [
  {
    src: "/images/events/mother-pack-bondeni-2026/bondeni-2026-group-outside.webp",
    alt: "The club outside Bondeni Maternity Hospital",
    href: "/events/mother-pack-bondeni-july-2026",
  },
  {
    src: "/images/events/mazingira-day-pangani-2026/mazingira-2026-planting-a-seedling.webp",
    alt: "A learner plants a seedling on Mazingira Day",
    href: "/events/mazingira-day-pangani-2026",
  },
  {
    src: "/images/events/pangani-art-day-2026/pangani-art-day-2026-artwork-colourful.webp",
    alt: "A drawing made by a learner at the art day",
    href: "/events/art-day-pangani-2026",
  },
  {
    src: "/images/events/installation-2026/installation-2026-badge-pinned.webp",
    alt: "A badge is pinned during the Presidential Installation",
    href: "/events/presidential-installation-june-2026",
  },
  {
    src: "/images/events/mother-pack-kabatini-2026/kabatini-2026-menengai-and-bahati-banners.webp",
    alt: "Both clubs' banners at the Kabatini distribution",
    href: "/events/mother-pack-kabatini-august-2026",
  },
  {
    src: "/images/events/mazingira-day-pangani-2026/mazingira-2026-planting-together.webp",
    alt: "A member and a learner planting a seedling together",
    href: "/events/mazingira-day-pangani-2026",
  },
];

const latestEvents = [...PUBLIC_EVENTS]
  .filter((e) => e.images.length > 0)
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 3);
export default function HomePage() {
  return (
    <>
      <PageMeta
        title="Rotaract Club of Menengai | Community service in Nakuru"
        description="Meet the Rotaract Club of Menengai: community service, young leadership and Thursday fellowship in Nakuru, Kenya. Join us or partner on a project."
      />
      <section className="menengai-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <div className="hero-copy-inner">
            <p className="hero-location">
              <MapPin size={15} aria-hidden="true" /> Nakuru, Kenya
            </p>
            <h1 id="home-title">
              <span className="hero-line">
                <span className="hero-line-inner">Thee </span>
              </span>
              <span className="hero-line">
                <span className="hero-line-inner">
                  Magicals<span className="hero-mantra-dots">…</span>
                </span>
              </span>
            </h1>
            <p className="hero-description">
              We’re the Rotaract Club of Menengai. We bring people together for
              community service, practical learning and Thursday fellowship.
            </p>
            <div className="hero-actions">
              <ButtonLink to="/membership" variant="light">
                Join us <ArrowUpRight size={19} aria-hidden="true" />
              </ButtonLink>
              <Link to="/projects" className="hero-text-link">
                Explore our impact <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <p className="hero-signoff">Service Above Self</p>
          </div>
        </div>
        <HeroGallery photos={HERO_LEAD} />
      </section>
      <div className="fellowship-ribbon">
        <div className="container ribbon-inner">
          <p>
            <Clock size={19} aria-hidden="true" />
            <strong>Thursdays are for fellowship.</strong>
            <span>5:30–6:30 PM EAT · Guests welcome</span>
          </p>
          <Link to="/membership#first-visit">
            Plan your first visit <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <section className="club-camera" aria-labelledby="club-camera-title">
        <div className="container">
          <div className="camera-heading">
            <h2 id="club-camera-title">Club life, in pictures.</h2>
            <Link to="/events">
              Explore events <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <ul className="camera-rail">
            {HERO_STRIP.map((photo, index) => (
              <li key={photo.src}>
                <Link to={photo.href}>
                  <img
                    src={photo.src.replace(".webp", "-720.webp")}
                    alt={photo.alt}
                    width="720"
                    height="540"
                    loading="lazy"
                    decoding="async"
                  />
                  <span>
                    {
                      [
                        "Mother packs at Bondeni",
                        "Mazingira Day",
                        "Art at Pangani",
                        "Installation day",
                        "Menengai & Bahati",
                        "Planting together",
                      ][index]
                    }
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section home-intro">
        <div className="container intro-grid">
          <p className="section-label">Our club</p>
          <div>
            <h2>
              Local roots.
              <br />
              Room for everyone.
            </h2>
            <p>
              We’re students, professionals and neighbours who make space for
              service. Through Rotaract, we work on local projects, learn from
              each other and build friendships beyond Nakuru.
            </p>
            <Link className="text-link" to="/about">
              Get to know Menengai <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="intro-aside">
            <span>18+</span>
            <p>Rotaract welcomes people aged 18 and over.</p>
            <a
              href="https://www.rotary.org/en/get-involved/our-clubs/rotaract-clubs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Part of the Rotary community
            </a>
          </div>
        </div>
      </section>
      <section className="section home-work">
        <div className="container">
          <div className="section-topline">
            <div>
              <p className="section-label">In the community</p>
              <h2>Time put to good use.</h2>
            </div>
            <Link className="text-link" to="/projects">
              Explore projects <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="work-grid">
            {/* Featuring the programme with recent photographs: everything on
                this page uses current imagery (see docs/CONTENT_AUDIT.md). */}
            <Link to="/projects/mother-packs" className="work-feature">
              <figure>
                <img
                  src="/images/events/mother-pack-kabatini-2026/kabatini-2026-group-with-packs.webp"
                  alt="The club and the Rotaract Club of Bahati with mother packs at Kabatini Maternity"
                  width="1280"
                  height="960"
                  loading="lazy"
                />
              </figure>
              <div className="work-feature-copy">
                <span>Maternal health</span>
                <h3>Mother packs, delivered</h3>
                <p>
                  Packs of essentials for mothers and newborns, at Bondeni and
                  Kabatini Maternity.
                </p>
                <span className="work-link">
                  Read the project <ArrowUpRight size={20} aria-hidden="true" />
                </span>
              </div>
            </Link>
            {/* Current programmes only, and nothing that repeats the feature
                above: this section shows what the club is doing now. */}
            <div className="work-list">
              <Link to="/projects/pangani-special-school">
                <span className="work-category">Art &amp; environment</span>
                <h3>Pangani Special School</h3>
                <p>
                  Art days and Mazingira Day planting with learners in Nakuru.
                </p>
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link to="/projects/limuko-girls">
                <span className="work-category">Education</span>
                <h3>Menstrual health at Limuko Schools</h3>
                <p>Sanitary supplies and mentorship with students.</p>
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link to="/projects/book-club">
                <span className="work-category">Community</span>
                <h3>Book Club Review</h3>
                <p>Reading and fellowship every second Sunday of the month.</p>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section home-meet">
        <div className="container meet-grid">
          <div>
            <p className="section-label">Meet the members</p>
            <h2>
              Start with
              <br />a Thursday.
            </h2>
            <p>
              You don’t need to know anyone before you come. Turn up at Nakuru
              Athletic Club, sit in on a fellowship, and see whether the club
              feels right for you.
            </p>
            <div className="meet-actions">
              <ButtonLink to="/membership" variant="dark">
                How to join <ArrowUpRight size={18} aria-hidden="true" />
              </ButtonLink>
              <Link className="text-link" to="/leadership">
                Meet the board <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="meeting-note">
            <h3>Weekly fellowship</h3>
            <dl>
              <div>
                <dt>When</dt>
                <dd>Thursday, 5:30–6:30 PM</dd>
              </div>
              <div>
                <dt>Where</dt>
                <dd>Nakuru Athletic Club, Nakuru</dd>
              </div>
              <div>
                <dt>Who</dt>
                <dd>Members, friends and first-time guests</dd>
              </div>
            </dl>
            <a
              className="text-link"
              href="mailto:menengairc@gmail.com?subject=Coming%20to%20a%20Thursday%20fellowship"
            >
              Tell us you’re coming{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      {/* Latest activity, not the archive: the three most recent events that
          have photographs, newest first. Older work lives on /events. */}
      <section className="section home-stories">
        <div className="container">
          <div className="section-topline">
            <div>
              <p className="section-label">Latest from the club</p>
              <h2>Just back from the field.</h2>
            </div>
            <Link className="text-link" to="/events">
              All events <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="latest-events">
            {latestEvents.map((e) => (
              <Link
                to={`/events/${e.slug}`}
                key={e.slug}
                className="latest-event"
              >
                <div className="latest-event-media">
                  <img
                    src={e.images[0].thumb}
                    alt={e.images[0].alt}
                    width={560}
                    height={421}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="latest-event-body">
                  <time dateTime={e.date}>{dateLabel(e.date)}</time>
                  <h3>{e.title}</h3>
                  <p>{e.location}</p>
                  <span className="latest-event-more">
                    {e.images.length} photographs{" "}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <p className="latest-events-note">
            Every occasion the club records — with its photographs and sources —
            is kept on <Link to="/events">Events</Link>.
          </p>
        </div>
      </section>
      <section className="section home-network">
        <div className="container network-grid">
          <div>
            <p className="section-label">Working together</p>
            <h2>
              Good work takes
              <br />
              more than one club.
            </h2>
          </div>
          <div>
            <p>
              Our service connects us with Rotary clubs, public agencies and
              community organisations. Each project record explains who took
              part and what was done together.
            </p>
            <div className="network-names">
              <span>Rotary Club of Nakuru</span>
              <span>Community organisations</span>
              <span>Local collaborators</span>
            </div>
            <div className="network-actions">
              <Link className="text-link" to="/partnerships">
                Find a way to collaborate{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link className="text-link" to="/rotary">
                How Rotaract fits into Rotary{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="club-magazine-section">
        <div className="container club-magazine-layout">
          <a
            className="club-magazine-cover"
            href="/publications/menengai-magazine-2025-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Read the Menengai magazine, opens PDF in a new tab"
          >
            <img
              src="/publications/menengai-magazine-2025-2026-cover.webp"
              alt="Cover of Menengai’s June 2026 club magazine"
              width={638}
              height={900}
              loading="lazy"
            />
          </a>
          <div>
            <p className="kicker">Club magazine · Issue 1 · June 2026</p>
            <h2>A year in our own words.</h2>
            <p>
              Explore the 2025–2026 club magazine: leadership, membership, club
              service and a year of community work.
            </p>
            <p className="magazine-file-note">25 pages · PDF · 19 MB</p>
            <div className="magazine-actions">
              <a
                className="btn btn-primary"
                href="/publications/menengai-magazine-2025-2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the magazine <ArrowUpRight size={18} />
                <span className="sr-only"> (PDF, opens in a new tab)</span>
              </a>
              <a
                className="text-link"
                href="/publications/menengai-magazine-2025-2026.pdf"
                download
              >
                Download PDF <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="home-invitation">
        <div className="container invitation-inner">
          <h2>
            See you
            <br />
            on Thursday?
          </h2>
          <div>
            <p>
              Bring your questions. Get to know the club.
              <br />
              There’s a place to start.
            </p>
            <ButtonLink to="/membership" variant="light">
              Join us <ArrowUpRight size={19} aria-hidden="true" />
            </ButtonLink>
            <Link to="/contact">Contact the club</Link>
          </div>
        </div>
      </section>
    </>
  );
}
