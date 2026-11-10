import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Sparkles, Scale, Info } from 'lucide-react';
import type { IncomeTrajectoryYear } from '../../types/dashboard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { formatINR, formatPercent } from './incomeFormatters';

export interface LongitudinalIncomeChartProps {
  trajectory: IncomeTrajectoryYear[];
  growth: {
    meanGrowthPct: number;
    medianGrowthPct: number;
    aggregateGrowthPct: number;
    bottomQuartileGainSummary: string;
  };
  className?: string;
}

type ViewMode = 'mean_vs_median' | 'aggregate_surplus' | 'active_saturation';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
    payload: IncomeTrajectoryYear;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="p-3.5 bg-surface/95 backdrop-blur-md border border-border-strong rounded-lg shadow-elevated text-xs font-mono space-y-2 z-50 min-w-[240px]">
      <div className="flex items-center justify-between border-b border-border-subtle pb-1.5">
        <span className="font-bold text-content-primary text-sm font-serif">
          {label} ({point.surveyWave})
        </span>
        <span className="text-[11px] px-1.5 py-0.5 rounded bg-accent-growth/10 text-accent-growth font-bold">
          N={point.sampleSize.toLocaleString()}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-content-primary">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-growth inline-block" />
            Mean Net Income:
          </span>
          <span className="font-bold tabular-nums">
            {formatINR(point.meanNetIncomeINR)}
          </span>
        </div>

        <div className="flex items-center justify-between text-content-primary">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-accent-harvest inline-block rotate-45" />
            Median Net Income:
          </span>
          <span className="font-bold tabular-nums">
            {formatINR(point.medianNetIncomeINR)}
          </span>
        </div>

        <div className="flex items-center justify-between text-content-secondary pt-1 border-t border-border-subtle/50">
          <span>Aggregate Net Margin:</span>
          <span className="font-bold tabular-nums text-accent-growth">
            {formatINR(point.aggregateNetIncomeINR, { compact: true })}
          </span>
        </div>

        <div className="flex items-center justify-between text-content-secondary">
          <span>Active Earner Saturation:</span>
          <span className="font-bold tabular-nums">
            {point.activeEarnerPct.toFixed(1)}%
          </span>
        </div>
      </div>

      {point.notes && (
        <p className="text-[10px] text-content-muted leading-tight pt-1.5 border-t border-border-subtle/50 italic font-sans">
          {point.notes}
        </p>
      )}
    </div>
  );
};

