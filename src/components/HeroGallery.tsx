import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";

export interface HeroPhoto {
  src: string;
  alt: string;
  href: string;
  title: string;
}

/** Photo stories stay still until a visitor opts into playback. */
export default function HeroGallery({ photos }: { photos: HeroPhoto[] }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => {
      setReduced(media.matches);
      if (media.matches) setPlaying(false);
    };
    preference();
    media.addEventListener("change", preference);
    let inView = true;
    const visibility = () => setVisible(inView && !document.hidden);
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting;
              visibility();
            },
            { threshold: 0.15 },
          );
    if (ref.current) observer?.observe(ref.current);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!playing || reduced || !visible || hovered || focused) return;
    const interval = window.setInterval(
      () => setActive((current) => (current + 1) % photos.length),
      7000,
    );
    return () => window.clearInterval(interval);
  }, [playing, reduced, visible, hovered, focused, photos.length]);

  const select = (index: number) => {
    const next = (index + photos.length) % photos.length;
    setActive(next);
    setPlaying(false);
    setAnnouncement(
      `${photos[next].title}. Photograph ${next + 1} of ${photos.length}.`,
    );
  };
  const photo = photos[active];
  return (
    <figure
      ref={ref}
      className="hero-photo photo-stories"
      aria-label="Club photo stories"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setFocused(false);
      }}
    >
      <img
        key={photo.src}
        className="photo-story-image"
        src={photo.src}
        srcSet={`${photo.src.replace(".webp", "-720.webp")} 720w, ${photo.src} 1280w`}
        sizes="(max-width: 760px) 100vw, 57vw"
        alt={photo.alt}
        width="1280"
        height="960"
        {...{ fetchpriority: active === 0 ? "high" : "auto" }}
        decoding="async"
      />
      <span className="photo-story-label">Menengai in action</span>
      <figcaption className="photo-story-caption">
        <div className="photo-story-description">
          <span>Recent club activity · 2026</span>
          <Link to={photo.href}>
            {photo.title}
            <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
        <div
          className="photo-story-controls"
          role="group"
          aria-label="Choose a club photograph"
        >
          <button
            type="button"
            aria-label="Previous photograph"
            onClick={() => select(active - 1)}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <span className="photo-story-position" aria-hidden="true">
            {active + 1} / {photos.length}
          </span>
          <button
            type="button"
            aria-label="Next photograph"
            onClick={() => select(active + 1)}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
          {!reduced && (
            <button
              type="button"
              aria-label={
                playing ? "Pause photo stories" : "Play photo stories"
              }
              aria-pressed={playing}
              onClick={() => setPlaying((current) => !current)}
            >
              {playing ? (
                <Pause size={17} aria-hidden="true" />
              ) : (
                <Play size={17} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </figcaption>
      <span className="sr-only" role="status">
        {announcement}
      </span>
    </figure>
  );
}
