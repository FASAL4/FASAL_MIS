import React, { useState } from 'react';
import { fasalMasterData } from '../../data/fasalMasterData';
import type { RFProgressionData } from '../../types/dashboard';
import { AppiBenchmarkCard } from './AppiBenchmarkCard';
import { BighaSensitivityMatrix } from './BighaSensitivityMatrix';
import { LeisaTransitionTimeline } from './LeisaTransitionTimeline';
import { MachanTrellisCard } from './MachanTrellisCard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { Sprout } from 'lucide-react';

export interface RFProgressionModuleProps {
  data?: RFProgressionData;
  onOpenLedger?: (metricId?: string) => void;
  className?: string;
}

type SectionTab = 'all' | 'appi_benchmark' | 'bigha_matrix' | 'leisa_transition' | 'machan_trellis';

export const RFProgressionModule: React.FC<RFProgressionModuleProps> = ({
  data,
  onOpenLedger: _onOpenLedger,
  className = '',
}) => {
  const rfData = data || fasalMasterData.rfProgression;
  const [selectedMultiplier, setSelectedMultiplier] = useState<number>(0.20);
  const [selectedSection, setSelectedSection] = useState<SectionTab>('all');

  const {
    benchmarks,
    landholdingStructure,
    bighaSensitivity,
    leisaTransition,
  } = rfData;

  return (
    <div className={`space-y-8 animate-fade-in ${className}`} id="rf-progression-module">
      {/* 1. Thematic Hero Header */}
      <section className="p-6 sm:p-8 rounded-xl bg-surface border border-border-subtle shadow-card space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-growth/10 border border-accent-growth/20 text-accent-growth text-xs font-mono font-bold uppercase tracking-wider">
            <Sprout className="w-4 h-4" />
            <span>Pillar II: Results Framework & Agronomic Transition</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <EvidenceBadge metricId="REC-LAND-02" variant="card" label="0.20 Factor Baseline" />
            <EvidenceBadge metricId="REC-ECON-12" variant="card" label="₹90,799 / acre" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-content-primary">
            APPI Benchmark Attainment, Bigha Sensitivity & LEISA Intensification
          </h2>
          <p className="text-sm sm:text-base text-content-secondary leading-relaxed max-w-4xl">
            Proving that smallholders operating micro-parcels in fragile buffer zones can achieve commercial viability and ecological sustainability simultaneously. At the authoritative 0.20 acre/bigha standard, <strong>76.8% of active landholders exceeded the ₹60,000/acre threshold</strong>, supported by 1,120+ bio-drums, closed-loop biological inputs, and 777+ multi-tier bamboo Machan trellises delivering a Land Equivalent Ratio (LER) of 2.1.
          </p>
        </div>

        {/* Executive Sub-Navigation Bar */}
        <div className="pt-2 border-t border-border-subtle flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedSection('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${selectedSection === 'all'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
              }`}
          >
            All Sections
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('appi_benchmark')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${selectedSection === 'appi_benchmark'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
              }`}
          >
            APPI Benchmark (F10)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('bigha_matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${selectedSection === 'bigha_matrix'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
              }`}
          >
            Bigha Sensitivity Matrix (F11)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('leisa_transition')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${selectedSection === 'leisa_transition'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
              }`}
          >
            LEISA PoP Transition (F12)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('machan_trellis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${selectedSection === 'machan_trellis'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
              }`}
          >
            Machan Trellises & LER (F12)
          </button>
        </div>
      </section>

      {/* 2. Feature F10: APPI Benchmark Attainment & Landholding Structure */}
      {(selectedSection === 'all' || selectedSection === 'appi_benchmark') && (
        <section id="section-benchmark">
          <AppiBenchmarkCard
            benchmarks={benchmarks}
            landStructure={landholdingStructure}
            activeFactorMultiplier={selectedMultiplier}
          />
        </section>
      )}

      {/* 3. Feature F11: Regional Bigha Sensitivity Matrix & SYS-4 Proof */}
      {(selectedSection === 'all' || selectedSection === 'bigha_matrix') && (
        <section id="section-bigha">
          <BighaSensitivityMatrix
            sensitivityItems={bighaSensitivity}
            totalParsedBigha={landholdingStructure.regexParsedTotalBigha}
            aggregateNetProfitINR={95045999}
            selectedMultiplier={selectedMultiplier}
            onSelectMultiplier={(m) => setSelectedMultiplier(m)}
            showRemediationCallout={true}
          />
        </section>
      )}

      {/* 4. Feature F12: LEISA Agro-Ecological Transition */}
      {(selectedSection === 'all' || selectedSection === 'leisa_transition') && (
        <section id="section-leisa">
          <LeisaTransitionTimeline leisaData={leisaTransition} />
        </section>
      )}

      {/* 5. Feature F12: Multi-Tier Bamboo Machan Trellises */}
      {(selectedSection === 'all' || selectedSection === 'machan_trellis') && (
        <section id="section-machan">
          <MachanTrellisCard
            machanFarmsCount={leisaTransition.machanTrellisFarmsCount}
            lerRatio={leisaTransition.lerLandEquivalentRatio}
            physicalYields={leisaTransition.physicalYields}
          />
        </section>
      )}
    </div>
  );
};
