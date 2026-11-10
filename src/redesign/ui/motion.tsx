import React, { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** True once the element has entered the viewport (fires once). */
export function useInView<T extends Element>(rootMargin = '0px 0px -8% 0px') {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView] as const;
}

/** Fade-and-rise on first scroll into view. `delay` in ms staggers siblings. */
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'figure';
}> = ({ children, delay = 0, className = '', as = 'div' }) => {
  const [ref, inView] = useInView<HTMLElement>();
  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
};

/**
 * Counts from 0 to `to` the first time it scrolls into view.
 * `format` receives the in-flight value; keep it pure.
 */
export const CountUp: React.FC<{
  to: number;
  format?: (n: number) => string;
  duration?: number;
}> = ({ to, format = (n) => Math.round(n).toLocaleString('en-IN'), duration = 1100 }) => {
  const [ref, inView] = useInView<HTMLSpanElement>('0px');
  const [value, setValue] = useState(() => (prefersReducedMotion() ? to : 0));

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="num" aria-label={format(to)}>
      {format(value)}
    </span>
  );
};
