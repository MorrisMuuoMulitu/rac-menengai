/**
 * 404 — a helpful dead end: the next step, never a dead link.
 */
import { ArrowRight } from "lucide-react";
import { ButtonLink, PageMeta } from "../components/ui";

export default function NotFoundPage() {
  return (
    <>
      <PageMeta title="Page not found" />
      <section className="section notfound">
        <div className="container notfound-inner">
          <span className="eyebrow">404</span>
          <h1>Page not found.</h1>
          <p>Check the address or return to the homepage.</p>
          <div className="notfound-actions">
            <ButtonLink to="/" variant="primary">
              Back to the home page <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to="/membership" variant="secondary">
              Attend a fellowship
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
