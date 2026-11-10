import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ViewModeProvider, useViewMode } from './context/ViewModeContext';
import { FilterProvider } from './context/FilterContext';
import { EvidenceProvider } from './context/EvidenceContext';
import { Header } from './components/layout/Header';
import { GlobalFilterBar } from './components/filters/GlobalFilterBar';
import { ExecutiveSummaryBar } from './components/layout/ExecutiveSummaryBar';
import { ThematicNavigation, type ThematicTab } from './components/layout/ThematicNavigation';
import { Footer } from './components/layout/Footer';
import { EvidenceDrawer } from './components/evidence/EvidenceDrawer';
import { EvidenceBadge } from './components/evidence/EvidenceBadge';
import { fasalMasterData } from './data/fasalMasterData';
import { IncomeModule } from './modules/income/IncomeModule';
import { RFProgressionModule } from './modules/rf/RFProgressionModule';
import { RightsModule } from './modules/rights';
import { NutritionModule } from './modules/nutrition';
import { ForensicModule } from './modules/forensic';
import { SocialInclusionCard } from './modules/demographics';
import { ExecutivePresentationModule } from './modules/executive/ExecutivePresentationModule';
import { MapPin } from 'lucide-react';

const PrintHeaderBanner: React.FC = () => (
  <div className="print-only print-header-banner" style={{ display: 'none' }}>
    <div className="print-header-meta">
      <span>DEHAT INDIA • APPI GRANT REF: G-2110-10970 (₹2.16 CR)</span>
      <span>FASAL (2021–2026) • 103/103 AUDITED CLAIMS VERIFIED</span>
    </div>
    <h1 className="print-header-title">
      Longitudinal Agrarian Transformation: Executive Donor Brief
    </h1>
    <p className="print-header-subtitle">
      Katarniaghat Wildlife Sanctuary Buffer, Mihinpurwa Block, Bahraich, Uttar Pradesh | N = 1,535 Households (1,487 Active Cultivators; 6,494 Resident Individuals)
    </p>
  </div>
);

