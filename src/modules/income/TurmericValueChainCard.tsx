import React, { useState } from 'react';
import {
  Shield,
  TrendingUp,
  Award,
} from 'lucide-react';
import type { TurmericEconomics } from '../../types/dashboard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { formatNumber } from './incomeFormatters';

export interface TurmericValueChainCardProps {
  turmeric: TurmericEconomics;
  className?: string;
}

export const TurmericValueChainCard: React.FC<TurmericValueChainCardProps> = ({
  turmeric,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'processing' | 'trajectory'>('overview');

  const historicalProfits = [
    { year: 2022, netLakh: 7.99, growers: 135, areaBigha: 140 },
    { year: 2023, netLakh: 12.97, growers: 216, areaBigha: 210 },
    { year: 2024, netLakh: 29.32, growers: 351, areaBigha: 295 },
    { year: 2025, netLakh: 93.09, growers: 333, areaBigha: 315 },
    { year: 2026, netLakh: 98.38, growers: 328, areaBigha: 345 },
  ];

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header with Flagship Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-harvest/15 text-accent-harvest border border-accent-harvest/25">
              Feature F08: Flagship Commercial Enterprise
            </span>
            <EvidenceBadge metricId="REC-TURM-07" variant="card" label="Net Profit: ₹98.38 Lakh" />
            <EvidenceBadge metricId="REC-TURM-01" variant="card" label="328 Active Growers" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            Commercial Organic Turmeric Value Chain (Curcuma longa)
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            Catalytic cash crop in the eco-fragile Katarniaghat Wildlife Sanctuary corridor. Turmeric combines{' '}
            <strong className="text-accent-harvest">100% biological immunity to wildlife raiding</strong> with high-margin market surplus, delivering an extraordinary{' '}
            <strong className="text-accent-growth">82.85% net cash profit margin</strong> across 328 specialized smallholders.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center p-1 rounded-lg bg-elevated border border-border-subtle self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${activeTab === 'overview'
                ? 'bg-surface text-content-primary shadow-xs font-bold border border-border-subtle'
                : 'text-content-muted hover:text-content-primary'
              }`}
          >
            Core Economics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('processing')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${activeTab === 'processing'
                ? 'bg-surface text-content-primary shadow-xs font-bold border border-border-subtle'
                : 'text-content-muted hover:text-content-primary'
              }`}
          >
            Processing & Quality
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trajectory')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${activeTab === 'trajectory'
                ? 'bg-surface text-content-primary shadow-xs font-bold border border-border-subtle'
                : 'text-content-muted hover:text-content-primary'
              }`}
          >
            5-Year Trajectory
          </button>
        </div>
      </div>

      {/* 2. Core Four-Quadrant Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Growers & Acreage */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Commercial Growers</span>
            <EvidenceBadge metricId="REC-TURM-01" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-content-primary tabular-nums">
              {turmeric.growers2026}
            </span>
            <span className="text-xs font-mono text-content-secondary">
              growers
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            {turmeric.areaBigha2026} bigha (69.0 ac; avg 0.53 bi/HH)
          </p>
        </div>

        {/* Metric 2: Net Cash Profit */}
        <div className="p-4 rounded-xl bg-accent-growth/10 border border-accent-growth/25 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span className="font-bold text-accent-growth">Net Cash Profit</span>
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
            Gross: ₹1.27 Cr | Input Cost: ₹28.50 L
          </p>
        </div>

        {/* Metric 3: Mean Return per Grower */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Mean Return / Grower</span>
            <EvidenceBadge metricId="REC-TURM-06" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-accent-harvest tabular-nums">
              ₹29,995
            </span>
            <span className="text-xs font-mono text-content-secondary">
              / HH
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            Represents ~47% of total farm net on 0.5 bigha
          </p>
        </div>

        {/* Metric 4: Certified Physical Yield */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Physical Harvest Yield</span>
            <EvidenceBadge metricId="REC-TURM-08" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-content-primary tabular-nums">
              {turmeric.averageYieldQuintalsPerAcre.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-content-secondary">
              q / acre
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            {formatNumber(turmeric.freshRhizomeProductionKg)} kg rhizomes (2,141 kg/bi)
          </p>
        </div>
      </div>

      {/* 3. Agro-Ecological Shield Callout: Human-Wildlife Coexistence */}
      <div className="p-5 rounded-xl bg-accent-harvest/10 border border-accent-harvest/30 space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2.5 text-accent-harvest">
          <Shield className="w-5 h-5 shrink-0" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">
            Agro-Ecological Buffer Zone Immunity: Why Turmeric?
          </span>
        </div>
        <h4 className="text-base font-serif font-bold text-content-primary">
          Complete Herbivore Unpalatability Eliminates Human-Wildlife Conflict
        </h4>
        <p className="text-xs sm:text-sm text-content-secondary leading-relaxed font-sans">
          Villages adjoining the Katarniaghat Wildlife Sanctuary face constant raiding from wild Asian elephants, wild boars, nilgai (*Boselaphus tragocamelus*), and spotted deer, often devastating cereal and vegetable fields overnight. Turmeric's pungent essential oils and bitter curcumin render both its aerial foliage and underground rhizomes <strong>completely unpalatable to herbivores</strong>. Smallholders harvest guaranteed commercial profits directly along the forest boundary with <strong>zero fencing costs and zero retaliatory human-wildlife conflict</strong>.
        </p>
      </div>

      {/* 4. Tab Views */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quality & Lab Curcumin Benchmarking */}
          <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-content-primary uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-accent-harvest" />
                Laboratory Curcumin Quality Benchmark
              </span>
              <span className="px-2 py-0.5 rounded bg-accent-harvest/15 text-accent-harvest font-bold text-[11px]">
                {turmeric.curcuminContentPctRange} Curcumin
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-content-muted">National Commodity Turmeric Benchmark:</span>
                <span className="font-bold text-content-secondary">~2.0%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-border-subtle overflow-hidden relative">
                <div style={{ width: '50%' }} className="h-full bg-content-muted/50 rounded-full" />
                <div style={{ width: '90%' }} className="h-full bg-accent-harvest rounded-full -mt-3 opacity-90" />
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-accent-harvest font-bold">FASAL Certified Bio-Input Range:</span>
                <span className="font-bold text-accent-harvest">{turmeric.curcuminContentPctRange} (+60% to +90% premium)</span>
              </div>
            </div>

            <p className="text-xs text-content-secondary font-sans leading-relaxed pt-2">
              Lab-tested curcumin levels consistently reach <strong>3.2% to 3.8%</strong>, well above the 2.0% standard. This superior biological potency unlocks premium market access for the AAS Farmer Producer Federation.
            </p>
          </div>

          {/* Pricing Power & Margin Dynamics */}
          <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-content-primary uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent-growth" />
                Value-Added Price Realization
              </span>
              <span className="px-2 py-0.5 rounded bg-accent-growth/15 text-accent-growth font-bold text-[11px]">
                {turmeric.dryFingerMarketingPriceRange}
              </span>
            </div>

            <div className="space-y-2.5 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-elevated border border-border-subtle flex items-center justify-between">
                <span className="text-content-muted">Raw Fresh Rhizome Farmgate:</span>
                <span className="font-bold text-content-primary">₹16 – ₹20 / kg</span>
              </div>
              <div className="p-2.5 rounded bg-elevated border border-border-subtle flex items-center justify-between">
                <span className="text-content-muted">Dried Polished Fingers (Bulk):</span>
                <span className="font-bold text-accent-harvest">₹140 – ₹160 / kg</span>
              </div>
              <div className="p-2.5 rounded bg-accent-growth/10 border border-accent-growth/20 flex items-center justify-between text-accent-growth">
                <span className="font-bold">AAS Community Packaged Powder:</span>
                <span className="font-bold text-sm">₹180+ / kg</span>
              </div>
            </div>
            <p className="text-xs text-content-secondary font-sans leading-relaxed">
              Decentralized post-harvest steam boiling and solar drying captures a <strong>5× to 9× value multiple</strong> at the village cluster level.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'processing' && (
        <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-4">
          <h4 className="text-sm font-serif font-bold text-content-primary">
            Decentralized Value Addition Micro-Flow: From Forest Buffer to Retail Shelf
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className="p-3.5 rounded-lg bg-elevated border border-border-subtle space-y-2 relative">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface text-content-muted uppercase">
                Step 1: Bio-Cultivation
              </span>
              <h5 className="text-xs font-serif font-bold text-content-primary">345 Bigha LEISA Plots</h5>
              <p className="text-[11px] text-content-secondary font-sans">
                Intercropped under multi-tier trellises with Jeevamrit and Ghanjeevamrit; zero synthetic chemicals.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-lg bg-elevated border border-border-subtle space-y-2 relative">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface text-content-muted uppercase">
                Step 2: Harvest
              </span>
              <h5 className="text-xs font-serif font-bold text-content-primary">738,640 kg Fresh Rhizomes</h5>
              <p className="text-[11px] text-content-secondary font-sans">
                Dug in winter (Dec–Feb). High moisture rhizomes sorted and cleaned by AAS women producer collectives.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-lg bg-elevated border border-border-subtle space-y-2 relative">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface text-content-muted uppercase">
                Step 3: Curing & Drying
              </span>
              <h5 className="text-xs font-serif font-bold text-content-primary">Steam Boiling & Solar Tunnel</h5>
              <p className="text-[11px] text-content-secondary font-sans">
                Traditional boiling gelatinizes starch; solar tunnel drying achieves 5:1 weight conversion and preserves curcumin.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-lg bg-accent-growth/10 border border-accent-growth/20 space-y-2 relative">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface text-accent-growth uppercase">
                Step 4: Branding
              </span>
              <h5 className="text-xs font-serif font-bold text-content-primary">AAS Community Brand</h5>
              <p className="text-[11px] text-content-secondary font-sans">
                Polished dry fingers packaged and sold at ₹140–₹180/kg, generating ₹98.38 Lakh in net local surplus.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trajectory' && (
        <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-serif font-bold text-content-primary">
              5-Year Turmeric Enterprise Trajectory: 12.3× Cash Surplus Expansion
            </h4>
            <span className="text-xs font-mono text-content-muted">₹7.99L (2022) → ₹98.38L (2026)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border-strong text-content-muted">
                  <th className="pb-2">Year</th>
                  <th className="pb-2 text-right">Growers</th>
                  <th className="pb-2 text-right">Area (Bigha)</th>
                  <th className="pb-2 text-right">Net Profit (₹ Lakh)</th>
                  <th className="pb-2 text-right">Multiple over Baseline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/60">
                {historicalProfits.map((item) => (
                  <tr key={item.year} className="hover:bg-elevated/40 transition-colors">
                    <td className="py-2.5 font-sans font-medium text-content-primary">{item.year}</td>
                    <td className="py-2.5 text-right tabular-nums">{item.growers}</td>
                    <td className="py-2.5 text-right tabular-nums">{item.areaBigha} bi</td>
                    <td className="py-2.5 text-right font-bold text-accent-harvest tabular-nums">
                      ₹{item.netLakh.toFixed(2)} L
                    </td>
                    <td className="py-2.5 text-right font-bold text-accent-growth tabular-nums">
                      {(item.netLakh / 7.99).toFixed(2)}×
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
