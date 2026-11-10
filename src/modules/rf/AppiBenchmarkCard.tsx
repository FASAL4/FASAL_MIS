import React from 'react';
import {
  CheckCircle2,
  TrendingUp,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import type { RFBenchmarkItem, RFProgressionData } from '../../types/dashboard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';

export interface AppiBenchmarkCardProps {
  benchmarks: RFBenchmarkItem[];
  landStructure: RFProgressionData['landholdingStructure'];
  activeFactorMultiplier?: number;
  className?: string;
}

export const AppiBenchmarkCard: React.FC<AppiBenchmarkCardProps> = ({
  benchmarks,
  landStructure,
  activeFactorMultiplier = 0.20,
  className = '',
}) => {
  // Effective acres and attainment for current factor
  const derivedAcres = landStructure.regexParsedTotalBigha * activeFactorMultiplier;
  const returnPerAcre = Math.round(95045999 / derivedAcres);
  const attainmentPct = ((returnPerAcre / 60000) * 100).toFixed(1);

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header with Result Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-growth/10 text-accent-growth border border-accent-growth/20">
              Feature F10: APPI Contractual Benchmark
            </span>
            <EvidenceBadge metricId="REC-ECON-12" variant="card" label="Net Return: ₹90,799 / ac" />
            <EvidenceBadge metricId="REC-LAND-02" variant="card" label="Saturation: 76.8% Exceeded" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            APPI ₹60,000 / Acre Net Farm Income Benchmark Attainment
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            Contractual Results Framework target under APPI Grant Ref: <strong>G-2110-10970 (₹2.16 Crore)</strong>. At the authoritative project baseline of 0.20 acre/bigha, <strong>76.8% of active landholders exceeded the ₹60,000/acre threshold</strong>, with a cohort mean productivity of <strong>₹90,799.31 per acre (151.3% of the target)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-growth/15 border border-accent-growth/30 text-accent-growth text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>[✓] BENCHMARK EXCEEDED (151.3%)</span>
          </div>
        </div>
      </div>

      {/* 2. Headline Attainment KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Cohort Mean Net Return per Acre */}
        <div className="p-4 rounded-xl bg-accent-growth/10 border border-accent-growth/25 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span className="font-bold text-accent-growth">Mean Return / Acre</span>
            <EvidenceBadge metricId="REC-ECON-12" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-accent-growth tabular-nums">
              ₹90,799
            </span>
            <span className="text-xs font-mono text-accent-growth/80 font-bold">
              / acre
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            +51.3% over ₹60,000 threshold
          </p>
        </div>

        {/* KPI 2: Smallholder Attainment Saturation */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Threshold Saturation</span>
            <EvidenceBadge metricId="REC-LAND-02" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-content-primary tabular-nums">
              76.8%
            </span>
            <span className="text-xs font-mono text-accent-growth font-bold">
              Exceeded
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            Contractual target was 70.0%
          </p>
        </div>

        {/* KPI 3: Operational Acreage */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Total Intervention Land</span>
            <EvidenceBadge metricId="REC-LAND-01" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-content-primary tabular-nums">
              1,046.77
            </span>
            <span className="text-xs font-mono text-content-secondary">
              acres
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            5,233.84 local bigha across 1,535 HHs
          </p>
        </div>

        {/* KPI 4: Micro-Landholding Concentration */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Marginal Smallholders</span>
            <EvidenceBadge metricId="REC-LAND-09" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-accent-harvest tabular-nums">
              91.3%
            </span>
            <span className="text-xs font-mono text-content-secondary">
              ≤ 1.0 Acre
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            828 landholders operate ≤ 5 local bigha
          </p>
        </div>
      </div>

      {/* 3. Visual Attainment Calibrated Progress Bar */}
      <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-content-primary uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent-growth" />
            Per-Acre Net Return Calibration (Scale 0 to ₹100,000)
          </span>
          <span className="text-accent-growth font-bold text-xs">
            Actual: ₹90,799 / acre ({attainmentPct}% of target)
          </span>
        </div>

        <div className="relative pt-6 pb-2">
          {/* Background track */}
          <div className="w-full h-4 rounded-full bg-border-subtle overflow-hidden relative">
            <div
              style={{ width: `${Math.min((90799 / 100000) * 100, 100)}%` }}
              className="h-full bg-accent-growth rounded-full transition-all duration-500"
            />
          </div>

          {/* Dotted Target Reference Line at ₹60,000 (60% mark) */}
          <div
            className="absolute top-0 bottom-0 left-[60%] -translate-x-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: '60%' }}
          >
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-accent-harvest text-white -mt-2">
              APPI Target: ₹60,000
            </span>
            <div className="w-0.5 h-10 border-l-2 border-dashed border-accent-harvest mt-1" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-content-muted">
          <span>₹0 / ac</span>
          <span>₹30,000 / ac</span>
          <span className="text-accent-harvest font-bold">₹60,000 (Benchmark Target)</span>
          <span className="text-accent-growth font-bold">₹90,799 (Cohort Mean)</span>
          <span>₹100,000 / ac</span>
        </div>
      </div>

      {/* 4. Landholding & Tenurial Distribution Structure */}
      <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="text-base font-serif font-bold text-content-primary flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-primary" />
              Operational Landholding Structure & Tenurial Regime (N=1,535)
            </h4>
            <p className="text-xs text-content-secondary">
              Deconstruction of 5,233.84 regex-parsed local bigha across owned, leased (batai), and landless households.
            </p>
          </div>
          <EvidenceBadge metricId="REC-LAND-01" variant="card" label="Col 22 Regex Sum" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-elevated border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-content-muted text-[11px]">
              <span>Owned Land</span>
              <EvidenceBadge metricId="REC-LAND-07" variant="subtle" />
            </div>
            <div className="text-lg font-bold text-content-primary tabular-nums">
              1,019.01 ac
            </div>
            <span className="text-[10px] text-accent-growth font-bold block">
              97.35% (5,095.05 bi)
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-elevated border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-content-muted text-[11px]">
              <span>Leased / Batai</span>
              <EvidenceBadge metricId="REC-LAND-08" variant="subtle" />
            </div>
            <div className="text-lg font-bold text-content-primary tabular-nums">
              43.14 ac
            </div>
            <span className="text-[10px] text-content-muted block">
              2.65% (215.69 bi)
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-elevated border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-content-muted text-[11px]">
              <span>Mean / Median Land</span>
              <EvidenceBadge metricId="REC-LAND-03" variant="subtle" />
            </div>
            <div className="text-lg font-bold text-content-primary tabular-nums">
              0.68 / 0.60 ac
            </div>
            <span className="text-[10px] text-content-muted block">
              3.41 bi / 3.00 bi
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-elevated border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-content-muted text-[11px]">
              <span>Landless Farmers</span>
              <EvidenceBadge metricId="REC-LAND-05" variant="subtle" />
            </div>
            <div className="text-lg font-bold text-content-primary tabular-nums">
              88 HHs
            </div>
            <span className="text-[10px] text-accent-harvest font-bold block">
              5.73% reporting 0 bigha
            </span>
          </div>
        </div>

        {/* Note on Free-Text Homestead Entries */}
        <div className="p-3.5 rounded-lg bg-elevated border border-border-subtle text-xs font-sans text-content-secondary flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-accent-evidence shrink-0 mt-0.5" />
          <div>
            <strong className="text-content-primary font-serif">Survey Data Hygiene Note:</strong> In addition to the 88 explicit 0-bigha landless households (<EvidenceBadge metricId="REC-LAND-05" variant="inline" />), 574 households (<EvidenceBadge metricId="REC-LAND-06" variant="inline" />) entered free-text qualitative phrases (e.g. "नहीं", "घर का सहन") indicating micro-homestead dwelling without titled agricultural fields.
          </div>
        </div>
      </div>

      {/* 5. Formal APPI Results Framework Indicators Table */}
      <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-4">
        <h4 className="text-base font-serif font-bold text-content-primary flex items-center justify-between">
          <span>APPI Grant Results Framework Contractual Indicators</span>
          <span className="text-xs font-mono text-content-muted">Grant Ref: G-2110-10970</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-strong text-content-muted">
                <th className="pb-2">Indicator Key & Description</th>
                <th className="pb-2 text-right">Target Value</th>
                <th className="pb-2 text-right">Achieved Value (2026)</th>
                <th className="pb-2 text-right">Attainment (%)</th>
                <th className="pb-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60">
              {benchmarks.map((bm) => (
                <tr key={bm.indicatorKey} className="hover:bg-elevated/40 transition-colors">
                  <td className="py-2.5 font-sans font-medium text-content-primary">
                    <span className="font-mono font-bold mr-2 text-accent-primary">{bm.indicatorKey}</span>
                    <span>{bm.label}</span>
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-content-muted">{bm.targetValueFormatted}</td>
                  <td className="py-2.5 text-right font-bold text-accent-growth tabular-nums">
                    {bm.achievedValueFormatted}
                  </td>
                  <td className="py-2.5 text-right font-bold text-accent-growth tabular-nums">
                    {bm.attainmentPct.toFixed(1)}%
                  </td>
                  <td className="py-2.5 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
                      [✓] {bm.status}
                    </span>
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
