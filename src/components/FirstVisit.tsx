import { ArrowRight, Clock, MapPin } from "lucide-react";
import { ButtonLink } from "./ui";
import { CLUB } from "../data";
export function FirstVisit() {
  return (
    <section
      className="section first-visit"
      id="first-visit"
      aria-labelledby="first-visit-title"
    >
      <div className="container first-visit-grid">
        <div>
          <h2 className="sec-title" id="first-visit-title">
            Your first Thursday.
          </h2>
          <p className="section-lead">
            You can come on your own. You can come with questions. You don’t
            need to know the club vocabulary first.
          </p>
          <ol className="first-visit-steps">
            <li>
              <h3>Before you come</h3>
              <p>
                Check with an officer that this week’s fellowship is going
                ahead. Ask about directions, access needs or any dress
                requirements.
              </p>
            </li>
            <li>
              <h3>When you arrive</h3>
              <p>
                Introduce yourself as a first-time guest. Meet members, hear
                about the club’s work and ask what you’d like to know.
              </p>
            </li>
            <li>
              <h3>Take your time</h3>
              <p>
                Guests may attend three fellowships before deciding. Talk with
                the membership team about projects and the next steps.
              </p>
            </li>
          </ol>
          <ButtonLink
            to="/contact?interest=join-club"
            variant="primary"
            size="md"
          >
            Tell us you’re coming <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
        <aside className="first-visit-note" aria-label="Fellowship details">
          <span className="first-visit-day">Thursday</span>
          <h3>An hour to meet Menengai.</h3>
          <p>
            <Clock size={20} aria-hidden="true" /> {CLUB.meeting.timeLabel} EAT
          </p>
          <p>
            <MapPin size={20} aria-hidden="true" /> Nakuru Athletic Club, Nakuru
          </p>
          <div className="first-visit-cost">
            <strong>Free for guests</strong>
            <span>Membership dues apply when you join.</span>
          </div>
          <ButtonLink to="/events" variant="secondary" size="sm">
            See what’s coming up
          </ButtonLink>
          <p className="first-visit-foot">
            Not sure about something? Ask the club before you travel.
          </p>
        </aside>
      </div>
    </section>
  );
}
