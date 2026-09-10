"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Hook that adds "revealed" class when element enters viewport.
 * Used for scroll-triggered fade-in animations.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

/**
 * Reveal wrapper component — wraps children in a div that fades in on scroll.
 * Supports: direction ("up" | "left" | "right" | "scale"), delay (1-5), className.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
}) {
  const ref = useReveal();
  const dirClass = {
    up: "reveal",
    left: "reveal-left",
    right: "reveal-right",
    scale: "reveal-scale",
  }[direction];

  return (
    <div
      ref={ref}
      className={`${dirClass} ${delay ? `reveal-delay-${delay}` : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Stagger-children wrapper — children animate in sequence.
 */
export function StaggerReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useReveal();

  return (
    <div ref={ref} className={`stagger-children ${className}`}>
      {children}
    </div>
  );
}
