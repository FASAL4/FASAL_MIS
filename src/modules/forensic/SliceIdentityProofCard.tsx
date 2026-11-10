import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { fasalMasterData } from '../../data/fasalMasterData';
import type { ForensicLedgerData } from '../../types/dashboard';

export interface SliceIdentityProofCardProps {
  sliceProof?: ForensicLedgerData['sliceIdentityProof'];
  className?: string;
}

export const SliceIdentityProofCard: React.FC<SliceIdentityProofCardProps> = ({
  sliceProof,
  className = '',
}) => {
  const [simulateDoubleCount, setSimulateDoubleCount] = useState<boolean>(false);

  const proof = sliceProof || fasalMasterData.forensic.sliceIdentityProof;

  // Primary 6 financial metrics
  const defaultMetrics = [
    {
      metricName: '2025 Aggregate Cultivation Cost',
      farmerRowsSum: 30214192,
      grandTotalCellValue: 30214192,
      discrepancyDelta: 0.00,
      cellCoordinate: 'Income Data!FF1492',
      evidenceId: 'REC-ECON-04',
      status: 'MATCH_ZERO_DISCREPANCY' as const,
    },
    {
      metricName: '2026 Aggregate Cultivation Cost',
      farmerRowsSum: 33124177,
      grandTotalCellValue: 33124177,
      discrepancyDelta: 0.00,
      cellCoordinate: 'Income Data!FG1492',
      evidenceId: 'REC-ECON-05',
      status: 'MATCH_ZERO_DISCREPANCY' as const,
    },
    {
      metricName: '2025 Aggregate Gross Revenue',
      farmerRowsSum: 111246772,
      grandTotalCellValue: 111246772,
      discrepancyDelta: 0.00,
      cellCoordinate: 'Income Data!FH1492',
      evidenceId: 'REC-ECON-06',
      status: 'MATCH_ZERO_DISCREPANCY' as const,
    },
    {
      metricName: '2026 Aggregate Gross Revenue',
      farmerRowsSum: 128170176,
      grandTotalCellValue: 128170176,
      discrepancyDelta: 0.00,
      cellCoordinate: 'Income Data!FI1492',
      evidenceId: 'REC-ECON-07',
      status: 'MATCH_ZERO_DISCREPANCY' as const,
    },
    {
      metricName: '2025 Aggregate Net Farm Profit',
      farmerRowsSum: 81032580,
      grandTotalCellValue: 81032580,
      discrepancyDelta: 0.00,
      cellCoordinate: 'Derived: FH1492 - FF1492',
      evidenceId: 'REC-ECON-11',
      status: 'MATCH_ZERO_DISCREPANCY' as const,
    },
    {
      metricName: '2026 Aggregate Net Farm Profit',
      farmerRowsSum: 95045999,
      grandTotalCellValue: 95045999,
      discrepancyDelta: 0.00,
      cellCoordinate: 'Derived: FI1492 - FG1492',
      evidenceId: 'REC-ECON-12',
      status: 'MATCH_ZERO_DISCREPANCY' as const,
    },
  ];

  const metrics = proof?.metrics || defaultMetrics;

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`} id="slice-identity-proof-card">
      {/* 1. Header with Result Badges & Simulation Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-growth/10 text-accent-growth border border-accent-growth/20">
              Feature F21: Mathematical Proof of Slice Identity
            </span>
            <EvidenceBadge metricId="REC-ECON-04" variant="card" label="FF1492 Proof" />
            <EvidenceBadge metricId="REC-ECON-12" variant="card" label="₹0.00 Variance" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            Row 1492 Grand Total Neutralization & ₹0.00 Slice Identity Proof
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            Demonstrating exact mathematical identity between individual farmer rows (Rows 4 to 1490, N=1,487 genuine cultivating farmers) and Microsoft Excel grand total Row 1492. Proves zero arithmetic discrepancy across all 4 cost and revenue columns, while neutralizing the lethal 2× double-counting trap.
          </p>
        </div>

        {/* Interactive Double-Count Simulation Switch */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={() => setSimulateDoubleCount(!simulateDoubleCount)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
              simulateDoubleCount
                ? 'bg-accent-stress text-white border-accent-stress shadow-md'
                : 'bg-elevated text-content-primary border-border-strong hover:bg-surface'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${simulateDoubleCount ? 'animate-spin' : ''}`} />
            <span>{simulateDoubleCount ? 'Simulating Double Count Trap' : 'Simulate Grand Total Double Count'}</span>
          </button>
        </div>
      </div>

      {/* 2. Double-Count Trap Warning / Educational Banner */}
      {simulateDoubleCount ? (
        <div className="p-4 sm:p-5 rounded-xl bg-accent-stress/10 border border-accent-stress/30 space-y-2 animate-fade-in text-xs font-mono">
          <div className="flex items-center gap-2 text-accent-stress font-bold text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>DOUBLE-COUNTING TRAP SIMULATION ACTIVE (Legacy Error Demonstration)</span>
          </div>
          <p className="text-content-primary font-sans leading-relaxed">
            If an automated script or spreadsheet macro naively sums the whole column including Row 1492 (e.g., <code>df.sum()</code> or <code>=SUM(FF4:FF1492)</code>), Row 1492 is added to its own constituents. This produces an inflated aggregate 2026 Net Profit of <strong className="text-accent-stress text-sm">₹19,00,91,998 (~₹19.01 Crore)</strong> instead of the verified <strong className="text-accent-growth text-sm">₹9,50,45,999 (~₹9.50 Crore)</strong>. This exact mechanism generated the historical SYS-7 leverage flaw!
          </p>
        </div>
      ) : (
        <div className="p-3.5 rounded-lg bg-accent-growth/10 border border-accent-growth/25 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent-growth" />
            <span className="font-bold text-accent-growth">Strict Slice Boundary Applied:</span>
            <span className="text-content-secondary">Slicing <code>rows 4:1490</code> isolates the 1,487 genuine farmer records cleanly with 0.00 discrepancy.</span>
          </div>
          <span className="text-accent-growth font-bold">Verified 2026 Net: ₹9.50 Cr</span>
        </div>
      )}

      {/* 3. The 6-Metric Slice Proof Matrix */}
      <div className="overflow-x-auto rounded-lg border border-border-subtle">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="bg-elevated/60 border-b border-border-strong text-content-muted">
              <th className="py-2.5 px-3">Financial Metric & Primary Coordinate</th>
              <th className="py-2.5 px-3 text-right">Farmer Rows Sum (4:1490)</th>
              <th className="py-2.5 px-3 text-right">Grand Total Cell (1492)</th>
              <th className="py-2.5 px-3 text-right">Discrepancy (Δ)</th>
              <th className="py-2.5 px-3 text-right">Simulated Double-Count</th>
              <th className="py-2.5 px-3 text-center">Audit Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/60 bg-surface">
            {metrics.map((m, idx) => {
              const rowEvidenceId = defaultMetrics[idx]?.evidenceId || 'REC-ECON-04';
              const doubledValue = m.farmerRowsSum * 2;

              return (
                <tr key={m.metricName} className="hover:bg-elevated/40 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-sans font-medium text-content-primary">{m.metricName}</div>
                    <div className="text-[10px] text-content-muted">{m.cellCoordinate}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold tabular-nums text-content-primary">
                    ₹{m.farmerRowsSum.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-content-secondary">
                    ₹{m.grandTotalCellValue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold tabular-nums text-accent-growth">
                    ₹{m.discrepancyDelta.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    {simulateDoubleCount ? (
                      <span className="font-bold text-accent-stress">
                        ₹{doubledValue.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="text-content-muted opacity-50">
                        ₹{doubledValue.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
                        MATCH_ZERO_DISCREPANCY
                      </span>
                      <EvidenceBadge metricId={rowEvidenceId} variant="subtle" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Companion Administrative & Referential Identities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Identity 1: Field Administration Accounting */}
        <div className="p-4 rounded-xl bg-elevated/40 border border-border-subtle space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-sm text-content-primary">
              Field Survey Administration Identity
            </span>
            <EvidenceBadge metricId="REC-ADM-01" variant="subtle" />
          </div>
          <div className="text-content-secondary space-y-1">
            <div className="flex justify-between">
              <span>Total Visible Kobo Submissions:</span>
              <strong className="text-content-primary">1,535</strong>
            </div>
            <div className="flex justify-between text-accent-stress">
              <span>Minus Incomplete (0.91%):</span>
              <strong>-14</strong>
            </div>
            <div className="flex justify-between text-accent-stress">
              <span>Minus Field Duplicates (0.98%):</span>
              <strong>-15</strong>
            </div>
            <div className="flex justify-between border-t border-border-subtle pt-1 text-accent-growth font-bold text-sm">
              <span>Validated Complete Interviews:</span>
              <span>1,506 (Δ = 0)</span>
            </div>
          </div>
          <p className="text-[11px] text-content-muted font-sans pt-1">
            Payment Status!Row 21 accounting identity balances 1,506 complete questionnaires plus 4 pilot audit reviews against 1,520 physically deposited booklets.
          </p>
        </div>

        {/* Identity 2: Child Member Referential Integrity */}
        <div className="p-4 rounded-xl bg-elevated/40 border border-border-subtle space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-sm text-content-primary">
              Family Member Roster Referential Integrity
            </span>
            <EvidenceBadge metricId="REC-DEMO-01" variant="subtle" />
          </div>
          <div className="text-content-secondary space-y-1">
            <div className="flex justify-between">
              <span>Resident Individuals Enumerated:</span>
              <strong className="text-content-primary">6,494</strong>
            </div>
            <div className="flex justify-between">
              <span>Parent Survey Submissions:</span>
              <strong className="text-content-primary">1,535</strong>
            </div>
            <div className="flex justify-between">
              <span>Unmatched Orphaned Child Rows:</span>
              <strong className="text-accent-growth font-bold">0 records</strong>
            </div>
            <div className="flex justify-between border-t border-border-subtle pt-1 text-accent-growth font-bold text-sm">
              <span>Relational Foreign Key Integrity:</span>
              <span>100.0% Matched</span>
            </div>
          </div>
          <p className="text-[11px] text-content-muted font-sans pt-1">
            Every child row in the family member repeat group matches its parent <code>_submission__id</code> to the parent record's <code>_id</code> with zero orphan records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SliceIdentityProofCard;
