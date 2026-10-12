import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PUBLIC_STORIES, dateLabel } from "../content";
import { PageHero, PageMeta } from "../components/ui";
export default function NewsPage() {
  return (
    <>
      <PageMeta
        title="News & stories"
        description="Service and community stories from the Rotaract Club of Menengai, with dates, sources and project context."
      />
      <PageHero
        eyebrow="News & stories"
        title="The work. The people. The stories."
        lead="A record of service and community life, with the sources behind each story."
      />
      <section className="section">
        <div className="container">
          <div className="editorial-stories">
            {PUBLIC_STORIES.map((s) => (
              <Link
                className="editorial-story"
                key={s.slug}
                to={`/news/${s.slug}`}
              >
                <div>
                  <span className="story-topic">{s.category}</span>
                  <h2>{s.title}</h2>
                  <p>{s.summary}</p>
                </div>
                <div className="story-tail">
                  <time dateTime={s.published!}>{dateLabel(s.published!)}</time>
                  <ArrowUpRight aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
          <p className="fine-print">
            These are archive stories. For current announcements, check the
            club’s{" "}
            <a
              href="https://www.instagram.com/racmenengai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram profile
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
