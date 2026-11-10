import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useEvidence } from '@/context/EvidenceContext';
import type { MetricProvenance } from '@/types/evidence';

/**
 * Evidence affordances.
 *
 * The old UI put a badge next to every number. Here there is one rule instead:
 *   - a number inside a sentence is highlighted like a marker pen  -> <Src>
 *   - a standalone figure is itself the button                     -> <Stat src>
 *   - a chart or table names its source once, in its caption       -> <Figure src> / <SourceLink>
 * Clicking any of them opens the same evidence drawer. "Show sources" in the
 * top bar (or the S key) additionally prints the cell coordinate under every figure.
 */

export function coordOf(m: MetricProvenance): string {
  const cells = m.provenance.cellCoordinates?.trim();
  if (cells && !/^n\/a/i.test(cells)) return cells;
  return m.provenance.sheetName;
}

export function sourceLine(m: MetricProvenance): string {
  return `${coordOf(m)} · N=${m.sampleSize.toLocaleString('en-IN')}`;
}

/** Inline, highlighter-style trigger for a number inside running text. */
export const Src: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { getMetric, openDrawer } = useEvidence();
  const m = getMetric(id);
  if (!m) return <>{children}</>;
  return (
    <button
      type="button"
      className="src"
      onClick={() => openDrawer(id)}
      title={`${m.label} — ${sourceLine(m)}`}
      aria-label={`Open the source for: ${m.label}`}
    >
      {children}
    </button>
  );
};

/** Caption-level source reference: "Source · Income Data!FI1492 · N=1,487". */
export const SourceLink: React.FC<{ id: string; label?: string; prefix?: string }> = ({
  id,
  label,
  prefix = 'Source',
}) => {
  const { getMetric, openDrawer } = useEvidence();
  const m = getMetric(id);
  if (!m) return null;
  return (
    <button
      type="button"
      className="src-link"
      onClick={() => openDrawer(id)}
      title={`${m.label} — open the audit trail`}
    >
      <span>
        {prefix ? `${prefix} · ` : ''}
        {label ?? sourceLine(m)}
      </span>
      <ArrowUpRight size={11} strokeWidth={2} aria-hidden="true" />
    </button>
  );
};

/** A source line that is only visible in "Show sources" mode (and in print). */
export const SrcCoord: React.FC<{ id: string }> = ({ id }) => (
  <div className="src-coord">
    <SourceLink id={id} prefix="" />
  </div>
);

/** Imperative access for rows, bars and chart marks that should open the drawer. */
export function useSource() {
  const { openDrawer, getMetric } = useEvidence();
  return { open: openDrawer, has: (id?: string) => !!id && !!getMetric(id) };
}
