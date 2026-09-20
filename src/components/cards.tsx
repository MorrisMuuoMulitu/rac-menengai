/**
 * Reusable content cards: service areas, projects (+ filter), leaders,
 * stories, the current-opportunity card with live date, FAQ accordion and
 * audience paths.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Book,
  Building,
  CalendarDays,
  ChevronDown,
  Clock,
  Droplets,
  Flag,
  GraduationCap,
  Handshake,
  Heart,
  HeartPulse,
  Leaf,
  MapPin,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import {
  CLUB,
  FELLOWSHIP_OVERRIDE,
  type AudiencePath,
  type Faq,
  type IconKey,
  type Leader,
  type NewsItem,
  type Project,
  type ServiceArea,
} from '../data';
import { Reveal } from '../hooks';
import { ButtonLink, SmartImage } from './ui';
import {
  fellowship,
  fellowshipStatus,
  formatMeetingDate,
  meetingDayLabel,
  meetingTimeLabel,
  describeCountdown,
  type FellowshipState,
} from '../lib/fellowship';

const FELLOWSHIP_CFG = { ...fellowship, override: FELLOWSHIP_OVERRIDE };

/** Status snapshot with a stable fallback if the event calculation fails. */
function statusSnapshot(): { ok: true; status: FellowshipState } | { ok: false } {
  try {
    return { ok: true, status: fellowshipStatus(new Date(), FELLOWSHIP_CFG) };
  } catch {
    return { ok: false };
  }
}

/* ---------- Service area ---------- */
const SERVICE_ICONS: Record<IconKey, React.ReactNode> = {
  leaf: <Leaf />,
  heart: <Heart />,
  book: <Book />,
  users: <Users />,
  star: <Star />,
  droplets: <Droplets />,
  heartPulse: <HeartPulse />,
  graduation: <GraduationCap />,
  sparkles: <Sparkles />,
  trending: <TrendingUp />,
  shield: <Shield />,
  handshake: <Handshake />,
  calendar: <CalendarDays />,
  mapPin: <MapPin />,
  award: <Award />,
  flag: <Flag />,
  building: <Building />,
  wallet: <Wallet />,
  messageCircle: <MessageCircle />,
};

export function ServiceAreaCard({ area, delay = 0 }: { area: ServiceArea; delay?: number }) {
  const linkLabel = SERVICE_LINK_LABELS[area.id] ?? `See ${area.title.toLowerCase()} projects`;
  return (
    <Reveal delay={delay} className="service-card" as="article">
      <span className="service-icon" aria-hidden="true">
        {SERVICE_ICONS[area.icon]}
      </span>
      <h3>{area.title}</h3>
      <p>{area.oneLiner}</p>
      <Link to="/projects" className="service-more">
        {linkLabel} <ArrowRight aria-hidden="true" />
      </Link>
    </Reveal>
  );
}

const SERVICE_LINK_LABELS: Record<string, string> = {
  environment: 'See environment projects',
  health: 'See maternal and child health projects',
  education: "See education and girls’ empowerment projects",
  community: 'See community and peacebuilding projects',
};

/* ---------- Project card + filter ---------- */
export function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  return (
    <Reveal delay={delay} as="li" className="project-card">
      <Link to={`/projects/${project.slug}`} className="project-card-inner" aria-label={`Read the project story: ${project.title} (${project.tag}, ${project.year})`}>
        <span className="project-thumb">
          <SmartImage
            src={project.image}
            alt={`${project.title} — photograph from the project`}
            width={800}
            height={500}
            loading="lazy"
            fallback={project.title}
          />
          <span className="project-tag">{project.tag}</span>
        </span>
        <span className="project-body">
          <span className="project-meta">
            <span className="date">{project.year}</span>
            <span className="loc">
              <MapPin aria-hidden="true" size={13} /> {project.location}
            </span>
          </span>
          <h3>{project.title}</h3>
          <span className="project-summary">{project.summary}</span>
          <span className="project-more">
            Read the project story <ArrowRight aria-hidden="true" />
          </span>
        </span>
      </Link>
    </Reveal>
  );
}

