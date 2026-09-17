/**
 * 404 — a helpful dead end: the next step, never a dead link.
 */
import { ArrowRight } from 'lucide-react';
import { ButtonLink, PageMeta } from '../components/ui';

export default function NotFoundPage() {
  return (
    <>
      <PageMeta title="Page not found" />
      <section className="section notfound">
        <div className="container notfound-inner">
          <span className="eyebrow">404</span>
          <h1>That page wandered off.</h1>
          <p>We couldn’t find what you were looking for — but fellowship is easy to find.</p>
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