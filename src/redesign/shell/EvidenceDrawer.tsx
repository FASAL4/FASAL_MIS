import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Check, Copy, X } from 'lucide-react';
import { useEvidence } from '@/context/EvidenceContext';
import type { AuditStatus, MetricProvenance } from '@/types/evidence';
import { Tag } from '../ui';

const DOMAIN: Record<string, string> = {
  governance: 'Programme & people',
  income: '01 · Income',
  rf_progression: '02 · Farming',
  rights: '03 · Rights',
  nutrition: '04 · Nutrition',
  forensic: '05 · Evidence',
};

const STATUS: Record<AuditStatus, { tone: 'forest' | 'haldi' | 'clay'; text: string; gloss: string }> = {
  VERIFIED: { tone: 'forest', text: 'Verified', gloss: 'Checked against the primary microdata with zero discrepancy.' },
  RECONCILED: { tone: 'haldi', text: 'Reconciled', gloss: 'Normalised across the two survey waves before comparison.' },
  NEUTRALIZED: { tone: 'clay', text: 'Neutralised', gloss: 'A historical artefact or error that was found and removed.' },
};

function display(v: string | number): string {
  return typeof v === 'number' ? v.toLocaleString('en-IN') : v;
}

function snippet(m: MetricProvenance): string {
  const fn = m.metricId.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const val = typeof m.verifiedValue === 'number' ? m.verifiedValue : `"${m.verifiedValue}"`;
  return `# verify_fdb_2026.py · module ${m.provenance.testAssertionIndex ?? 1}
def verify_${fn}():
    workbook = "${m.provenance.workbook}"
    sheet    = "${m.provenance.sheetName}"
    cells    = "${m.provenance.cellCoordinates || 'Summary'}"

    # ground truth, N=${m.sampleSize}
    verified = ${val}
    assert verified is not None, "${m.metricId} failed"
    # status: ${m.provenance.auditStatus}`;
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => undefined);
  };
  return [copied, copy] as const;
}

export const EvidenceDrawer: React.FC<{ onOpenLedger: (metricId: string) => void }> = ({ onOpenLedger }) => {
  const { isOpen, activeMetric: m, closeDrawer } = useEvidence();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [codeCopied, copyCode] = useCopy();
  const [citeCopied, copyCite] = useCopy();

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen, m?.metricId]);

  if (!isOpen || !m) return null;

  const status = STATUS[m.provenance.auditStatus] ?? STATUS.VERIFIED;
  const citation = `FASAL 2026 — ${m.label}: ${display(m.verifiedValue)} (N=${m.sampleSize}; ${m.provenance.sheetName}${
    m.provenance.cellCoordinates ? `, ${m.provenance.cellCoordinates}` : ''
  }; ledger ${m.provenance.ledgerReference})`;

  return createPortal(
    <>
      <div className="scrim" onClick={closeDrawer} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="evidence-title">
        <div className="drawer-head">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="t-label">{DOMAIN[m.thematicDomain] ?? m.thematicDomain}</span>
              <span className="t-mono text-ink-3">{m.metricId}</span>
            </div>
            <button ref={closeRef} type="button" className="icon-btn -mr-2 -mt-1" onClick={closeDrawer} aria-label="Close">
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>
          <h2 id="evidence-title" className="t-h2 mt-3">
            {m.label}
          </h2>
        </div>

        <div className="drawer-body">
          <div>
            <div
              className="font-display text-ink num"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 3.25rem)', lineHeight: 1.02, letterSpacing: '-0.035em', fontWeight: 380, overflowWrap: 'anywhere' }}
            >
              {display(m.verifiedValue)}
              {m.unit && typeof m.verifiedValue === 'number' && (
                <span className="stat-unit ml-2">{m.unit}</span>
              )}
            </div>
            {m.delta && <div className="stat-delta">{m.delta}</div>}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Tag tone={status.tone}>{status.text}</Tag>
              <span className="t-note">{status.gloss}</span>
            </div>
          </div>

          <div>
            <div className="t-label mb-3">Where this number lives</div>
            <dl className="defs m-0">
              <div className="def">
                <dt>Workbook</dt>
                <dd>{m.provenance.workbook}</dd>
              </div>
              <div className="def">
                <dt>Sheet</dt>
                <dd>{m.provenance.sheetName}</dd>
              </div>
              <div className="def">
                <dt>Cells</dt>
                <dd className="t-mono" style={{ fontSize: '0.78125rem' }}>
                  {m.provenance.cellCoordinates || 'Summary column'}
                </dd>
              </div>
              <div className="def">
                <dt>Sample</dt>
                <dd>N = {m.sampleSize.toLocaleString('en-IN')}</dd>
              </div>
              <div className="def">
                <dt>Cohort</dt>
                <dd>{m.cohortDefinition}</dd>
              </div>
              {m.baselineValue !== undefined && (
                <div className="def">
                  <dt>Earlier value</dt>
                  <dd>{display(m.baselineValue)}</dd>
                </div>
              )}
              <div className="def">
                <dt>Ledger entry</dt>
                <dd>{m.provenance.ledgerReference}</dd>
              </div>
            </dl>
          </div>

          {m.provenance.reconciliationNotes && (
            <aside className="note" data-kind={status.tone === 'forest' ? 'finding' : status.tone === 'clay' ? 'caution' : 'audit'}>
              <div className="note-label">Auditor’s note</div>
              <div className="note-body">{m.provenance.reconciliationNotes}</div>
            </aside>
          )}

          <details>
            <summary className="t-label cursor-pointer select-none">Assertion that guards it</summary>
            <div className="mt-3">
              <pre className="code">
                <code>{snippet(m)}</code>
              </pre>
              <button type="button" className="src-link mt-2" onClick={() => copyCode(snippet(m))}>
                {codeCopied ? <Check size={11} /> : <Copy size={11} />}
                <span>{codeCopied ? 'Copied' : 'Copy assertion'}</span>
              </button>
            </div>
          </details>
        </div>

        <div className="drawer-foot">
          <button type="button" className="btn" onClick={() => copyCite(citation)}>
            {citeCopied ? <Check size={15} /> : <Copy size={15} />}
            {citeCopied ? 'Citation copied' : 'Copy citation'}
          </button>
          <button
            type="button"
            className="btn btn--solid"
            onClick={() => {
              closeDrawer();
              onOpenLedger(m.metricId);
            }}
          >
            Open in the ledger
            <ArrowRight size={15} />
          </button>
        </div>
      </aside>
    </>,
    document.body,
  );
};
