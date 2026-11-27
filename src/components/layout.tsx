import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Instagram, Facebook, Menu, X } from "lucide-react";
import { CLUB, NAV_LINKS, contactConfig, isContactConfirmed } from "../data";
import { PUBLIC_ACCOUNTS } from "../content";
import { useLockBody, useScrolled } from "../hooks";
import { ButtonLink } from "./ui";
export function AnnouncementBar() {
  return null;
}
export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  useLockBody(open);
  const scrolled = useScrolled(24);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement;
    const background = [
      document.querySelector("main"),
      document.querySelector("footer"),
    ].filter(Boolean) as HTMLElement[];
    const wasInert = background.map((element) => element.hasAttribute("inert"));
    background.forEach((element) => element.setAttribute("inert", ""));
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab") {
        const elements = [
          toggle.current,
          ...Array.from(
            menu.current?.querySelectorAll<HTMLElement>("a,button") ?? [],
          ),
        ].filter(Boolean) as HTMLElement[];
        const first = elements[0],
          last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      background.forEach((element, index) => {
        if (!wasInert[index]) element.removeAttribute("inert");
      });
      if (previous?.isConnected) previous.focus();
    };
  }, [open]);
  return (
    <header
      className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " menu-open" : ""}`}
    >
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label={`${CLUB.name}, home`}>
          {/* Club-supplied mark with a transparent background for the header. */}
          <picture>
            <source
              srcSet="/images/branding/menengai-logo-transparent.webp"
              type="image/webp"
            />
            <img
              className="brand-lockup"
              src="/images/branding/menengai-logo-transparent.png"
              alt={CLUB.name}
              width={1908}
              height={824}
            />
          </picture>
        </Link>
        <nav className="nav-main" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.href} to={l.href}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-cta">
          <ButtonLink to="/membership" size="sm">
            Join us <ArrowUpRight size={17} aria-hidden="true" />
          </ButtonLink>
          <button
            ref={toggle}
            className="nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav
        ref={menu}
        id="mobile-menu"
        className="mobile-nav"
        aria-label="Mobile"
        hidden={!open}
      >
        <div className="mobile-nav-main">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.href} to={l.href} onClick={() => setOpen(false)}>
              {l.label}
              <ArrowUpRight size={22} aria-hidden="true" />
            </NavLink>
          ))}
        </div>
        <div className="mobile-nav-extras">
          <Link to="/learn" onClick={() => setOpen(false)}>
            Learn about Rotaract
          </Link>
          <Link to="/membership/orientation" onClick={() => setOpen(false)}>
            New member course
          </Link>
          <Link to="/awards" onClick={() => setOpen(false)}>
            Awards &amp; recognition
          </Link>
          <Link to="/partnerships" onClick={() => setOpen(false)}>
            Partnerships
          </Link>
          <Link to="/rotary" onClick={() => setOpen(false)}>
            Rotary worldwide
          </Link>
          <Link to="/about/district-9215" onClick={() => setOpen(false)}>
            Rotary District 9215
          </Link>
        </div>
        <div className="mobile-nav-visit">
          <p>Start with a Thursday.</p>
          <span>5:00–7:00 PM · Nakuru Athletic Club</span>
          <Link to="/membership#first-visit" onClick={() => setOpen(false)}>
            Plan your visit <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          {/* The club mantra as supplied artwork: "Thee Magicals…", the slogan
              members say when they meet (see docs/BRANDING_VERIFICATION.md). */}
          <picture>
            <source
              srcSet="/images/branding/thee-magicals.webp"
              type="image/webp"
            />
            <img
              className="footer-magicals"
              src="/images/branding/thee-magicals.png"
              alt="Thee Magicals — the club mantra"
              width={203}
              height={219}
            />
          </picture>
          <p>
            Community service, professional development and fellowship in
            Nakuru, Kenya.
          </p>
          <div className="footer-social">
            {PUBLIC_ACCOUNTS.map((a) => (
              <a
                key={a.platform}
                href={a.url!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Menengai on ${a.platform}`}
              >
                {a.platform === "Instagram" ? <Instagram /> : <Facebook />}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-col">
          <h2>Explore</h2>
          <Link to="/about">About the club</Link>
          <Link to="/projects">Our projects</Link>
          <Link to="/events">Events & fellowship</Link>
          <Link to="/awards">Club archive</Link>
        </div>
        <div className="footer-col">
          <h2>Get involved</h2>
          <Link to="/membership">Become a member</Link>
          <Link to="/membership/orientation">New member course</Link>
          <Link to="/learn">Rotaract glossary &amp; guide</Link>
          <Link to="/partnerships">Partner with us</Link>
          <Link to="/partnerships#partners">Our partners</Link>
          <Link to="/leadership">Leadership</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
        <div className="footer-col">
          <h2>Find us in Nakuru</h2>
          <p>
            Thursday fellowship
            <br />
            5:00–7:00 PM EAT
          </p>
          <p>Thursday fellowship at Nakuru Athletic Club.</p>
          <div className="footer-contact">
            <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>
            {contactConfig.phones.filter(isContactConfirmed).map((phone) => (
              <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} key={phone}>
                {phone}
              </a>
            ))}
          </div>
          <Link to="/about/district-9215">Rotary District 9215</Link>
          <Link to="/rotary">Rotary worldwide</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>
            © {new Date().getFullYear()} {CLUB.name}
          </span>
          <span>Service Above Self</span>
          <a
            className="design-credit"
            href="https://www.impelweb.studio/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Designed by Impel Web ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}
