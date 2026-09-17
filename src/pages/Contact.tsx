/**
 * Contact & partnerships — every way to reach the club, plus the partner path.
 */
import { ArrowRight, Clock, MapPin, MessageCircle } from 'lucide-react';
import { CLUB, PAGE_INTROS, PARTNERS, SOCIALS } from '../data';
import { ButtonLink, PageHero, PageMeta } from '../components/ui';
import { AudiencePaths } from '../components/cards';
import { ContactForm } from '../components/forms';
import { Reveal } from '../hooks';
import { AUDIENCES } from '../data';

export default function ContactPage() {
  const intro = PAGE_INTROS.contact;
  return (
    <>
      <PageMeta title="Contact & Partnerships" />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead} />

      <section className="section section-tint">
        <div className="container form-layout">
          <div className="form-layout-copy">
            <Reveal>
              <div className="section-head-block">
                <span className="eyebrow">Send a message</span>
                <h2 className="sec-title">We reply to every message</h2>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="contact-cards">
                <div className="contact-card">
                  <Clock aria-hidden="true" />
                  <div>
                    <h3>Fellowship</h3>
                    <p>
                      Every {CLUB.meeting.dayLabel}, {CLUB.meeting.timeLabel} ({CLUB.meeting.timeZoneNote}) — {CLUB.city.split(',')[0]}
                    </p>
                  </div>
                </div>
                <div className="contact-card">
                  <MapPin aria-hidden="true" />
                  <div>
                    <h3>Where we serve</h3>
                    <p>
                      {CLUB.city} and surrounds · {CLUB.district}
                    </p>
                  </div>
                </div>
                <div className="contact-card">
                  <MessageCircle aria-hidden="true" />
                  <div>
                    <h3>Fastest reply</h3>
                    <p>
                      Message us on{' '}
                      <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer">
                        Facebook
                      </a>{' '}
                      or{' '}
                      <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer">
                        Instagram
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={120} className="form-card">
            <ContactForm heading="Message the club" />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head-block center-block">
            <span className="eyebrow">Find your path</span>
            <h2 className="sec-title">Join, partner or support</h2>
          </div>
          <AudiencePaths paths={AUDIENCES} />
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-head-block center-block">
            <span className="eyebrow">Our community</span>
            <h2 className="sec-title">Partners we serve alongside</h2>
          </div>
          <ul className="partner-list">
            {PARTNERS.map((p) => (
              <li key={p.name} className="partner-chip">
                {p.name}
              </li>
            ))}
          </ul>
          <div className="section-more">
            <ButtonLink to="/projects" variant="secondary" size="sm">
              See the work we do together <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}