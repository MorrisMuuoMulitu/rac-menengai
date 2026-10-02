/**
 * Shared UI primitives: scroll reveal, animated counters, scroll-lock and the
 * active-section spy for navigation. Deliberately small — nothing here adds
 * decoration, only basic motion and behaviour.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Adds `.in` when the element scrolls into view (once). Respects reduced motion via CSS. */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div', id }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'span' | 'article'; id?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;
  return (
    // @ts-expect-error polymorphic tag with shared ref
    <Tag ref={ref} id={id} className={`reveal ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}

/** Locks body scroll while `locked` (mobile drawer, dialog). */
export function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

/** Tracks which section id is currently in view — used for anchor highlighting. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** True while the page is scrolled past a threshold (sticky header state). */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}