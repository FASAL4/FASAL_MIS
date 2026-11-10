import React from 'react';
import { useEvidence } from '@/context/EvidenceContext';
import { SourceLink, SrcCoord } from './evidence';
import { CountUp, Reveal } from './motion';

/* ----------------------------------------------------------------------------
   ChapterOpener — the top of every chapter except the overview cover.
   `title` is the finding, written as a sentence. Not the name of the topic.
---------------------------------------------------------------------------- */
export const ChapterOpener: React.FC<{
  no: string;
  name: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode; // usually a <StatRow>
}> = ({ no, name, title, lead, children }) => (
  <header className="opener wrap">
    <div className="opener-grid">
      <div className="opener-rail">
        <span className="opener-tick" aria-hidden="true" />
        <span className="opener-no">{no}</span>
        <span className="t-label">{name}</span>
      </div>
      <div className="opener-main">
        <h1 className="t-h1">{title}</h1>
        {lead && <p className="t-lead mt-6">{lead}</p>}
        {children && <div className="opener-stats">{children}</div>}
      </div>
    </div>
  </header>
);

/* ----------------------------------------------------------------------------
   Section — numbered block with a left rail. Content starts on column 4.
   `wide` lets the body span all 12 columns (big tables, wide charts).
   `aside` renders in the rail under the kicker (desktop only): a short note.
---------------------------------------------------------------------------- */
export const Section: React.FC<{
  id?: string;
  no: string;
  kicker: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  aside?: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}> = ({ id, no, kicker, title, intro, aside, wide, children }) => (
  <section id={id} className={`sec ${wide ? 'sec--wide' : ''}`} aria-labelledby={id ? `${id}-title` : undefined}>
    <div className="sec-rail">
      <div className="sec-rail-inner">
        <span className="sec-no">{no}</span>
        <span className="t-label">{kicker}</span>
        {aside && <div className="sec-aside t-note">{aside}</div>}
      </div>
    </div>
    <Reveal className="sec-head">
      <h2 className="t-h2" id={id ? `${id}-title` : undefined}>
        {title}
      </h2>
      {intro && <p className="t-body">{intro}</p>}
    </Reveal>
    <div className="sec-body">{children}</div>
  </section>
);

/* ----------------------------------------------------------------------------
   Stat — a single figure. If `src` is set the figure itself opens the evidence
   drawer; a small haldi dot marks it as traceable.
---------------------------------------------------------------------------- */
export interface StatProps {
  label: React.ReactNode;
  /** Pre-formatted value. Ignored when `countTo` is given. */
  value?: React.ReactNode;
  /** Animate from 0 to this number on first view, using `format`. */
  countTo?: number;
  format?: (n: number) => string;
  unit?: React.ReactNode;
  delta?: React.ReactNode;
  tone?: 'forest' | 'haldi' | 'clay' | 'ink';
  note?: React.ReactNode;
  src?: string;
  size?: 'xl' | 'lg' | 'md' | 'sm';
  quiet?: boolean;
}

export const Stat: React.FC<StatProps> = ({
  label,
  value,
  countTo,
  format,
  unit,
  delta,
  tone = 'forest',
  note,
  src,
  size = 'lg',
  quiet,
}) => {
  const { getMetric, openDrawer } = useEvidence();
  const traceable = !!src && !!getMetric(src);
  const body = (
    <>
      <span>{countTo !== undefined ? <CountUp to={countTo} format={format} /> : value}</span>
      {unit && <span className="stat-unit">{unit}</span>}
      {traceable && <span className="src-dot" aria-hidden="true" />}
    </>
  );
  return (
    <div className={`stat stat--${size} ${quiet ? 'stat--quiet' : ''}`}>
      <div className="stat-label">{label}</div>
      {traceable ? (
        <button
          type="button"
          className="stat-value"
          onClick={() => openDrawer(src!)}
          title="Open the source for this figure"
        >
          {body}
        </button>
      ) : (
        <div className="stat-value">{body}</div>
      )}
      {delta && (
        <div className="stat-delta" data-tone={tone}>
          {delta}
        </div>
      )}
      {note && <p className="stat-note">{note}</p>}
      {traceable && <SrcCoord id={src!} />}
    </div>
  );
};

/** Row of stats separated by a top rule each. `cols` applies from 900px up. */
export const StatRow: React.FC<{ cols?: 2 | 3 | 4 | 5; children: React.ReactNode; className?: string }> = ({
  cols = 4,
  children,
  className = '',
}) => (
  <div className={`stats ${className}`} style={{ '--cols': cols } as React.CSSProperties}>
    {children}
  </div>
);

