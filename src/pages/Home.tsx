import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Clock, MapPin } from "lucide-react";
import { PageMeta, ButtonLink } from "../components/ui";
import { PUBLIC_STORIES, dateLabel } from "../content";
import { useHeroPointer } from "../hooks";
export default function HomePage() {
  const heroRef = useHeroPointer<HTMLElement>();
  return (
    <>
      <PageMeta
        title="Rotaract Club of Menengai | Community service in Nakuru"
        description="Meet the Rotaract Club of Menengai: community service, young leadership and Thursday fellowship in Nakuru, Kenya. Join us or partner on a project."
      />
      <section
        className="menengai-hero"
        ref={heroRef}
        aria-labelledby="home-title"
      >
        {/* Depth planes: the copy panel and the photograph sit on separate
            layers, the wash shifts the ground colour at the midpoint and the
            scroll timeline lifts the copy away. All of it is additive — the
            markup below is the full opening state with no animation support. */}
        <div className="hero-copy">
          <div className="hero-copy-inner">
            <p className="hero-location">
              <MapPin size={15} aria-hidden="true" /> Nakuru, Kenya
            </p>
            <h1 id="home-title">
              Thee{" "}
              <br />
              Magicals…
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
        <figure className="hero-photo">
          <img
            src="/images/gallery/banner.webp"
            srcSet="/images/gallery/banner-720.webp 720w, /images/gallery/banner.webp 1500w"
            sizes="(max-width: 760px) 100vw, 60vw"
            alt="Club members and the community gathered outdoors in Nakuru"
            width="1500"
            height="500"
            {...{ fetchpriority: "high" }}
          />
          <figcaption>From the Menengai club archive</figcaption>
        </figure>
        <div className="hero-wash" aria-hidden="true" />
      </section>
      <div className="fellowship-ribbon">
        <div className="container ribbon-inner">
          <p>
            <Clock size={19} aria-hidden="true" />
            <strong>Thursdays are for fellowship.</strong>
            <span>5:30–6:30 PM EAT · Guests welcome</span>
          </p>
          <Link to="/events">
            Plan your first visit <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
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
            <Link to="/projects/ndarugu-cleanup" className="work-feature">
              <figure>
                <img
                  src="/images/projects/river-cleanup.webp"
                  srcSet="/images/projects/river-cleanup-720.webp 720w, /images/projects/river-cleanup.webp 800w"
                  sizes="(max-width: 760px) 100vw, 50vw"
                  alt="Community members gathered during a riverside activity from the club archive"
                  width="800"
                  height="533"
                  loading="lazy"
                />
              </figure>
              <div className="work-feature-copy">
                <span>Environment & water</span>
                <h3>Along River Ndarugu</h3>
                <p>
                  A cleanup and conversations with riverside residents about
                  waste and water.
                </p>
                <span className="work-link">
                  Read the project <ArrowUpRight size={20} aria-hidden="true" />
                </span>
              </div>
            </Link>
            <div className="work-list">
              <Link to="/projects/mother-packs">
                <span className="work-category">Maternal health</span>
                <h3>Supporting new mothers at Bondeni</h3>
                <p>
                  Mother packs and essentials for families welcoming a baby.
                </p>
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link to="/projects/limuko-girls">
                <span className="work-category">Education</span>
                <h3>Menstrual health at Limuko Schools</h3>
                <p>Sanitary supplies and mentorship with students.</p>
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link to="/projects/peace-fest">
                <span className="work-category">Peacebuilding</span>
                <h3>Art. Conversation. Common ground.</h3>
                <p>Menengai joined collaborators at Peace in Colour Fest.</p>
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
              You don’t need to know anyone before you come. Ask us for the
              meeting venue, sit in on a fellowship, and see whether the club
              feels right for you.
            </p>
            <ButtonLink to="/membership" variant="dark">
              How to join <ArrowUpRight size={18} aria-hidden="true" />
            </ButtonLink>
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
                <dd>Nakuru · confirm the venue before visiting</dd>
              </div>
              <div>
                <dt>Who</dt>
                <dd>Members, friends and first-time guests</dd>
              </div>
            </dl>
            <a
              className="text-link"
              href="mailto:menengairc@gmail.com?subject=Thursday%20fellowship%20venue"
            >
              Ask for the venue <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      <section className="section home-stories">
        <div className="container">
          <div className="section-topline">
            <div>
              <p className="section-label">From the archive</p>
              <h2>Stories worth sharing.</h2>
            </div>
            <Link className="text-link" to="/news">
              All stories <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="editorial-stories">
            {PUBLIC_STORIES.map((s) => (
              <Link
                to={`/news/${s.slug}`}
                key={s.slug}
                className="editorial-story"
              >
                <div>
                  <span className="story-topic">{s.category}</span>
                  <h3>{s.title}</h3>
                  <p>{s.summary}</p>
                </div>
                <div className="story-tail">
                  <time dateTime={s.published!}>{dateLabel(s.published!)}</time>
                  <ArrowUpRight aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
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
            <Link className="text-link" to="/partnerships">
              Find a way to collaborate{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
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
