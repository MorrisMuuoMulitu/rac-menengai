import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

interface RailPhoto {
  src: string;
  alt: string;
  href: string;
  label: string;
}
export default function PhotoRail({ photos }: { photos: RailPhoto[] }) {
  const rail = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () =>
      setEdges({
        start: element.scrollLeft < 2,
        end:
          element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
      });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, []);
  const move = (direction: number) => {
    const element = rail.current;
    if (!element) return;
    element.scrollBy({
      left: direction * element.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  return (
    <>
      <div className="camera-heading">
        <h2 id="club-camera-title">Club life, in pictures.</h2>
        <div className="camera-navigation">
          <Link to="/events">
            Explore events <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <div role="group" aria-label="Browse club photographs">
            <button
              type="button"
              aria-label="Previous club photographs"
              aria-controls="club-photo-rail"
              disabled={edges.start}
              onClick={() => move(-1)}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next club photographs"
              aria-controls="club-photo-rail"
              disabled={edges.end}
              onClick={() => move(1)}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <ul ref={rail} id="club-photo-rail" className="camera-rail">
        {photos.map((photo) => (
          <li key={photo.src}>
            <Link to={photo.href}>
              <img
                src={photo.src.replace(".webp", "-720.webp")}
                alt={photo.alt}
                width={720}
                height={540}
                loading="lazy"
                decoding="async"
              />
              <span>
                {photo.label}
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
