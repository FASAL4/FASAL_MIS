import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fasalMasterData } from '@/data/fasalMasterData';
import cohortRows from '../../data/cohorts.json';
import { Segmented, inr, num, useSource } from '../../ui';

/**
 * The household field: one dot per surveyed household (N = 1,535).
 * Dots regroup into strips by panchayat, by community, or by who farms.
 * It is a unit chart: every strip's area is its true count. Panchayat and
 * community are assigned jointly from the survey's cohort table (data/cohorts.json,
 * households by panchayat × hamlet × community), so a dot keeps a consistent
 * pair of attributes when it regroups. No household identities are involved.
 */

interface CohortRow {
  gp: string;
  village: string;
  caste: string;
  tier: string;
  count: number;
}

type Mode = 'all' | 'panchayat' | 'community' | 'farming';

interface Group {
  key: string;
  name: string;
  count: number;
  detail: React.ReactNode;
  src?: string;
}

interface ModeDef {
  id: Mode;
  blurb: React.ReactNode;
  groups: Group[];
  /** group index for each of the N dots */
  assign: Uint8Array;
}

interface Layout {
  height: number;
  pos: Float32Array; // x0,y0,x1,y1…
  labels: number[]; // y of each group label
}

const LABEL_H = 24;
const GROUP_GAP = 14;

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

/** Deal N dots into groups of the given sizes, in a seeded random order. */
function deal(counts: number[], n: number, seed: number): Uint8Array {
  const order = Array.from({ length: n }, (_, i) => i);
  const r = rng(seed);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const out = new Uint8Array(n);
  let g = 0;
  let used = 0;
  for (const i of order) {
    while (g < counts.length - 1 && used >= counts[g]) {
      g++;
      used = 0;
    }
    out[i] = g;
    used++;
  }
  return out;
}

