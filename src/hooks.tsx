/**
 * Shared wrappers, scroll locking and active-section tracking. Content remains
 * visible before JavaScript; there are no scroll-triggered entrance effects.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Pointer depth for the homepage hero.
 *
 * Publishes `--px` / `--py` (each -1…1) on the hero element so the copy and
 * photograph planes can drift against each other. Purely decorative: it is
 * skipped on touch/coarse pointers and under `prefers-reduced-motion`, and the
 * hero renders fully without it.
 */
export function useHeroPointer<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;
    let frame = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      frame = 0;
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };
    const onMove = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px = Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width - 0.5) * 2));
      py = Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height - 0.5) * 2));
      schedule();
    };
    const onLeave = () => {
      px = 0;
      py = 0;
      schedule();
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      el.style.removeProperty("--px");
      el.style.removeProperty("--py");
    };
  }, []);
  return ref;
}

/** Compatibility wrapper for existing content layouts; renders without entrance animation. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "span" | "article" | "figure";
  id?: string;
}) {
  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  );
}

/** Locks body scroll while `locked` (mobile drawer, dialog). */
export function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

/** Tracks which section id is currently in view — used for anchor highlighting. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}
