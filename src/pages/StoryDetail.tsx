import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { PUBLIC_STORIES, dateLabel } from "../content";
import { PageMeta } from "../components/ui";
import NotFoundPage from "./NotFound";
export default function StoryDetail() {
  const { slug } = useParams();
  const story = PUBLIC_STORIES.find((s) => s.slug === slug);
  const [notice, setNotice] = useState("");
  if (!story) return <NotFoundPage />;
  return (
    <article className="story-detail container">
      <PageMeta title={story.title} description={story.summary} />
      <Link className="back-link" to="/news">
        Back to stories
      </Link>
      <p className="section-label">{story.category}</p>
      <h1>{story.title}</h1>
      <p className="article-byline">
        By {story.author} · Published{" "}
        <time dateTime={story.published!}>{dateLabel(story.published!)}</time> ·{" "}
        {Math.max(1, Math.ceil(story.body.join(" ").split(/\s+/).length / 200))}{" "}
        min read
      </p>
      <p className="article-lead">{story.summary}</p>
      {story.image && (
        <figure>
          <img
            src={story.image}
            alt={story.imageAlt ?? ""}
            width={1080}
            height={719}
          />
          <figcaption>{story.imageCaption}</figcaption>
        </figure>
      )}
      <div className="article-body">
        {story.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <aside className="source-note">
          <h2>Source</h2>
          <p>This story summarises a public report in original language.</p>
          <a href={story.sourceUrl} target="_blank" rel="noopener noreferrer">
            Read the report by {story.sourceName}
          </a>
        </aside>
        {story.relatedProject && (
          <Link className="text-link" to={`/projects/${story.relatedProject}`}>
            Explore the related project
          </Link>
        )}
        <div className="article-share">
          <button
            className="btn btn-secondary btn-md"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  `https://rac-menengai.vercel.app/news/${story.slug}`,
                );
                setNotice("Story link copied.");
              } catch {
                setNotice(
                  "Copy unavailable. Copy the page address from your browser.",
                );
              }
            }}
          >
            Copy story link
          </button>
          <p role="status">{notice}</p>
        </div>
        <h2>More from the club</h2>
        {PUBLIC_STORIES.filter((s) => s.slug !== slug).map((s) => (
          <p key={s.slug}>
            <Link to={`/news/${s.slug}`}>{s.title}</Link>
          </p>
        ))}
      </div>
    </article>
  );
}
