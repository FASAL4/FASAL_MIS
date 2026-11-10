import React, { useState } from 'react';
import {
  Sprout,
  Shield,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
} from 'lucide-react';
import type { RFProgressionData } from '../../types/dashboard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';

export interface LeisaTransitionTimelineProps {
  leisaData: RFProgressionData['leisaTransition'];
  className?: string;
}

type FormulationFilter = 'All' | 'Liquid Bio-Nutrient' | 'Solid Bio-Manure' | 'Bio-Pest Repellent';

export const LeisaTransitionTimeline: React.FC<LeisaTransitionTimelineProps> = ({
  leisaData,
  className = '',
}) => {
  const [selectedFilter, setSelectedFilter] = useState<FormulationFilter>('All');

  const filteredFormulations =
    selectedFilter === 'All'
      ? leisaData.formulationsAdopted
      : leisaData.formulationsAdopted.filter((f) => f.type === selectedFilter);

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-growth/10 text-accent-growth border border-accent-growth/20">
              Feature F12: Agro-Ecological Intensification
            </span>
            <EvidenceBadge metricId="REC-INST-01" variant="card" label="1,120+ 200L Bio-Drums" />
            <EvidenceBadge metricId="REC-TRN-03" variant="card" label="9 LEISA Curricula" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            LEISA Ecological Transition: From Chemical Debt to Biological Autonomy
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            Transitioning from High External Input Sustainable Agriculture (HIESA) into Low External Input Sustainable Agriculture (LEISA). Smallholders deployed <strong>1,120+ food-grade 200L bio-drums</strong> across 64 affinity groups, achieving a certified <strong>~90% reduction in chemical pesticide expenditure</strong> and containing whole-farm cultivation cost to <strong>₹2,227 per bigha</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-accent-growth/10 border border-accent-growth/20 text-accent-growth font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ~90% Chemical Pesticide Cut
          </span>
        </div>
      </div>

      {/* 2. Headline Agronomic Indicators Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Chemical Pesticide Cut */}
        <div className="p-4 rounded-xl bg-accent-growth/10 border border-accent-growth/25 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span className="font-bold text-accent-growth">Pesticide Expenditure Cut</span>
            <EvidenceBadge metricId="REC-INST-01" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-accent-growth tabular-nums">
              ~{leisaData.chemicalPesticideCutPct.toFixed(0)}%
            </span>
            <span className="text-xs font-mono text-accent-growth/80 font-bold">
              cut
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            Replaced with botanical repellents
          </p>
        </div>

        {/* Metric 2: 200L Bio-Drums Deployed */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Bio-Drums Deployed</span>
            <EvidenceBadge metricId="REC-INST-01" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-content-primary tabular-nums">
              {leisaData.bioNutrientDrumsCount.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-content-secondary">
              units
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            200L food-grade fermentation barrels
          </p>
        </div>

        {/* Metric 3: Multi-Tier Machan Farms */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Machan Trellis Farms</span>
            <EvidenceBadge metricId="REC-CROP-04" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-content-primary tabular-nums">
              {leisaData.machanTrellisFarmsCount}
            </span>
            <span className="text-xs font-mono text-content-secondary">
              farms
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            Vertical spatial intensification (LER = {leisaData.lerLandEquivalentRatio})
          </p>
        </div>

        {/* Metric 4: Cultivation Cost per Bigha */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Mean Cost / Bigha</span>
            <EvidenceBadge metricId="REC-ECON-09" variant="subtle" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-accent-harvest tabular-nums">
              ₹{leisaData.averageCultivationCostPerBighaINR.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-mono text-content-secondary">
              / bigha
            </span>
          </div>
          <p className="text-[11px] font-mono text-content-secondary">
            Across 42 diversified crop systems
          </p>
        </div>
      </div>

      {/* 3. Paradigm Shift Comparative Card: HIESA vs LEISA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* HIESA (Chemical Input Treadmill) */}
        <div className="p-5 rounded-xl bg-accent-stress/5 border border-accent-stress/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-stress flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Pre-Intervention HIESA (Chemical Trap)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-stress/15 text-accent-stress font-bold">
              Debt Monoculture
            </span>
          </div>
          <h4 className="text-sm font-serif font-bold text-content-primary">
            High Cost, Dealer Credit & Severe Soil Degradation
          </h4>
          <ul className="text-xs text-content-secondary space-y-2 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-accent-stress font-bold mt-0.5">✕</span>
              <span><strong>Moneylender Debt Treadmill:</strong> ₹2,500–₹4,500/bigha on synthetic urea, DAP, and toxic organophosphates (chlorpyrifos) financed at 60–120% APR.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-stress font-bold mt-0.5">✕</span>
              <span><strong>Soil Health Collapse:</strong> Soil organic carbon plummeted below 0.35%, creating hard-pan soil crusting (<em>papad</em>) and moisture drought stress.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-stress font-bold mt-0.5">✕</span>
              <span><strong>Pest Resistance Resurgence:</strong> Synthetic sprays eliminated natural predators (spiders, dragonflies), causing devastating secondary borer pest flare-ups.</span>
            </li>
          </ul>
        </div>

        {/* LEISA (Biological Regenerative Agriculture) */}
        <div className="p-5 rounded-xl bg-accent-growth/10 border border-accent-growth/25 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-growth flex items-center gap-1.5">
              <Sprout className="w-4 h-4" />
              Post-Intervention LEISA (Biological Sovereignty)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-growth/20 text-accent-growth font-bold">
              Closed-Loop Ecology
            </span>
          </div>
          <h4 className="text-sm font-serif font-bold text-content-primary">
            Zero-Debt Closed Loop, Natural Predators & High Margins
          </h4>
          <ul className="text-xs text-content-secondary space-y-2 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-accent-growth font-bold mt-0.5">✓</span>
              <span><strong>On-Farm Biological Inputs:</strong> Jeevamrit, Ghanjeevamrit, and Char Chatni produced using desi cow dung, urine, pulse flour, and local botanicals.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-growth font-bold mt-0.5">✓</span>
              <span><strong>90% Pesticide Cut & Contained Costs:</strong> Input costs held to ₹2,227/bigha, yielding an aggregate 74.16% whole-farm net profit margin.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-growth font-bold mt-0.5">✓</span>
              <span><strong>Soil & Canopy Regeneration:</strong> Restored microbial biodiversity, enhanced moisture retention during winter rabi, and zero wildlife toxicity in buffer.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. Interactive Bio-Formulation Catalog */}
      <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-serif font-bold text-content-primary flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-accent-harvest" />
              Standardized Bio-Nutrient & NPM Formulation Catalog
            </h4>
            <p className="text-xs text-content-secondary">
              5 standardized indigenous bio-formulations fermented in 200L drums across AAS clusters.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(['All', 'Liquid Bio-Nutrient', 'Solid Bio-Manure', 'Bio-Pest Repellent'] as FormulationFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${selectedFilter === filter
                    ? 'bg-content-primary text-base font-bold shadow-xs'
                    : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Formulation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredFormulations.map((formulation) => (
            <div
              key={formulation.name}
              className="p-4 rounded-xl bg-elevated/70 border border-border-subtle space-y-2.5 hover:border-border-strong transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-content-primary">
                  {formulation.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-growth/10 text-accent-growth border border-accent-growth/20">
                  {formulation.type}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div>
                  <span className="text-content-muted block text-[10px] uppercase tracking-wider">
                    Ingredients:
                  </span>
                  <p className="text-content-primary font-sans leading-relaxed text-[11px]">
                    {formulation.ingredients}
                  </p>
                </div>

                <div className="pt-1.5 border-t border-border-subtle/50">
                  <span className="text-content-muted block text-[10px] uppercase tracking-wider">
                    Agronomic Target:
                  </span>
                  <p className="text-content-secondary font-sans leading-relaxed text-[11px]">
                    {formulation.applicationTarget}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Debunked Formulation Audit Callout (Agniastra) */}
        <div className="p-3.5 rounded-lg bg-elevated border border-border-subtle text-xs font-sans text-content-secondary flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-accent-evidence shrink-0 mt-0.5" />
          <div>
            <strong className="text-content-primary font-serif">Audit Compliance (TC-F12-05):</strong> The formulation "Agniastra" (sometimes cited in unverified literature) was confirmed to be a debunked, purged artifact not deployed in the standardized Katarniaghat package. Frontline extension strictly standardized on the 5 validated formulations above.
          </div>
        </div>
      </div>
    </div>
  );
};