export function ProjectFilter({ tags, active, onChange }: { tags: string[]; active: string; onChange: (tag: string) => void }) {
  return (
    <div className="filter-wrap">
      <label className="filter-label" htmlFor="project-filter">
        Filter projects
      </label>
      <div className="filter-row" role="group" aria-label="Filter projects by area">
        {tags.map((t) => (
          <button
            key={t}
            className={`filter-btn${active === t ? ' active' : ''}`}
            aria-pressed={active === t}
            onClick={() => onChange(t)}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Leader card ---------- */
export function LeaderCard({ leader, delay = 0, linkTo }: { leader: Leader; delay?: number; linkTo?: string }) {
  const inner = (
    <Reveal delay={delay} className="leader-card" as="article">
      <span className="leader-avatar" aria-hidden="true">
        {leader.initials}
      </span>
      <h3>{leader.name}</h3>
      <span className="leader-role">
        {leader.role}
        {leader.term ? ` · ${leader.term}` : ''}
      </span>
      <p>{leader.bio}</p>
    </Reveal>
  );
  return linkTo ? (
    <Link to={linkTo} className="leader-link" aria-label={`Read more about our leadership — ${leader.name}`}>
      {inner}
    </Link>
  ) : (
    inner
  );
}

/* ---------- Story card ---------- */
export function StoryCard({ story, delay = 0, to, href }: { story: NewsItem; delay?: number; to?: string; href?: string }) {
  const readLabel = to ? `Read the story: ${story.title}.` : `Read the full story on Instagram: ${story.title}.`;
  const body = (
    <>
      <span className="story-thumb">
        <SmartImage src={story.image} alt={`${story.title} — photograph`} width={640} height={360} loading="lazy" fallback={story.category} />
      </span>
      <span className="story-body">
        <span className="story-meta">
          <span className="cat">{story.category}</span>
          <span className="date">{story.date}</span>
        </span>
        <h3>{story.title}</h3>
        <span className="story-excerpt">{story.excerpt}</span>
        <span className="story-more">
          {to ? 'Read the story' : 'Read the full story on Instagram'} <ArrowRight aria-hidden="true" />
        </span>
      </span>
    </>
  );
  if (to) {
    return (
      <Reveal delay={delay} as="li" className="story-card">
        <Link className="story-card-inner" to={to} aria-label={readLabel}>
          {body}
        </Link>
      </Reveal>
    );
  }
  return (
    <Reveal delay={delay} as="li" className="story-card">
      <a
        className="story-card-inner"
        href={href ?? 'https://www.instagram.com/racmenengai/'}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={readLabel}
      >
        {body}
      </a>
    </Reveal>
  );
}

/* ---------- Current opportunity (next fellowship) ---------- */
export function OpportunityCard({ compact = false }: { compact?: boolean }) {
  const [snapshot, setSnapshot] = useState(statusSnapshot);
  useEffect(() => {
    const t = setInterval(() => setSnapshot(statusSnapshot()), 60_000);
    return () => clearInterval(t);
  }, []);

  const kicker = 'Fellowship';
  const meta = (
    <div className="opportunity-meta">
      <span>
        <Clock aria-hidden="true" /> {meetingTimeLabel()} · East Africa Time
      </span>
      <span>
        <MapPin aria-hidden="true" /> {CLUB.city.split(',')[0]} · casual
      </span>
    </div>
  );

  if (!snapshot.ok) {
    return (
      <Reveal className={`opportunity-card${compact ? ' opportunity-card-compact' : ''}`} as="article">
        <span className="opportunity-kicker">{kicker}</span>
        <h3>Attend a fellowship</h3>
        <p className="opportunity-note">
          Fellowship every {CLUB.meeting.dayLabel}, {meetingTimeLabel()} in {CLUB.city.split(',')[0]}. Guests are
          always welcome.
        </p>
        <div className="opportunity-actions">
          <ButtonLink to="/membership" variant="primary">
            Attend a fellowship <ArrowRight aria-hidden="true" />
          </ButtonLink>
          <ButtonLink to="/contact" variant="secondary">
            Ask a question
          </ButtonLink>
        </div>
      </Reveal>
    );
  }

  const s = snapshot.status;

  if (s.kind === 'override') {
    return (
      <Reveal className={`opportunity-card${compact ? ' opportunity-card-compact' : ''}`} as="article">
        <span className="opportunity-kicker">Special announcement</span>
        <h3>Fellowship update</h3>
        <p className="opportunity-note">{s.message}</p>
        <div className="opportunity-actions">
          <ButtonLink to="/contact" variant="primary">
            Ask a question
          </ButtonLink>
        </div>
      </Reveal>
    );
  }

  if (s.kind === 'live') {
    return (
      <Reveal className={`opportunity-card${compact ? ' opportunity-card-compact' : ''}`} as="article">
        <span className="opportunity-kicker">Right now</span>
        <h3>Fellowship is happening now</h3>
        <p className="opportunity-count">
          <span className="oc-day">Happening now</span>
          <span className="oc-date">{formatMeetingDate(s.start)}</span>
          <span className="oc-note">Fellowship runs until 6:30 PM — come through now, guests welcome.</span>
        </p>
        {meta}
        <div className="opportunity-actions">
          <ButtonLink to="/membership" variant="primary">
            How joining works <ArrowRight aria-hidden="true" />
          </ButtonLink>
          <ButtonLink to="/contact" variant="secondary">
            Ask a question
          </ButtonLink>
        </div>
      </Reveal>
    );
  }

  const now = new Date();
  const day = meetingDayLabel(s.start, now);
  const note =
    s.kind === 'today'
      ? `Fellowship starts today at 5:30 PM — see you there ${describeCountdown(s.start, s.end, now)}.`
      : `Fellowship runs ${meetingTimeLabel()} — see you there ${describeCountdown(s.start, s.end, now)}.`;

  return (
    <Reveal className={`opportunity-card${compact ? ' opportunity-card-compact' : ''}`} as="article">
      <span className="opportunity-kicker">This Thursday</span>
      <h3>Attend a fellowship</h3>
      <p className="opportunity-count">
        <span className="oc-day">{day}</span>
        <span className="oc-date">{formatMeetingDate(s.start)}</span>
        <span className="oc-note">{note}</span>
      </p>
      {meta}
      <div className="opportunity-actions">
        <ButtonLink to="/membership" variant="primary">
          Attend a fellowship <ArrowRight aria-hidden="true" />
        </ButtonLink>
        <ButtonLink to="/contact" variant="secondary">
          Ask a question
        </ButtonLink>
      </div>
      <p className="opportunity-note">
        Guests are welcome — come to three meetings to get a feel for the family before joining.
      </p>
    </Reveal>
  );
}

/* ---------- FAQ accordion ---------- */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list">
      {faqs.map((f, i) => (
        <Reveal key={f.q} delay={i * 40} className="faq-item" as="div" >
          <h3 className="faq-heading">
            <button
              className="faq-q"
              aria-expanded={open === i}
              aria-controls={`faq-panel-${i}`}
              id={`faq-button-${i}`}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              <span className="faq-q-text">{f.q}</span>
              <ChevronDown className="faq-chevron" aria-hidden="true" />
            </button>
          </h3>
          <div className="faq-a" id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-button-${i}`} hidden={open !== i}>
            <p>{f.a}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------- Audience paths ---------- */
export function AudiencePaths({ paths }: { paths: AudiencePath[] }) {
  return (
    <div className="audience-grid">
      {paths.map((p, i) => (
        <Reveal delay={i * 80} className="audience-card" as="article" key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.text}</p>
          <ButtonLink to={p.href} variant="secondary">
            {p.cta} <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </Reveal>
      ))}
    </div>
  );
}