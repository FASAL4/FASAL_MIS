import React, { useState } from 'react';
import { fasalMasterData } from '../../data/fasalMasterData';
import type { IncomeSecurityData } from '../../types/dashboard';
import { LongitudinalIncomeChart } from './LongitudinalIncomeChart';
import { MacroEconomyCard } from './MacroEconomyCard';
import { TurmericValueChainCard } from './TurmericValueChainCard';
import { CropEconomicsTable } from './CropEconomicsTable';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import {
  TrendingUp,
} from 'lucide-react';

export interface IncomeModuleProps {
  data?: IncomeSecurityData;
  onOpenLedger?: (metricId?: string) => void;
  className?: string;
}

type SectionTab = 'all' | 'trajectory' | 'macro' | 'turmeric' | 'crop_explorer';

export const IncomeModule: React.FC<IncomeModuleProps> = ({
  data,
  onOpenLedger,
  className = '',
}) => {
  const incomeData = data || fasalMasterData.income;
  const [selectedSection, setSelectedSection] = useState<SectionTab>('all');

  const {
    macroFinancials,
    longitudinalTrajectory,
    longitudinalGrowth,
    casteEconomics,
    turmericValueChain,
    cropLedger,
  } = incomeData;

  return (
    <div className={`space-y-8 animate-fade-in ${className}`} id="income-security-module">
      {/* 1. Thematic Hero Header */}
      <section className="p-6 sm:p-8 rounded-xl bg-surface border border-border-subtle shadow-card space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-growth/10 border border-accent-growth/20 text-accent-growth text-xs font-mono font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Pillar I: Agrarian Economics & Income Security</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <EvidenceBadge metricId="REC-ECON-12" variant="card" label="2026 Endline: ₹63,918" />
            <EvidenceBadge metricId="METRIC-INC-001" variant="card" label="Net Surplus: ₹9.50 Cr" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-content-primary">
            Agrarian Surplus, Pro-Poor Growth & Commercial Crop Enterprises
          </h2>
          <p className="text-sm sm:text-base text-content-secondary leading-relaxed max-w-4xl">
            Over the 5-year intervention span (2022 to 2026), 1,487 genuine cultivating smallholders in the fragile Katarniaghat Wildlife Sanctuary buffer transitioned from debt-laden chemical monocultures to low-cost LEISA bio-inputs and wildlife-immune commercial spice enterprises. Net farm income advanced from ₹34,555 to ₹63,918 (+84.97% mean gain) and median net income surged by +142.73% (from ₹22,000 to ₹53,400), proving structural pro-poor income redistribution.
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
            onClick={() => setSelectedSection('trajectory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === 'trajectory'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            Longitudinal Trajectory (F06)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('macro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === 'macro'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            Macro Economy & Caste (F07)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('turmeric')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === 'turmeric'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            Flagship Turmeric (F08)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('crop_explorer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === 'crop_explorer'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            42-Crop Explorer (F09)
          </button>
        </div>
      </section>

      {/* 2. Feature F06: Longitudinal Net Farm Income Trajectory */}
      {(selectedSection === 'all' || selectedSection === 'trajectory') && (
        <section id="section-trajectory">
          <LongitudinalIncomeChart
            trajectory={longitudinalTrajectory}
            growth={longitudinalGrowth}
          />
        </section>
      )}

      {/* 3. Feature F07: Macro Balance Sheet & Caste Equity */}
      {(selectedSection === 'all' || selectedSection === 'macro') && (
        <section id="section-macro">
          <MacroEconomyCard
            macroFinancials={macroFinancials}
            casteEconomics={casteEconomics}
            onViewSliceProof={() => onOpenLedger?.('REC-HYG-01')}
          />
        </section>
      )}

      {/* 4. Feature F08: Turmeric Commercial Value Chain */}
      {(selectedSection === 'all' || selectedSection === 'turmeric') && (
        <section id="section-turmeric">
          <TurmericValueChainCard turmeric={turmericValueChain} />
        </section>
      )}

      {/* 5. Feature F09: 42-Crop Economics Explorer */}
      {(selectedSection === 'all' || selectedSection === 'crop_explorer') && (
        <section id="section-crops">
          <CropEconomicsTable crops={cropLedger} />
        </section>
      )}
    </div>
  );
};
