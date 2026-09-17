/**
 * Story sections: hero, impact stats, about, pillars, focus areas.
 */
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  Building2,
  Clock,
  Droplets,
  Flag,
  GraduationCap,
  Handshake,
  HeartHandshake,
  HeartPulse,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { ABOUT_IMAGES, FOCUS_AREAS, HERO_IMAGES, PILLARS, STATS } from '../data';
import { Reveal, useCountUp, useSpotlight, useTilt } from '../hooks';
import { SectionHead } from './chrome';

/* ---------- Hero ---------- */
export function Hero() {
  const bgRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = bgRef.current;
    if (!el || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (y < window.innerHeight * 1.15) el.style.transform = `translateY(${Math.round(y * 0.2)}px)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero-bg-wrap" aria-hidden="true" ref={bgRef}>
        <div className="hero-bg" style={{ backgroundImage: `url('${HERO_IMAGES.background}')` }} />
      </div>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-glow g2" aria-hidden="true" />
      <div className="hero-side" aria-hidden="true">
        Est. 2016 — Rotary District 9212 — Nakuru, Kenya
      </div>
      <div className="container hero-inner">
        <div className="hero-main">
          <span className="hero-eyebrow la la-1">
            <span className="dot" aria-hidden="true" />
            Rotary District 9212 · Nakuru, Kenya
          </span>
          <h1 className="la la-2">
            A Decade of <span className="grad-text">Service Above Self</span>
          </h1>
          <p className="hero-sub la la-3">
            Rotaract Club of Menengai — a vibrant family of young professionals and students turning Nakuru’s
            challenges into moments of impact. Join us every Thursday for fellowship, and join us in service every
            single day.
          </p>
          <div className="hero-ctas la la-4">
            <span className="magnetic">
              <a className="btn btn-solid" href="#join">
                Become a Member <ArrowRight />
              </a>
            </span>
            <span className="magnetic">
              <a className="btn btn-ghost-light" href="#projects">
                Explore Our Work
              </a>
            </span>
          </div>
          <dl className="hero-meta la la-5">
            <div className="hm-item">
              <b>10+</b>
              <span>Years of Service</span>
            </div>
            <div className="hm-item">
              <b>D9212</b>
              <span>Kenya · Ethiopia</span>
            </div>
            <div className="hm-item">
              <b>Thu</b>
              <span>5:30 – 6:30 PM</span>
            </div>
            <div className="hm-item">
              <b>#DEI</b>
              <span>Champions 2026</span>
            </div>
          </dl>
        </div>
        <HeroPanel />
      </div>
      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <span className="wheel">
          <i />
        </span>
      </div>
    </section>
  );
}

/** Next Thursday 5:30 PM local time. */
function nextFellowship(from: Date): Date {
  const d = new Date(from);
  const thursday = 4;
  let diff = (thursday - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  d.setHours(17, 30, 0, 0);
  if (d.getTime() <= from.getTime()) d.setDate(d.getDate() + 7);
  return d;
}

function fmtLeft(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function HeroPanel() {
  const [left, setLeft] = useState(() => fmtLeft(nextFellowship(new Date()).getTime() - Date.now()));
  const tilt = useTilt(6);
  useEffect(() => {
    const t = setInterval(() => {
      setLeft(fmtLeft(nextFellowship(new Date()).getTime() - Date.now()));
    }, 30_000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hero-panel la la-4">
      <div className="ring-wrap" aria-hidden="true">
        <span className="ring" />
        <span className="ring-label">Service Above Self · Since 2016 ·</span>
      </div>
      <div className="hp-card tilt" onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
        <div className="hp-top">
          <span className="hp-logo">
            <img src={HERO_IMAGES.logo} alt="RAC Menengai emblem" />
          </span>
          <div>
            <b>RAC Menengai, live</b>
            <span>Impact · Fellowship · Leadership</span>
          </div>
        </div>
        <div className="hp-rows">
          <div className="hp-row hp-live">
            <Clock aria-hidden="true" />
            <div>
              <b>
                Next fellowship in <em>{left}</em>
              </b>
              <span>Every Thursday · 5:30 – 6:30 PM</span>
            </div>
          </div>
          <div className="hp-row">
            <Droplets aria-hidden="true" />
            <div>
              <b>Adopt-a-River</b>
              <span>Signature environmental project</span>
            </div>
          </div>
          <div className="hp-row">
            <HeartPulse aria-hidden="true" />
            <div>
              <b>150+ mother packs</b>
              <span>Bondeni Maternity, opening day</span>
            </div>
          </div>
          <div className="hp-row">
            <Award aria-hidden="true" />
            <div>
              <b>DEI Champion 2026</b>
              <span>Legacy Award · District 9212</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stats ---------- */
function StatCard({ value, suffix, label, note, start, delay }: { value: number; suffix: string; label: string; note: string; start: boolean; delay: number }) {
  const display = useCountUp(value, suffix, start);
  const { onMouseMove } = useSpotlight();
  return (
    <Reveal delay={delay} className="stat-card spot" onMouseMove={onMouseMove}>
      <span className="stat-num" aria-label={`${value}${suffix} ${label}`}>
        {display}
      </span>
      <h4>{label}</h4>
      <p>{note}</p>
    </Reveal>
  );
}

export function Stats() {
  const [start, setStart] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStart(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="block stats" aria-label="Club impact in numbers">
      <div className="container">
        <div className="stats-grid" ref={ref}>
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} start={start} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- About ---------- */
export function About() {
  return (
    <section className="block about" id="about">
      <div className="container about-grid">
        <Reveal className="about-visual">
          <div className="about-img">
            <img src={ABOUT_IMAGES.tall} alt="Members at the Adopt-a-River launch" loading="lazy" />
          </div>
          <div className="about-img offset">
            <img src={ABOUT_IMAGES.wide} alt="Members at the Nakuru city clean-up campaign" loading="lazy" />
          </div>
          <div className="about-badge" aria-label="10 years strong">
            <b>10</b>
            <span>
              Years
              <br />
              Strong
            </span>
          </div>
        </Reveal>
        <div className="about-copy">
          <Reveal>
            <span className="eyebrow">Who We Are</span>
            <h2 className="sec-title">Nakuru’s home of young leaders in action</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="body body-first">
              Chartered by the Rotary Club of Nakuru and part of Rotary International’s global Rotaract family, the
              Rotaract Club of Menengai has spent a decade turning energy into impact — from cleaning our rivers to
              welcoming new mothers at Bondeni Maternity.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="body">
              Rooted in “Service Above Self,” we bring together young professionals and students aged 18–30 across
              District 9212 to lead with empathy, skill and joy.
            </p>
          </Reveal>
          <div className="about-feats">
            {[
              { icon: <Flag />, title: 'Our Motto', text: 'Service Above Self' },
              { icon: <Building2 />, title: 'Sponsor', text: 'Rotary Club of Nakuru' },
              { icon: <Users />, title: 'Members', text: '18–30, diverse & inclusive' },
              { icon: <MapPin />, title: 'Home', text: 'Nakuru, Kenya · D9212' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 70} className="feat">
                {f.icon}
                <div>
                  <b>{f.title}</b>
                  <span>{f.text}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <a className="btn btn-outline" href="#join">
              Come meet us <ArrowRight />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Pillars ---------- */
const PILLAR_ICONS = { users: <Users />, star: <Star />, heart: <HeartHandshake /> } as const;

export function Pillars() {
  const { onMouseMove } = useSpotlight();
  return (
    <section className="block pillars">
      <div className="container">
        <SectionHead center index="01" eyebrow="What We Stand For" title="Three pillars. One purpose." />
        <div className="pillars-grid">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 90} className="pillar-card spot" onMouseMove={onMouseMove}>
              <span className="idx" aria-hidden="true">
                0{i + 1}
              </span>
              <div className={`v-icon${'navy' in p && p.navy ? ' navy' : ''}`}>
                {PILLAR_ICONS[p.icon as keyof typeof PILLAR_ICONS]}
              </div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Focus areas ---------- */
const FOCUS_ICONS = {
  leaf: <Leaf />,
  heartbeat: <HeartPulse />,
  book: <GraduationCap />,
  female: <Sparkles />,
  water: <Droplets />,
  chart: <TrendingUp />,
  shield: <ShieldCheck />,
  dove: <Handshake />,
} as const;

export function FocusAreas() {
  return (
    <section className="block focus">
      <div className="container">
        <SectionHead center index="02" eyebrow="Rotary's Seven Areas of Focus" title="Where our service lands" />
        <div className="focus-grid">
          {FOCUS_AREAS.map((a, i) => (
            <Reveal key={a.label} delay={(i % 4) * 70} className="focus-card">
              <span className="fc-ico">{FOCUS_ICONS[a.icon as keyof typeof FOCUS_ICONS]}</span>
              <b>{a.label}</b>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
