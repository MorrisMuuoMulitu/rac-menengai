import { Link } from "react-router-dom";
import { ButtonLink, PageHero, PageMeta } from "../components/ui";
import { LOGO_PARTNERS, PARTNERS } from "../data";

export default function Partnerships() {
  const textOnlyPartners = PARTNERS.filter((partner) => !partner.logo);
  return (
    <>
      <PageMeta
        title="Partnerships"
        description="Collaborate with the Rotaract Club of Menengai on community service in Nakuru, and meet the partners who work alongside the club."
      />
      <PageHero
        eyebrow="Partnerships"
        title="Let’s work on something useful."
        lead="Bring local knowledge, practical skills or resources to a community project."
      />
      <section className="section">
        <div className="container partnership-grid">
          {[
            {
              title: "Community organisations",
              text: "Tell us what your community needs and where a joint activity could help.",
            },
            {
              title: "Professional partners",
              text: "Share technical expertise, mentorship or support with planning and delivery.",
            },
            {
              title: "Volunteers & supporters",
              text: "Offer your time, materials or a skill that fits a specific project.",
            },
          ].map((p) => (
            <article className="partner-path" key={p.title}>
              <h2>{p.title}</h2>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
        <div className="container partnership-actions">
          <p>
            Start with a conversation about the project, responsibilities and
            how results will be recorded. Payment arrangements are discussed
            directly with authorised club officers.
          </p>
          <ButtonLink to="/contact?interest=partner-project">
            Discuss a partnership
          </ButtonLink>
          <ButtonLink to="/projects" variant="secondary">
            See previous work
          </ButtonLink>
        </div>
      </section>

      <section
        className="section section-tint partner-wall-section"
        id="partners"
        aria-labelledby="partner-wall-title"
      >
        <div className="container">
          <div className="section-topline partner-wall-head">
            <div>
              <p className="section-label">Our partners</p>
              <h2 id="partner-wall-title">Good work is shared work.</h2>
            </div>
            <p>
              Health providers, Rotary and Rotaract clubs, businesses and
              community organisations that put people and resources behind our
              service — among them, the team behind the Nakuru Free Medical
              Outreach.
            </p>
          </div>
          <ul className="partner-wall">
            {LOGO_PARTNERS.map((partner) => (
              <li className="partner-tile" key={partner.name}>
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  loading="lazy"
                  decoding="async"
                />
                <span>{partner.name}</span>
              </li>
            ))}
          </ul>
          {textOnlyPartners.length ? (
            <p className="partner-wall-more">
              <strong>Also working alongside</strong>{" "}
              {textOnlyPartners.map((partner) => partner.name).join(" · ")}
            </p>
          ) : null}
          <p className="fine-print">
            Logos are reproduced from files supplied by each partner. Names
            without supplied artwork are listed in text. Medical Outreach
            details are recorded on{" "}
            <Link to="/events/medical-camp-2026">the event page</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
