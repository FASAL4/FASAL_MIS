import React, { useState, useEffect } from 'react';
import {
  FileSearch,
  Lock,
} from 'lucide-react';
import { fasalMasterData, getAllEvidenceMetrics } from '../../data/fasalMasterData';
import { AuditMatrixCard } from './AuditMatrixCard';
import { SliceIdentityProofCard } from './SliceIdentityProofCard';
import { DebunkedMythRegistry } from './DebunkedMythRegistry';
import { ReconciliationLedgerTable } from './ReconciliationLedgerTable';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import type { ForensicLedgerData } from '../../types/dashboard';
import type { MetricProvenance } from '../../types/evidence';

export interface ForensicModuleProps {
  data?: ForensicLedgerData;
  evidenceItems?: MetricProvenance[];
  highlightedMetricId?: string;
  onOpenLedger?: (metricId?: string) => void;
  className?: string;
}

export type ForensicSubSection =
  | 'all'
  | 'audit_matrix'
  | 'slice_identity'
  | 'debunked_myths'
  | 'ledger_browser'
  | 'pii_governance';

export const ForensicModule: React.FC<ForensicModuleProps> = ({
  data,
  evidenceItems,
  highlightedMetricId,
  onOpenLedger: _onOpenLedger,
  className = '',
}) => {
  const forensicData = data || fasalMasterData.forensic;
  const metrics = evidenceItems || getAllEvidenceMetrics();
  const [activeSection, setActiveSection] = useState<ForensicSubSection>('all');

  // If highlightedMetricId is provided, jump directly to the ledger browser or all
  useEffect(() => {
    if (highlightedMetricId) {
      setActiveSection('ledger_browser');
    }
  }, [highlightedMetricId]);

  const { auditOverview, piiRedactionStatus } = forensicData;

  return (
    <div className={`space-y-8 animate-fade-in ${className}`} id="forensic-reconciliation-module">
      {/* 1. Thematic Hero Header */}
      <section className="p-6 sm:p-8 rounded-xl bg-surface border border-border-subtle shadow-card space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-stress/10 border border-accent-stress/20 text-accent-stress text-xs font-mono font-bold uppercase tracking-wider">
            <FileSearch className="w-4 h-4" />
            <span>Pillar V: Forensic Audit & Methodological Integrity</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <EvidenceBadge metricId="REC-LEV-01" variant="card" label="7/7 Systemic Checks" />
            <EvidenceBadge metricId="REC-ECON-04" variant="card" label="₹0.00 Slice Variance" />
            <EvidenceBadge metricId="REC-PII-01" variant="card" label="0 PII Violations" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-content-primary">
            Forensic Data Lineage, Systematic Remediation & Master Reconciliation Ledger
          </h2>
          <p className="text-sm sm:text-base text-content-secondary leading-relaxed max-w-4xl">
            This module represents the empirical bedrock of the FASAL archive. To guarantee publication-grade integrity for APPI grant stakeholders and independent academic auditors, all 490 historical claims were forensically reviewed, 7 systemic defects (SYS-1 through SYS-7) were neutralized, the Row 1492 double-counting trap was mathematically eliminated with ₹0.00 slice identity variance, and three prominent development myths were demystified.
          </p>
        </div>

        {/* Executive Sub-Navigation Bar */}
        <div className="pt-2 border-t border-border-subtle flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'all'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            All Sections
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('audit_matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'audit_matrix'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            Audit Matrix (SYS-1 to 7)
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('slice_identity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'slice_identity'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            Slice Identity Proof (₹0.00)
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('debunked_myths')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'debunked_myths'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            Debunked Myths
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('ledger_browser')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'ledger_browser'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            Master Evidence Ledger (120 Items)
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('pii_governance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'pii_governance'
                ? 'bg-content-primary text-base font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            PII & Research Governance
          </button>
        </div>
      </section>

      {/* 2. Executive Headline KPI Ribbon */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Audited Claims</span>
          <div className="text-2xl font-mono font-bold text-content-primary tabular-nums">
            {auditOverview.totalAuditedClaims} Claims
          </div>
          <p className="text-[11px] text-accent-growth font-mono">100% Remediated</p>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Systemic Checks</span>
          <div className="text-2xl font-mono font-bold text-accent-growth tabular-nums">
            7 / 7 Neutralized
          </div>
          <p className="text-[11px] text-accent-growth font-mono">SYS-1 through SYS-7</p>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Slice Variance</span>
          <div className="text-2xl font-mono font-bold text-accent-growth tabular-nums">
            ₹0.00
          </div>
          <p className="text-[11px] text-content-muted font-mono">Row 1492 vs Rows 4:1490</p>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Debunked Myths</span>
          <div className="text-2xl font-mono font-bold text-accent-harvest tabular-nums">
            3 Dismantled
          </div>
          <p className="text-[11px] text-content-muted font-mono">Agniastra, ₹11.7Cr, Hunger</p>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">PII Redaction</span>
          <div className="text-2xl font-mono font-bold text-content-primary tabular-nums">
            0 Violations
          </div>
          <p className="text-[11px] text-accent-growth font-mono">Zero phone number leaks</p>
        </div>
      </section>

      {/* 3. Section F21.1: Audit Matrix Card (SYS-1 to SYS-7) */}
      {(activeSection === 'all' || activeSection === 'audit_matrix') && (
        <section id="section-audit-matrix">
          <AuditMatrixCard defects={forensicData.systemicDefects} />
        </section>
      )}

      {/* 4. Section F21.2: Slice Identity Proof Card */}
      {(activeSection === 'all' || activeSection === 'slice_identity') && (
        <section id="section-slice-identity">
          <SliceIdentityProofCard sliceProof={forensicData.sliceIdentityProof} />
        </section>
      )}

      {/* 5. Section F21.3: Debunked Myth Registry */}
      {(activeSection === 'all' || activeSection === 'debunked_myths') && (
        <section id="section-debunked-myths">
          <DebunkedMythRegistry myths={forensicData.debunkedMyths} />
        </section>
      )}

      {/* 6. Section F21.4: Master Reconciliation Ledger Table */}
      {(activeSection === 'all' || activeSection === 'ledger_browser') && (
        <section id="section-ledger-browser">
          <ReconciliationLedgerTable
            ledgerItems={metrics}
            highlightedMetricId={highlightedMetricId}
          />
        </section>
      )}

      {/* 7. Section F21.5: PII & Research Governance */}
      {(activeSection === 'all' || activeSection === 'pii_governance') && (
        <section id="section-pii-governance">
          <div className="p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent-growth" />
                <h4 className="text-base font-serif font-bold text-content-primary">
                  Four-Tier PII Redaction & Research Data Governance Compliance
                </h4>
              </div>
              <EvidenceBadge metricId="REC-PII-01" variant="card" label="Scrubbed Zero Leaks" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-lg bg-elevated/40 border border-border-subtle space-y-1">
                <span className="text-content-muted block text-[11px]">Phone Numbers Found</span>
                <span className="text-xl font-bold text-accent-growth tabular-nums">{piiRedactionStatus.phoneNumbersFoundCount} Leaks</span>
                <p className="text-[11px] text-content-muted font-sans">
                  Regex assertion <code>\b[6-9]\d&#123;9&#125;\b</code> confirmed zero 10-digit mobile numbers in compiled deliverables.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-elevated/40 border border-border-subtle space-y-1">
                <span className="text-content-muted block text-[11px]">Beneficiary Name Masking</span>
                <span className="text-xl font-bold text-content-primary">Synthetic IDs</span>
                <p className="text-[11px] text-content-muted font-sans">
                  {piiRedactionStatus.namesAnonymizationPolicy}: preserving relational linkages without personal identification.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-elevated/40 border border-border-subtle space-y-1">
                <span className="text-content-muted block text-[11px]">Family Member Tokenization</span>
                <span className="text-xl font-bold text-content-primary">Roster Tokens</span>
                <p className="text-[11px] text-content-muted font-sans">
                  Tokenized as <code>{piiRedactionStatus.childRosterTokenization}</code> to maintain demographic composition while protecting minor children.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-elevated/40 border border-border-subtle space-y-1">
                <span className="text-content-muted block text-[11px]">Geographic Integrity</span>
                <span className="text-xl font-bold text-accent-growth">{piiRedactionStatus.geographyIntegrityPreserved ? 'Fully Preserved' : 'Modified'}</span>
                <p className="text-[11px] text-content-muted font-sans">
                  All 7 Gram Panchayats and 19 villages maintained intact for spatial and environmental buffer zone research.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ForensicModule;
