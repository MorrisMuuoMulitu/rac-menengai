/**
 * Site chrome: announcement bar, header + accessible mobile menu, footer,
 * scroll restoration and the skip link.
 */
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Menu,
  MessageCircle,
  Twitter,
  X,
} from 'lucide-react';
import { ANNOUNCEMENT, CLUB, HERO_IMAGES, NAV_LINKS, SOCIALS } from '../data';
import { useLockBody, useScrolled } from '../hooks';
import { ButtonLink } from './ui';
import { formatMeetingDate, nextMeetingDate } from '../lib/format';

/* ---------- Announcement bar ---------- */
export function AnnouncementBar() {
  const [meeting] = useState(() => nextMeetingDate());
  const active = CLUB.meeting.active;
  return (
    <div className="announcement" role="region" aria-label="Next fellowship announcement">
      <div className="container announcement-inner">
        <p className="announcement-text">
          {active ? (
            <>
              <Clock aria-hidden="true" size={14} />
              <span>
                Next fellowship: <strong>{formatMeetingDate(meeting)}</strong> · {CLUB.meeting.timeLabel} ·{' '}
                {CLUB.city.split(',')[0]}
              </span>
            </>
          ) : (
            <span>Fellowships resume soon — watch our socials for the next date.</span>
          )}
        </p>
        <Link to="/membership" className="announcement-action">
          {ANNOUNCEMENT.action} <ArrowRight aria-hidden="true" size={14} />
        </Link>
      </div>
    </div>
  );
}

/* ---------- Header ---------- */
export function Header() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(12);
  useLockBody(open);
  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' is-sticky' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label={`${CLUB.name} — home`}>
          <span className="brand-mark">
            <img src={HERO_IMAGES.logo} alt="" width={40} height={40} />
          </span>
          <span className="brand-name">
            {CLUB.name}
            <small>{CLUB.shortName} · {CLUB.city}</small>
          </span>
        </Link>

        <nav className="nav-main" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.href} to={l.href} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-cta">
          <ButtonLink to="/membership" variant="primary" size="sm">
            Attend a fellowship
          </ButtonLink>
          <button
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile" aria-hidden={!open}>
        {NAV_LINKS.map((l, i) => (
          <NavLink key={l.href} to={l.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            <span className="mno" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            {l.label}
          </NavLink>
        ))}
        <div className="mobile-nav-cta">
          <ButtonLink to="/membership" variant="primary" onClick={() => setOpen(false)}>
            Attend a fellowship <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <span className="brand-mark">
            <img src={HERO_IMAGES.logo} alt="" width={44} height={44} />
          </span>
          <p>
            {CLUB.name} — {CLUB.motto}. A decade of community impact in {CLUB.city.split(',')[0]}, powered by young
            leaders across {CLUB.district}.
          </p>
          <div className="footer-social">
            <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer" aria-label="RAC Menengai on Facebook">
              <Facebook />
            </a>
            <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" aria-label="RAC Menengai on Instagram">
              <Instagram />
            </a>
            <a href={SOCIALS.x} target="_blank" rel="noopener noreferrer" aria-label="RAC Menengai on X">
              <Twitter />
            </a>
            <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="RAC Menengai on LinkedIn">
              <Linkedin />
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/about">About us</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/awards">Awards</Link>
          <Link to="/news">News</Link>
        </div>
        <div className="footer-col">
          <h4>Join & partner</h4>
          <Link to="/membership">Membership</Link>
          <Link to="/leadership">Leadership</Link>
          <Link to="/contact">Contact & partnerships</Link>
          <a href="https://www.rotary.org" target="_blank" rel="noopener noreferrer">
            Rotary International
          </a>
        </div>
        <div className="footer-col">
          <h4>Meet us</h4>
          <div className="footer-contact">
            <MapPin aria-hidden="true" />
            <span>
              {CLUB.city} · {CLUB.district}
            </span>
          </div>
          <div className="footer-contact">
            <Clock aria-hidden="true" />
            <span>
              Every {CLUB.meeting.dayLabel}, {CLUB.meeting.timeLabel} ({CLUB.meeting.timeZoneNote})
            </span>
          </div>
          <div className="footer-contact">
            <MessageCircle aria-hidden="true" />
            <span>
              Reach us fastest on{' '}
              <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>{' '}
              or{' '}
              <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              .
            </span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>
            © 2016 – {year} {CLUB.name} · {CLUB.district}
          </span>
          <span>{CLUB.motto}</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Scroll restoration on route change ---------- */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}