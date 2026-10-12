import { ButtonLink, PageHero, PageMeta } from "../components/ui";
export default function Partnerships() {
  return (
    <>
      <PageMeta
        title="Partnerships"
        description="Collaborate with the Rotaract Club of Menengai on community service in Nakuru: share expertise, volunteer or support a project."
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
    </>
  );
}
