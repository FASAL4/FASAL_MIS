import React, { useState } from 'react';
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { fasalMasterData } from '../../data/fasalMasterData';
import type { SystemicDefectItem } from '../../types/dashboard';

export interface AuditMatrixCardProps {
  defects?: SystemicDefectItem[];
  onOpenEvidence?: (metricId?: string) => void;
  className?: string;
}

export const AuditMatrixCard: React.FC<AuditMatrixCardProps> = ({
  defects,
  onOpenEvidence: _onOpenEvidence,
  className = '',
}) => {
  const [expandedDefects, setExpandedDefects] = useState<Record<string, boolean>>({
    'SYS-7': true, // Keep SYS-7 (₹11.70 Cr leverage) expanded by default as primary showcase
    'SYS-4': false,
  });

  const defectList = defects || fasalMasterData.forensic.systemicDefects;

  const toggleExpand = (defectId: string) => {
    setExpandedDefects((prev) => ({
      ...prev,
      [defectId]: !prev[defectId],
    }));
  };

  // Detailed forensic metadata mapped to each SYS check
  const defectDetails: Record<string, { category: string; testModule: string; evidenceId: string; coordinates: string }> = {
    'SYS-1': {
      category: 'Data Pipeline & Column Structure',
      testModule: 'Module 1: Data Pipeline Overwrite Integrity',
      evidenceId: 'REC-HYG-01',
      coordinates: 'FDB - year 4&5 questionnaire (3,291 cols restored)',
    },
    'SYS-2': {
      category: 'Agronomic Accounting & Yield Economics',
      testModule: 'Module 3: 2022 Paddy Net Income Sign Reversal',
      evidenceId: 'REC-HYG-02',
      coordinates: 'Raw Data Year 1-3!Paddy Columns (Surplus: +₹1,58,40,719.00)',
    },
    'SYS-3': {
      category: 'Longitudinal Econometrics',
      testModule: 'Module 7: Longitudinal Income Progression Tracking',
      evidenceId: 'REC-HYG-03',
      coordinates: 'Year 1-3 RAW ₹34,555 ➔ 2026 Endline ₹63,918 (+84.97% mean)',
    },
    'SYS-4': {
      category: 'Measurement Standards & Unit Factors',
      testModule: 'Module 9: Regional Bigha Conversion Sensitivity Matrix',
      evidenceId: 'REC-HYG-04',
      coordinates: '0.20 Acre/Bigha Authoritative Standard (5 bigha = 1 acre)',
    },
    'SYS-5': {
      category: 'Survey Design & Cohort Semantics',
      testModule: 'Module 2: Survey Administration & Attrition Accounting',
      evidenceId: 'REC-RES-02',
      coordinates: 'Wave 1 (N=1,329) & Wave 2 (N=1,535) Retrospective Cohorts',
    },
    'SYS-6': {
      category: 'Table Integrity & Relational Merges',
      testModule: 'Module 10: Multi-Wave Relational Merge Integrity',
      evidenceId: 'REC-DEMO-01',
      coordinates: 'Unique per-household cryptographic ID (_id / _uuid) matching',
    },
    'SYS-7': {
      category: 'Public Leverage & Convergence Valuation',
      testModule: 'Module 11: Document Consistency & Forensic Integrity',
      evidenceId: 'REC-LEV-01',
      coordinates: 'Levrage Registers 2023-2025 (₹7,70,98,360 / 577 projects)',
    },
  };

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`} id="audit-matrix-card">
      {/* 1. Header & Remediation Metric Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-stress/10 text-accent-stress border border-accent-stress/20">
              Feature F21: Adversarial Audit Matrix
            </span>
            <EvidenceBadge metricId="REC-LEV-01" variant="card" label="7/7 Defects Neutralized" />
            <EvidenceBadge metricId="REC-HYG-01" variant="subtle" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            The Seven Audited & Neutralized Systemic Defects (SYS-1 to SYS-7)
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            A comprehensive catalog of historical reporting distortions, spreadsheet formula traps, and ungrounded claims purged during adversarial forensic review. Each defect is backed by mathematical ground truth, an explicit safeguard mandate, and an automated verification test in <code>verify_fdb_2026.py</code>.
          </p>
        </div>

        {/* Remediation Summary Badges */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-growth/15 border border-accent-growth/30 text-accent-growth text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% AUDIT REMEDIATION</span>
          </div>
        </div>
      </div>

      {/* 2. Headline Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-lg bg-elevated/60 border border-border-subtle">
          <span className="text-content-muted block text-[11px]">Historical Claims Audited</span>
          <span className="text-xl font-bold text-content-primary tabular-nums">490 Claims</span>
          <span className="text-accent-growth block text-[11px]">100% inspected</span>
        </div>
        <div className="p-3.5 rounded-lg bg-accent-growth/10 border border-accent-growth/25">
          <span className="text-accent-growth block text-[11px] font-bold">Systemic Defects Neutralized</span>
          <span className="text-xl font-bold text-accent-growth tabular-nums">7 / 7 Defeated</span>
          <span className="text-accent-growth block text-[11px]">Zero unresolved errors</span>
        </div>
        <div className="p-3.5 rounded-lg bg-elevated/60 border border-border-subtle">
          <span className="text-content-muted block text-[11px]">Slice Identity Discrepancy</span>
          <span className="text-xl font-bold text-content-primary tabular-nums">₹0.00 Variance</span>
          <span className="text-accent-growth block text-[11px]">Row 1492 match verified</span>
        </div>
        <div className="p-3.5 rounded-lg bg-elevated/60 border border-border-subtle">
          <span className="text-content-muted block text-[11px]">PII Scrubbing Violations</span>
          <span className="text-xl font-bold text-content-primary tabular-nums">0 Phone Leaks</span>
          <span className="text-accent-growth block text-[11px]">100% anonymized</span>
        </div>
      </div>

      {/* 3. The 7 Defect Cards List */}
      <div className="space-y-4">
        {defectList.map((def) => {
          const isExpanded = !!expandedDefects[def.defectId];
          const meta = defectDetails[def.defectId] || {
            category: 'Audit Remediation',
            testModule: 'verify_fdb_2026.py',
            evidenceId: 'REC-HYG-01',
            coordinates: 'Master Ledger',
          };

          return (
            <div
              key={def.defectId}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-surface border-border-strong shadow-sm'
                  : 'bg-elevated/40 border-border-subtle hover:border-border-strong'
              }`}
            >
              {/* Card Header (Clickable for Expand/Collapse) */}
              <div
                onClick={() => toggleExpand(def.defectId)}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-accent-harvest/15 text-accent-harvest border border-accent-harvest/30">
                      {def.defectId}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
                      NEUTRALIZED
                    </span>
                    <span className="text-[11px] font-mono text-content-muted">
                      {meta.category}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-content-primary">
                    {def.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <EvidenceBadge metricId={meta.evidenceId} variant="subtle" />
                  <button
                    type="button"
                    aria-label={isExpanded ? `Collapse ${def.defectId}` : `Expand ${def.defectId}`}
                    className="p-1 rounded text-content-muted hover:text-content-primary transition-colors cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Side-by-Side Hazard vs Remediated Truth (Always Visible Summary) */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-accent-stress/5 border border-accent-stress/20 space-y-1">
                    <span className="font-mono font-bold text-accent-stress flex items-center gap-1.5 uppercase text-[10px]">
                      <AlertTriangle className="w-3.5 h-3.5" /> Historical Hazard / Artifact
                    </span>
                    <p className="text-content-secondary font-sans leading-relaxed">
                      {def.historicalArtifact}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-accent-growth/5 border border-accent-growth/20 space-y-1">
                    <span className="font-mono font-bold text-accent-growth flex items-center gap-1.5 uppercase text-[10px]">
                      <ShieldCheck className="w-3.5 h-3.5" /> Remediated Ground Truth
                    </span>
                    <p className="text-content-secondary font-sans leading-relaxed">
                      {def.remediatedTruth}
                    </p>
                  </div>
                </div>

                {/* Expandable Technical Deep-Dive */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border-subtle space-y-3 animate-fade-in text-xs font-mono">
                    <div className="p-3.5 rounded-lg bg-elevated/60 border border-border-subtle space-y-1.5">
                      <span className="font-bold text-content-primary flex items-center gap-1.5 uppercase text-[11px]">
                        <FileCheck className="w-3.5 h-3.5 text-accent-evidence" /> Safeguard Mandate & Regression Protection
                      </span>
                      <p className="text-content-secondary font-sans leading-relaxed">
                        {def.safeguardMandate}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-content-muted">
                      <div className="p-2.5 rounded bg-surface border border-border-subtle">
                        <span className="block font-bold text-content-primary">Automated Test Guardian:</span>
                        <span>{meta.testModule}</span>
                      </div>
                      <div className="p-2.5 rounded bg-surface border border-border-subtle">
                        <span className="block font-bold text-content-primary">Primary Source Coordinate:</span>
                        <span>{meta.coordinates}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuditMatrixCard;