/* ----------------------------------------------------------------------------
   Figure — every chart, diagram or data table that deserves a number.
---------------------------------------------------------------------------- */
export interface LegendKey {
  label: string;
  color: string;
  shape?: 'box' | 'line' | 'dash' | 'hatch';
}

export const Figure: React.FC<{
  no?: string;
  title: React.ReactNode;
  caption?: React.ReactNode;
  src?: string;
  srcLabel?: string;
  legend?: LegendKey[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}> = ({ no, title, caption, src, srcLabel, legend, actions, children }) => (
  <Reveal as="figure" className="fig">
    <div className="fig-head">
      <div>
        {no && <div className="fig-no">Fig. {no}</div>}
        <div className="fig-title">{title}</div>
      </div>
      {actions && <div className="no-print">{actions}</div>}
    </div>
    {legend && legend.length > 0 && (
      <div className="fig-legend" aria-hidden="true">
        {legend.map((k) => (
          <span key={k.label} className="fig-key">
            <span
              className={`fig-swatch ${k.shape === 'hatch' ? 'hatch' : ''}`}
              data-shape={k.shape ?? 'box'}
              style={k.shape === 'dash' ? { borderColor: k.color } : { background: k.color }}
            />
            {k.label}
          </span>
        ))}
      </div>
    )}
    <div className="fig-body">{children}</div>
    {(caption || src) && (
      <figcaption className="fig-cap">
        {caption ? <p>{caption}</p> : <span />}
        {src && <SourceLink id={src} label={srcLabel} />}
      </figcaption>
    )}
  </Reveal>
);

/* ----------------------------------------------------------------------------
   Note — the only callout. A rule on the left, a label, a sentence or two.
   kind: audit (haldi) · finding (forest) · caution (clay) · method (grey)
---------------------------------------------------------------------------- */
export const Note: React.FC<{
  kind?: 'audit' | 'finding' | 'caution' | 'method';
  label?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
  src?: string;
}> = ({ kind = 'audit', label, title, children, src }) => {
  const fallback = { audit: 'Audit note', finding: 'Finding', caution: 'Read with care', method: 'Method' }[kind];
  return (
    <aside className="note" data-kind={kind}>
      <div className="note-label">{label ?? fallback}</div>
      {title && <div className="note-title">{title}</div>}
      <div className="note-body">{children}</div>
      {src && (
        <div className="mt-2">
          <SourceLink id={src} />
        </div>
      )}
    </aside>
  );
};

/* ----------------------------------------------------------------------------
   Segmented — the one switcher for sub-views, units and chart modes.
---------------------------------------------------------------------------- */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
  label: string;
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="seg-btn"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   Meter — a single proportion. `hatch` marks a baseline value.
   `target` (0–100 of the same scale) draws a tick, e.g. an RF benchmark.
---------------------------------------------------------------------------- */
export const Meter: React.FC<{
  value: number;
  max?: number;
  tone?: 'forest' | 'haldi' | 'clay' | 'river' | 'ink' | 'stone';
  hatch?: boolean;
  size?: 'sm' | 'md' | 'lg';
  target?: number;
  label?: string;
}> = ({ value, max = 100, tone = 'forest', hatch, size = 'md', target, label }) => {
  const w = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={`meter ${size === 'lg' ? 'meter--lg' : size === 'sm' ? 'meter--sm' : ''}`}
      role="img"
      aria-label={label ?? `${value} of ${max}`}
      style={{ overflow: target !== undefined ? 'visible' : undefined }}
    >
      <div className={`meter-fill ${hatch ? 'hatch' : ''}`} data-tone={tone} style={{ width: `${w}%` }} />
      {target !== undefined && (
        <div className="meter-target" style={{ left: `${Math.min(100, (target / max) * 100)}%` }} />
      )}
    </div>
  );
};

/** Stacked 100% bar. Each part: { value, color, label }. */
export const ShareBar: React.FC<{
  parts: Array<{ value: number; color: string; label: string }>;
  height?: number;
}> = ({ parts, height = 14 }) => {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  return (
    <div
      className="share"
      style={{ height }}
      role="img"
      aria-label={parts.map((p) => `${p.label}: ${p.value}`).join(', ')}
    >
      {parts.map((p, i) => (
        <span
          key={p.label}
          title={`${p.label}: ${p.value.toLocaleString('en-IN')}`}
          style={{ width: `${(p.value / total) * 100}%`, background: p.color, animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
};

export const Tag: React.FC<{ tone?: 'forest' | 'haldi' | 'clay'; children: React.ReactNode }> = ({
  tone,
  children,
}) => (
  <span className="tag" data-tone={tone}>
    {children}
  </span>
);
