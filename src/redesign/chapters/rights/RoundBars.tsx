import React from 'react';
import { ROUNDS } from './rightsData';

const EARLIER = 'color-mix(in srgb, var(--forest) 40%, var(--paper))';
const LATEST = 'var(--forest)';

/**
 * Four survey rounds as four small columns on a shared scale.
 * Earlier rounds are tinted; the latest round is solid.
 *   compact (default): a sparkline for a table cell, values in the tooltip
 *   labelled: value above and round name below each column
 */
export const RoundBars: React.FC<{
  values: number[];
  max: number;
  labelled?: boolean;
  height?: number;
  format?: (v: number) => string;
}> = ({ values, max, labelled, height = labelled ? 64 : 26, format = (v) => String(v) }) => {
  const last = values.length - 1;
  const summary = values.map((v, i) => `${ROUNDS[i]?.name ?? `Round ${i + 1}`}: ${format(v)}`).join(', ');
  return (
    <div
      role="img"
      aria-label={summary}
      title={labelled ? undefined : summary}
      className={`inline-flex items-end ${labelled ? 'gap-2' : 'gap-[3px]'}`}
    >
      {values.map((v, i) => (
        <div key={i} className={`flex flex-col items-center ${labelled ? 'w-12' : ''}`}>
          {labelled && <span className="num mb-1.5 text-[0.75rem] leading-none text-ink-2">{format(v)}</span>}
          <span
            className="block rounded-[1px]"
            style={{
              width: labelled ? '100%' : 7,
              height: Math.max(2, Math.round((v / max) * height)),
              background: i === last ? LATEST : EARLIER,
            }}
          />
          {labelled && (
            <span className="mt-1.5 text-[0.6875rem] leading-none text-ink-3">{ROUNDS[i]?.short ?? i + 1}</span>
          )}
        </div>
      ))}
    </div>
  );
};
