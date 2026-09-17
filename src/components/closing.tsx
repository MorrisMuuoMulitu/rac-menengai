/**
 * Closing sections: join CTA, news, partners, FAQ.
 */
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, CalendarCheck, MapPin, Plus, Users } from 'lucide-react';
import { FAQS, NEWS, PARTNERS, SOCIALS } from '../data';
import { Reveal, useSpotlight } from '../hooks';
import { SectionHead } from './chrome';

/* ---------- Join ---------- */
const JOIN_STEPS = [
  { n: 'Step 01', title: 'Come to fellowship', text: 'Attend three Thursday fellowships (5:30–6:30 PM). Come as you are — guests are family.' },
  { n: 'Step 02', title: 'Serve on a project', text: 'Join one hands-on project — a cleanup, a donation drive, a school visit. Feel the work.' },
  { n: 'Step 03', title: 'Get inducted', text: 'Take the oath, get your pin, and start leading. Mentorship from day one.' },
] as const;

export function Join() {
  return (
    <section className="block join" id="join">
      <div className="container">
        <Reveal>
          <span className="eyebrow" style={{ color: '#ffc3d6' }}>
            <i>07</i>
            Ready to Serve?
          </span>
          <h2 className="sec-title">Join the Rotaract Club of Menengai</h2>
          <p className="sec-lead">Come as you are. Leave as a leader. Three fellowships, one project, and you’ve found your people.</p>
        </Reveal>
        <div className="join-steps">
          {JOIN_STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90} className="join-step">
              <span className="n">{s.n}</span>
              <b>{s.title}</b>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
        <div className="meet-row">
          {[
            { icon: <CalendarCheck />, title: 'Every Thursday', text: '5:30 – 6:30 PM' },
            { icon: <MapPin />, title: 'Nakuru, Kenya', text: 'District 9212' },
            { icon: <Users />, title: 'Ages 18–30', text: 'Everyone welcome' },
          ].map((m, i) => (
            <Reveal key={m.title} delay={i * 90} className="meet-chip">
              {m.icon}
              <b>{m.title}</b>
              <span>{m.text}</span>
            </Reveal>
          ))}
        </div>
        <Reveal className="join-ctas">
          <span className="magnetic">
            <a className="btn btn-light" href={SOCIALS.facebook} target="_blank" rel="noopener">
              Message Us on Facebook <ArrowRight />
            </a>
          </span>
          <span className="magnetic">
            <a className="btn btn-ghost-light" href={SOCIALS.instagram} target="_blank" rel="noopener">
              Follow on Instagram <ArrowUpRight />
            </a>
          </span>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- News ---------- */
export function News() {
  const { onMouseMove } = useSpotlight();
  return (
    <section className="block news" id="news">
      <div className="container">
        <SectionHead index="08" eyebrow="Stay Connected" title="Club updates & stories" />
        <div className="news-grid">
          {NEWS.map((n, i) => (
            <Reveal key={n.title} delay={(i % 3) * 80} className="news-card spot" onMouseMove={onMouseMove}>
              <span className="n-img">
                <img src={n.image} alt="" loading="lazy" />
              </span>
              <span className="n-body">
                <span className="news-meta">
                  <span className="cat">{n.category}</span>
                  <span className="date">{n.date}</span>
                </span>
                <h3>{n.title}</h3>
                <span className="excerpt">{n.excerpt}</span>
                <a className="read" href={SOCIALS.instagram} target="_blank" rel="noopener" aria-label={`Read more about: ${n.title}`}>
                  Read the story <ArrowRight />
                </a>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Partners ---------- */
export function Partners() {
  return (
    <section className="block partners" aria-label="Partners">
      <div className="container">
        <SectionHead center index="09" eyebrow="Our Community" title="Who we serve alongside" />
        <div className="partners-marquee">
          <div className="partners-track">
            {[0, 1].map((half) => (
              <div className="partners-half" key={half} aria-hidden={half === 1}>
                {PARTNERS.map((p, i) => (
                  <span key={`${half}-${i}`} className="partner-chip">
                    {p}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FaqItem({ q, a, open, index, onToggle }: { q: string; a: string; open: boolean; index: number; onToggle: () => void }) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    setHeight(open ? (bodyRef.current?.scrollHeight ?? 0) : 0);
  }, [open, a]);
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-q" onClick={onToggle} aria-expanded={open}>
        <span>
          <span className="q-no">{String(index + 1).padStart(2, '0')}</span>
          {q}
        </span>
        <Plus aria-hidden="true" />
      </button>
      <div className="faq-a" ref={bodyRef} style={{ maxHeight: `${height}px` }}>
        <p>{a}</p>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="block faq" id="faq">
      <div className="container">
        <SectionHead center index="10" eyebrow="Good to Know" title="Questions, answered" lead="Everything a prospective member or partner usually asks. Anything else — message us." />
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 50}>
              <FaqItem q={f.q} a={f.a} open={open === i} index={i} onToggle={() => setOpen(open === i ? -1 : i)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