export const LongitudinalIncomeChart: React.FC<LongitudinalIncomeChartProps> = ({
  trajectory,
  growth,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('mean_vs_median');

  // Chart data formatted for Recharts
  const chartData = trajectory.map((item) => ({
    ...item,
    yearLabel: `${item.calendarYear}`,
    aggregateCr: parseFloat((item.aggregateNetIncomeINR / 10000000).toFixed(2)),
  }));

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header & Synthesis Narrative */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-subtle pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-growth/10 text-accent-growth border border-accent-growth/20">
              Feature F06: 5-Year Empirical Trajectory
            </span>
            <EvidenceBadge metricId="REC-ECON-12" variant="card" label="2026 Mean: ₹63,918" />
            <EvidenceBadge metricId="METRIC-INC-002" variant="card" label="2026 Median: ₹53,400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary">
            Longitudinal Net Farm Income Trajectory (2022 Baseline to 2026 Endline)
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            Tracking 1,487 genuine cultivating smallholders in the Katarniaghat Wildlife Sanctuary buffer. Net farm income advanced from ₹34,555.01 (2022 RAW baseline) to ₹63,917.95 (2026 Endline), delivering a{' '}
            <strong className="text-accent-growth">+84.97% mean gain (1.85×)</strong> and an unprecedented{' '}
            <strong className="text-accent-growth">+142.73% median gain (2.43× from ₹22,000 to ₹53,400)</strong>.
          </p>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center p-1 rounded-lg bg-elevated border border-border-subtle self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('mean_vs_median')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${viewMode === 'mean_vs_median'
                ? 'bg-surface text-content-primary shadow-xs font-bold border border-border-subtle'
                : 'text-content-muted hover:text-content-primary'
              }`}
          >
            Mean vs Median
          </button>
          <button
            type="button"
            onClick={() => setViewMode('aggregate_surplus')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${viewMode === 'aggregate_surplus'
                ? 'bg-surface text-content-primary shadow-xs font-bold border border-border-subtle'
                : 'text-content-muted hover:text-content-primary'
              }`}
          >
            Aggregate Surplus (₹ Cr)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('active_saturation')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${viewMode === 'active_saturation'
                ? 'bg-surface text-content-primary shadow-xs font-bold border border-border-subtle'
                : 'text-content-muted hover:text-content-primary'
              }`}
          >
            Earner Saturation (%)
          </button>
        </div>
      </div>

      {/* 2. Headline Trajectory KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: 5-Year Mean Growth */}
        <div className="p-4 rounded-lg bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>5-Yr Mean Growth</span>
            <EvidenceBadge metricId="REC-ECON-12" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-accent-growth tabular-nums">
              {formatPercent(growth.meanGrowthPct)}
            </span>
            <span className="text-xs font-mono text-content-muted">
              (1.85×)
            </span>
          </div>
          <p className="text-[11px] text-content-secondary font-mono">
            ₹34,555 → ₹63,918 / HH
          </p>
        </div>

        {/* Card 2: 5-Year Median Growth (Pro-Poor) */}
        <div className="p-4 rounded-lg bg-accent-growth/5 border border-accent-growth/20 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span className="flex items-center gap-1 font-bold text-accent-growth">
              <Sparkles className="w-3.5 h-3.5" />
              5-Yr Median Growth
            </span>
            <EvidenceBadge metricId="METRIC-INC-002" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-accent-growth tabular-nums">
              {formatPercent(growth.medianGrowthPct)}
            </span>
            <span className="text-xs font-mono text-accent-growth/80 font-bold">
              (2.43×)
            </span>
          </div>
          <p className="text-[11px] text-content-secondary font-mono">
            ₹22,000 → ₹53,400 / HH (Pro-Poor)
          </p>
        </div>

        {/* Card 3: Aggregate Farm Net Profit */}
        <div className="p-4 rounded-lg bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>2026 Cohort Net Surplus</span>
            <EvidenceBadge metricId="METRIC-INC-001" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-content-primary tabular-nums">
              ₹9.50 Cr
            </span>
            <span className="text-xs font-mono text-accent-growth font-bold">
              +106.97%
            </span>
          </div>
          <p className="text-[11px] text-content-secondary font-mono">
            ₹4.59 Cr (2022) → ₹9.50 Cr
          </p>
        </div>

        {/* Card 4: Active Earner Saturation */}
        <div className="p-4 rounded-lg bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Earner Saturation</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface text-content-secondary">
              1,478 / 1,487
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-content-primary tabular-nums">
              99.39%
            </span>
            <span className="text-xs font-mono text-accent-growth font-bold">
              ▲ +6.39 pp
            </span>
          </div>
          <p className="text-[11px] text-content-secondary font-mono">
            Only 9 homestead non-earners
          </p>
        </div>
      </div>

      {/* 3. Main Trajectory Chart Canvas */}
      <div className="p-4 rounded-xl bg-surface border border-border-subtle space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-content-muted">
          <div className="flex items-center gap-4 flex-wrap">
            {viewMode === 'mean_vs_median' && (
              <>
                <div className="flex items-center gap-1.5 text-content-primary">
                  <span className="w-3 h-0.5 bg-accent-growth inline-block" />
                  <span className="w-2 h-2 rounded-full bg-accent-growth inline-block -ml-2" />
                  <span className="font-bold">Mean Net Farm Income (₹)</span>
                </div>
                <div className="flex items-center gap-1.5 text-content-primary">
                  <span className="w-3 border-b-2 border-dashed border-accent-harvest inline-block" />
                  <span className="w-2 h-2 bg-accent-harvest inline-block rotate-45 -ml-2" />
                  <span className="font-bold">Median Net Farm Income (₹) [Pro-Poor]</span>
                </div>
              </>
            )}
            {viewMode === 'aggregate_surplus' && (
              <span className="font-bold text-content-primary">
                Aggregate Farm Net Profit Across 1,487 Households (₹ Crores)
              </span>
            )}
            {viewMode === 'active_saturation' && (
              <span className="font-bold text-content-primary">
                Active Earner Saturation Rate (% of Households with Net Profit &gt; 0)
              </span>
            )}
          </div>
          <span className="hidden sm:inline text-[11px]">Values verified via verify_fdb_2026.py</span>
        </div>

        <div className="h-[320px] w-full" role="region" aria-label="5-Year Net Farm Income Trajectory Chart">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 15, right: 25, left: 15, bottom: 5 }}>
              <defs>
                <linearGradient id="incomeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#047857" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#047857" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#047857" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#047857" stopOpacity={0.35} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(19, 56, 38, 0.08)" />

              <XAxis
                dataKey="yearLabel"
                stroke="#5D6A65"
                tick={{ fill: 'currentColor', fontSize: 12, fontFamily: 'monospace' }}
                tickLine={{ stroke: 'rgba(19, 56, 38, 0.15)' }}
              />

              {viewMode === 'mean_vs_median' && (
                <>
                  <YAxis
                    stroke="#5D6A65"
                    tick={{ fill: 'currentColor', fontSize: 11, fontFamily: 'monospace' }}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    domain={[15000, 75000]}
                    tickLine={{ stroke: 'rgba(19, 56, 38, 0.15)' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="meanNetIncomeINR"
                    fill="url(#incomeAreaGrad)"
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="meanNetIncomeINR"
                    name="Mean Net Income"
                    stroke="#047857"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#047857', stroke: '#FFFFFF', strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="medianNetIncomeINR"
                    name="Median Net Income"
                    stroke="#92400E"
                    strokeWidth={2.5}
                    strokeDasharray="6 4"
                    dot={{ r: 4, fill: '#92400E', stroke: '#FFFFFF', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </>
              )}

              {viewMode === 'aggregate_surplus' && (
                <>
                  <YAxis
                    stroke="#5D6A65"
                    tick={{ fill: 'currentColor', fontSize: 11, fontFamily: 'monospace' }}
                    tickFormatter={(v) => `₹${v} Cr`}
                    domain={[0, 11]}
                    tickLine={{ stroke: 'rgba(19, 56, 38, 0.15)' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="aggregateCr"
                    name="Aggregate Net Surplus (₹ Cr)"
                    fill="url(#barGrad)"
                    radius={[4, 4, 0, 0]}
                  />
                </>
              )}

              {viewMode === 'active_saturation' && (
                <>
                  <YAxis
                    stroke="#5D6A65"
                    tick={{ fill: 'currentColor', fontSize: 11, fontFamily: 'monospace' }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[90, 100]}
                    tickLine={{ stroke: 'rgba(19, 56, 38, 0.15)' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="activeEarnerPct"
                    name="Active Earner Saturation (%)"
                    stroke="#047857"
                    fill="url(#incomeAreaGrad)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#047857' }}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Critical Econometric Narrative Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pro-Poor Growth Inversion Callout */}
        <div className="p-4 rounded-lg bg-accent-growth/10 border border-accent-growth/25 space-y-2">
          <div className="flex items-center gap-2 text-accent-growth font-bold text-xs uppercase tracking-wider font-mono">
            <Scale className="w-4 h-4" />
            <span>Pro-Poor Econometric Inversion Proof</span>
          </div>
          <h4 className="text-sm font-serif font-bold text-content-primary">
            Median Gain (+142.73%) Greatly Exceeds Mean Gain (+84.97%)
          </h4>
          <p className="text-xs text-content-secondary leading-relaxed font-sans">
            In standard economic theory, top-heavy income growth creates a rising mean while median growth lags. Here, the inverse occurs: <strong>median net income expanded by 2.43× (from ₹22,000 to ₹53,400)</strong>, proving that the bottom 50% and ultra-marginal smallholders experienced the fastest proportional recovery, compressing agrarian inequality in the forest buffer.
          </p>
        </div>

        {/* 2025 Cohort Dilution Explanation Callout */}
        <div className="p-4 rounded-lg bg-accent-harvest/10 border border-accent-harvest/25 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-accent-harvest font-bold text-xs uppercase tracking-wider font-mono">
              <Info className="w-4 h-4" />
              <span>2025 Cohort Expansion & Mean Dilution</span>
            </div>
            <EvidenceBadge metricId="REC-ECON-07" variant="subtle" />
          </div>
          <h4 className="text-sm font-serif font-bold text-content-primary">
            Why Did Mean Net Income Dip from ₹56,377 in 2024 to ₹54,494 in 2025?
          </h4>
          <p className="text-xs text-content-secondary leading-relaxed font-sans">
            This temporary dip was not an agronomic contraction, but an artifact of <strong>onboarding +158 marginal families (cohort grew from 1,328 to 1,487 households)</strong>. These newly joined households entered with zero baseline capital, diluting the arithmetic cohort mean. Crucially, <strong>median income steadily grew +14.7% YoY (₹38,700 to ₹44,400)</strong>, and by 2026 mean surged to ₹63,918.
          </p>
        </div>
      </div>

      {/* 5. 5-Year Data Lineage & Milestone Ledger */}
      <div className="p-4 rounded-lg bg-surface border border-border-subtle space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-content-muted flex items-center justify-between">
          <span>Audited 5-Year Milestone Data Lineage</span>
          <span className="text-[11px] font-normal normal-case text-content-muted">
            N=1,487 Genuine Farmers
          </span>
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-strong text-content-muted">
                <th className="pb-2">Year & Wave</th>
                <th className="pb-2 text-right">Sample (N)</th>
                <th className="pb-2 text-right">Mean Net (₹)</th>
                <th className="pb-2 text-right">Median Net (₹)</th>
                <th className="pb-2 text-right">Aggregate (₹ Cr)</th>
                <th className="pb-2 text-right">Earners (%)</th>
                <th className="pb-2 text-center">Ledger Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60">
              {trajectory.map((item) => (
                <tr key={item.calendarYear} className="hover:bg-elevated/40 transition-colors">
                  <td className="py-2.5 font-sans font-medium text-content-primary">
                    <span className="font-mono font-bold mr-1.5">{item.calendarYear}</span>
                    <span className="text-content-muted text-[11px]">({item.surveyWave})</span>
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-content-secondary">{item.sampleSize.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-bold text-accent-growth tabular-nums">
                    ₹{Math.round(item.meanNetIncomeINR).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 text-right font-bold text-accent-harvest tabular-nums">
                    ₹{Math.round(item.medianNetIncomeINR).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-content-primary font-bold">
                    ₹{(item.aggregateNetIncomeINR / 10000000).toFixed(2)} Cr
                  </td>
                  <td className="py-2.5 text-right tabular-nums">{item.activeEarnerPct.toFixed(1)}%</td>
                  <td className="py-2.5 text-center">
                    {item.calendarYear === 2022 && <EvidenceBadge metricId="REC-ECON-01" variant="subtle" />}
                    {item.calendarYear === 2023 && <EvidenceBadge metricId="REC-ECON-02" variant="subtle" />}
                    {item.calendarYear === 2024 && <EvidenceBadge metricId="REC-ECON-03" variant="subtle" />}
                    {item.calendarYear === 2025 && <EvidenceBadge metricId="REC-ECON-07" variant="subtle" />}
                    {item.calendarYear === 2026 && <EvidenceBadge metricId="REC-ECON-12" variant="subtle" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
