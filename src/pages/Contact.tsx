/**
 * Contact & partnerships — every way to reach the club, plus the partner path.
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { AUDIENCES, CLUB, contactConfig, isContactConfirmed, PAGE_INTROS, PARTNERS, SOCIALS } from '../data';
import { ButtonLink, PageHero, PageMeta } from '../components/ui';
import { AudiencePaths } from '../components/cards';
import { ContactForm } from '../components/forms';
import { Reveal } from '../hooks';

/** Maps /contact?interest=<key> to a preselected form value. */
const INTEREST_MAP: Record<string, string> = {
  'join-club': 'Join the club',
  'partner-project': 'Partner on a project',
  'support-project': 'Support a project',
  'general-question': 'General question',
};

export default function ContactPage() {
  const intro = PAGE_INTROS.contact;
  const [params] = useSearchParams();
  const [interest, setInterest] = useState<string | undefined>(() => INTEREST_MAP[params.get('interest') ?? '']);
  useEffect(() => {
    if (params.get('interest')) setInterest(INTEREST_MAP[params.get('interest') ?? '']);
  }, [params]);

  const confirmedEmail = isContactConfirmed(contactConfig.email) ? contactConfig.email : null;
  const confirmedPhone = isContactConfirmed(contactConfig.phone) ? contactConfig.phone : null;
  const confirmedWhatsapp = isContactConfirmed(contactConfig.whatsapp) ? contactConfig.whatsapp : null;

  return (
    <>
      <PageMeta title="Contact & Partnerships" description={intro.description} />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead} />

      {(confirmedEmail || confirmedPhone || confirmedWhatsapp) ? (
        <section className="section section-tint">
          <div className="container direct-contact">
            <h2>Direct contact</h2>
            <div className="direct-contact-list">
              {confirmedEmail ? (
                <a className="contact-card direct" href={`mailto:${confirmedEmail}`}>
                  <Mail aria-hidden="true" />
                  <div>
                    <h3>Email</h3>
                    <p>{confirmedEmail}</p>
                  </div>
                </a>
              ) : null}
              {confirmedPhone ? (
                <a className="contact-card direct" href={`tel:${confirmedPhone.replace(/\s/g, '')}`}>
                  <Phone aria-hidden="true" />
                  <div>
                    <h3>Phone</h3>
                    <p>{confirmedPhone}</p>
                  </div>
                </a>
              ) : null}
              {confirmedWhatsapp ? (
                <a className="contact-card direct" href={`https://wa.me/${confirmedWhatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden="true" />
                  <div>
                    <h3>WhatsApp</h3>
                    <p>{confirmedWhatsapp}</p>
                  </div>
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section-tint">
        <div className="container form-layout">
          <div className="form-layout-copy">
            <Reveal>
              <div className="section-head-block">
                <span className="eyebrow">Send a message</span>
                <h2 className="sec-title">Our officers review every message</h2>
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
            <ContactForm key={interest ?? 'default'} defaultInterest={interest} heading="Message the club" />
          </Reveal>
          <p className="fine-print">
            Official email and phone will appear here once the club confirms them — nothing is shown before it
            exists. Until then, the fastest way to reach us is the form, Facebook or Instagram.
          </p>
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