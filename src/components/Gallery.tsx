/**
 * Photograph gallery with a full-frame viewer.
 *
 * The grid shows thumbnails; opening one puts the whole photograph on screen,
 * uncropped, over the page. Anyone using a keyboard can move between images
 * with the arrow keys and close with Escape; anyone on a phone can swipe. Focus
 * returns to the thumbnail they came from.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLockBody } from "../hooks";

export interface GalleryPhoto {
  src: string;
  thumb: string;
  srcSet?: string;
  alt: string;
  width?: number;
  height?: number;
}

export function Gallery({
  photos,
  label,
  sizes = "(max-width: 700px) 100vw, 560px",
}: {
  photos: GalleryPhoto[];
  label?: string;
  sizes?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const thumbnails = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef<number | null>(null);

  const close = useCallback(() => {
    setOpen((current) => {
      if (current !== null) thumbnails.current[current]?.focus();
      return null;
    });
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpen((current) =>
        current === null
          ? current
          : (current + delta + photos.length) % photos.length,
      );
    },
    [photos.length],
  );

  useLockBody(open !== null);

  useEffect(() => {
    if (open === null) return;
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "Tab") {
        /* Keep focus inside the viewer while it is open. */
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled])",
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  if (!photos.length) return null;
  const photo = open === null ? null : photos[open];

  return (
    <>
      <ul className="event-gallery">
        {photos.map((item, index) => (
          <li key={item.thumb}>
            <button
              type="button"
              className="event-gallery-open"
              ref={(node) => {
                thumbnails.current[index] = node;
              }}
              onClick={() => setOpen(index)}
              aria-label={`Open photograph ${index + 1} of ${photos.length}: ${item.alt}`}
            >
              <img
                src={item.thumb}
                srcSet={item.srcSet}
                sizes={sizes}
                alt={item.alt}
                width={item.width ?? 560}
                height={item.height ?? 421}
                loading="lazy"
                decoding="async"
              />
            </button>
          </li>
        ))}
      </ul>

      {photo ? (
        <div
          className="gallery-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={label ?? "Photographs"}
          ref={dialogRef}
          tabIndex={-1}
          onTouchStart={(event) => {
            touchStart.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            const end = event.changedTouches[0]?.clientX ?? null;
            touchStart.current = null;
            if (start === null || end === null) return;
            const distance = end - start;
            if (Math.abs(distance) > 48) step(distance < 0 ? 1 : -1);
          }}
        >
          <button
            type="button"
            className="gallery-viewer-close"
            onClick={close}
            aria-label="Close the photograph viewer"
          >
            <X size={22} aria-hidden="true" />
          </button>

          {photos.length > 1 ? (
            <button
              type="button"
              className="gallery-viewer-step prev"
              onClick={() => step(-1)}
              aria-label="Previous photograph"
            >
              <ChevronLeft size={26} aria-hidden="true" />
            </button>
          ) : null}

          <figure className="gallery-viewer-frame">
            {/* Full frame: the whole photograph, never cropped to fit. */}
            <img
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              decoding="async"
            />
            <figcaption>
              <span>{photo.alt}</span>
              <span className="gallery-viewer-count">
                {open! + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>

          {photos.length > 1 ? (
            <button
              type="button"
              className="gallery-viewer-step next"
              onClick={() => step(1)}
              aria-label="Next photograph"
            >
              <ChevronRight size={26} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
