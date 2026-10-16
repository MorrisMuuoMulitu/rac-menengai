/**
 * Membership — the honest version of what joining asks, the course the club
 * sets, and a way to start either one today.
 *
 * The page is shorter than it was on purpose. Everything a prospective member
 * needs is in the first two screens: what it costs, what it takes, and the two
 * buttons that begin.
 */

import { ArrowRight, BookOpen, Clock, MapPin, Users } from "lucide-react";
import {
  CLUB,
  FAQS,
  JOIN_STEPS,
  MEMBERSHIP,
  PAGE_INTROS,
  formatKes,
} from "../data";
import { ButtonLink, PageHero, PageMeta } from "../components/ui";
import { FaqAccordion } from "../components/cards";
import { ContactForm } from "../components/forms";
import { CHAPTERS, COURSE_INFO } from "../course-info";
import { FirstVisit } from "../components/FirstVisit";
import { Reveal } from "../hooks";

const COURSE_IMAGE =
  "/images/events/nakuru-region-district-governor-meeting-inductions/menengai-induction-members-lineup-560.webp";
const SERVICE_IMAGE =
  "/images/events/mother-pack-bondeni-2026/bondeni-2026-group-outside-720.webp";

export default function MembershipPage() {
  const intro = PAGE_INTROS.membership;
  const lessons = COURSE_INFO.lessons.length;

  return (
    <>
      <PageMeta title="Membership" description={intro.description} />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead}>
        <ButtonLink to="/membership/academy" variant="primary" size="md">
          Start the membership course <ArrowRight aria-hidden="true" />
        </ButtonLink>
        <ButtonLink to="/contact?interest=join-club" variant="secondary" size="md">
          Ask before you commit
        </ButtonLink>
      </PageHero>

      {/* ------------------------------------------------- the two numbers -- */}
      <section className="section membership-facts">
        <div className="container">
          <div className="membership-fact-grid">
            <div className="membership-fact">
              <Clock size={20} aria-hidden="true" />
              <h2>One hour a week</h2>
              <p>
                Fellowship runs every {CLUB.meeting.dayLabel},{" "}
                {CLUB.meeting.timeLabel} at Nakuru Athletic Club. Short service
                update, project news, time to talk.
              </p>
            </div>
            <div className="membership-fact">
              <Users size={20} aria-hidden="true" />
              <h2>{formatKes(MEMBERSHIP.fees.subscription)} a year</h2>
              <p>
                Rotary International dues and club running costs, plus a{" "}
                {formatKes(MEMBERSHIP.fees.pin)} Rotaract pin. Projects are
                funded separately by fundraising — you are never billed for
                one.
              </p>
            </div>
            <div className="membership-fact">
              <BookOpen size={20} aria-hidden="true" />
              <h2>A course, then a conversation</h2>
              <p>
                {CHAPTERS.length} chapters and {lessons} lessons about Rotaract,
                service and leadership, ending in a one-page proposal. Officers
                read it; a person still decides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- the course -- */}
      <section className="section section-tint" id="course">
        <div className="container membership-course">
          <div className="membership-course-media">
            <img
              src={COURSE_IMAGE}
              alt="Members of the Rotaract Club of Menengai standing together after a fellowship."
              width={720}
              height={480}
              loading="lazy"
              decoding="async"
            />
            <img
              src={SERVICE_IMAGE}
              alt="Members handing out mother packs during a service project."
              width={720}
              height={480}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div>
            <span className="eyebrow">The membership course</span>
            <h2 className="sec-title">
              Learn the movement before you commit to it
            </h2>
            <p className="section-lead">
              {COURSE_INFO.lead} It is online, it is free, and you can stop
              halfway and come back. Each chapter ends with a real situation —
              the sort that turns up at a project, not in a textbook.
            </p>
            <ol className="membership-chapters">
              {CHAPTERS.map((chapter, index) => (
                <li key={chapter.id}>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <strong>{chapter.title}</strong>
                    <p>{chapter.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="section-more">
              <ButtonLink to="/membership/academy" variant="primary" size="lg">
                Open the academy <ArrowRight aria-hidden="true" />
              </ButtonLink>
              <ButtonLink to="/learn" variant="secondary" size="sm">
                Or just look up a term
              </ButtonLink>
            </div>
            <p className="form-hint">
              Reading the course needs no account. Signing in is what saves your
              place and lets the club mark your answers.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- who joins -- */}
      <section className="section">
        <div className="container membership-who">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">Who can join</span>
              <h2 className="sec-title">
                If you’re 18 or over, there is a place for you here
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
      </section>

      <FirstVisit />

      {/* ------------------------------------------------------------ steps -- */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head-block">
              <span className="eyebrow">How joining works</span>
              <h2 className="sec-title">Four steps, in this order</h2>
              <p className="section-lead">
                The course can run alongside the first two. Nothing is decided
                behind your back, and nobody is inducted on the strength of a
                quiz score.
              </p>
            </div>
          </Reveal>
          <ol className="join-steps">
            {JOIN_STEPS.map((step, index) => (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 80}
                className="join-step"
              >
                <span className="join-step-no" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </ol>

          <div className="membership-costs">
            <div>
              <h3>What it costs</h3>
              <dl>
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
                <div>
                  <dt>Visiting as a guest</dt>
                  <dd>Free</dd>
                </div>
              </dl>
              <p className="form-hint">{MEMBERSHIP.fees.note}</p>
            </div>
            <div className="membership-costs-note">
              <h3>What nobody will ask you for</h3>
              <p>
                No joining fee is published and no minimum donation is expected.
                You will not be asked to fund a project out of your own pocket,
                and you do not need a profession, a degree or a car to be
                useful here.
              </p>
              <p className="membership-meeting">
                <MapPin size={18} aria-hidden="true" /> Fellowship ·{" "}
                {CLUB.meeting.dayLabel}, {CLUB.meeting.timeLabel} · Nakuru
                Athletic Club
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- the ask -- */}
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
                {CLUB.meeting.dayLabel}. Guests are welcome, and you can bring
                questions instead of answers.
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
            <h2 className="sec-title">Questions people actually ask</h2>
          </div>
          <FaqAccordion faqs={FAQS} />
        </div>
      </section>
    </>
  );
}
