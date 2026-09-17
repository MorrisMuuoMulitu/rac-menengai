/**
 * Shared UI primitives: scroll reveal, animated counters, scroll progress,
 * active-section spy and body scroll locking.
 */
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode, type CSSProperties } from 'react';

/** Adds `.in` when the element scrolls into view (once). Respects reduced motion via CSS. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
  onMouseMove,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'span' | 'article';
  onMouseMove?: (e: ReactMouseEvent<HTMLElement>) => void;
}) {
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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const style: CSSProperties | undefined = delay ? { transitionDelay: `${delay}ms` } : undefined;
  return (
    // @ts-expect-error polymorphic tag with shared ref
    <Tag ref={ref} className={`reveal ${className}`.trim()} style={style} onMouseMove={onMouseMove}>
      {children}
    </Tag>
  );
}

/** Eases 0 → `target` once visible. Returns the display string. */
export function useCountUp(target: number, suffix: string, start: boolean, duration = 1400): string {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return `${value.toLocaleString()}${suffix}`;
}

/** 0–100 scroll progress for the top progress bar. */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min((window.scrollY / h) * 100, 100) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return progress;
}

/** Tracks which section id is currently in view for nav highlighting. */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return active;
}

/** Locks body scroll while `locked` (mobile drawer, modal). */
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

/**
 * Cursor-follow spotlight for cards. Attach `onMouseMove` to any element with
 * the `.spot` class (e.g. via `<Reveal onMouseMove>`); the CSS radial
 * highlight tracks the cursor through `--mx` / `--my` custom properties.
 */
export function useSpotlight() {
  const ref = useRef<HTMLElement | null>(null);
  const onMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const el = (ref.current ?? e.currentTarget) as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${Math.round(e.clientX - rect.left)}px`);
    el.style.setProperty('--my', `${Math.round(e.clientY - rect.top)}px`);
  };
  return { ref, onMouseMove };
}

/** True when the user prefers reduced motion or a coarse (touch) pointer. */
export function usePrefersReducedMotionOrTouch(): boolean {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mqReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const mqFine = window.matchMedia?.('(pointer: fine)');
    const update = () => setPrefers(Boolean(mqReduce?.matches) || !mqFine);
    update();
    mqReduce?.addEventListener?.('change', update);
    mqFine?.addEventListener?.('change', update);
    return () => {
      mqReduce?.removeEventListener?.('change', update);
      mqFine?.removeEventListener?.('change', update);
    };
  }, []);
  return prefers;
}

/**
 * 3D tilt. Attach `onMouseMove` / `onMouseLeave` to an element with the
 * `.tilt` class; rotation is written via `--rx` / `--ry` custom properties.
 */
export function useTilt(maxDeg = 7) {
  const onMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(px * maxDeg).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-py * maxDeg).toFixed(2)}deg`);
  };
  const onMouseLeave = (e: ReactMouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };
  return { onMouseMove, onMouseLeave };
}
