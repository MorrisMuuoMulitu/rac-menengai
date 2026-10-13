import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const programmes = [
  {
    category: "Maternal health",
    title: "Mother packs, delivered",
    image:
      "/images/events/mother-pack-kabatini-2026/kabatini-2026-group-with-packs.webp",
    alt: "Menengai and Bahati members with mother packs at Kabatini Maternity",
    location: "Bondeni & Kabatini Maternity",
    description:
      "Essentials for mothers and newborns, delivered with fellow Rotaractors. Explore the programme and the people who make it happen.",
    href: "/projects/mother-packs",
  },
  {
    category: "Art & environment",
    title: "Pangani Special School",
    image:
      "/images/events/pangani-art-day-2026/pangani-art-day-2026-drawings-held-up.webp",
    alt: "Learners at Pangani Special School showing their drawings",
    location: "Pangani Special School, Nakuru",
    description:
      "Art days with learners. Seedlings planted together. Time spent creating and caring for the school environment.",
    href: "/projects/pangani-special-school",
  },
  {
    category: "Fellowship",
    title: "Book Club Review",
    image:
      "/images/events/installation-2026/installation-2026-group-photo.webp",
    alt: "Menengai members and guests at the Presidential Installation",
    location: "Every second Sunday of the month",
    description:
      "A book, a conversation and a reason to meet. Our book club brings reading into the club’s fellowship.",
    href: "/projects/book-club",
    note: "Club members at the June 2026 installation",
  },
];

export default function ImpactExplorer() {
  const [selected, setSelected] = useState(0);
  const programme = programmes[selected];
  return (
    <div className="impact-explorer">
      <div
        className="impact-choices"
        role="group"
        aria-label="Explore a service interest"
      >
        {programmes.map((item, index) => (
          <button
            key={item.category}
            type="button"
            aria-pressed={selected === index}
            aria-controls="impact-selection"
            onClick={() => setSelected(index)}
          >
            {item.category}
            <ArrowUpRight size={18} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div
        id="impact-selection"
        className="impact-spread"
        aria-live="polite"
        aria-atomic="true"
      >
        <figure className="impact-photo">
          <img
            src={programme.image}
            alt={programme.alt}
            width={1280}
            height={960}
            loading="lazy"
            decoding="async"
          />
          <figcaption>{programme.note ?? programme.location}</figcaption>
        </figure>
        <div className="impact-copy">
          <span className="section-label">{programme.category}</span>
          <h3>{programme.title}</h3>
          <p>{programme.description}</p>
          <span className="impact-location">{programme.location}</span>
          <Link to={programme.href} className="text-link">
            Explore the project <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