const PrintFooterBanner: React.FC = () => (
  <div className="print-only print-footer-banner" style={{ display: 'none' }}>
    <span>
      Data Source: FDB Master Survey 2026 & FASAL Reconciliation Ledger. 100% Programmatic Assertions Passed.
    </span>
    <span>
      Confidential Donor Brief — APPI Grant Ref: G-2110-10970 — Printed: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
    </span>
  </div>
);

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ThematicTab>('overview');
  const [highlightedMetricId, setHighlightedMetricId] = useState<string | undefined>(undefined);
  const { isExecutive, setViewMode } = useViewMode();

  const handleOpenLedger = (metricId?: string) => {
    setViewMode('research');
    setActiveTab('forensic');
    if (metricId) {
      setHighlightedMetricId(metricId);
    }
  };

  const handleNavigateTab = (tab: ThematicTab) => {
    setViewMode('research');
    setActiveTab(tab);
  };

  const { overview, income, rfProgression, rights, nutrition, forensic } = fasalMasterData;

  return (
    <div className="min-h-screen bg-base text-content-primary font-sans antialiased selection:bg-accent-harvest/20 selection:text-content-primary transition-colors duration-200 flex flex-col justify-between">
      <div>
        <PrintHeaderBanner />

        {/* 1. Global Executive Header with Segmented Audience Toggle */}
        <Header onOpenLedger={() => handleOpenLedger()} />

        {/* 2. Global Interactive Filter Engine */}
        <GlobalFilterBar />

        {/* 3. Conditional Presentation Mode Rendering */}
        {isExecutive ? (
          <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ExecutivePresentationModule 
              onOpenLedger={handleOpenLedger}
              onNavigateTab={handleNavigateTab}
            />
          </main>
        ) : (
          <>
            {/* 3a. Executive Headline KPI Ribbon (with micro-evidence badges) */}
            <ExecutiveSummaryBar />

            {/* 3b. Thematic Tab Navigation across 6 empirical pillars */}
            <ThematicNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            {/* 3c. Empirical Research Workbench Panels */}
            <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <section
                id={`tabpanel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
                className="space-y-6"
              >
                {/* ============================================================ */}
                {/* TAB 0: EXECUTIVE & DONOR OVERVIEW                             */}
                {/* ============================================================ */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Grant Header & Synthesis Narrative */}
                    <div className="p-6 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-harvest">
                          Grant Governance & Operational Census
                        </span>
                        <EvidenceBadge metricId="REC-ADM-01" variant="card" label="N=1,535 Submissions" />
                      </div>
                      <h2 className="text-2xl font-serif font-bold text-content-primary">
                        Catalytic Agrarian Transformation in the Katarniaghat Wildlife Sanctuary Buffer
                      </h2>
                      <p className="text-sm text-content-secondary leading-relaxed max-w-4xl">
                        Funded by the <strong>Azim Premji Philanthropic Initiatives (APPI Grant Ref: G-2110-10970, ₹2.16 Crore)</strong> and implemented by <strong>DEHAT India</strong> (Nov 2021 – Dec 2026), the FASAL program organizes 1,535 marginalized households (1,487 active cultivating farmers; 6,494 resident individuals) across 7 Gram Panchayats in Mihinpurwa Block, Bahraich District, Uttar Pradesh.
                      </p>
                    </div>

                    {/* Operational Census: Geography */}
                    <div className="p-5 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-base font-serif font-bold text-content-primary flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent-harvest" />
                          Geographic Distribution across 7 Gram Panchayats & 19 Hamlets
                        </h3>
                        <EvidenceBadge metricId="REC-GEO-01" variant="card" label="7 Gram Panchayats" />
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                          <thead>
                            <tr className="border-b border-border-strong text-content-muted">
                              <th className="pb-2">Gram Panchayat</th>
                              <th className="pb-2 text-right">Households</th>
                              <th className="pb-2 text-right">Share (%)</th>
                              <th className="pb-2 text-right">Hamlets</th>
                              <th className="pb-2 pl-4">Landscape Characteristics</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-subtle/60">
                            {overview.geographicDistribution.map((gp) => (
                              <tr key={gp.gpName} className="hover:bg-elevated/40 transition-colors">
                                <td className="py-2.5 font-sans font-medium text-content-primary">{gp.gpName}</td>
                                <td className="py-2.5 text-right font-bold tabular-nums">{gp.households}</td>
                                <td className="py-2.5 text-right tabular-nums">{gp.percentage.toFixed(1)}%</td>
                                <td className="py-2.5 text-right text-content-muted tabular-nums">{gp.hamletsCount}</td>
                                <td className="py-2.5 pl-4 font-sans text-content-secondary text-[11px]">{gp.primaryCharacteristics}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Demographics & Social Inclusion Console (Feature F20) */}
                    <SocialInclusionCard
                      casteData={overview.casteDemographics}
                      collectivizationData={overview.collectivization}
                      headlineKPIs={overview.headlineKPIs}
                      onOpenLedger={handleOpenLedger}
                    />
                  </div>
                )}

                {/* ============================================================ */}
                {/* TAB 1: PILLAR I: INCOME SECURITY & CROP ECONOMICS            */}
                {/* ============================================================ */}
                {activeTab === 'income' && (
                  <IncomeModule
                    data={income}
                    onOpenLedger={handleOpenLedger}
                  />
                )}

                {/* ============================================================ */}
                {/* TAB 2: PILLAR II: RF & LEISA PROGRESSION                     */}
                {activeTab === 'rf' && (
                  <RFProgressionModule
                    data={rfProgression}
                    onOpenLedger={handleOpenLedger}
                  />
                )}

                {/* ============================================================ */}
                {/* TAB 3: PILLAR III: RIGHTS & PUBLIC LEVERAGE                  */}
                {/* ============================================================ */}
                {activeTab === 'rights' && (
                  <RightsModule
                    data={rights}
                    onOpenLedger={handleOpenLedger}
                  />
                )}

                {/* ============================================================ */}
                {/* TAB 4: PILLAR IV: NUTRITION & EQUITY                         */}
                {/* ============================================================ */}
                {activeTab === 'nutrition' && (
                  <NutritionModule
                    data={nutrition}
                    onOpenLedger={handleOpenLedger}
                  />
                )}

                {/* ============================================================ */}
                {/* TAB 5: FORENSIC AUDIT LEDGER & VERIFICATION RUNNER           */}
                {/* ============================================================ */}
                {activeTab === 'forensic' && (
                  <ForensicModule
                    data={forensic}
                    highlightedMetricId={highlightedMetricId}
                    onOpenLedger={handleOpenLedger}
                  />
                )}
              </section>
            </main>
          </>
        )}
      </div>

      {/* 4. Docked Audit Footer */}
      <Footer />

      {/* 5. Micro-Evidence Drawer Component */}
      <EvidenceDrawer onNavigateToLedger={handleOpenLedger} />

      <PrintFooterBanner />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ViewModeProvider>
        <FilterProvider>
          <EvidenceProvider>
            <AppContent />
          </EvidenceProvider>
        </FilterProvider>
      </ViewModeProvider>
    </ThemeProvider>
  );
};

export default App;
