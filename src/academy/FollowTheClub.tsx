/**
 * The closing ask: follow the club.
 *
 * It sits at the end of the course, where someone has just spent 92 minutes
 * learning what the club does. The links come from `SOCIALS`, which is the
 * same list the site footer uses, so they cannot drift apart.
 */

import {
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Twitter,
} from "lucide-react";
import { SOCIALS } from "../data";

const CHANNELS = [
  { label: "Instagram", handle: "@racmenengai", href: SOCIALS.instagram, Icon: Instagram },
  { label: "Facebook", handle: "RCmenengai", href: SOCIALS.facebook, Icon: Facebook },
  { label: "X", handle: "@RcMenengai", href: SOCIALS.x, Icon: Twitter },
  { label: "Threads", handle: "@racmenengai", href: SOCIALS.threads, Icon: MessageCircle },
  { label: "LinkedIn", handle: "Rotaract Club of Menengai", href: SOCIALS.linkedin, Icon: Linkedin },
].filter((channel) => Boolean(channel.href));

export function FollowTheClub() {
  return (
    <section className="follow-club" aria-labelledby="follow-club-title">
      <header>
        <span className="eyebrow">One last thing</span>
        <h3 id="follow-club-title">Follow the club</h3>
        <p>
          Project days, fellowship photos and the next event land on social
          media first. Following is how you find out what the club is doing
          between meetings — and it is how the club reaches people who have not
          heard of us yet.
        </p>
      </header>
      <ul className="follow-club-list">
        {CHANNELS.map(({ label, handle, href, Icon }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              <span className="follow-club-icon" aria-hidden="true">
                <Icon size={20} />
              </span>
              <span className="follow-club-who">
                <strong>{label}</strong>
                <small>{handle}</small>
              </span>
              <span className="follow-club-cta">Follow</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="follow-club-note">
        When you post about a club activity, tag the club and check with
        everyone in the photograph before it goes up.
      </p>
    </section>
  );
}
