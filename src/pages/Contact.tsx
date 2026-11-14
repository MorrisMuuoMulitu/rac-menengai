/**
 * Contact & partnerships — every way to reach the club, plus the partner path.
 */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import {
  AUDIENCES,
  CLUB,
  contactConfig,
  isContactConfirmed,
  PAGE_INTROS,
  PARTNERS,
  SOCIALS,
} from "../data";
import { ButtonLink, PageHero, PageMeta } from "../components/ui";
import { AudiencePaths } from "../components/cards";
import { ContactForm } from "../components/forms";
import { Reveal } from "../hooks";

/** Maps /contact?interest=<key> to a preselected form value. */
const INTEREST_MAP: Record<string, string> = {
  "join-club": "Join the club",
  "partner-project": "Partner on a project",
  "support-project": "Support a project",
  "general-question": "General question",
};

export default function ContactPage() {
  const intro = PAGE_INTROS.contact;
  const [params] = useSearchParams();
  const [interest, setInterest] = useState<string | undefined>(
    () => INTEREST_MAP[params.get("interest") ?? ""],
  );
  useEffect(() => {
    if (params.get("interest"))
      setInterest(INTEREST_MAP[params.get("interest") ?? ""]);
  }, [params]);

  const confirmedEmail = isContactConfirmed(contactConfig.email)
    ? contactConfig.email
    : null;
  const confirmedPhone = isContactConfirmed(contactConfig.phone)
    ? contactConfig.phone
    : null;
  const confirmedWhatsapp = isContactConfirmed(contactConfig.whatsapp)
    ? contactConfig.whatsapp
    : null;

  return (
    <>
      <PageMeta
        title="Contact & Partnerships"
        description={intro.description}
      />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead} />

      {confirmedEmail || confirmedPhone || confirmedWhatsapp ? (
        <section className="section section-tint">
          <div className="container direct-contact">
            <h2>Direct contact</h2>
            <div className="direct-contact-list">
              {confirmedEmail ? (
                <a
                  className="contact-card direct"
                  href={`mailto:${confirmedEmail}`}
                >
                  <Mail aria-hidden="true" />
                  <div>
                    <h3>Email</h3>
                    <p>{confirmedEmail}</p>
                  </div>
                </a>
              ) : null}
              {confirmedPhone ? (
                <a
                  className="contact-card direct"
                  href={`tel:${confirmedPhone.replace(/\s/g, "")}`}
                >
                  <Phone aria-hidden="true" />
                  <div>
                    <h3>Phone</h3>
                    <p>{confirmedPhone}</p>
                  </div>
                </a>
              ) : null}
              {confirmedWhatsapp ? (
                <a
                  className="contact-card direct"
                  href={`https://wa.me/${confirmedWhatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                <h2 className="sec-title">Get in touch with the club</h2>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="contact-cards">
                <div className="contact-card">
                  <Clock aria-hidden="true" />
                  <div>
                    <h3>Fellowship</h3>
                    <p>
                      Every {CLUB.meeting.dayLabel}, {CLUB.meeting.timeLabel} (
                      {CLUB.meeting.timeZoneNote}) — {CLUB.city.split(",")[0]}
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
                    <h3>Social contact</h3>
                    <p>
                      Message us on{" "}
                      <a
                        href={SOCIALS.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>{" "}
                      or{" "}
                      <a
                        href={SOCIALS.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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
            <ContactForm
              key={interest ?? "default"}
              defaultInterest={interest}
              heading="Message the club"
            />
          </Reveal>
          <p className="fine-print">
            The email address is listed on the club’s public Facebook profile.
            The club is working on publishing a phone number. Fellowship is
            every Thursday at Nakuru Athletic Club.
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

      <section className="section qr-section" aria-labelledby="qr-title">
        <div className="container qr-panel">
          <div className="qr-panel-copy">
            <span className="eyebrow">Share the club</span>
            <h2 className="sec-title" id="qr-title">
              One scan, the whole site.
            </h2>
            <p>
              Show this code at a fellowship, add it to a poster or share the
              file with someone who needs the club’s details. It opens{" "}
              <strong>rotaractmenengai.org</strong>.
            </p>
            <div className="qr-actions">
              <a
                className="btn btn-primary btn-sm"
                href="/images/branding/website-qr.png"
                download="rotaract-menengai-website-qr.png"
              >
                Download PNG
              </a>
              <a
                className="btn btn-secondary btn-sm"
                href="/images/branding/website-qr.svg"
                download="rotaract-menengai-website-qr.svg"
              >
                Download SVG
              </a>
            </div>
            <p className="fine-print">
              The code is generated from the club’s public address. Test-scan
              the file at its final print size before ordering a large run.
            </p>
          </div>
          <figure className="qr-figure">
            <img
              src="/images/branding/website-qr.png"
              alt="QR code that opens rotaractmenengai.org"
              width={1024}
              height={1024}
            />
            <figcaption>rotaractmenengai.org</figcaption>
          </figure>
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
            <ButtonLink to="/partnerships#partners" variant="secondary" size="sm">
              Meet our partners <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to="/projects" variant="secondary" size="sm">
              See the work we do together <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
