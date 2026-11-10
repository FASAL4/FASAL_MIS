import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import type { BighaSensitivityMatrixItem } from '../../types/dashboard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';

export interface BighaSensitivityMatrixProps {
  sensitivityItems: BighaSensitivityMatrixItem[];
  totalParsedBigha?: number;
  aggregateNetProfitINR?: number;
  selectedMultiplier?: number;
  onSelectMultiplier?: (multiplier: number) => void;
  showRemediationCallout?: boolean;
  className?: string;
}

export const BighaSensitivityMatrix: React.FC<BighaSensitivityMatrixProps> = ({
  sensitivityItems,
  totalParsedBigha = 5233.84,
  aggregateNetProfitINR = 95045999,
  selectedMultiplier: controlledMultiplier,
  onSelectMultiplier,
  showRemediationCallout = true,
  className = '',
}) => {
  const [internalMultiplier, setInternalMultiplier] = useState<number>(0.20);
  const activeMultiplier = controlledMultiplier !== undefined ? controlledMultiplier : internalMultiplier;

  const handleSelect = (multiplier: number) => {
    setInternalMultiplier(multiplier);
    onSelectMultiplier?.(multiplier);
  };

  // Find active item or default to baseline
  const activeItem =
    sensitivityItems.find(
      (item) => Math.abs(item.multiplierAcrePerBigha - activeMultiplier) < 0.001
    ) || sensitivityItems[0];

  // Dynamic calculations
  const dynamicAcres = totalParsedBigha * activeMultiplier;
  const dynamicReturnPerAcre = Math.round(aggregateNetProfitINR / dynamicAcres);
  const dynamicMeanAcres = dynamicAcres / 1535;

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header with SYS-4 Proof Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-evidence/15 text-accent-evidence border border-accent-evidence/25">
              Feature F11: Sensitivity Matrix & SYS-4 Proof
            </span>
            <EvidenceBadge metricId="REC-HYG-04" variant="card" label="Unit Definition: 0.20 ac" />
            <EvidenceBadge metricId="REC-LAND-02" variant="card" label="Physical Land: 1,046.77 ac" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            Regional Bigha Sensitivity Matrix: Land Unit Disambiguation
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            In Uttar Pradesh, land nomenclature varies drastically across administrative zones. In the Terai borderlands of Bahraich and Shravasti, communities transact in <strong>Local Kacha Bigha (0.2000 acre / bigha; 5 bigha = 1 acre)</strong>. Conflating this with statutory Western UP <em>Pucca Bigha</em> (0.6190 ac) creates a 3.1× false land expansion, artificially depressing calculated per-acre income.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-accent-growth/10 border border-accent-growth/20 text-accent-growth font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Remediates Defect SYS-4
          </span>
        </div>
      </div>

      {/* 2. Interactive Sensitivity Multiplier Toggle */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-content-muted flex items-center justify-between">
          <span>Select Regional Conversion Standard (Click to Compare):</span>
          <span className="text-[11px] text-accent-evidence font-normal">
            Active Factor: {activeMultiplier.toFixed(4)} ac/bigha
          </span>
        </label>

        <div
          role="radiogroup"
          aria-label="Regional Bigha Conversion Factors"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {sensitivityItems.map((item) => {
            const isSelected = Math.abs(item.multiplierAcrePerBigha - activeMultiplier) < 0.001;

            return (
              <button
                key={item.standardName}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(item.multiplierAcrePerBigha)}
                className={`p-4 rounded-xl text-left transition-all cursor-pointer border space-y-2 relative ${isSelected
                    ? 'bg-accent-growth/10 border-accent-growth/40 shadow-xs ring-2 ring-accent-growth/30'
                    : 'bg-elevated/70 border-border-subtle hover:bg-elevated hover:border-border-strong'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono font-bold text-content-primary tabular-nums">
                    {item.multiplierAcrePerBigha.toFixed(4)} ac
                  </span>
                  {item.isProjectBaseline && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-growth text-white">
                      BASELINE
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-serif font-bold text-content-primary">
                    {item.standardName}
                  </h4>
                  <p className="text-[10px] text-content-muted line-clamp-2 mt-0.5">
                    {item.regionalContext}
                  </p>
                </div>

                <div className="pt-2 border-t border-border-subtle/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-content-muted">Attainment Rate:</span>
                  <span
                    className={`font-bold tabular-nums ${item.benchmarkAttainmentPct >= 70
                        ? 'text-accent-growth'
                        : item.benchmarkAttainmentPct >= 40
                          ? 'text-accent-harvest'
                          : 'text-accent-stress'
                      }`}
                  >
                    {item.benchmarkAttainmentPct.toFixed(1)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Live Dynamic Recalculation Card */}
      <div className="p-5 rounded-xl bg-elevated/80 border border-border-subtle space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-accent-harvest" />
            <h4 className="text-sm font-serif font-bold text-content-primary">
              Live Dynamic Recalculation for Standard: {activeItem.standardName}
            </h4>
          </div>
          <span className="text-xs font-mono text-content-muted">
            Formula: 5,233.84 bigha × {activeMultiplier.toFixed(4)} ac/bigha
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-surface border border-border-subtle space-y-1">
            <span className="text-content-muted block text-[10px]">Derived Physical Land</span>
            <div className="text-xl font-bold text-content-primary tabular-nums">
              {dynamicAcres.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ac
            </div>
            <span className="text-[10px] text-content-secondary block">
              Across 1,535 households
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border-subtle space-y-1">
            <span className="text-content-muted block text-[10px]">Mean Landholding / HH</span>
            <div className="text-xl font-bold text-content-primary tabular-nums">
              {dynamicMeanAcres.toFixed(4)} ac
            </div>
            <span className="text-[10px] text-content-secondary block">
              {(dynamicMeanAcres / activeMultiplier).toFixed(2)} local bigha
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border-subtle space-y-1">
            <span className="text-content-muted block text-[10px]">Cohort Mean Net / Acre</span>
            <div
              className={`text-xl font-bold tabular-nums ${dynamicReturnPerAcre >= 60000 ? 'text-accent-growth' : 'text-accent-stress'
                }`}
            >
              ₹{dynamicReturnPerAcre.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-content-secondary block">
              Target: ₹60,000 / ac
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border-subtle space-y-1">
            <span className="text-content-muted block text-[10px]">Attainment Saturation</span>
            <div
              className={`text-xl font-bold tabular-nums ${activeItem.benchmarkAttainmentPct >= 70
                  ? 'text-accent-growth'
                  : 'text-accent-stress'
                }`}
            >
              {activeItem.benchmarkAttainmentPct.toFixed(1)}%
            </div>
            <span className="text-[10px] text-content-secondary block">
              {activeItem.benchmarkAttainmentPct >= 70 ? 'Target Exceeded (≥70%)' : 'Target Depressed'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Full Comparative Sensitivity Table */}
      <div className="p-4 rounded-xl bg-surface border border-border-subtle space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-content-muted flex items-center justify-between">
          <span>Comparative Cross-Standard Sensitivity Ledger</span>
          <span className="text-[11px] font-normal normal-case text-content-muted">
            Audited in verify_fdb_2026.py Module 7
          </span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-strong text-content-muted">
                <th className="pb-2">Standard Name & Regional Context</th>
                <th className="pb-2">Multiplier</th>
                <th className="pb-2 text-right">Derived Acreage</th>
                <th className="pb-2 text-right">Mean Land/HH</th>
                <th className="pb-2 text-right">Attainment Rate</th>
                <th className="pb-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60">
              {sensitivityItems.map((item) => {
                const isSelected = Math.abs(item.multiplierAcrePerBigha - activeMultiplier) < 0.001;

                return (
                  <tr
                    key={item.standardName}
                    onClick={() => handleSelect(item.multiplierAcrePerBigha)}
                    className={`hover:bg-elevated/40 transition-colors cursor-pointer ${isSelected ? 'bg-accent-growth/10 font-bold' : ''
                      }`}
                  >
                    <td className="py-2.5 font-sans font-medium text-content-primary">
                      <span>{item.standardName}</span>
                      <span className="text-content-muted text-[11px] block font-normal">
                        {item.regionalContext}
                      </span>
                    </td>
                    <td className="py-2.5 tabular-nums text-content-secondary">
                      {item.multiplierAcrePerBigha.toFixed(4)} ac/bi
                    </td>
                    <td className="py-2.5 text-right font-bold tabular-nums">
                      {item.totalAcresDerived.toLocaleString()} ac
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      {item.meanAcresPerHH.toFixed(4)} ac
                    </td>
                    <td
                      className={`py-2.5 text-right font-bold tabular-nums ${item.benchmarkAttainmentPct >= 70
                          ? 'text-accent-growth'
                          : 'text-accent-stress'
                        }`}
                    >
                      {item.benchmarkAttainmentPct.toFixed(1)}%
                    </td>
                    <td className="py-2.5 text-center">
                      {item.isProjectBaseline ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-growth text-white">
                          BASELINE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-content-muted bg-elevated border border-border-subtle">
                          COMPARATIVE
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Forensic SYS-4 Defect Remediation Callout Banner */}
      {showRemediationCallout && (
        <div className="p-4 rounded-xl bg-accent-evidence/10 border border-accent-evidence/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-accent-evidence font-bold text-xs uppercase tracking-wider font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Forensic SYS-4 Remediation: Why 0.20 Acre is Administratively True</span>
            </div>
            <EvidenceBadge metricId="REC-HYG-04" variant="card" label="SYS-4 Remediation" />
          </div>
          <h4 className="text-sm font-serif font-bold text-content-primary">
            Remediation of 3.1× False Land Expansion & Artificial Income Depletion
          </h4>
          <p className="text-xs text-content-secondary leading-relaxed font-sans">
            In 2024, an external evaluation mistakenly applied the statutory Western UP Board of Revenue factor of <strong>0.6190 acre / bigha</strong> to Terai survey submissions. This mathematical error falsely inflated operational land to <strong>3,239.75 acres</strong> and falsely depressed calculated per-acre income to <strong>₹29,337/acre (8.9% attainment)</strong>. In reality, field surveys in Mihinpurwa Block strictly measured in <strong>local Kacha Bigha (0.2000 acre; 20 biswa = 1 bigha; 5 bigha = 1 acre)</strong>, yielding <strong>1,046.77 physical acres</strong> and the true cohort productivity of <strong>₹90,799.31/acre (76.8% attainment)</strong>.
          </p>
        </div>
      )}
    </div>
  );
};
