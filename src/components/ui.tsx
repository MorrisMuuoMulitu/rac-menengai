/**
 * Small UI primitives shared across pages: links-as-buttons, section headings,
 * inner-page heroes, the contextual stat bar and the explicit image slot.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, useCountUp } from '../hooks';
import type { Stat } from '../data';

/* ---------- Eyebrow / section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  center = false,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <Reveal className={`sec-head${center ? ' center' : ''}`}>
      <span className="eyebrow" data-dark={dark || undefined}>
        {eyebrow}
      </span>
      <h2 className="sec-title" data-dark={dark || undefined}>
        {title}
      </h2>
      {lead ? (
        <p className="sec-lead" data-dark={dark || undefined}>
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}

/* ---------- Button-styled link ---------- */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'light' | 'dark';

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  children,
  external = false,
  ariaLabel,
  onClick,
}: {
  to: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  external?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
}) {
  const cls = `btn btn-${variant} btn-${size}`;
  if (external) {
    return (
      <a className={cls} href={to} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link className={cls} to={to} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </Link>
  );
}

/* ---------- Inner-page hero ---------- */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="page-hero-title">{title}</h1>
        {lead ? <p className="page-hero-lead">{lead}</p> : null}
        {children ? <div className="page-hero-actions">{children}</div> : null}
      </div>
    </section>
  );
}

/* ---------- Contextual stat bar ---------- */
export function StatBar({ stats, dark = false, delayStep = 90 }: { stats: Stat[]; dark?: boolean; delayStep?: number }) {
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
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`statbar${dark ? ' statbar-dark' : ''}`} ref={ref}>
      {stats.map((s, i) => (
        <StatCell key={s.label} stat={s} start={start} delay={i * delayStep} dark={dark} />
      ))}
    </div>
  );
}

function StatCell({ stat, start, delay, dark }: { stat: Stat; start: boolean; delay: number; dark: boolean }) {
  const display = useCountUp(stat.value, stat.suffix, start);
  return (
    <Reveal delay={delay} className="stat-cell" as="div">
      <span className="stat-value" data-dark={dark || undefined} aria-label={`${stat.value}${stat.suffix} ${stat.label}`}>
        {display}
      </span>
      <span className="stat-label" data-dark={dark || undefined}>
        {stat.label}
      </span>
      <span className="stat-context" data-dark={dark || undefined}>
        {stat.context}
        {stat.year ? ` · ${stat.year}` : ''}
      </span>
    </Reveal>
  );
}

/* ---------- Explicit image slot (never a fake photo) ---------- */
export function PlaceholderImage({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`img-slot${className ? ` ${className}` : ''}`} role="img" aria-label={label}>
      <span className="img-slot-mark" aria-hidden="true">
        {label.slice(0, 2).toUpperCase()}
      </span>
      <span className="img-slot-label">{label}</span>
    </div>
  );
}

/* ---------- Per-page document title ---------- */
export function PageMeta({ title }: { title: string }) {
  useEffect(() => {
    const club = 'Rotaract Club of Menengai';
    document.title = title.includes(club) ? title : `${title} · ${club}`;
  }, [title]);
  return null;
}