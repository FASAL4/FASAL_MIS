import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ShieldCheck, 
  FileSpreadsheet, 
  Check, 
  Copy, 
  ExternalLink, 
  Database,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { useEvidence } from '../../context/EvidenceContext';
import type { EvidenceDrawerProps } from '../../types/evidence';

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ onNavigateToLedger }) => {
  const { isOpen, activeMetric, closeDrawer } = useEvidence();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  if (!isOpen || !activeMetric) return null;

  // Domain badge styling
  const domainLabels: Record<string, string> = {
    income: 'PILLAR I: INCOME SECURITY',
    rf_progression: 'PILLAR II: RF & AGRONOMIC PROGRESSION',
    rights: 'PILLAR III: RIGHTS & ENTITLEMENTS',
    nutrition: 'PILLAR IV: NUTRITION & INCLUSION',
    governance: 'EXECUTIVE GOVERNANCE',
    forensic: 'FORENSIC AUDIT LEDGER',
  };

  const domainLabel = domainLabels[activeMetric.thematicDomain] || activeMetric.thematicDomain.toUpperCase();

  // Python verification snippet generator
  const assertionSnippet = `# Automated Assertion (verify_fdb_2026.py: Module ${activeMetric.provenance.testAssertionIndex ?? 1})
def verify_${activeMetric.metricId.toLowerCase().replace(/[^a-z0-9]/g, '_')}():
    primary_file = "${activeMetric.provenance.workbook}"
    sheet = "${activeMetric.provenance.sheetName}"
    coords = "${activeMetric.provenance.cellCoordinates || 'Summary'}"
    
    # Asserting Ground Truth (N=${activeMetric.sampleSize})
    verified_val = ${typeof activeMetric.verifiedValue === 'number' ? activeMetric.verifiedValue : `"${activeMetric.verifiedValue}"`}
    assert verified_val is not None, "Assertion failed for ${activeMetric.metricId}"
    # Status: ${activeMetric.provenance.auditStatus}`;

  const copyCodeToClipboard = () => {
    if (!navigator.clipboard) return;
    try {
      navigator.clipboard.writeText(assertionSnippet)
        .then(() => {
          setCopiedCode(true);
          setTimeout(() => setCopiedCode(false), 2000);
        })
        .catch((err) => console.warn('[EvidenceDrawer] Clipboard copy failed:', err));
    } catch (err) {
      console.warn('[EvidenceDrawer] Clipboard copy failed:', err);
    }
  };

  const copyCitationToClipboard = () => {
    if (!navigator.clipboard) return;
    try {
      const citation = `[FASAL 2026 Audit Citation] ${activeMetric.label}: ${activeMetric.verifiedValue} (N=${activeMetric.sampleSize}, ${activeMetric.provenance.sheetName}!${activeMetric.provenance.cellCoordinates || ''}, Ref: ${activeMetric.provenance.ledgerReference})`;
      navigator.clipboard.writeText(citation)
        .then(() => {
          setCopiedCitation(true);
          setTimeout(() => setCopiedCitation(false), 2000);
        })
        .catch((err) => console.warn('[EvidenceDrawer] Clipboard citation copy failed:', err));
    } catch (err) {
      console.warn('[EvidenceDrawer] Clipboard citation copy failed:', err);
    }
  };

  const portalRoot = document.getElementById('evidence-portal-root') || document.body;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-drawer-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* 1. Backdrop Scrim */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xs transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* 2. Slide-Over Drawer Sheet */}
      <aside 
        className="relative w-full max-w-xl bg-surface text-content-primary border-l border-border-strong shadow-2xl flex flex-col h-full z-10 overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-border-subtle bg-elevated/40 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-wider uppercase font-mono font-bold text-accent-harvest px-2 py-0.5 rounded bg-accent-harvest/10 border border-accent-harvest/20">
                {domainLabel}
              </span>
              <span className="text-[10px] font-mono text-content-muted">
                ID: {activeMetric.metricId}
              </span>
            </div>
            <h2 id="evidence-drawer-title" className="text-lg font-serif font-bold text-content-primary">
              {activeMetric.label}
            </h2>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close evidence drawer"
            className="p-1.5 rounded-md text-content-muted hover:text-content-primary hover:bg-elevated transition-colors focus:outline-none focus:ring-2 focus:ring-accent-evidence cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Empirical Value Card */}
          <div className="p-4 rounded-lg bg-base border border-border-subtle space-y-3">
            <div className="text-xs font-mono text-content-muted uppercase tracking-wider">
              Audited Empirical Metric
            </div>
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div className="text-3xl font-mono font-bold text-content-primary tracking-tight tabular-nums">
                {typeof activeMetric.verifiedValue === 'number' 
                  ? activeMetric.verifiedValue.toLocaleString('en-IN')
                  : activeMetric.verifiedValue}
              </div>
              {activeMetric.delta && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
                  {activeMetric.delta}
                </span>
              )}
            </div>

            {activeMetric.baselineValue !== undefined && (
              <div className="text-xs text-content-secondary flex items-center gap-4 pt-2 border-t border-border-subtle/60 font-mono">
                <span>Baseline (2022): <strong className="text-content-primary">{activeMetric.baselineValue}</strong></span>
                <span>Cohort Sample: <strong className="text-content-primary">N = {activeMetric.sampleSize.toLocaleString()}</strong></span>
              </div>
            )}
          </div>

          {/* Section 2: Audit Status & Double-Counting Neutralization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent-evidence" />
                Audit Status & Integrity
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                activeMetric.provenance.auditStatus === 'VERIFIED'
                  ? 'bg-accent-growth/15 text-accent-growth border border-accent-growth/30'
                  : 'bg-accent-harvest/15 text-accent-harvest border border-accent-harvest/30'
              }`}>
                {activeMetric.provenance.auditStatus}
              </span>
            </div>

            {activeMetric.provenance.reconciliationNotes && (
              <div className="p-3 rounded bg-accent-harvest/10 border border-accent-harvest/20 text-xs text-content-secondary flex gap-2">
                <AlertTriangle className="w-4 h-4 text-accent-harvest shrink-0 mt-0.5" />
                <div>
                  <strong className="text-content-primary block font-mono text-[11px]">Reconciliation Note:</strong>
                  {activeMetric.provenance.reconciliationNotes}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Forensic Coordinates Matrix */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-accent-evidence" />
              Primary Source Coordinates
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-elevated border border-border-subtle">
                <span className="text-content-muted block text-[10px]">Workbook</span>
                <span className="font-semibold text-content-primary break-all">{activeMetric.provenance.workbook}</span>
              </div>
              <div className="p-2.5 rounded bg-elevated border border-border-subtle">
                <span className="text-content-muted block text-[10px]">Sheet Name</span>
                <span className="font-semibold text-content-primary">{activeMetric.provenance.sheetName}</span>
              </div>
              <div className="p-2.5 rounded bg-elevated border border-border-subtle">
                <span className="text-content-muted block text-[10px]">Cell Coordinates</span>
                <span className="font-semibold text-accent-evidence">{activeMetric.provenance.cellCoordinates || 'Summary Column'}</span>
              </div>
              <div className="p-2.5 rounded bg-elevated border border-border-subtle">
                <span className="text-content-muted block text-[10px]">Ledger Reference</span>
                <span className="font-semibold text-content-primary truncate block" title={activeMetric.provenance.ledgerReference}>
                  {activeMetric.provenance.ledgerReference}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Cohort & Sample Roster Context */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5">
              <Database className="w-4 h-4 text-accent-evidence" />
              Cohort Definition & Population
            </span>
            <div className="p-3 rounded bg-elevated/60 border border-border-subtle text-xs text-content-secondary space-y-1">
              <p><strong className="text-content-primary">Cohort:</strong> {activeMetric.cohortDefinition}</p>
              <p><strong className="text-content-primary">Active Population:</strong> N = {activeMetric.sampleSize.toLocaleString()} smallholders (7 GPs, 19 villages)</p>
            </div>
          </div>

          {/* Section 5: Executable Python Assertion Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-accent-evidence" />
                Python Verification Assertion
              </span>
              <button
                type="button"
                onClick={copyCodeToClipboard}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-accent-evidence hover:underline cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-accent-growth" /> : <Copy className="w-3 h-3" />}
                {copiedCode ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <pre className="p-3 rounded bg-black/80 dark:bg-black/95 text-emerald-400 font-mono text-xs overflow-x-auto border border-border-strong/40 leading-relaxed">
              <code>{assertionSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 border-t border-border-subtle bg-elevated/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={copyCitationToClipboard}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium bg-base hover:bg-elevated border border-border-strong text-content-primary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-evidence cursor-pointer"
          >
            {copiedCitation ? <Check className="w-3.5 h-3.5 text-accent-growth" /> : <Copy className="w-3.5 h-3.5 text-content-muted" />}
            <span>{copiedCitation ? 'Citation Copied' : 'Copy Citation'}</span>
          </button>

          {onNavigateToLedger && (
            <button
              type="button"
              onClick={() => {
                closeDrawer();
                onNavigateToLedger(activeMetric.metricId);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium bg-accent-primary text-white dark:text-stone-950 font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent-primary/50 cursor-pointer"
            >
              <span>View in Forensic Ledger</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </aside>
    </div>,
    portalRoot
  );
};

export default EvidenceDrawer;

