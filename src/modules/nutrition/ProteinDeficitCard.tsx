import React from 'react';
import {
  PackageCheck,
  Sprout,
} from 'lucide-react';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { fasalMasterData } from '../../data/fasalMasterData';
import type { NutritionData } from '../../types/dashboard';
import { formatDelta } from './nutritionFormatters';

export interface ProteinDeficitCardProps {
  data?: NutritionData;
  className?: string;
}

export const ProteinDeficitCard: React.FC<ProteinDeficitCardProps> = ({
  data,
  className = '',
}) => {
  const nutrition = data || fasalMasterData.nutrition;
  const pulses = nutrition.foodGroupRecall.yellowFoodsPulses;

  const pulseCropPortfolio = [
    { crop: 'Moong (Green Gram)', season: 'Zaid / Summer', growers: 98, netMarginINR: 221300, role: 'Short-duration summer pulse fixing soil nitrogen' },
    { crop: 'Bakala (Fava Bean)', season: 'Rabi / Winter', growers: 138, netMarginINR: 308242, role: 'Indigenous frost-hardy winter protein legume' },
    { crop: 'Seam (Lablab Bean)', season: 'Kharif / Trellis', growers: 151, netMarginINR: 405315, role: 'High-protein vine legume cultivated on Machan' },
    { crop: 'Pea (Matar)', season: 'Rabi / Winter', growers: 46, netMarginINR: 168472, role: 'Dual-purpose winter green vegetable and dry pulse' },
    { crop: 'Gram (Chana)', season: 'Rabi / Rainfed', growers: 12, netMarginINR: 34700, role: 'Rainfed drought-tolerant pulse' },
  ];

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header & Evidence Linkage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-harvest/10 text-accent-harvest border border-accent-harvest/20">
              Feature F18: Protein Deficit Reversal
            </span>
            <EvidenceBadge metricId="REC-NUTR-04" variant="card" label="Weekly Pulse Intake: 42.6%➔66.4%" />
            <EvidenceBadge metricId="REC-CROP-05" variant="subtle" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary">
            Weekly Pulse Consumption Expansion (+23.8 pp)
          </h3>
        </div>
      </div>

      {/* 2. Headline Metric Card: 42.6% -> 66.4% */}
      <div className="p-5 rounded-lg bg-accent-harvest/5 border border-accent-harvest/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold uppercase text-accent-harvest tracking-wider">
            Household Weekly Pulse Consumption Frequency
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
            {formatDelta(pulses.reversalExpansionGainPp)} Net Expansion (+55.9% relative)
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between font-mono text-sm">
            <span className="text-content-muted">2022 Baseline: <strong>{pulses.baselineWeeklyPct}%</strong></span>
            <span className="text-accent-harvest font-bold text-lg">2026 Endline: <strong>{pulses.endlineWeeklyPct}%</strong></span>
          </div>
          <div className="w-full h-3 rounded-full bg-elevated overflow-hidden p-0.5 border border-border-subtle flex">
            <div
              style={{ width: `${pulses.baselineWeeklyPct}%` }}
              className="h-full bg-content-muted/60 rounded-l-full"
              title={`Baseline: ${pulses.baselineWeeklyPct}%`}
            />
            <div
              style={{ width: `${pulses.reversalExpansionGainPp}%` }}
              className="h-full bg-accent-harvest"
              title={`Net Gain: +${pulses.reversalExpansionGainPp} pp`}
            />
          </div>
        </div>

        <p className="text-xs text-content-secondary leading-relaxed font-sans">
          In rural Terai diets, protein deficiency was historically severe. Smallholders routinely distress-sold their pulses to pay debt, consuming only watery rice gruel. FASAL reversed this through the <strong>50 kg Household Pulse Retention Protocol</strong> and spatial legume intercropping (LER &ge; 2.0).
        </p>
      </div>

      {/* 3. The 50 kg Household Reserve Policy Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-elevated border border-border-subtle space-y-2">
          <div className="flex items-center gap-2 text-content-primary font-serif font-bold text-sm">
            <PackageCheck className="w-4 h-4 text-accent-harvest" />
            <span>50 kg Pulse Retention Protocol</span>
          </div>
          <p className="text-[11px] text-content-secondary font-sans leading-relaxed">
            Cultivators were trained and contractually pledged through AAS democratic collectives to retain a minimum of <strong>50 kg of clean harvested pulses per family</strong> in domestic storage bins before marketing any surplus.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-elevated border border-border-subtle space-y-2">
          <div className="flex items-center gap-2 text-content-primary font-serif font-bold text-sm">
            <Sprout className="w-4 h-4 text-accent-growth" />
            <span>LEISA Legume Intercropping (LER &ge; 2.0)</span>
          </div>
          <p className="text-[11px] text-content-secondary font-sans leading-relaxed">
            Pulses were integrated into commercial turmeric and maize rows. Legume root nodules fixed biological atmospheric nitrogen, lowering fertilizer costs while yielding dual grain and protein harvests from identical acreage.
          </p>
        </div>
      </div>

      {/* 4. Pulse Variety Agronomic Ledger */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-mono font-bold uppercase text-content-muted tracking-wider">
          Empirical Pulse & Legume Portfolio in FASAL Agro-Ecosystem
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-strong text-content-muted">
                <th className="pb-2">Pulse Variety</th>
                <th className="pb-2">Cropping Window</th>
                <th className="pb-2 text-right">Active Growers</th>
                <th className="pb-2 text-right">Net Margin</th>
                <th className="pb-2 pl-4">Nutritional & Agro Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60">
              {pulseCropPortfolio.map((p) => (
                <tr key={p.crop} className="hover:bg-elevated/40 transition-colors">
                  <td className="py-2.5 font-sans font-medium text-content-primary">{p.crop}</td>
                  <td className="py-2.5 text-content-muted">{p.season}</td>
                  <td className="py-2.5 text-right font-bold tabular-nums">{p.growers} HH</td>
                  <td className="py-2.5 text-right font-bold tabular-nums text-accent-growth">₹{p.netMarginINR.toLocaleString()}</td>
                  <td className="py-2.5 pl-4 font-sans text-content-secondary text-[11px]">{p.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProteinDeficitCard;
