import React, { useState } from 'react';
import {
  Apple,
} from 'lucide-react';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { fasalMasterData } from '../../data/fasalMasterData';
import type { NutritionData } from '../../types/dashboard';
import { DietaryRecallChart } from './DietaryRecallChart';
import { HungerGapInversionCard } from './HungerGapInversionCard';
import { ProteinDeficitCard } from './ProteinDeficitCard';
import { PoshanVatikaCard } from './PoshanVatikaCard';

export interface NutritionModuleProps {
  data?: NutritionData;
  onOpenLedger?: (metricId?: string) => void;
  className?: string;
}

type SectionTab = 'all' | 'recall_trajectory' | 'hunger_inversion' | 'protein_reversal' | 'poshan_vatikas';

export const NutritionModule: React.FC<NutritionModuleProps> = ({
  data,
  onOpenLedger: _onOpenLedger,
  className = '',
}) => {
  const nutrition = data || fasalMasterData.nutrition;
  const [selectedSection, setSelectedSection] = useState<SectionTab>('all');

  return (
    <div className={`space-y-8 animate-fade-in ${className}`} id="nutrition-food-security-module">
      {/* 1. Thematic Hero Header */}
      <section className="p-6 sm:p-8 rounded-xl bg-surface border border-border-subtle shadow-card space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-growth/10 border border-accent-growth/20 text-accent-growth text-xs font-mono font-bold uppercase tracking-wider">
            <Apple className="w-4 h-4" />
            <span>Pillar IV: Nutrition Security & Dietary Diversity</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <EvidenceBadge metricId="REC-NUTR-01" variant="card" label="60-Month Recall Series" />
            <EvidenceBadge metricId="REC-NUTR-02" variant="card" label="Summer Peak: 68.9%" />
            <EvidenceBadge metricId="REC-NUTR-04" variant="card" label="Pulses: +23.8 pp" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-content-primary">
            60-Month Continuous Dietary Recall, Hunger Gap Inversion & Poshan Vatikas
          </h2>
          <p className="text-sm sm:text-base text-content-secondary leading-relaxed max-w-4xl">
            A monumental analytical achievement combining Wave 1 and Wave 2 is the construction of an unbroken, 60-month monthly dietary recall series across 1,535 marginalized households in the Katarniaghat buffer. Empirical analysis disproved the regional "summer hunger gap" myth by showing May/June is the peak of green vegetable intake (67%–70%), while winter cold snaps cause the true dietary trough (31.4%), successfully remediated to 42.8% (+11.4 pp) by 1,120+ homestead Poshan Vatikas. Regular weekly pulse consumption expanded from 42.6% to 66.4% (+23.8 pp) via the mandatory 50 kg household pulse retention protocol.
          </p>
        </div>

        {/* Executive Sub-Navigation Bar */}
        <div className="pt-2 border-t border-border-subtle flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedSection('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === 'all'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            All Sections
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('recall_trajectory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === 'recall_trajectory'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            60-Month Recall Series (F16)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('hunger_inversion')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === 'hunger_inversion'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            Hunger Gap Inversion (F17)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('protein_reversal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === 'protein_reversal'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            Protein Deficit Reversal (F18)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('poshan_vatikas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === 'poshan_vatikas'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            Poshan Vatikas (F19)
          </button>
        </div>
      </section>

      {/* 2. Executive Headline KPI Ribbon */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: 60 Continuous Months */}
        <div className="p-4 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Continuous Recall Window</span>
            <EvidenceBadge metricId="REC-NUTR-01" variant="subtle" />
          </div>
          <div className="text-2xl font-mono font-bold text-content-primary tabular-nums">
            60 Months
          </div>
          <p className="text-[11px] text-content-secondary font-mono">
            Wave 1 (36m) + Wave 2 (24m) unbroken
          </p>
        </div>

        {/* KPI 2: Summer Green Peak */}
        <div className="p-4 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Summer Green Food Peak</span>
            <EvidenceBadge metricId="REC-NUTR-02" variant="subtle" />
          </div>
          <div className="text-2xl font-mono font-bold text-accent-growth tabular-nums">
            68.9% – 69.8%
          </div>
          <p className="text-[11px] text-accent-growth font-mono">
            May/Jun peak inverts starvation myth
          </p>
        </div>

        {/* KPI 3: Weekly Pulse Consumption Expansion */}
        <div className="p-4 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Weekly Pulse Intake</span>
            <EvidenceBadge metricId="REC-NUTR-04" variant="subtle" />
          </div>
          <div className="text-2xl font-mono font-bold text-accent-harvest tabular-nums">
            42.6% ➔ 66.4%
          </div>
          <p className="text-[11px] text-accent-harvest font-mono">
            +23.8 pp net gain (+55.9% relative)
          </p>
        </div>

        {/* KPI 4: Active Poshan Vatikas */}
        <div className="p-4 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span>Functional Kitchen Gardens</span>
            <EvidenceBadge metricId="REC-NUTR-03" variant="subtle" />
          </div>
          <div className="text-2xl font-mono font-bold text-accent-growth tabular-nums">
            1,120 Gardens
          </div>
          <p className="text-[11px] text-content-secondary font-mono">
            73.0% saturation (5.6× expansion)
          </p>
        </div>
      </section>

      {/* 3. Section F16: 60-Month Longitudinal Dietary Recall Time-Series */}
      {(selectedSection === 'all' || selectedSection === 'recall_trajectory') && (
        <DietaryRecallChart data={nutrition} />
      )}

      {/* 4. Sections F17 & F18: 2-Column Responsive Comparison Grid */}
      {(selectedSection === 'all' || selectedSection === 'hunger_inversion' || selectedSection === 'protein_reversal') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(selectedSection === 'all' || selectedSection === 'hunger_inversion') && (
            <HungerGapInversionCard data={nutrition} />
          )}
          {(selectedSection === 'all' || selectedSection === 'protein_reversal') && (
            <ProteinDeficitCard data={nutrition} />
          )}
        </div>
      )}

      {/* 5. Section F19: Poshan Vatikas (Homestead Bio-Diverse Nutrition Gardens) */}
      {(selectedSection === 'all' || selectedSection === 'poshan_vatikas') && (
        <PoshanVatikaCard data={nutrition} />
      )}
    </div>
  );
};

export default NutritionModule;
