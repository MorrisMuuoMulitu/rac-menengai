import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import { ButtonLink } from "./ui";
import HeroGallery, { type HeroPhoto } from "./HeroGallery";

export default function MenengaiHero({ photos }: { photos: HeroPhoto[] }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const travel =
        media.matches || window.innerWidth < 761
          ? 0
          : Math.min(1, Math.max(0, -rect.top / rect.height));
      element.style.setProperty("--hero-travel", String(travel));
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    media.addEventListener("change", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      media.removeEventListener("change", queue);
    };
  }, []);
  return (
    <section ref={ref} className="journal-hero" aria-labelledby="home-title">
      <div className="container">
        <div className="hero-masthead-note">
          <p>Rotaract Club of Menengai</p>
          <p>
            <MapPin size={14} aria-hidden="true" /> Nakuru, Kenya
          </p>
          <span>Thee Magicals…</span>
        </div>
        <h1 id="home-title" className="hero-masthead">
          MENENGAI
        </h1>
        <div className="hero-opening-footer">
          <p>
            Community service.
            <br />
            Friendships that grow.
          </p>
          <span>
            We’re students, professionals and neighbours who make time for
            Nakuru. Find your place in the club.
          </span>
          <div>
            <ButtonLink to="/membership">
              Join us <ArrowUpRight size={19} aria-hidden="true" />
            </ButtonLink>
            <Link to="/projects" className="text-link">
              Explore our work <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="hero-contact-sheet">
          <div className="journal-hero-scene">
            <HeroGallery photos={photos} />
          </div>
          <div className="hero-side-story">
            <Link
              className="journal-detail-photo"
              to="/events/mazingira-day-pangani-2026"
            >
              <img
                src="/images/events/mazingira-day-pangani-2026/mazingira-2026-planting-a-seedling-720.webp"
                alt="A learner planting a seedling at Pangani Special School on Mazingira Day"
                width={720}
                height={540}
              />
              <span>
                At Pangani, together.
                <ArrowUpRight size={19} aria-hidden="true" />
              </span>
            </Link>
            <div className="hero-side-copy">
              <p>Service Above Self.</p>
              <span>
                In our city.
                <br />
                With our people.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
