/**
 * Proof-of-work sections: filterable projects with detail modal,
 * the Adopt-a-River signature story, awards and leadership.
 */
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Award, CalendarDays, MapPin, X } from 'lucide-react';
import { AWARDS, LEADERS, PROJECTS, PROJECT_TAGS, SIGNATURE_IMAGE, SIGNATURE_STEPS, SOCIALS, type Project } from '../data';
import { Reveal, useLockBody, useSpotlight, useTilt } from '../hooks';
import { SectionHead } from './chrome';

/* ---------- Projects ---------- */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  useLockBody(true);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close details">
          <X />
        </button>
        <div className="modal-img">
          <img src={project.image} alt={project.title} />
        </div>
        <div className="modal-body">
          <span className="tag">{project.tag}</span>
          <h3>{project.title}</h3>
          <p>{project.detail}</p>
          <div className="modal-meta">
            <span>
              <CalendarDays /> {project.year}
            </span>
            <span>
              <MapPin /> {project.location}
            </span>
          </div>
          <a className="btn btn-solid btn-sm" href={SOCIALS.facebook} target="_blank" rel="noopener">
            Join a project like this <ArrowRight />
          </a>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const [tag, setTag] = useState('All');
  const [open, setOpen] = useState<Project | null>(null);
  const { onMouseMove } = useSpotlight();
  const filtered = tag === 'All' ? PROJECTS : PROJECTS.filter((p) => p.tag === tag);

  return (
    <section className="block projects" id="projects">
      <div className="container">
        <SectionHead index="03" eyebrow="Impact in Action" title="Projects that change lives" lead="Tap any project for the full story — who it served, where, and what changed." />
        <Reveal>
          <div className="filter-row" role="group" aria-label="Filter projects by area" style={{ marginBottom: 0 }}>
            {PROJECT_TAGS.map((t) => (
              <button key={t} className={`filter-btn${tag === t ? ' active' : ''}`} onClick={() => setTag(t)} aria-pressed={tag === t}>
                {t}
              </button>
            ))}
          </div>
        </Reveal>
        <div className="proj-grid">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 80}>
              <button className="proj-card spot" onMouseMove={onMouseMove} onClick={() => setOpen(p)} aria-haspopup="dialog">
                <span className="thumb">
                  <img src={p.image} alt={p.title} loading="lazy" />
                  <span className="tag">{p.tag}</span>
                </span>
                <span className="body">
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <span className="meta">
                    <span className="date">{p.year}</span>
                    <span className="more">
                      Full story <ArrowRight />
                    </span>
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      {open ? <ProjectModal project={open} onClose={() => setOpen(null)} /> : null}
    </section>
  );
}

/* ---------- Signature project ---------- */
export function Signature() {
  const tilt = useTilt(5);
  return (
    <section className="block signature" id="signature">
      <div className="container signature-grid">
        <Reveal className="sig-wrap">
          <div className="sig-img tilt" onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
            <img
              src={SIGNATURE_IMAGE}
              alt="Adopt-a-River cleanup on River Njoro"
              loading="lazy"
            />
            <div className="sig-quote">
              <b>“The plastic we removed is just what happens upstream.”</b> — RAC Menengai, Adopt-a-River
            </div>
          </div>
        </Reveal>
        <div>
          <SectionHead
            dark
            index="04"
            eyebrow="Signature Project"
            title="Adopt-a-River: restoring Nakuru’s waterways"
            lead="Our flagship environmental project tackles pollution at the source — filtration, mobilisation, cleanup and the infrastructure to keep rivers clean."
          />
          <ol className="timeline">
            {SIGNATURE_STEPS.map((step, i) => (
              <Reveal as="li" key={step} delay={i * 70}>
                <span className="step-n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{step}</span>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <a className="btn btn-light" href={SOCIALS.facebook} target="_blank" rel="noopener">
              Join a Cleanup <ArrowRight />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Awards ---------- */
export function Awards() {
  return (
    <section className="block awards" id="awards">
      <div className="container">
        <SectionHead index="05" eyebrow="Recognition" title="Celebrating excellence" />
        <div className="awards-grid">
          {AWARDS.map((a, i) => (
            <Reveal key={a.title} delay={(i % 3) * 80} className={`award-card${a.title.startsWith('DEI') ? ' gold' : ''}`}>
              <span className="thumb" aria-hidden="true">
                <img src={a.image} alt="" loading="lazy" />
              </span>
              <span className="body">
                <span className="award-badge">
                  <Award /> {a.tag}
                </span>
                <h3>{a.title}</h3>
                <span className="date">{a.year}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Leadership ---------- */
export function Leadership() {
  const { onMouseMove } = useSpotlight();
  return (
    <section className="block leadership" id="leadership">
      <div className="container">
        <SectionHead center index="06" eyebrow="The People" title="Leadership that leads with heart" />
        <div className="leaders-grid">
          {LEADERS.map((l, i) => (
            <Reveal key={l.name} delay={i * 90} className="leader-card spot" onMouseMove={onMouseMove}>
              <div className={`leader-avatar${l.navy ? ' navy' : ''}`} aria-hidden="true">
                {l.initials}
              </div>
              <h3>{l.name}</h3>
              <div className="role">{l.role}</div>
              <p>{l.bio}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
