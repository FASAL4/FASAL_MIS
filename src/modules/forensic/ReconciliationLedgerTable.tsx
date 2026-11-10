import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Database,
  X,
} from 'lucide-react';
import { useEvidence } from '../../context/EvidenceContext';
import { getAllEvidenceMetrics } from '../../data/fasalMasterData';
import type { MetricProvenance, ThematicDomain, AuditStatus } from '../../types/evidence';

export interface ReconciliationLedgerTableProps {
  ledgerItems?: MetricProvenance[];
  highlightedMetricId?: string;
  onSelectMetric?: (metricId: string) => void;
  className?: string;
}

type DomainFilter = 'ALL' | ThematicDomain;
type StatusFilter = 'ALL' | AuditStatus;

export const ReconciliationLedgerTable: React.FC<ReconciliationLedgerTableProps> = ({
  ledgerItems,
  highlightedMetricId,
  onSelectMetric,
  className = '',
}) => {
  const { openDrawer } = useEvidence();
  const allItems = useMemo(() => ledgerItems || getAllEvidenceMetrics(), [ledgerItems]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<DomainFilter>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('ALL');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeHighlight, setActiveHighlight] = useState<string | undefined>(highlightedMetricId);

  const highlightedRowRef = useRef<HTMLTableRowElement | null>(null);

  // Sync prop changes for highlightedMetricId
  useEffect(() => {
    if (highlightedMetricId) {
      setActiveHighlight(highlightedMetricId);
      // If the target metric belongs to a specific domain, reset domain filter so it's visible
      const targetIndex = allItems.findIndex((item) => item.metricId === highlightedMetricId);
      if (targetIndex !== -1) {
        const targetItem = allItems[targetIndex];
        if (selectedDomain !== 'ALL' && selectedDomain !== targetItem.thematicDomain) {
          setSelectedDomain('ALL');
        }
        if (selectedStatus !== 'ALL' && selectedStatus !== targetItem.provenance.auditStatus) {
          setSelectedStatus('ALL');
        }
        setSearchQuery('');
        // Synchronize pagination page to ensure target row is rendered in the DOM
        if (pageSize !== -1) {
          setCurrentPage(Math.floor(targetIndex / pageSize) + 1);
        }
      }

      // Smooth scroll into view
      setTimeout(() => {
        if (highlightedRowRef.current) {
          highlightedRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);

      // Dismiss highlight pulse after 4 seconds
      const timer = setTimeout(() => {
        setActiveHighlight(undefined);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [highlightedMetricId, allItems, pageSize]);

  // Compute counts per domain
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: allItems.length };
    allItems.forEach((item) => {
      counts[item.thematicDomain] = (counts[item.thematicDomain] || 0) + 1;
    });
    return counts;
  }, [allItems]);

  // Filter items based on search query, domain, and status
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return allItems.filter((item) => {
      // Domain filter
      if (selectedDomain !== 'ALL' && item.thematicDomain !== selectedDomain) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'ALL' && item.provenance.auditStatus !== selectedStatus) {
        return false;
      }
      // Text search
      if (!query) return true;
      const matchId = item.metricId.toLowerCase().includes(query);
      const matchLabel = item.label.toLowerCase().includes(query);
      const matchSheet = item.provenance.sheetName.toLowerCase().includes(query);
      const matchCoords = (item.provenance.cellCoordinates || '').toLowerCase().includes(query);
      const matchNotes = (item.provenance.reconciliationNotes || '').toLowerCase().includes(query);
      const matchCohort = item.cohortDefinition.toLowerCase().includes(query);
      return matchId || matchLabel || matchSheet || matchCoords || matchNotes || matchCohort;
    });
  }, [allItems, searchQuery, selectedDomain, selectedStatus]);

  // Pagination calculation
  const totalItems = filteredItems.length;
  const totalPages = pageSize === -1 ? 1 : Math.max(1, Math.ceil(totalItems / pageSize));
  const effectivePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    if (pageSize === -1) return filteredItems;
    const start = (effectivePage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, effectivePage, pageSize]);

  // Domain badge colors
  const getDomainBadge = (domain: ThematicDomain) => {
    switch (domain) {
      case 'governance':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'income':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'rf_progression':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'rights':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      case 'nutrition':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'forensic':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20';
    }
  };

  const handleInspect = (metricId: string) => {
    if (onSelectMetric) {
      onSelectMetric(metricId);
    }
    openDrawer(metricId);
  };

  const exportToCSV = () => {
    const headers = [
      'Metric ID',
      'Domain',
      'Label',
      'Verified Value',
      'Baseline Value',
      'Delta',
      'Sample Size',
      'Workbook',
      'Sheet Name',
      'Cell Coordinates',
      'Audit Status',
      'Reconciliation Notes',
    ];

    const rows = filteredItems.map((item) => [
      `"${item.metricId}"`,
      `"${item.thematicDomain}"`,
      `"${item.label.replace(/"/g, '""')}"`,
      `"${item.verifiedValue}"`,
      `"${item.baselineValue || ''}"`,
      `"${item.delta || ''}"`,
      item.sampleSize,
      `"${item.provenance.workbook}"`,
      `"${item.provenance.sheetName}"`,
      `"${item.provenance.cellCoordinates || ''}"`,
      `"${item.provenance.auditStatus}"`,
      `"${(item.provenance.reconciliationNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FASAL_Evidence_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`} id="master-evidence-ledger-table">
      {/* 1. Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-growth/10 text-accent-growth border border-accent-growth/20">
              Feature F21: Master Reconciliation Ledger
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-elevated border border-border-strong text-content-primary">
              {allItems.length} Audited Metrics
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
              107 VERIFIED / 13 RECONCILED
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            Audited Micro-Evidence Reconciliation Browser (All 120 Metrics)
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            Complete empirical ledger cataloging all 120 quantitative assertions across Governance, Income, RF Progression, Rights, Nutrition, and Forensic Integrity. Every record references canonical primary coordinates from <code>FDB Survey as on 05112026.xlsx</code> and <code>FASAL_2026_RECONCILIATION_LEDGER.md</code>.
          </p>
        </div>

        {/* Export Button */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevated border border-border-strong text-content-primary text-xs font-mono font-bold hover:bg-surface transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Search & Filter Engine */}
      <div className="space-y-3">
        {/* Search Bar + Status & Page Size Selectors */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID (e.g. REC-ECON-12), metric name, sheet, cell coordinates, or audit notes..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-elevated/60 border border-border-strong text-xs font-mono text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-1 focus:ring-accent-growth"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Status Filter */}
            <select
              aria-label="Filter ledger by audit certification status"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as StatusFilter);
                setCurrentPage(1);
              }}
              className="text-xs font-mono py-2 px-3 rounded-lg bg-elevated/60 border border-border-strong text-content-primary focus:outline-none focus:ring-1 focus:ring-accent-growth cursor-pointer"
            >
              <option value="ALL">All Statuses ({allItems.length})</option>
              <option value="VERIFIED">VERIFIED Only (107)</option>
              <option value="RECONCILED">RECONCILED Only (13)</option>
            </select>

            {/* Page Size */}
            <select
              aria-label="Items per page"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs font-mono py-2 px-2.5 rounded-lg bg-elevated/60 border border-border-strong text-content-primary focus:outline-none focus:ring-1 focus:ring-accent-growth cursor-pointer"
            >
              <option value="10">10 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
              <option value="-1">All ({filteredItems.length})</option>
            </select>
          </div>
        </div>

        {/* Thematic Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
          <span className="text-content-muted flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> Domain:
          </span>
          {(
            [
              ['ALL', `All (${domainCounts['ALL'] || 120})`],
              ['governance', `Governance (${domainCounts['governance'] || 41})`],
              ['income', `Income (${domainCounts['income'] || 22})`],
              ['rf_progression', `RF Progression (${domainCounts['rf_progression'] || 19})`],
              ['rights', `Rights (${domainCounts['rights'] || 25})`],
              ['nutrition', `Nutrition (${domainCounts['nutrition'] || 4})`],
              ['forensic', `Forensic (${domainCounts['forensic'] || 9})`],
            ] as const
          ).map(([domainKey, label]) => (
            <button
              key={domainKey}
              type="button"
              onClick={() => {
                setSelectedDomain(domainKey as DomainFilter);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                selectedDomain === domainKey
                  ? 'bg-content-primary text-base font-bold shadow-xs'
                  : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. The Audited Ledger Table */}
      <div className="overflow-x-auto rounded-lg border border-border-subtle">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="bg-elevated/60 border-b border-border-strong text-content-muted">
              <th className="py-2.5 px-3">Metric ID & Domain</th>
              <th className="py-2.5 px-3">Metric Description & Cohort</th>
              <th className="py-2.5 px-3 text-right">Verified Ground Truth</th>
              <th className="py-2.5 px-3 text-right">Baseline / Delta</th>
              <th className="py-2.5 px-3">Primary Source Coordinates</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/60 bg-surface">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-content-muted space-y-2">
                  <Database className="w-8 h-8 mx-auto opacity-30" />
                  <p className="font-sans text-sm text-content-secondary">
                    No audited ledger items match your search filter "{searchQuery}".
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedDomain('ALL');
                      setSelectedStatus('ALL');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-elevated border border-border-strong text-xs font-mono text-content-primary hover:bg-surface cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => {
                const isTarget = item.metricId === activeHighlight;
                return (
                  <tr
                    key={item.metricId}
                    ref={isTarget ? highlightedRowRef : undefined}
                    className={`transition-colors hover:bg-elevated/40 ${
                      isTarget
                        ? 'bg-accent-harvest/15 ring-2 ring-accent-harvest font-medium'
                        : ''
                    }`}
                  >
                    {/* Metric ID & Domain */}
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-bold text-content-primary flex items-center gap-1.5">
                        <span>{item.metricId}</span>
                      </div>
                      <span className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] border ${getDomainBadge(item.thematicDomain)}`}>
                        {item.thematicDomain}
                      </span>
                    </td>

                    {/* Label & Cohort */}
                    <td className="py-2.5 px-3 max-w-xs sm:max-w-sm">
                      <div className="font-sans font-medium text-content-primary line-clamp-2" title={item.label}>
                        {item.label}
                      </div>
                      <div className="text-[10px] text-content-muted truncate" title={item.cohortDefinition}>
                        {item.cohortDefinition} (N={item.sampleSize.toLocaleString()})
                      </div>
                    </td>

                    {/* Verified Ground Truth */}
                    <td className="py-2.5 px-3 text-right font-bold tabular-nums text-content-primary">
                      {typeof item.verifiedValue === 'number'
                        ? item.verifiedValue.toLocaleString('en-IN')
                        : item.verifiedValue}
                    </td>

                    {/* Baseline / Delta */}
                    <td className="py-2.5 px-3 text-right tabular-nums text-content-secondary">
                      {item.delta ? (
                        <span className="font-bold text-accent-growth">{item.delta}</span>
                      ) : item.baselineValue !== undefined ? (
                        <span className="text-content-muted">Base: {item.baselineValue}</span>
                      ) : (
                        <span className="text-content-muted">—</span>
                      )}
                    </td>

                    {/* Primary Coordinates */}
                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="text-content-primary font-medium truncate" title={item.provenance.sheetName}>
                        {item.provenance.sheetName}
                      </div>
                      <div className="text-[10px] text-accent-evidence truncate" title={item.provenance.cellCoordinates || item.provenance.ledgerReference}>
                        {item.provenance.cellCoordinates ? `Cell ${item.provenance.cellCoordinates}` : item.provenance.ledgerReference}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.provenance.auditStatus === 'VERIFIED'
                          ? 'bg-accent-growth/15 text-accent-growth border border-accent-growth/30'
                          : 'bg-accent-harvest/15 text-accent-harvest border border-accent-harvest/30'
                      }`}>
                        {item.provenance.auditStatus}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleInspect(item.metricId)}
                        aria-label={`Inspect evidence for ${item.metricId}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-elevated hover:bg-surface border border-border-strong text-content-primary text-[11px] font-mono transition-colors cursor-pointer"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3 text-accent-evidence" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination Footer */}
      {pageSize !== -1 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-content-muted pt-2 border-t border-border-subtle">
          <div>
            Showing items <strong className="text-content-primary">{(effectivePage - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-content-primary">{Math.min(effectivePage * pageSize, totalItems)}</strong> of{' '}
            <strong className="text-content-primary">{totalItems}</strong> filtered metrics
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={effectivePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-md bg-elevated border border-border-subtle text-content-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              Page <strong className="text-content-primary">{effectivePage}</strong> of{' '}
              <strong className="text-content-primary">{totalPages}</strong>
            </span>
            <button
              type="button"
              disabled={effectivePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-md bg-elevated border border-border-subtle text-content-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReconciliationLedgerTable;
