import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
} from 'lucide-react';
import type { RFProgressionData } from '../../types/dashboard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';

export interface MachanTrellisCardProps {
  machanFarmsCount: number;
  lerRatio: number;
  physicalYields: RFProgressionData['leisaTransition']['physicalYields'];
  className?: string;
}

export const MachanTrellisCard: React.FC<MachanTrellisCardProps> = ({
  machanFarmsCount = 777,
  lerRatio = 2.1,
  physicalYields,
  className = '',
}) => {
  const [selectedTier, setSelectedTier] = useState<number>(1);

  const tiers = [
    {
      tierNumber: 1,
      title: 'Tier 1: Upper Roof Canopy (6–7 ft Height)',
      crops: 'Bitter Gourd (Karela), Bottle Gourd (Lauki), Cucumber (Kheera), Sponge Gourd (Torai)',
      mechanisms:
        'Raised bamboo and galvanized wire grid. Cucurbit vines trail overhead in full sunlight. Suspended fruit has zero soil-moisture contact, eliminating rot and slug damage, capturing a 20–30% cash premium in wholesale mandis.',
      metrics: 'Bitter Gourd: 777 growers | ₹30.78 Lakh net profit | 48.5 q/ac yield',
      evidenceId: 'REC-CROP-04',
      badgeColor: 'text-accent-growth bg-accent-growth/10 border-accent-growth/20',
    },
    {
      tierNumber: 2,
      title: 'Tier 2: Intermediate Climbing Strata (Vertical Twine)',
      crops: 'Climbing Cowpea (Lobia), Yardlong Beans, Pointed Gourd (Parwal)',
      mechanisms:
        'Leguminous climbers trained vertically along natural jute twine between bamboo uprights. Nodulating root systems fix atmospheric nitrogen in root zones, directly benefiting companion understory crops.',
      metrics: 'Symbiotic nitrogen fixation + continuous weekly cash pickings for women SHGs',
      evidenceId: 'REC-CROP-03',
      badgeColor: 'text-accent-primary bg-accent-primary/10 border-accent-primary/20',
    },
    {
      tierNumber: 3,
      title: 'Tier 3: Ground Floor Understory (Rhizomes & Greens)',
      crops: 'Commercial Turmeric (Curcuma longa), Ginger, Elephant Yam (Suran), Coriander',
      mechanisms:
        'Shade-tolerant root systems thriving in the filtered micro-climate beneath the vine canopy. Pungent essential oils guarantee 100% immunity to raiding by forest elephants, boars, and nilgai.',
      metrics: 'Flagship Turmeric: 328 growers | ₹98.38 Lakh net profit | 107.0 q/ac yield',
      evidenceId: 'REC-TURM-07',
      badgeColor: 'text-accent-harvest bg-accent-harvest/15 border-accent-harvest/25',
    },
  ];

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-growth/10 text-accent-growth border border-accent-growth/20">
              Feature F12: Vertical Spatial Intensification
            </span>
            <EvidenceBadge metricId="REC-CROP-04" variant="card" label="777 Machan Farms" />
            <EvidenceBadge metricId="REC-TURM-08" variant="card" label="LER = 2.1 (> 2.0)" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            Multi-Tier Bamboo Machan Trellises & Spatial Land Equivalent Ratio
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            For smallholders operating micro-parcels averaging just <strong>0.68 acres</strong>, horizontal farm expansion is impossible. FASAL engineered vertical multi-tier bamboo and wire <em>Machan</em> trellises across <strong>777+ households</strong>, achieving a verified <strong>Land Equivalent Ratio (LER) of 2.1</strong> (1 acre of Machan yields the equivalent output of 2.1 acres of traditional monoculture).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-accent-growth/10 border border-accent-growth/20 text-accent-growth font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            LER = 2.1 (&gt; 2.0 Target)
          </span>
        </div>
      </div>

      {/* 2. Headline Trellis Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Machan Installations</span>
            <EvidenceBadge metricId="REC-CROP-04" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-content-primary tabular-nums">
              {machanFarmsCount}
            </span>
            <span className="text-xs font-mono text-content-secondary">
              farms
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            Constructed over 0.5 to 1.5 bigha plots
          </p>
        </div>

        <div className="p-4 rounded-xl bg-accent-growth/10 border border-accent-growth/25 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span className="font-bold text-accent-growth">Land Equivalent Ratio</span>
            <EvidenceBadge metricId="REC-TURM-08" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-accent-growth tabular-nums">
              LER = {lerRatio.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-accent-growth/80 font-bold">
              (&gt; 2.0)
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            Multiplies spatial land efficiency by 210%
          </p>
        </div>

        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Bitter Gourd Net Return</span>
            <EvidenceBadge metricId="REC-CROP-04" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-accent-harvest tabular-nums">
              ₹30.78 L
            </span>
            <span className="text-xs font-mono text-accent-growth font-bold">
              +16.5% YoY
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            Rank 4 whole-farm cash earner in 2026
          </p>
        </div>

        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Companion Turmeric</span>
            <EvidenceBadge metricId="REC-TURM-07" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-accent-growth tabular-nums">
              ₹98.38 L
            </span>
            <span className="text-xs font-mono text-accent-growth/80 font-bold">
              82.85% margin
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            Ground understory non-browsed buffer
          </p>
        </div>
      </div>

      {/* 3. Interactive 3-Tier Vertical Spatial Architecture Explorer */}
      <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-base font-serif font-bold text-content-primary flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-growth" />
            The 3-Tier Multi-Story Canopy Architecture
          </h4>
          <span className="text-xs font-mono text-content-muted">
            Click tier below to inspect agronomic mechanisms
          </span>
        </div>

        {/* Visual 3-Tier Stack */}
        <div className="space-y-3">
          {tiers.map((tier) => {
            const isSelected = selectedTier === tier.tierNumber;

            return (
              <div
                key={tier.tierNumber}
                onClick={() => setSelectedTier(tier.tierNumber)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${isSelected
                    ? 'bg-elevated/90 border-border-strong shadow-xs ring-2 ring-accent-growth/20'
                    : 'bg-surface border-border-subtle hover:bg-elevated/50'
                  }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${tier.badgeColor}`}>
                      {tier.title}
                    </span>
                  </div>
                  <EvidenceBadge metricId={tier.evidenceId} variant="subtle" />
                </div>

                <div className="text-xs font-mono text-content-primary font-bold">
                  Target Crops: {tier.crops}
                </div>

                <p className="text-xs text-content-secondary font-sans leading-relaxed">
                  {tier.mechanisms}
                </p>

                <div className="pt-2 border-t border-border-subtle/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-content-muted">Empirical Output:</span>
                  <span className="font-bold text-accent-growth">{tier.metrics}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Physical Crop Yields Ledger */}
      <div className="p-4 rounded-xl bg-surface border border-border-subtle space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-content-muted flex items-center justify-between">
          <span>Certified Agronomic Physical Yields</span>
          <span className="text-[11px] font-normal normal-case text-content-muted">
            Quintals per Operational Acre (0.20 Standard)
          </span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-strong text-content-muted">
                <th className="pb-2">Crop Enterprise</th>
                <th className="pb-2 text-right">Physical Yield (q / acre)</th>
                <th className="pb-2 text-right">Yield per Local Bigha (kg)</th>
                <th className="pb-2 text-center">Agronomic Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60">
              {physicalYields.map((yieldItem) => (
                <tr key={yieldItem.crop} className="hover:bg-elevated/40 transition-colors">
                  <td className="py-2.5 font-sans font-medium text-content-primary">
                    {yieldItem.crop}
                  </td>
                  <td className="py-2.5 text-right font-bold text-accent-growth tabular-nums">
                    {yieldItem.yieldPerAcreQuintals.toFixed(2)} q/ac
                  </td>
                  <td className="py-2.5 text-right font-bold tabular-nums text-content-primary">
                    {yieldItem.yieldPerBighaKg.toLocaleString()} kg/bi
                  </td>
                  <td className="py-2.5 text-center text-[11px] text-content-muted font-sans">
                    {yieldItem.crop === 'Turmeric' && 'Flagship Understory Cash Crop (Non-browsed buffer)'}
                    {yieldItem.crop === 'Bitter Gourd' && 'High-Value Suspended Roof Cucurbit (Machan)'}
                    {yieldItem.crop === 'Paddy' && 'Kharif Subsistence Staple (LEISA microbial seed treatment)'}
                    {yieldItem.crop === 'Wheat' && 'Rabi Staple (Reduced synthetic nitrogen, Ghanjeevamrit)'}
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
