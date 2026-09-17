/**
 * Site chrome: section heading, navbar, ticker, footer, back-to-top.
 */
import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Sparkles, Twitter } from 'lucide-react';
import { NAV_LINKS, SOCIALS, HERO_IMAGES, TICKER_ITEMS } from '../data';
import { useActiveSection, useLockBody, usePrefersReducedMotionOrTouch, useScrollProgress, Reveal } from '../hooks';

/* ---------- Section heading ---------- */
export function SectionHead({
  eyebrow,
  title,
  lead,
  center = false,
  dark = false,
  index,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  center?: boolean;
  dark?: boolean;
  index?: string;
}) {
  return (
    <Reveal className={`sec-head${center ? ' center' : ''}`}>
      {index ? (
        <span className="sec-watermark" aria-hidden="true">
          {index}
        </span>
      ) : null}
      <span className="eyebrow" style={dark ? { color: '#f08bb0' } : undefined}>
        {index ? <i>{index}</i> : null}
        {eyebrow}
      </span>
      <h2 className="sec-title" style={dark ? { color: '#fff' } : undefined}>
        {title}
      </h2>
      {lead ? (
        <p className="sec-lead" style={dark ? { color: 'rgba(255,255,255,0.72)' } : undefined}>
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}

/* ---------- Navbar ---------- */
export function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [open, setOpen] = useState(false);
  const progress = useScrollProgress();
  const active = useActiveSection(['about', 'projects', 'awards', 'leadership', 'news', 'faq']);

  useLockBody(open);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open ]);

  return (
    <>
      <div className="progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`site-header${sticky ? ' is-sticky' : ''}`}>
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="Rotaract Club of Menengai — home">
            <img className="brand-mark" src={HERO_IMAGES.logo} alt="RAC Menengai emblem" width={50} height={50} />
            <span className="brand-name">
              Rotaract Club of Menengai<small>RAC Menengai · Nakuru</small>
            </span>
          </a>
          <nav className="nav-main" aria-label="Primary">
            <a href="#top" className={active === 'top' ? 'active' : ''}>
              Home
            </a>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className={active === l.href.slice(1) ? 'active' : ''}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav-cta">
            <a className="btn btn-solid btn-sm" href="#join">
              Join Us
            </a>
            <button
              className="nav-toggle"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Mobile">
        {[{ href: '#top', label: 'Home' }, ...NAV_LINKS.map((l) => ({ href: l.href, label: l.label }))].map((l, i) => (
          <a key={l.href} href={l.href} data-no={String(i + 1).padStart(2, '0')} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#join" data-no="07" onClick={() => setOpen(false)} style={{ color: 'var(--pink-600)' }}>
          Become a Member
        </a>
      </nav>
    </>
  );
}

/* ---------- Ticker ---------- */
export function Ticker() {
  const row = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[0, 1].map((half) => (
          <span key={half}>
            {row.slice(half * TICKER_ITEMS.length, half * TICKER_ITEMS.length + TICKER_ITEMS.length).map((item) => (
              <span key={`${half}-${item}`} style={{ display: 'contents' }}>
                {item} <Sparkles aria-hidden="true" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <a className="brand" href="#top" aria-label="Back to top">
            <img className="brand-mark" src={HERO_IMAGES.logo} alt="RAC Menengai emblem" width={50} height={50} />
            <span className="brand-name">
              Rotaract Club of Menengai<small style={{ color: 'var(--pink-400)' }}>RAC Menengai · Nakuru</small>
            </span>
          </a>
          <p>Service Above Self — a decade of community impact in Nakuru, powered by young leaders across District 9212.</p>
          <div className="footer-social">
            <a href={SOCIALS.facebook} target="_blank" rel="noopener" aria-label="Facebook">
              <Facebook />
            </a>
            <a href={SOCIALS.instagram} target="_blank" rel="noopener" aria-label="Instagram">
              <Instagram />
            </a>
            <a href={SOCIALS.x} target="_blank" rel="noopener" aria-label="X (Twitter)">
              <Twitter />
            </a>
            <a href={SOCIALS.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
              <Linkedin />
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <a href="#about">About Us</a>
          <a href="#projects">Projects</a>
          <a href="#awards">Awards</a>
          <a href="#leadership">Leadership</a>
          <a href="#news">News</a>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <a href="#join">Become a Member</a>
          <a href="#signature">Adopt-a-River</a>
          <a href="https://www.rotary.org/en/get-involved/rotaract-clubs" target="_blank" rel="noopener">
            About Rotaract
          </a>
          <a href="https://www.rotary.org" target="_blank" rel="noopener">
            Rotary International
          </a>
        </div>
        <div className="footer-col">
          <h4>Meet Us</h4>
          <div className="footer-contact">
            <MapPin />
            <span>Nakuru, Kenya · Rotary District 9212</span>
          </div>
          <div className="footer-contact">
            <Clock />
            <span>Fellowship every Thursday, 5:30–6:30 PM</span>
          </div>
          <div className="footer-contact">
            <Mail />
            <a href={SOCIALS.facebook} target="_blank" rel="noopener">
              Message us on Facebook
            </a>
          </div>
        </div>
      </div>
      <div className="footer-mast" aria-hidden="true">
        <span>Menengai</span>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© 2016 – 2026 Rotaract Club of Menengai · Rotary District 9212</span>
          <span>Service Above Self</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Back to top ---------- */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      className={`toplink${visible ? ' visible' : ''}`}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUp />
    </button>
  );
}

/* ---------- Cursor glow (fine pointers only, reduced-motion safe) ---------- */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefers = usePrefersReducedMotionOrTouch();
  useEffect(() => {
    const el = ref.current;
    if (!el || prefers) return;
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let x = tx;
    let y = ty;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.13;
      y += (ty - y) * 0.13;
      el.style.transform = `translate3d(${Math.round(x - 260)}px, ${Math.round(y - 260)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [prefers]);
  return <div className="cursor-glow" ref={ref} aria-hidden="true" />;
}

/* ---------- Section indicator rail (desktop) ---------- */
const RAIL_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'signature', label: 'Adopt-a-River' },
  { id: 'awards', label: 'Awards' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'join', label: 'Join' },
  { id: 'news', label: 'News' },
  { id: 'faq', label: 'FAQ' },
] as const;

export function SectionRail() {
  const active = useActiveSection(RAIL_SECTIONS.map((s) => s.id));
  return (
    <nav className="section-rail" aria-label="Section navigation" aria-hidden="true">
      {RAIL_SECTIONS.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'active' : ''} title={s.label}>
          <span className="rail-dot" />
        </a>
      ))}
    </nav>
  );
}