function layoutFor(mode: ModeDef, n: number, width: number, pitch: number): Layout {
  const cols = Math.max(8, Math.floor(width / pitch));
  const offsetX = (width - cols * pitch) / 2;
  const starts: number[] = [];
  const labels: number[] = [];
  let y = 0;
  for (const g of mode.groups) {
    labels.push(y);
    y += LABEL_H;
    starts.push(y);
    y += Math.ceil(g.count / cols) * pitch + GROUP_GAP;
  }
  const pos = new Float32Array(n * 2);
  const seen = new Array(mode.groups.length).fill(0);
  for (let i = 0; i < n; i++) {
    const g = mode.assign[i];
    const j = seen[g]++;
    pos[i * 2] = offsetX + (j % cols) * pitch + pitch / 2;
    pos[i * 2 + 1] = starts[g] + Math.floor(j / cols) * pitch + pitch / 2;
  }
  return { height: y - GROUP_GAP, pos, labels };
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const GEO_SRC = ['REC-GEO-02', 'REC-GEO-03', 'REC-GEO-04', 'REC-GEO-05', 'REC-GEO-06', 'REC-GEO-07', 'REC-GEO-08'];
const SOC_SRC: Record<string, string> = { OBC: 'REC-SOC-01', ST: 'REC-SOC-02', SC: 'REC-SOC-03', General: 'REC-SOC-04' };
const SOC_NAME: Record<string, string> = {
  OBC: 'Other Backward Classes',
  ST: 'Scheduled Tribe · Tharu',
  SC: 'Scheduled Caste',
  General: 'General',
};

export const HouseholdField: React.FC = () => {
  const { overview } = fasalMasterData;
  const N = overview.headlineKPIs.totalHouseholdsSurveyed;
  const farmers = overview.headlineKPIs.activeCultivatingFarmers;
  const source = useSource();

  const modes = useMemo<Record<Mode, ModeDef>>(() => {
    const gp = overview.geographicDistribution;
    const soc = overview.casteDemographics;

    // One (panchayat, community) pair per household, from the cohort table.
    const gpNames = gp.map((g) => g.gpName);
    const socNames = soc.map((c) => c.casteCategory as string);
    const pairs: Array<[number, number]> = [];
    for (const row of cohortRows as CohortRow[]) {
      const gi = gpNames.indexOf(row.gp);
      const si = socNames.indexOf(row.caste);
      for (let i = 0; i < row.count; i++) pairs.push([gi, si]);
    }
    const joint = pairs.length === N && pairs.every(([g, c]) => g >= 0 && c >= 0);
    if (joint) {
      const r = rng(7);
      for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
      }
    }
    const cross = (gi: number, si: number) => pairs.reduce((n, p) => n + (p[0] === gi && p[1] === si ? 1 : 0), 0);
    const communityMix = (gi: number) =>
      joint
        ? ` By community: ${soc
            .map((c, si) => ({ k: c.casteCategory, n: cross(gi, si) }))
            .filter((x) => x.n > 0)
            .map((x) => `${x.k} ${num(x.n)}`)
            .join(', ')}.`
        : '';
    const whereTheyLive = (si: number) => {
      if (!joint) return '';
      const top = gp
        .map((g, gi) => ({ k: g.gpName, n: cross(gi, si) }))
        .filter((x) => x.n > 0)
        .sort((a, b) => b.n - a.n)
        .slice(0, 3);
      return ` Mostly in ${top.map((x) => `${x.k} (${num(x.n)})`).join(', ')}.`;
    };

    return {
      all: {
        id: 'all',
        blurb: (
          <>
            <b>Each dot is one household.</b> {num(N)} were surveyed door to door across {overview.headlineKPIs.villagesCount}{' '}
            hamlets. Regroup them above; point at a strip to read about it.
          </>
        ),
        groups: [
          {
            key: 'all',
            name: 'Every household surveyed',
            count: N,
            detail: (
              <>
                <b>{num(N)} households</b>, home to {num(overview.headlineKPIs.residentIndividualPopulation)} people — a mean
                of {overview.headlineKPIs.meanHouseholdSize} per home.
              </>
            ),
            src: 'REC-ADM-01',
          },
        ],
        assign: new Uint8Array(N),
      },
      panchayat: {
        id: 'panchayat',
        blurb: (
          <>
            <b>Seven gram panchayats.</b> Karikot alone holds nearly half the programme. Point at a strip for its hamlets.
          </>
        ),
        groups: gp.map((g, i) => ({
          key: g.gpName,
          name: g.gpName,
          count: g.households,
          detail: (
            <>
              <b>{g.gpName}</b> — {g.primaryCharacteristics}.{' '}
              {g.hamletsCount > 1 ? `${g.hamletsCount} hamlets: ${g.hamletNames.join(', ')}.` : 'A single hamlet.'}
              {communityMix(i)}
            </>
          ),
          src: GEO_SRC[i],
        })),
        assign: joint ? Uint8Array.from(pairs, (p) => p[0]) : deal(gp.map((g) => g.households), N, 7),
      },
      community: {
        id: 'community',
        blurb: (
          <>
            <b>{overview.headlineKPIs.marginalizedInclusionRate}% of households</b> belong to Scheduled Caste, Scheduled Tribe or
            Other Backward Class communities.
          </>
        ),
        groups: soc.map((c, si) => ({
          key: c.casteCategory,
          name: SOC_NAME[c.casteCategory] ?? c.casteCategory,
          count: c.households,
          detail: (
            <>
              <b>{c.description}.</b> Mean holding {c.meanLandBigha} bigha; mean net farm income {inr(c.meanNetIncome2026)} in
              2026; {c.aasMembershipPct}% in the farmers’ union.
              {whereTheyLive(si)}
            </>
          ),
          src: SOC_SRC[c.casteCategory],
        })),
        assign: joint ? Uint8Array.from(pairs, (p) => p[1]) : deal(soc.map((c) => c.households), N, 19),
      },
      farming: {
        id: 'farming',
        blurb: (
          <>
            <b>{num(farmers)} households farm.</b> Every income and crop figure on this site is computed on that base, not on
            the full census.
          </>
        ),
        groups: [
          {
            key: 'farm',
            name: 'Actively cultivating',
            count: farmers,
            detail: (
              <>
                <b>{num(farmers)} cultivating households</b> have a row in the farm-income sheet. They are the denominator for
                all farm economics.
              </>
            ),
          },
          {
            key: 'nofarm',
            name: 'Surveyed, not cultivating',
            count: N - farmers,
            detail: (
              <>
                <b>{N - farmers} households</b> are in the census but carry no farm-income row. They are counted for people,
                rights and nutrition — not for farm income.
              </>
            ),
          },
        ],
        assign: deal([farmers, N - farmers], N, 43),
      },
    };
  }, [N, farmers, overview]);

  const [mode, setMode] = useState<Mode>('all');
  const [hover, setHover] = useState<number | null>(null);
  const [width, setWidth] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sim = useRef({
    x: new Float32Array(N), y: new Float32Array(N), a: new Float32Array(N),
    sx: new Float32Array(N), sy: new Float32Array(N), sa: new Float32Array(N),
    tx: new Float32Array(N), ty: new Float32Array(N), ta: new Float32Array(N),
    delay: new Float32Array(N),
    t0: 0, dur: 0, raf: 0, ready: false,
  });

  // Track the stage width.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setWidth(Math.round(entries[0].contentRect.width)));
    ro.observe(el);
    setWidth(Math.round(el.clientWidth));
    return () => ro.disconnect();
  }, []);

  const pitch = width ? Math.max(8.5, Math.min(11, width / 58)) : 10;
  const layouts = useMemo(() => {
    if (!width) return null;
    const grouped = {
      panchayat: layoutFor(modes.panchayat, N, width, pitch),
      community: layoutFor(modes.community, N, width, pitch),
      farming: layoutFor(modes.farming, N, width, pitch),
    };
    // The undivided field is sown wider, so it fills the same plot the strips need.
    const plot = Math.max(...Object.values(grouped).map((l) => l.height));
    let all = layoutFor(modes.all, N, width, pitch);
    for (let k = 1.6; k > 1; k -= 0.02) {
      const candidate = layoutFor(modes.all, N, width, pitch * k);
      if (candidate.height <= plot) {
        all = candidate;
        break;
      }
    }
    return { all, ...grouped } as Record<Mode, Layout>;
  }, [modes, N, width, pitch]);
  const height = layouts ? Math.ceil(Math.max(...Object.values(layouts).map((l) => l.height))) : 420;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const s = sim.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--cover-dot').trim() || '#141c17';
    const r = pitch * 0.33;
    for (let i = 0; i < N; i++) {
      const a = s.a[i];
      if (a <= 0.01) continue;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(s.x[i], s.y[i], r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [N, pitch]);

  const run = useCallback(() => {
    const s = sim.current;
    cancelAnimationFrame(s.raf);
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
  }, [N, draw]);

  // Size the canvas backing store, then (re)target the dots.
  const lastMode = useRef<Mode | null>(null);
  const lastWidth = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !layouts) return;
    const s = sim.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    const L = layouts[mode];
    const assign = modes[mode].assign;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const r = rng(mode.length * 97 + 11);

    for (let i = 0; i < N; i++) {
      s.sx[i] = s.x[i]; s.sy[i] = s.y[i]; s.sa[i] = s.a[i];
      s.tx[i] = L.pos[i * 2];
      s.ty[i] = L.pos[i * 2 + 1];
      s.ta[i] = hover === null || assign[i] === hover ? 1 : 0.16;
    }

    const first = !s.ready;
    const resized = lastWidth.current !== width && !first;
    const modeChanged = lastMode.current !== mode && !first;
    lastMode.current = mode;
    lastWidth.current = width;

    if (reduced || resized) {
      // Snap: no choreography on resize or for reduced motion.
      s.x.set(s.tx); s.y.set(s.ty); s.a.set(s.ta);
      s.ready = true;
      cancelAnimationFrame(s.raf);
      draw();
      return;
    }
    if (first) {
      // Sowing: dots drop into their furrows in a left-to-right sweep.
      for (let i = 0; i < N; i++) {
        s.sx[i] = s.tx[i];
        s.sy[i] = s.ty[i] - 18 - r() * 26;
        s.sa[i] = 0;
        s.delay[i] = 150 + (s.tx[i] / width) * 900 + r() * 260;
      }
      s.dur = 820;
      s.ready = true;
    } else if (modeChanged) {
      for (let i = 0; i < N; i++) s.delay[i] = (s.tx[i] / width) * 180 + r() * 220;
      s.dur = 980;
    } else {
      s.delay.fill(0);
      s.dur = 220;
    }
    s.t0 = performance.now();
    run();
  }, [layouts, mode, hover, width, height, N, modes, draw, run]);

  // Repaint when the theme flips (dot colour is a CSS variable).
  useEffect(() => {
    const mo = new MutationObserver(() => requestAnimationFrame(draw));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, [draw]);

  useEffect(() => () => cancelAnimationFrame(sim.current.raf), []);

  const def = modes[mode];
  const labels = layouts?.[mode].labels ?? [];

  return (
    <div className="field">
      <div className="field-head">
        <div className="field-title">
          <b>{num(N)} households</b>, one dot each
        </div>
        <Segmented<Mode>
          label="Group the households"
          value={mode}
          onChange={(m) => {
            setHover(null);
            setMode(m);
          }}
          options={[
            { value: 'all', label: 'All' },
            { value: 'panchayat', label: 'By panchayat' },
            { value: 'community', label: 'By community' },
            { value: 'farming', label: 'Who farms' },
          ]}
        />
      </div>

      <div
        className="field-stage"
        ref={stageRef}
        style={{ height }}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          if (def.groups.length < 2) return;
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
          aria-label={`${num(N)} dots, one per household. ${def.groups.map((g) => `${g.name}: ${num(g.count)}`).join('; ')}.`}
        />
        {def.groups.map((g, i) => {
          const share = ((g.count / N) * 100).toFixed(1);
          const clickable = source.has(g.src);
          return (
            <button
              key={`${mode}-${g.key}`}
              type="button"
              className="field-label"
              style={{ top: labels[i] ?? 0, height: LABEL_H - 6, animationDelay: `${i * 45}ms`, cursor: clickable ? 'pointer' : 'default' }}
              data-dim={hover !== null && hover !== i}
              onMouseEnter={() => def.groups.length > 1 && setHover(i)}
              onFocus={() => def.groups.length > 1 && setHover(i)}
              onBlur={() => setHover(null)}
              onClick={() => clickable && source.open(g.src!)}
              title={clickable ? 'Open the source for this count' : undefined}
            >
              <span className="field-label-name">{g.name}</span>
              <span className="field-label-meta">
                {num(g.count)}
                {def.groups.length > 1 && ` · ${share}%`}
              </span>
            </button>
          );
        })}
      </div>

      <p className="field-foot" aria-live="polite">
        {hover !== null && def.groups[hover] ? def.groups[hover].detail : def.blurb}
      </p>
    </div>
  );
};
