import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Segmented } from './primitives';

/**
 * UnitField — the cover's dot engine as a reusable figure.
 * One mark per real unit. Marks sit in labelled strips and regroup, with
 * animation, when the reader switches mode. Modes may hold different totals:
 * surplus marks fade out.
 */
export interface UnitGroup {
  key: string;
  name: string;
  count: number;
  /** Right-hand label; defaults to the count. */
  meta?: string;
  /** Shown under the field while the strip is pointed at. */
  detail?: React.ReactNode;
}

export interface UnitMode {
  id: string;
  label: string;
  /** CSS custom property holding the mark colour, e.g. "--ink". */
  colorVar?: string;
  blurb: React.ReactNode;
  groups: UnitGroup[];
}

const LABEL_H = 24;
const GAP = 14;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const UnitField: React.FC<{ modes: UnitMode[]; title: React.ReactNode; pitchMax?: number }> = ({
  modes,
  title,
  pitchMax = 12,
}) => {
  const N = useMemo(() => Math.max(...modes.map((m) => m.groups.reduce((s, g) => s + g.count, 0))), [modes]);

  /** Group index per mark for every mode; -1 = not shown in that mode. */
  const assigns = useMemo(
    () =>
      modes.map((m, mi) => {
        const out = new Int16Array(N).fill(-1);
        const order = Array.from({ length: N }, (_, i) => i);
        if (mi > 0) {
          const r = rng(mi * 31 + 5);
          for (let i = N - 1; i > 0; i--) {
            const j = Math.floor(r() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]];
          }
        }
        let p = 0;
        m.groups.forEach((g, gi) => {
          for (let k = 0; k < g.count; k++) out[order[p++]] = gi;
        });
        return out;
      }),
    [modes, N],
  );

  const [mi, setMi] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [width, setWidth] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sim = useRef({
    x: new Float32Array(N), y: new Float32Array(N), a: new Float32Array(N),
    sx: new Float32Array(N), sy: new Float32Array(N), sa: new Float32Array(N),
    tx: new Float32Array(N), ty: new Float32Array(N), ta: new Float32Array(N),
    delay: new Float32Array(N), t0: 0, dur: 0, raf: 0, ready: false,
  });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver((e) => setWidth(Math.round(e[0].contentRect.width)));
    ro.observe(el);
    setWidth(Math.round(el.clientWidth));
    return () => ro.disconnect();
  }, []);

  const pitch = width ? Math.max(8, Math.min(pitchMax, width / 72)) : 10;

  const layouts = useMemo(() => {
    if (!width) return null;
    const cols = Math.max(8, Math.floor(width / pitch));
    const off = (width - cols * pitch) / 2;
    return modes.map((m, k) => {
      const labels: number[] = [];
      const starts: number[] = [];
      let y = 0;
      for (const g of m.groups) {
        labels.push(y);
        y += LABEL_H;
        starts.push(y);
        y += Math.ceil(g.count / cols) * pitch + GAP;
      }
      const pos = new Float32Array(N * 2);
      const seen = new Array(m.groups.length).fill(0);
      for (let i = 0; i < N; i++) {
        const g = assigns[k][i];
        if (g < 0) continue;
        const j = seen[g]++;
        pos[i * 2] = off + (j % cols) * pitch + pitch / 2;
        pos[i * 2 + 1] = starts[g] + Math.floor(j / cols) * pitch + pitch / 2;
      }
      return { labels, pos, height: y - GAP };
    });
  }, [modes, assigns, N, width, pitch]);

  const height = layouts ? Math.ceil(Math.max(...layouts.map((l) => l.height))) : 320;
  const colorVar = modes[mi].colorVar ?? '--ink';

  const draw = useCallback(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const s = sim.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = getComputedStyle(c).getPropertyValue(colorVar).trim() || '#141c17';
    const r = pitch * 0.34;
    for (let i = 0; i < N; i++) {
      if (s.a[i] <= 0.01) continue;
      ctx.globalAlpha = s.a[i];
      ctx.beginPath();
      ctx.arc(s.x[i], s.y[i], r, 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [N, pitch, colorVar]);

  const last = useRef({ mi: -1, width: 0 });
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !layouts) return;
    const s = sim.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(width * dpr);
    c.height = Math.round(height * dpr);
    const L = layouts[mi];
    const A = assigns[mi];
    const r = rng(mi + 3);
    const first = !s.ready;
    const resized = !first && last.current.width !== width;
    const switched = !first && last.current.mi !== mi;
    last.current = { mi, width };

    for (let i = 0; i < N; i++) {
      s.sx[i] = s.x[i]; s.sy[i] = s.y[i]; s.sa[i] = s.a[i];
      if (A[i] < 0) {
        s.tx[i] = s.x[i]; s.ty[i] = s.y[i]; s.ta[i] = 0;
      } else {
        s.tx[i] = L.pos[i * 2]; s.ty[i] = L.pos[i * 2 + 1];
        s.ta[i] = hover === null || A[i] === hover ? 1 : 0.16;
        if (s.sa[i] <= 0.01 && !first) { s.sx[i] = s.tx[i]; s.sy[i] = s.ty[i] - 14; }
      }
    }
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    cancelAnimationFrame(s.raf);
    if (reduced || resized) {
      s.x.set(s.tx); s.y.set(s.ty); s.a.set(s.ta); s.ready = true;
      draw();
      return;
    }
    if (first) {
      for (let i = 0; i < N; i++) {
        s.sx[i] = s.tx[i]; s.sy[i] = s.ty[i] - 16 - r() * 22; s.sa[i] = 0;
        s.delay[i] = (s.tx[i] / width) * 800 + r() * 240;
      }
      s.dur = 780; s.ready = true;
    } else if (switched) {
      for (let i = 0; i < N; i++) s.delay[i] = (s.tx[i] / width) * 160 + r() * 220;
      s.dur = 950;
    } else {
      s.delay.fill(0); s.dur = 200;
    }
    s.t0 = performance.now();
    const tick = (now: number) => {
      let done = true;
      for (let i = 0; i < N; i++) {
        const t = Math.max(0, Math.min(1, (now - s.t0 - s.delay[i]) / s.dur));
        if (t < 1) done = false;
        const e = ease(t);
        s.x[i] = s.sx[i] + (s.tx[i] - s.sx[i]) * e;
        s.y[i] = s.sy[i] + (s.ty[i] - s.sy[i]) * e;
        s.a[i] = s.sa[i] + (s.ta[i] - s.sa[i]) * e;
      }
      draw();
      if (!done) s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
  }, [layouts, assigns, mi, hover, width, height, N, draw]);

  useEffect(() => {
    const mo = new MutationObserver(() => requestAnimationFrame(draw));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(sim.current.raf);
    };
  }, [draw]);

  const mode = modes[mi];
  const labels = layouts?.[mi].labels ?? [];

  return (
    <div className="field field--paper">
      <div className="field-head">
        <div className="field-title">{title}</div>
        {modes.length > 1 && (
          <Segmented
            label="Count the marks as"
            value={mode.id}
            onChange={(id) => {
              setHover(null);
              setMi(modes.findIndex((m) => m.id === id));
            }}
            options={modes.map((m) => ({ value: m.id, label: m.label }))}
          />
        )}
      </div>
      <div
        className="field-stage"
        ref={stageRef}
        style={{ height }}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
          let i = labels.length - 1;
          while (i > 0 && y < labels[i]) i--;
          if (i !== hover) setHover(i);
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ height }}
          role="img"
          aria-label={mode.groups.map((g) => `${g.name}: ${g.meta ?? g.count}`).join('; ')}
        />
        {mode.groups.map((g, i) => (
          <div
            key={`${mode.id}-${g.key}`}
            className="field-label"
            style={{ top: labels[i] ?? 0, height: LABEL_H - 6, animationDelay: `${i * 45}ms` }}
            data-dim={hover !== null && hover !== i}
          >
            <span className="field-label-name">{g.name}</span>
            <span className="field-label-meta">{g.meta ?? g.count.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
      <p className="field-foot" aria-live="polite">
        {hover !== null && mode.groups[hover]?.detail ? mode.groups[hover].detail : mode.blurb}
      </p>
    </div>
  );
};
