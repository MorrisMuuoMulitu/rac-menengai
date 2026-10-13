import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Clock, MapPin } from "lucide-react";
import { PageMeta, ButtonLink } from "../components/ui";
import { PUBLIC_EVENTS, dateLabel } from "../content";
import MenengaiHero from "../components/MenengaiHero";
import ImpactExplorer from "../components/ImpactExplorer";
import PhotoRail from "../components/PhotoRail";

/** Current club photographs link to their event records. */
const HERO_LEAD = [
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
      <MenengaiHero photos={HERO_LEAD} />
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
      <section className="section home-intro" id="our-club">
        <div className="container club-introduction">
          <div className="club-introduction-heading">
            <p className="section-label">Get to know the club</p>
            <h2>
              A little time.
              <br />A lot of good company.
            </h2>
          </div>
          <div className="club-introduction-copy">
            <p>
              Thursday conversations turn into school visits, mother packs and
              seedlings in the ground. We learn from each other, work alongside
              our neighbours and make friends along the way.
            </p>
            <Link className="text-link" to="/about">
              This is Menengai <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <div className="club-introduction-note">
              <span>18+</span>
              <p>
                Students. Professionals. First-time guests.
                <br />
                Rotaract welcomes everyone aged 18 and over.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section home-work">
        <div className="container">
          <div className="section-topline">
            <div>
              <p className="section-label">In the community</p>
              <h2>
                Put your time
                <br />
                into something that matters.
              </h2>
            </div>
            <Link className="text-link" to="/projects">
              Explore projects <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <ImpactExplorer />
        </div>
      </section>
      <section className="section home-meet">
        <div className="container meet-experience">
          <div className="meet-portrait">
            <img
              src="/images/events/installation-2026/installation-2026-badge-pinned.webp"
              alt="A Rotaract badge being pinned during Menengai’s Presidential Installation"
              width={960}
              height={1280}
              loading="lazy"
            />
            <span>You don’t have to know anyone yet.</span>
          </div>
          <div className="meet-copy">
            <p className="section-label">Your first fellowship</p>
            <h2>
              Make Thursday
              <br />
              your starting point.
            </h2>
            <p>
              Come on your own. Bring a friend. Sit in on a fellowship and meet
              the people behind the projects.
            </p>
            <div className="meet-details">
              <span>
                <Clock size={18} aria-hidden="true" /> Thursdays, 5:30–6:30 PM
                EAT
              </span>
              <span>
                <MapPin size={18} aria-hidden="true" /> Nakuru Athletic Club,
                Nakuru
              </span>
            </div>
            <p className="meet-guest-note">
              Free for guests. Take your time before deciding to join.
            </p>
            <div className="meet-actions">
              <ButtonLink to="/membership#first-visit" variant="light">
                Plan your first visit{" "}
                <ArrowUpRight size={19} aria-hidden="true" />
              </ButtonLink>
              <Link className="text-link" to="/leadership">
                Meet the board <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
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
              <h2>The club, lately.</h2>
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
            Discover more photographs and club activity in{" "}
            <Link to="/events">our event journal</Link>.
          </p>
        </div>
      </section>
      <section className="club-camera" aria-labelledby="club-camera-title">
        <div className="container">
          <PhotoRail
            photos={HERO_STRIP.map((photo, index) => ({
              ...photo,
              label: [
                "Mother packs at Bondeni",
                "Mazingira Day",
                "Art at Pangani",
                "Installation day",
                "Menengai & Bahati",
                "Planting together",
              ][index],
            }))}
          />
        </div>
      </section>
      <section className="section home-network">
        <div className="container collaboration-spread">
          <div>
            <p className="section-label">Work with Menengai</p>
            <h2>
              More hands.
              <br />
              More possibilities.
            </h2>
          </div>
          <div>
            <p>
              Our projects bring clubs, schools, health facilities and community
              organisations together. Have an idea or a skill to share? Let’s
              talk about what we can do together.
            </p>
            <Link to="/partnerships" className="text-link">
              Explore a partnership{" "}
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <Link to="/rotary" className="collaboration-network">
              Part of the Rotary community{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
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
