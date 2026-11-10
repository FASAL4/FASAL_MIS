import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  PieChart,
} from 'lucide-react';
import type { MacroFinancialTotals, CasteEconomicMetrics } from '../../types/dashboard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';

export interface MacroEconomyCardProps {
  macroFinancials: {
    year2025: MacroFinancialTotals;
    year2026: MacroFinancialTotals;
    deltaYoY: {
      netProfitGrowthAmount: number;
      netProfitGrowthPct: number;
      grossRevenueGrowthAmount: number;
      grossRevenueGrowthPct: number;
      cultivationCostGrowthAmount: number;
      cultivationCostGrowthPct: number;
      profitMarginDeltaPp: number;
    };
  };
  casteEconomics: CasteEconomicMetrics[];
  onViewSliceProof?: () => void;
  className?: string;
}

export const MacroEconomyCard: React.FC<MacroEconomyCardProps> = ({
  macroFinancials,
  casteEconomics,
  onViewSliceProof,
  className = '',
}) => {
  const { year2026, deltaYoY } = macroFinancials;
  const [selectedCaste, setSelectedCaste] = useState<string | null>(null);

  // Cost and Profit percentages of Gross Revenue
  const costPct = (year2026.cultivationCostINR / year2026.grossRevenueINR) * 100;
  const profitPct = year2026.netProfitMarginPct; // 74.16%
  const roi = (year2026.netProfitINR / year2026.cultivationCostINR) * 100; // 286.95% -> 287.0%

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-growth/10 text-accent-growth border border-accent-growth/20">
              Feature F07: Macro Crop Economy
            </span>
            <EvidenceBadge metricId="METRIC-INC-001" variant="card" label="Net Surplus: ₹9.50 Cr" />
            <EvidenceBadge metricId="REC-ECON-11" variant="card" label="Income Data!FI1492 - FG1492" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            2026 Macro Agrarian Balance Sheet & Earner Saturation
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            Aggregate economic output across 1,487 cultivating smallholders operating 42 diversified crops. Total gross agrarian production reached <strong>₹12.82 Crore</strong> against <strong>₹3.31 Crore</strong> in input costs, creating a certified <strong>₹9.50 Crore in aggregate net farm profit (74.16% margin)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-accent-growth/10 border border-accent-growth/20 text-accent-growth font-bold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            99.39% Saturation (1,478 Earners)
          </span>
        </div>
      </div>

      {/* 2. Primary Three-Pillar Financial Balance Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Cultivation Cost */}
        <div className="p-5 rounded-xl bg-elevated/80 border border-border-subtle space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span className="font-bold uppercase tracking-wider">Input Cultivation Cost</span>
            <EvidenceBadge metricId="REC-ECON-09" variant="card" label="Cell FG1492" />
          </div>
          <div>
            <div className="text-3xl font-mono font-bold text-content-primary tabular-nums">
              ₹3.31 Cr
            </div>
            <div className="text-xs font-mono text-content-muted tabular-nums mt-0.5">
              ₹{year2026.cultivationCostINR.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs font-mono">
            <span className="text-content-muted">Share of Gross Output:</span>
            <span className="font-bold text-content-primary tabular-nums">
              {costPct.toFixed(2)}%
            </span>
          </div>
          <div className="text-[11px] font-mono text-content-secondary flex items-center justify-between">
            <span>YoY Growth (2025→26):</span>
            <span className="text-content-primary tabular-nums font-bold">
              +{deltaYoY.cultivationCostGrowthPct.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Pillar 2: Gross Farm Revenue */}
        <div className="p-5 rounded-xl bg-elevated/80 border border-border-subtle space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span className="font-bold uppercase tracking-wider">Gross Farm Revenue</span>
            <EvidenceBadge metricId="REC-ECON-10" variant="card" label="Cell FI1492" />
          </div>
          <div>
            <div className="text-3xl font-mono font-bold text-content-primary tabular-nums">
              ₹12.82 Cr
            </div>
            <div className="text-xs font-mono text-content-muted tabular-nums mt-0.5">
              ₹{year2026.grossRevenueINR.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs font-mono">
            <span className="text-content-muted">Market & Domestic Output:</span>
            <span className="font-bold text-accent-harvest tabular-nums">
              100.00%
            </span>
          </div>
          <div className="text-[11px] font-mono text-content-secondary flex items-center justify-between">
            <span>YoY Growth (2025→26):</span>
            <span className="text-accent-growth tabular-nums font-bold">
              +{deltaYoY.grossRevenueGrowthPct.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Pillar 3: Net Cash Profit Margin */}
        <div className="p-5 rounded-xl bg-accent-growth/10 border border-accent-growth/30 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span className="font-bold text-accent-growth uppercase tracking-wider">Net Farm Surplus</span>
            <EvidenceBadge metricId="REC-ECON-11" variant="card" label="Net: ₹9.50 Cr" />
          </div>
          <div>
            <div className="text-3xl font-mono font-bold text-accent-growth tabular-nums">
              ₹9.50 Cr
            </div>
            <div className="text-xs font-mono text-accent-growth/80 tabular-nums mt-0.5 font-bold">
              ₹{year2026.netProfitINR.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="pt-2 border-t border-accent-growth/20 flex items-center justify-between text-xs font-mono">
            <span className="text-content-muted">Net Profit Margin:</span>
            <span className="font-bold text-accent-growth text-sm tabular-nums">
              {profitPct.toFixed(2)}%
            </span>
          </div>
          <div className="text-[11px] font-mono text-content-secondary flex items-center justify-between">
            <span>YoY Surplus Expansion:</span>
            <span className="text-accent-growth tabular-nums font-bold">
              +₹1.40 Cr (+{deltaYoY.netProfitGrowthPct.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Visual Financial Flow / Proportional Waterfall Bar */}
      <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-content-primary uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-accent-harvest" />
            Macro Agrarian Flow: Gross Output Decomposition
          </span>
          <span className="text-content-muted text-[11px]">
            Input Cost ({costPct.toFixed(1)}%) + Net Profit ({profitPct.toFixed(1)}%) = 100%
          </span>
        </div>

        {/* Dual-segment stacked proportional progress bar */}
        <div className="w-full h-8 rounded-lg overflow-hidden bg-elevated flex border border-border-subtle shadow-inner">
          <div
            style={{ width: `${costPct}%` }}
            className="bg-content-muted/40 hover:bg-content-muted/60 transition-colors flex items-center justify-center text-[11px] font-mono font-bold text-content-primary px-2 truncate"
            title={`Cultivation Cost: ₹3.31 Cr (${costPct.toFixed(1)}%)`}
          >
            Cost: ₹3.31 Cr ({costPct.toFixed(1)}%)
          </div>
          <div
            style={{ width: `${profitPct}%` }}
            className="bg-accent-growth hover:bg-accent-growth/90 transition-colors flex items-center justify-center text-[11px] font-mono font-bold text-white px-2 truncate"
            title={`Net Farm Surplus: ₹9.50 Cr (${profitPct.toFixed(1)}%)`}
          >
            Net Farm Surplus: ₹9.50 Cr ({profitPct.toFixed(1)}%)
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
          <div className="p-2.5 rounded bg-elevated border border-border-subtle">
            <span className="text-content-muted block text-[10px]">Cost-to-Revenue Ratio</span>
            <span className="text-sm font-bold text-content-primary tabular-nums">
              {(costPct / 100).toFixed(3)} (₹0.26 / ₹1)
            </span>
          </div>
          <div className="p-2.5 rounded bg-elevated border border-border-subtle">
            <span className="text-content-muted block text-[10px]">Return on Working Capital</span>
            <span className="text-sm font-bold text-accent-growth tabular-nums">
              {roi.toFixed(1)}% (2.87× ROI)
            </span>
          </div>
          <div className="p-2.5 rounded bg-elevated border border-border-subtle">
            <span className="text-content-muted block text-[10px]">Mean Net Farm Income</span>
            <span className="text-sm font-bold text-content-primary tabular-nums">
              ₹{Math.round(year2026.meanNetIncomePerHH).toLocaleString('en-IN')} / HH
            </span>
          </div>
          <div className="p-2.5 rounded bg-elevated border border-border-subtle">
            <span className="text-content-muted block text-[10px]">Daily Net Farm Margin</span>
            <span className="text-sm font-bold text-accent-growth tabular-nums">
              ~₹{(year2026.meanNetIncomePerHH / 365).toFixed(2)} / day
            </span>
          </div>
        </div>
      </div>

      {/* 4. Active Earner Saturation Progress Meter */}
      <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-content-primary flex items-center gap-1.5">
            <Users className="w-4 h-4 text-accent-primary" />
            Active Earner Saturation Rate: 1,478 / 1,487 Cultivating Households
          </span>
          <span className="font-bold text-accent-growth text-sm tabular-nums">
            {year2026.activeEarnerSaturationPct.toFixed(2)}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-border-subtle overflow-hidden">
          <div
            style={{ width: `${year2026.activeEarnerSaturationPct}%` }}
            className="h-full bg-accent-growth rounded-full transition-all duration-500"
          />
        </div>
        <p className="text-[11px] text-content-secondary font-sans leading-relaxed">
          <strong>99.39% of all 1,487 genuine cultivating households</strong> generated positive net crop revenue in 2026. Only 9 households recorded zero net crop income (primarily landless homestead dwellers reliant purely on wage labor or elderly non-cultivating guardians).
        </p>
      </div>

      {/* 5. Caste Equity Economic Disaggregation Panel */}
      <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="text-base font-serif font-bold text-content-primary flex items-center gap-2">
              <Users className="w-4 h-4 text-accent-primary" />
              Social Equity & Caste Disaggregation (2026 Endline)
            </h4>
            <p className="text-xs text-content-secondary">
              Cross-cutting income security across Scheduled Tribe (ST/Tharu), OBC, Scheduled Caste (SC/Dalit), and General categories.
            </p>
          </div>
          <EvidenceBadge metricId="REC-SOC-05" variant="card" label="Col 25 Saturation: 99.48%" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-strong text-content-muted">
                <th className="pb-2">Social Category</th>
                <th className="pb-2 text-right">Households</th>
                <th className="pb-2 text-right">Mean Land (Bigha)</th>
                <th className="pb-2 text-right">Mean Net (₹/HH)</th>
                <th className="pb-2 text-right">Median Net (₹/HH)</th>
                <th className="pb-2 text-right">Productivity (₹/Bigha)</th>
                <th className="pb-2 text-right">Union Enrollment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60">
              {casteEconomics.map((caste) => {
                const productivityPerBigha = caste.meanNetFarmIncome2026 / caste.meanLandBigha;
                const isSC = caste.caste === 'SC';

                return (
                  <tr
                    key={caste.caste}
                    onClick={() => setSelectedCaste(selectedCaste === caste.caste ? null : caste.caste)}
                    className={`hover:bg-elevated/40 transition-colors cursor-pointer ${isSC ? 'bg-accent-growth/5' : ''
                      }`}
                  >
                    <td className="py-2.5 font-sans font-medium text-content-primary flex items-center gap-1.5">
                      <span className="font-mono font-bold">{caste.caste}</span>
                      <span className="text-[11px] text-content-muted">({caste.label})</span>
                      {isSC && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-accent-growth/20 text-accent-growth">
                          Highest ₹/Bigha
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-content-secondary">
                      {caste.sampleSize} ({((caste.sampleSize / 1535) * 100).toFixed(1)}%)
                    </td>
                    <td className="py-2.5 text-right tabular-nums">{caste.meanLandBigha.toFixed(2)} bi</td>
                    <td className="py-2.5 text-right font-bold text-accent-growth tabular-nums">
                      ₹{Math.round(caste.meanNetFarmIncome2026).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 text-right font-bold text-accent-harvest tabular-nums">
                      ₹{Math.round(caste.medianNetFarmIncome2026).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 text-right font-bold text-content-primary tabular-nums">
                      ₹{Math.round(productivityPerBigha).toLocaleString('en-IN')}/bi
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-accent-primary">
                      {caste.aasUnionEnrollmentPct.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Analytical Callout regarding SC Land Productivity */}
        <div className="p-3.5 rounded-lg bg-accent-growth/10 border border-accent-growth/20 text-xs font-sans text-content-secondary flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-accent-growth shrink-0 mt-0.5" />
          <div>
            <strong className="text-content-primary font-serif">Agronomic Equity Finding:</strong> Dalit (SC) households, despite holding the smallest average parcel size (2.87 bigha / ~0.57 acre), achieved the{' '}
            <strong className="text-accent-growth">highest net farm productivity per unit land (₹19,900 / bigha)</strong> via intensive vertical trellis farming, high-density organic kitchen gardening (Poshan Vatikas), and closed-loop bio-inputs.
          </div>
        </div>
      </div>

      {/* 6. Forensic Row 1492 Grand Total Neutralization Callout Banner */}
      <div className="p-4 rounded-xl bg-accent-evidence/10 border border-accent-evidence/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent-evidence shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-evidence">
                Forensic Audit SYS-1 Proof: Neutralized Row 1492 Grand Total
              </span>
              <EvidenceBadge metricId="REC-HYG-01" variant="card" label="Variance: ₹0.00" />
            </div>
            <p className="text-xs text-content-secondary font-sans leading-relaxed">
              In the raw survey workbook (<code className="font-mono text-content-primary">FDB Survey as on 05112026.xlsx</code>), Row 1492 contains a pre-computed Grand Total. Our zero-backend data compilation pipeline isolated individual farmer rows (4:1490, N=1,487) from Row 1492, eliminating a <strong>₹3.31 Cr duplicate double-count</strong> with <strong>₹0.00 slice identity variance</strong>.
            </p>
          </div>
        </div>

        {onViewSliceProof && (
          <button
            type="button"
            onClick={onViewSliceProof}
            className="px-3.5 py-1.5 rounded-lg bg-accent-evidence/20 hover:bg-accent-evidence/30 text-accent-evidence font-mono text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-center shrink-0 cursor-pointer"
          >
            <span>Inspect Audit Proof</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
