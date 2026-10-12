/**
 * Membership — who can join, the three steps, what it costs (flagged), the
 * membership-focused FAQ, and the join-interest form.
 */
import { ArrowRight, Users } from "lucide-react";
import {
  CLUB,
  FAQS,
  JOIN_STEPS,
  MEMBERSHIP,
  ORIENTATION,
  PAGE_INTROS,
  formatKes,
} from "../data";
import { ButtonLink, PageHero, PageMeta } from "../components/ui";
import { FaqAccordion, OpportunityCard } from "../components/cards";
import { ContactForm } from "../components/forms";
import { Reveal } from "../hooks";

export default function MembershipPage() {
  const intro = PAGE_INTROS.membership;
  return (
    <>
      <PageMeta title="Membership" description={intro.description} />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead}>
        <ButtonLink to="/contact" variant="secondary" size="sm">
          Ask a question
        </ButtonLink>
      </PageHero>

      <section className="section section-tint">
        <div className="container membership-grid">
          <div className="membership-copy">
            <Reveal>
              <div className="section-head-block">
                <span className="eyebrow">Who can join</span>
                <h2 className="sec-title">
                  If you’re 18 and over, you’re welcome
                </h2>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <p className="lede">{MEMBERSHIP.whoCanJoin}</p>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">{MEMBERSHIP.whatHappens}</p>
            </Reveal>
            <Reveal delay={120}>
              <p className="guest-note">
                <Users aria-hidden="true" /> {MEMBERSHIP.guestNote}
              </p>
            </Reveal>
          </div>
          <div className="membership-side">
            <OpportunityCard compact />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">How joining works</span>
              <h2 className="sec-title">Getting started</h2>
            </div>
          </Reveal>
          <ol className="join-steps">
            {JOIN_STEPS.map((s, i) => (
              <Reveal
                as="li"
                key={s.title}
                delay={i * 80}
                className="join-step"
              >
                <span className="join-step-no" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal>
            <div className="orientation-callout">
              <div className="orientation-callout-copy">
                <span className="callout-badge">Learn about the club</span>
                <h3>New member orientation</h3>
                <p>
                  A short course about Rotaract and RAC Menengai —{" "}
                  {ORIENTATION.modules.length} modules, about{" "}
                  {ORIENTATION.modules.reduce(
                    (total, m) => total + m.minutes,
                    0,
                  )}{" "}
                  minutes, plus a {ORIENTATION.questions.length}-question check.
                  Work through it at your own pace; your progress is saved in
                  this browser.
                </p>
                <ul className="callout-points">
                  {ORIENTATION.modules.slice(0, 4).map((m) => (
                    <li key={m.id}>{m.title}</li>
                  ))}
                </ul>
              </div>
              <div className="orientation-callout-actions">
                <ButtonLink
                  to="/membership/orientation"
                  variant="primary"
                  size="lg"
                >
                  Start the course <ArrowRight aria-hidden="true" />
                </ButtonLink>
                <p className="form-hint">
                  Ask the membership team how they confirm orientation.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="fees-card">
              <h3>What it costs</h3>
              <dl className="fee-list">
                <div>
                  <dt>Annual membership</dt>
                  <dd>
                    {formatKes(MEMBERSHIP.fees.subscription)}{" "}
                    <span>{MEMBERSHIP.fees.subscriptionPeriod}</span>
                  </dd>
                </div>
                <div>
                  <dt>Rotaract pin</dt>
                  <dd>{formatKes(MEMBERSHIP.fees.pin)}</dd>
                </div>
              </dl>
              <p className="fee-note">{MEMBERSHIP.fees.note}</p>
              <p className="form-hint">
                Guests attend free — fees apply once you join.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container form-layout">
          <div className="form-layout-copy">
            <Reveal>
              <div className="section-head-block">
                <span className="eyebrow">Ready when you are</span>
                <h2 className="sec-title">Tell us you’re coming</h2>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <p className="lede">
                Leave your details and one of our officers will invite you to
                the next fellowship at Nakuru Athletic Club on a{" "}
                {CLUB.meeting.dayLabel}; guests are welcome.
              </p>
            </Reveal>
          </div>
          <Reveal delay={120} className="form-card">
            <ContactForm
              defaultInterest="Join the club"
              heading="Interest in joining"
            />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head-block center-block">
            <span className="eyebrow">Good to know</span>
            <h2 className="sec-title">Questions, answered</h2>
          </div>
          <FaqAccordion faqs={FAQS} />
        </div>
      </section>
    </>
  );
}
