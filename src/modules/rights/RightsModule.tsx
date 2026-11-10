import React, { useState } from 'react';
import { fasalMasterData } from '../../data/fasalMasterData';
import type { RightsEntitlementsData } from '../../types/dashboard';
import { SchemeFunnelCard } from './SchemeFunnelCard';
import { EssentialServicesCard } from './EssentialServicesCard';
import { PublicLeverageCard } from './PublicLeverageCard';
import { JanSuvidhaKendraCard } from './JanSuvidhaKendraCard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import {
  Scale,
} from 'lucide-react';

export interface RightsModuleProps {
  data?: RightsEntitlementsData;
  onOpenLedger?: (metricId?: string) => void;
  className?: string;
}

type SectionTab = 'all' | 'delivery_funnel' | 'essential_services' | 'public_leverage' | 'jsk_services';

export const RightsModule: React.FC<RightsModuleProps> = ({
  data,
  onOpenLedger: _onOpenLedger,
  className = '',
}) => {
  const rightsData = data || fasalMasterData.rights;
  const [selectedSection, setSelectedSection] = useState<SectionTab>('all');

  const {
    longitudinalRounds,
    stableFrontlineServices,
    publicLeverage,
    janSuvidhaKendra,
  } = rightsData;

  return (
    <div className={`space-y-8 animate-fade-in ${className}`} id="rights-entitlements-module">
      {/* 1. Thematic Hero Header */}
      <section className="p-6 sm:p-8 rounded-xl bg-surface border border-border-subtle shadow-card space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-evidence/10 border border-accent-evidence/20 text-accent-evidence text-xs font-mono font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Pillar III: Civic Rights, Entitlements & Public Leverage</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <EvidenceBadge metricId="REC-LEV-01" variant="card" label="₹7.71 Cr Verified Leverage" />
            <EvidenceBadge metricId="REC-RNE-01" variant="card" label="77 Schemes Tracked" />
            <EvidenceBadge metricId="REC-INST-01" variant="card" label="4,826 AAS Union Members" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-content-primary">
            Democratic Leadership, 4-Round Scheme Delivery & ₹7.71 Crore Verified Public Leverage
          </h2>
          <p className="text-sm sm:text-base text-content-secondary leading-relaxed max-w-4xl">
            Underpinned by the operational doctrine <strong>"Jiska Mudda Uski Agwai"</strong> (Whose issue it is, theirs is the leadership), FASAL organized 1,535 marginalized households into an autonomous democratic federation (Ajeevika Adhikar Sangathan). Tracking 77 public welfare schemes over four sequential operational rounds (2025–2026), the collective mobilized <strong>₹7,70,98,360 (~₹7.71 Crore)</strong> in verified public infrastructure across <strong>577 genuine civil projects</strong>, achieving an exceptional <strong>3.57× catalytic multiplier</strong> against the ₹2.16 Crore APPI grant commitment.
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
            onClick={() => setSelectedSection('delivery_funnel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === 'delivery_funnel'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            4-Round Delivery Funnel (F13)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('essential_services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === 'essential_services'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            Essential Services Stability (F14)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('public_leverage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === 'public_leverage'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            Verified Public Leverage & Purge Audit (F15)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('jsk_services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === 'jsk_services'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            Jan Suvidha Kendra MIS
          </button>
        </div>
      </section>

      {/* 2. Feature F13: Rights & Entitlements 4-Round Delivery Funnel */}
      {(selectedSection === 'all' || selectedSection === 'delivery_funnel') && (
        <section id="section-scheme-funnel">
          <SchemeFunnelCard schemes={longitudinalRounds} />
        </section>
      )}

      {/* 3. Feature F14: Essential Services Stability Rates */}
      {(selectedSection === 'all' || selectedSection === 'essential_services') && (
        <section id="section-essential-services">
          <EssentialServicesCard
            services={stableFrontlineServices}
            schemes={longitudinalRounds}
          />
        </section>
      )}

      {/* 4. Feature F15: Verified Public Leverage Breakdown & Forensic Purge */}
      {(selectedSection === 'all' || selectedSection === 'public_leverage') && (
        <section id="section-public-leverage">
          <PublicLeverageCard leverage={publicLeverage} />
        </section>
      )}

      {/* 5. Frontline Kiosk Intermediation: Jan Suvidha Kendra MIS */}
      {(selectedSection === 'all' || selectedSection === 'jsk_services') && (
        <section id="section-jsk-mis">
          <JanSuvidhaKendraCard jsk={janSuvidhaKendra} />
        </section>
      )}
    </div>
  );
};

export default RightsModule;
