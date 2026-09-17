/** App composition — section order is the narrative arc. */
import { useEffect, useState } from 'react';
import { About, FocusAreas, Hero, Pillars, Stats } from './components/sections';
import { Awards, Leadership, Projects, Signature } from './components/work';
import { Faq, Join, News, Partners } from './components/closing';
import { BackToTop, CursorGlow, Footer, Navbar, SectionRail, Ticker } from './components/chrome';
import { HERO_IMAGES } from './data';
import { usePrefersReducedMotionOrTouch } from './hooks';

/* ---------- Branded preloader ---------- */
function Preloader() {
  const prefers = usePrefersReducedMotionOrTouch();
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), prefers ? 120 : 1150);
    return () => clearTimeout(t);
  }, [prefers]);
  return (
    <div className={`preloader${gone ? ' gone' : ''}`} aria-hidden="true">
      <span className="pl-mark">
        <img src={HERO_IMAGES.logo} alt="" />
      </span>
      <span className="pl-bar">
        <i />
      </span>
      <span className="pl-text">Service Above Self</span>
    </div>
  );
}

/* ---------- Magnetic buttons (fine pointers, reduced-motion safe) ---------- */
function useMagnetic() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia?.('(pointer: fine)');
    if (mq?.matches || (fine && !fine.matches)) return;
    const move = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('.magnetic') as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.16;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
      el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
    };
    const leave = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('.magnetic') as HTMLElement | null;
      if (el) el.style.transform = '';
    };
    document.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', leave);
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', leave);
    };
  }, []);
}

export default function App() {
  useMagnetic();
  return (
    <>
      <Preloader />
      <CursorGlow />
      <Navbar />
      <SectionRail />
      <main id="main">
        <Hero />
        <Ticker />
        <Stats />
        <About />
        <Pillars />
        <FocusAreas />
        <Projects />
        <Signature />
        <Awards />
        <Leadership />
        <Join />
        <News />
        <Partners />
        <Faq />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}