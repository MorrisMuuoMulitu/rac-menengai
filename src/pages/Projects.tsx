/**
 * Projects — filterable catalogue of verified service projects.
 */
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { PAGE_INTROS, PROJECTS, PROJECT_TAGS } from "../data";
import { PageHero, PageMeta } from "../components/ui";
import { ProjectCard, ProjectFilter } from "../components/cards";
import { ButtonLink } from "../components/ui";

export default function ProjectsPage() {
  const intro = PAGE_INTROS.projects;
  const [tag, setTag] = useState("All");
  const filtered =
    tag === "All" ? PROJECTS : PROJECTS.filter((p) => p.tag === tag);

  return (
    <>
      <PageMeta title="Projects" description={intro.description} />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead}>
        <ButtonLink to="/membership" variant="primary" size="sm">
          Attend a fellowship <ArrowRight aria-hidden="true" />
        </ButtonLink>
      </PageHero>

      <section className="section section-tint">
        <div className="container">
          <h2 className="sr-only">All projects</h2>
          <ProjectFilter tags={PROJECT_TAGS} active={tag} onChange={setTag} />
          {filtered.length > 0 ? (
            <ul className="projects-grid" aria-live="polite">
              {filtered.map((p, i) => (
                <ProjectCard key={p.slug} project={p} delay={(i % 3) * 70} />
              ))}
            </ul>
          ) : (
            <p className="empty-state" role="status">
              No projects in this area yet — check back soon or{" "}
              <a
                href="https://www.facebook.com/RCmenengai/"
                target="_blank"
                rel="noopener noreferrer"
              >
                follow the club
              </a>{" "}
              for the latest.
            </p>
          )}
          <p className="fine-print">
            This library retains the club’s existing project records.
            Unconfirmed counts are withheld, and each detail page notes its
            source status.
          </p>
        </div>
      </section>
    </>
  );
}
