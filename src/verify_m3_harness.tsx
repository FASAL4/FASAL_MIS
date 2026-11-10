import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { EvidenceProvider } from './context/EvidenceContext';
import { EvidenceDrawer } from './components/evidence/EvidenceDrawer';
import { ReconciliationLedgerTable } from './modules/forensic/ReconciliationLedgerTable';
import { getAllEvidenceMetrics } from './data/fasalMasterData';
import './index.css';

declare global {
  interface Window {
    __TRIGGER_HIGHLIGHT__?: (metricId: string | undefined) => void;
    __GET_CURRENT_HIGHLIGHT__?: () => string | undefined;
    __ALL_METRIC_IDS__?: string[];
  }
}

const HarnessApp: React.FC = () => {
  const [highlightedId, setHighlightedId] = useState<string | undefined>(undefined);
  const allMetrics = getAllEvidenceMetrics();

  useEffect(() => {
    window.__TRIGGER_HIGHLIGHT__ = (metricId: string | undefined) => {
      setHighlightedId(metricId);
    };
    window.__GET_CURRENT_HIGHLIGHT__ = () => highlightedId;
    window.__ALL_METRIC_IDS__ = allMetrics.map((m) => m.metricId);
  }, [allMetrics, highlightedId]);

  return (
    <ThemeProvider>
      <EvidenceProvider>
        <div className="max-w-7xl mx-auto py-6 space-y-6">
          <header className="border-b border-border-subtle pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold font-serif">M3 Forensic Ledger Verification Harness</h1>
              <p className="text-xs text-content-secondary font-mono">
                Automated empirical test harness for BUG-M3-DL-01 verification across all 120 metrics.
              </p>
            </div>
            <div className="text-right">
              <span id="harness-active-id" className="px-2 py-1 rounded bg-elevated border border-border-strong text-xs font-mono">
                Active Highlight: {highlightedId || 'none'}
              </span>
            </div>
          </header>

          <main>
            <ReconciliationLedgerTable
              highlightedMetricId={highlightedId}
              onSelectMetric={(id) => setHighlightedId(id)}
            />
          </main>

          <EvidenceDrawer onNavigateToLedger={(id) => setHighlightedId(id)} />
        </div>
      </EvidenceProvider>
    </ThemeProvider>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<HarnessApp />);
}
