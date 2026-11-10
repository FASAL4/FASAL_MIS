import React from 'react';

/**
 * Chart vocabulary for Recharts. Colours are CSS variables so charts follow the
 * theme without re-rendering. Rules of use:
 *   forest  = endline / current / positive       haldi = the flagship or second series
 *   stone   = baseline / comparison (pair with a dashed or hatched mark)
 *   clay    = deficit, cost, anything struck out  river = third series only
 * Never more than three series colours in one figure.
 */
export const C = {
  forest: 'var(--forest)',
  haldi: 'var(--haldi-mark)',
  haldiFill: 'var(--haldi)',
  clay: 'var(--clay)',
  river: 'var(--river)',
  stone: 'var(--stone)',
  ink: 'var(--ink)',
  ink2: 'var(--ink-2)',
  ink3: 'var(--ink-3)',
  rule: 'var(--rule)',
  ruleStrong: 'var(--rule-strong)',
  paper: 'var(--paper)',
} as const;

/** Spread onto <CartesianGrid>: horizontal hairlines only. */
export const gridProps = {
  vertical: false,
  stroke: C.rule,
  strokeDasharray: '0',
} as const;

/** Spread onto <XAxis>. */
export const xAxisProps = {
  axisLine: { stroke: C.ruleStrong },
  tickLine: false,
  tickMargin: 10,
  interval: 'preserveStartEnd' as const,
};

/** Spread onto <YAxis>. Pass `tickFormatter` and `width` yourself. */
export const yAxisProps = {
  axisLine: false,
  tickLine: false,
  tickMargin: 8,
  width: 56,
};

/** Standard chart margins: room for direct labels on the right. */
export const chartMargin = { top: 12, right: 16, bottom: 4, left: 0 };

interface TipPayload {
  name?: string | number;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
}

/**
 * Tooltip body. Use as: <Tooltip content={<ChartTooltip format={inr} />} cursor={{ stroke: C.ruleStrong }} />
 * `labels` renames series keys; `format` formats every value; `note` adds a muted last line.
 */
export const ChartTooltip: React.FC<{
  active?: boolean;
  label?: string | number;
  payload?: TipPayload[];
  format?: (v: number, key: string) => string;
  labels?: Record<string, string>;
  title?: (label: string | number | undefined, payload?: TipPayload[]) => React.ReactNode;
  note?: (payload?: TipPayload[]) => React.ReactNode;
}> = ({ active, label, payload, format, labels, title, note }) => {
  if (!active || !payload || payload.length === 0) return null;
  const extra = note?.(payload);
  return (
    <div className="tip">
      <div className="tip-title">{title ? title(label, payload) : label}</div>
      {payload.map((p) => {
        const key = String(p.dataKey ?? p.name ?? '');
        const v = typeof p.value === 'number' ? (format ? format(p.value, key) : p.value.toLocaleString('en-IN')) : p.value;
        return (
          <div className="tip-row" key={key}>
            <span className="tip-key">
              <i style={{ background: p.color }} />
              {labels?.[key] ?? p.name ?? key}
            </span>
            <b>{v}</b>
          </div>
        );
      })}
      {extra && <div className="t-note mt-1.5">{extra}</div>}
    </div>
  );
};
