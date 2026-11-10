import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { MonthlyDietaryObservation } from '@/types/dashboard';
import { pct, useInView } from '../../ui';

/**
 * The thali: one plate, three portions, twelve months.
 * Each portion's area is the share of households eating that food group in
 * the chosen month. Drag through the year and the green portion shrinks in winter.
 */
const R = 150;

/** A third of the plate, starting at `from` degrees (0 = up, clockwise). */
function sector(from: number): string {
  const a = ((from - 90) * Math.PI) / 180;
  const b = ((from + 120 - 90) * Math.PI) / 180;
  return `M0 0 L${(R * Math.cos(a)).toFixed(2)} ${(R * Math.sin(a)).toFixed(2)} A${R} ${R} 0 0 1 ${(R * Math.cos(b)).toFixed(2)} ${(R * Math.sin(b)).toFixed(2)} Z`;
}

const PORTIONS = [
  { key: 'whiteFoodsAccessPct' as const, name: 'White', gloss: 'rice, wheat, dairy', from: 240, fill: 'var(--raised)', stroke: 'var(--ink-3)', dot: 'var(--stone)' },
  { key: 'greenFoodsAccessPct' as const, name: 'Green', gloss: 'vegetables', from: 0, fill: 'var(--forest)', stroke: 'none', dot: 'var(--forest)' },
  { key: 'yellowFoodsAccessPct' as const, name: 'Yellow', gloss: 'pulses', from: 120, fill: 'var(--haldi)', stroke: 'none', dot: 'var(--haldi-mark)' },
];

export const Thali: React.FC<{ months: MonthlyDietaryObservation[] }> = ({ months }) => {
  const [i, setI] = useState(5); // June: the fullest plate
  const [playing, setPlaying] = useState(false);
  const [ref, inView] = useInView<HTMLDivElement>('0px 0px -30% 0px');
  const started = useRef(false);
  const m = months[i];
  const maxGreen = Math.max(...months.map((x) => x.greenFoodsAccessPct));

  // Play the year once when the plate first scrolls into view.
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) setPlaying(true);
  }, [inView]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI((v) => (v + 1) % months.length), 900);
    const stop = setTimeout(() => setPlaying(false), 900 * months.length + 50);
    return () => {
      clearInterval(t);
      clearTimeout(stop);
    };
  }, [playing, months.length]);

  const pick = (k: number) => {
    setPlaying(false);
    setI(k);
  };

  return (
    <div ref={ref}>
      <div className="grid items-center gap-x-12 gap-y-8 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <svg viewBox="-180 -180 360 360" role="img" aria-label={`Plate for ${m.calendarMonth}: staples ${m.whiteFoodsAccessPct}%, vegetables ${m.greenFoodsAccessPct}%, pulses ${m.yellowFoodsAccessPct}%`} style={{ width: '100%', height: 'auto', maxWidth: 380 }}>
          <circle r="174" fill="var(--sunk)" stroke="var(--ink-3)" strokeWidth="1" />
          <circle r="162" fill="none" stroke="var(--rule-strong)" strokeWidth="1" />
          <circle r={R} fill="none" stroke="var(--rule)" strokeWidth="1" strokeDasharray="2 5" />
          {PORTIONS.map((p) => (
            <path
              key={p.key}
              d={sector(p.from)}
              fill={p.fill}
              stroke={p.stroke}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              style={{ transform: `scale(${Math.sqrt(m[p.key] / 100)})`, transition: 'transform 700ms var(--ease-out)' }}
            />
          ))}
          {[0, 120, 240].map((d) => (
            <line key={d} x1="0" y1="0" x2={R * Math.cos(((d - 90) * Math.PI) / 180)} y2={R * Math.sin(((d - 90) * Math.PI) / 180)} stroke="var(--sunk)" strokeWidth="5" />
          ))}
        </svg>

        <div>
          <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
            <span className="font-display text-[2.75rem] leading-none tracking-[-0.03em] text-ink">{m.calendarMonth}</span>
            <span className="t-note">
              {m.isSummerPeakWindow ? 'Early-summer peak' : m.isWinterTroughWindow ? 'Winter trough' : 'Share of households eating each group'}
            </span>
          </div>
          {PORTIONS.map((p) => (
            <div key={p.key} className="flex items-baseline justify-between gap-4 border-b border-rule py-3">
              <span className="flex items-center gap-2.5 text-[0.9375rem] text-ink">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.dot }} />
                <span className="font-semibold">{p.name}</span>
                <span className="text-ink-3">{p.gloss}</span>
              </span>
              <span className="num font-display text-[1.75rem] leading-none tracking-[-0.02em] text-ink">{pct(m[p.key], 1)}</span>
            </div>
          ))}
          <p className="t-note mt-3 min-h-[3em]">{m.notes}.</p>
        </div>
      </div>

      {/* The scrubber is itself a chart: bar height is that month's green share. */}
      <div className="mt-8 flex items-end gap-3 border-t border-rule pt-4">
        <button type="button" className="icon-btn shrink-0 border border-rule-strong" style={{ border: '1px solid var(--rule-strong)' }} onClick={() => setPlaying((v) => !v)} aria-label={playing ? 'Pause' : 'Play the year'}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <div className="grid flex-1 grid-cols-12 gap-1" role="group" aria-label="Month">
          {months.map((x, k) => (
            <button
              key={x.calendarMonth}
              type="button"
              onClick={() => pick(k)}
              onMouseEnter={() => pick(k)}
              aria-pressed={k === i}
              aria-label={`${x.calendarMonth}: vegetables ${x.greenFoodsAccessPct}%`}
              className="flex flex-col items-stretch gap-1.5 border-0 bg-transparent p-0"
            >
              <span className="flex h-12 items-end">
                <span
                  className="block w-full rounded-[1px]"
                  style={{
                    height: `${(x.greenFoodsAccessPct / maxGreen) * 100}%`,
                    background: k === i ? 'var(--forest)' : 'color-mix(in srgb, var(--forest) 26%, var(--paper))',
                    transition: 'background-color 200ms ease',
                  }}
                />
              </span>
              <span className={`text-center text-[0.6875rem] ${k === i ? 'font-semibold text-ink' : 'text-ink-3'}`}>
                <span className="hidden sm:inline">{x.calendarMonth}</span>
                <span className="sm:hidden">{x.calendarMonth[0]}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
