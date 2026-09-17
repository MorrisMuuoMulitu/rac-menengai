/**
 * About — identity, charter history, values, the Rotary connection, timeline.
 */
import { ArrowRight } from 'lucide-react';
import { Heart, Star, Users } from 'lucide-react';
import { ABOUT_IMAGES, CLUB, PAGE_INTROS, VALUES } from '../data';
import { Reveal } from '../hooks';
import { ButtonLink, PageHero, PageMeta } from '../components/ui';

const VALUE_ICONS: Record<string, React.ReactNode> = {
  users: <Users aria-hidden="true" />,
  star: <Star aria-hidden="true" />,
  heart: <Heart aria-hidden="true" />,
};

const MILESTONES = [
  { year: '~2015/16', title: 'Charter', text: 'The club is chartered under the sponsorship of the Rotary Club of Nakuru.', confirm: true },
  { year: '2019', title: 'Presidency of Terry Muigai', text: 'A year of growth and service under then-president Terry Muigai.' },
  { year: '2022', title: 'Adopt-a-River launches', text: 'Our flagship environmental project begins on River Njoro and River Ndarugu.' },
  { year: '2024', title: 'City clean-up, Nakuru County', text: 'Recognised for the inaugural city clean-up campaign with KWS, NEMA and Red Cross.' },
  { year: '2025', title: 'Ten years of service', text: 'The club marks a decade of fellowship and impact across District 9212.' },
  { year: '2026', title: 'DEI Champion — Legacy Award', text: 'Recognised by Rotary District 9212 for championing diversity, equity and inclusion.' },
] as const;

export default function AboutPage() {
  const intro = PAGE_INTROS.about;
  return (
    <>
      <PageMeta title="About" description={intro.description} />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead} />

      <section className="section">
        <div className="container about-grid">
          <Reveal className="about-visual">
            <img src={ABOUT_IMAGES.tall} alt="Club members at the Adopt-a-River launch on River Njoro" width={640} height={760} loading="lazy" />
          </Reveal>
          <div className="about-copy">
            <Reveal>
              <h2 className="sec-title">Nakuru’s home of young leaders in action</h2>
            </Reveal>
            <Reveal delay={80}>
              <p>
                {CLUB.name} is a member of Rotary International’s global Rotaract family — a vibrant club of young
                professionals and students, roughly 18–30, living the motto <em>{CLUB.motto}</em>. We are chartered by{' '}
                <strong>{CLUB.sponsor}</strong> and part of {CLUB.district}.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p>
                For a decade we have turned energy into impact: cleaning our rivers, welcoming new mothers at Bondeni
                Maternity, keeping girls in school, and hosting Nakuru’s young people in fellowship every Thursday.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div className="about-facts">
                <p>
                  <strong>{CLUB.establishedLabel}</strong> · sponsored by {CLUB.sponsor}
                </p>
                <p>
                  <strong>Thursday fellowship</strong> · {CLUB.meeting.timeLabel} · {CLUB.city.split(',')[0]}
                </p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="about-cta">
                <ButtonLink to="/membership" variant="primary">
                  Attend a fellowship <ArrowRight aria-hidden="true" />
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">What we value</span>
              <h2 className="sec-title">Three values. One purpose.</h2>
            </div>
          </Reveal>
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80} className="value-card" as="article">
                <span className="value-icon" aria-hidden="true">
                  {VALUE_ICONS[v.icon] ?? <Star aria-hidden="true" />}
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">The Rotary connection</span>
              <h2 className="sec-title">Same motto. Same areas of focus.</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="rotary-note">
              <p>
                Rotaract is Rotary’s young-leaders arm for 18–30s. We run our own club leadership, sponsored by a
                Rotary club — for us, {CLUB.sponsor} — and we work inside Rotary’s seven areas of focus, from the
                environment to maternal health to peacebuilding.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">The journey</span>
              <h2 className="sec-title">A decade, in moments</h2>
            </div>
          </Reveal>
          <ol className="timeline">
            {MILESTONES.map((m, i) => (
              <Reveal as="li" key={m.title} delay={i * 50}>
                <span className="timeline-year">{m.year}</span>
                <div className="timeline-body">
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <p className="fine-print">* Charter year pending confirmation — see our content audit.</p>
        </div>
      </section>
    </>
  );
}