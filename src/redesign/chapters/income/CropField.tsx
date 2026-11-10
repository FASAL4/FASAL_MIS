import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { CropEconomicRecord } from '@/types/dashboard';
import { Segmented, inr, inrShort, num, pct } from '../../ui';

/**
 * The crop field: every crop is a plot, seen from above, sized by what it
 * returned in 2026. Furrow direction marks the crop type; turmeric is haldi.
 */
type Metric = 'netProfit2026' | 'grossRevenue2026' | 'growersCount2026';

interface Rect { x: number; y: number; w: number; h: number }
interface Item { crop: CropEconomicRecord; value: number }

/** Squarified treemap (Bruls, Huizing, van Wijk). */
function squarify(items: Item[], box: Rect): Array<Rect & { crop: CropEconomicRecord }> {
  const total = items.reduce((s, i) => s + i.value, 0);
  const scale = (box.w * box.h) / total;
  const nodes = items.map((i) => ({ crop: i.crop, area: i.value * scale }));
  const out: Array<Rect & { crop: CropEconomicRecord }> = [];
  let { x, y, w, h } = box;
  let row: typeof nodes = [];

  const worst = (r: typeof nodes, side: number) => {
    const sum = r.reduce((s, n) => s + n.area, 0);
    const max = Math.max(...r.map((n) => n.area));
    const min = Math.min(...r.map((n) => n.area));
    return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min));
  };
  const flush = () => {
    const sum = row.reduce((s, n) => s + n.area, 0);
    if (w >= h) {
      const rw = sum / h;
      let cy = y;
      for (const n of row) { const rh = n.area / rw; out.push({ crop: n.crop, x, y: cy, w: rw, h: rh }); cy += rh; }
      x += rw; w -= rw;
    } else {
      const rh = sum / w;
      let cx = x;
      for (const n of row) { const rw = n.area / rh; out.push({ crop: n.crop, x: cx, y, w: rw, h: rh }); cx += rw; }
      y += rh; h -= rh;
    }
    row = [];
  };
  for (const n of nodes) {
    const side = Math.min(w, h);
    if (row.length === 0 || worst([...row, n], side) <= worst(row, side)) row.push(n);
    else { flush(); row.push(n); }
  }
  if (row.length) flush();
  return out;
}

const ANGLE: Record<string, number> = { Cereal: 90, 'Cash/Spice': 45, Vegetable: 0, Oilseed: 135, Pulse: 60, Other: 120 };

export const CropField: React.FC<{ crops: CropEconomicRecord[] }> = ({ crops }) => {
  const [metric, setMetric] = useState<Metric>('netProfit2026');
  const [hover, setHover] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((e) => setWidth(Math.round(e[0].contentRect.width)));
    ro.observe(el);
    setWidth(Math.round(el.clientWidth));
    return () => ro.disconnect();
  }, []);

  const height = width < 640 ? 440 : 500;
  const plots = useMemo(() => {
    if (!width) return [];
    const items = crops
      .map((crop) => ({ crop, value: crop[metric] }))
      .filter((i) => i.value > 0)
      .sort((a, b) => b.value - a.value);
    return squarify(items, { x: 0, y: 0, w: width, h: height });
  }, [crops, metric, width, height]);

  const total = crops.reduce((s, c) => s + Math.max(0, c[metric]), 0);
  const fmt = (v: number) => (metric === 'growersCount2026' ? num(v) : inrShort(v));
  const focus = crops.find((c) => c.cropKey === hover);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink pb-3.5">
        <div className="text-[0.8125rem] text-ink-2">
          <b className="font-semibold text-ink">{plots.length} crops</b>, one plot each, sized by{' '}
          {metric === 'netProfit2026' ? 'net profit' : metric === 'grossRevenue2026' ? 'revenue' : 'number of growers'}
        </div>
        <Segmented<Metric>
          label="Size the plots by"
          value={metric}
          onChange={setMetric}
          options={[
            { value: 'netProfit2026', label: 'Net profit' },
            { value: 'grossRevenue2026', label: 'Revenue' },
            { value: 'growersCount2026', label: 'Growers' },
          ]}
        />
      </div>

      <div ref={ref} className="relative mt-3.5" style={{ height }} onMouseLeave={() => setHover(null)}>
        {plots.map((p) => {
          const haldi = p.crop.cropKey === 'turmeric';
          const big = p.w > 92 && p.h > 46;
          const mid = !big && p.w > 54 && p.h > 22;
          const dim = hover !== null && hover !== p.crop.cropKey;
          return (
            <button
              key={p.crop.cropKey}
              type="button"
              onMouseEnter={() => setHover(p.crop.cropKey)}
              onFocus={() => setHover(p.crop.cropKey)}
              onBlur={() => setHover(null)}
              aria-label={`${p.crop.displayName}: ${fmt(p.crop[metric])}`}
              className="absolute overflow-hidden border-0 p-0 text-left"
              style={{
                left: p.x, top: p.y, width: Math.max(0, p.w - 3), height: Math.max(0, p.h - 3),
                opacity: dim ? 0.38 : 1,
                color: haldi ? '#141c17' : 'var(--ink)',
                backgroundColor: haldi ? 'var(--haldi)' : 'color-mix(in srgb, var(--forest) 16%, var(--paper))',
                backgroundImage: `repeating-linear-gradient(${ANGLE[p.crop.category] ?? 0}deg, ${haldi ? 'rgba(20,28,23,0.22)' : 'color-mix(in srgb, var(--forest) 42%, transparent)'} 0 1px, transparent 1px 7px)`,
                transition: 'left 800ms var(--ease-out), top 800ms var(--ease-out), width 800ms var(--ease-out), height 800ms var(--ease-out), opacity 200ms ease',
              }}
            >
              {(big || mid) && (
                <span className="absolute left-2 top-1.5 right-1 block leading-tight">
                  <span className="block truncate text-[0.8125rem] font-semibold">{p.crop.displayName}</span>
                  {big && <span className="block truncate text-[0.75rem] opacity-75" lang="hi">{p.crop.hindiName}</span>}
                  {big && <span className="num mt-1 block font-display text-[1.125rem] tracking-[-0.02em]">{fmt(p.crop[metric])}</span>}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-3 min-h-[3.2em] border-t border-rule pt-3 text-[0.8125rem] leading-normal text-ink-2" aria-live="polite">
        {focus ? (
          <>
            <b className="font-semibold text-ink">{focus.displayName}</b> <span lang="hi">{focus.hindiName}</span> · {focus.category} ·{' '}
            {num(focus.growersCount2026)} growers. Cost {inr(focus.cultivationCost2026)}, revenue {inr(focus.grossRevenue2026)}, net profit{' '}
            <b className="font-semibold text-ink">{inr(focus.netProfit2026)}</b> at a {pct(focus.netProfitMargin2026, 1)} margin
            {metric !== 'growersCount2026' && total > 0 && <> ({pct((Math.max(0, focus[metric]) / total) * 100, 1)} of the field)</>}.
          </>
        ) : (
          <>
            <b className="font-semibold text-ink">Read it like a field from the air.</b> The bigger the plot, the more the crop
            returned. Turmeric is the yellow one. Furrow direction marks the crop type. Point at a plot for its account.
          </>
        )}
      </p>
    </div>
  );
};
