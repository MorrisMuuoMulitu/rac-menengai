/**
 * News — the club's stories; full originals live on Instagram.
 */
import { ArrowRight } from 'lucide-react';
import { NEWS, PAGE_INTROS } from '../data';
import { ButtonLink, PageHero, PageMeta } from '../components/ui';
import { StoryCard } from '../components/cards';

export default function NewsPage() {
  const intro = PAGE_INTROS.news;
  return (
    <>
      <PageMeta title="News & Stories" description={intro.description} />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead}>
        <ButtonLink to="/membership" variant="primary" size="sm">
          Attend a fellowship <ArrowRight aria-hidden="true" />
        </ButtonLink>
      </PageHero>
      <section className="section section-tint">
        <div className="container">
          <ul className="stories-grid">
            {NEWS.map((n, i) => (
              <StoryCard key={n.title} story={n} delay={(i % 3) * 70} />
            ))}
          </ul>
          <p className="fine-print">
            Each story links to its original post on the club’s Instagram. Want the freshest updates?
            <a href="https://www.instagram.com/racmenengai/" target="_blank" rel="noopener noreferrer">
              {' '}
              Follow @racmenengai
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}