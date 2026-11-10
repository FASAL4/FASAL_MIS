/**
 * ==============================================================================
 * FASAL Publication-Grade Micro-Evidence Provenance & Ledger Types
 * File: src/types/evidence.ts
 *
 * Grounded in:
 * - FDB Survey as on 05112026.xlsx (SHA-256: a7c0ecee9a1adc63fe3340e58c690171bf4ab193d79f0e6ee7b0b2a9056d945f)
 * - FASAL_2026_RECONCILIATION_LEDGER.md (490 Audited Claims)
 * - verification/verify_fdb_2026.py (103/103 Assertions Passed)
 * ==============================================================================
 */

/**
 * Six authoritative thematic domains governing the FASAL project archive
 */
export type ThematicDomain =
  | 'governance'
  | 'income'
  | 'rf_progression'
  | 'rights'
  | 'nutrition'
  | 'forensic';

/**
 * Audit status certification levels for all empirical data points:
 * - VERIFIED: Directly asserted and validated against primary microdata with zero discrepancy.
 * - RECONCILED: Methodologically normalized across sequential survey waves (Wave 1 to Wave 2).
 * - NEUTRALIZED: Historical artifact, defect, or myth systematically purged (SYS-1 through SYS-7).
 */
export type AuditStatus = 'VERIFIED' | 'RECONCILED' | 'NEUTRALIZED';

/**
 * Nested forensic provenance metadata anchoring an empirical metric
 * to its primary spreadsheet or register source coordinates.
 */
export interface ProvenanceDetails {
  /** Canonical source workbook or document (e.g. 'FDB Survey as on 05112026.xlsx') */
  workbook: string;
  /** Exact worksheet name within the primary workbook (e.g. 'Income Data') */
  sheetName: string;
  /** Physical cell address, column letter, or formula coordinate (e.g. 'Income Data!FG1492') */
  cellCoordinates?: string;
  /** Section and metric ID reference in FASAL_2026_RECONCILIATION_LEDGER.md */
  ledgerReference: string;
  /** Verification test module index (1 to 11) in verification/verify_fdb_2026.py */
  testAssertionIndex?: number;
  /** Formal audit classification status */
  auditStatus: AuditStatus;
  /** Forensic audit commentary and methodological reconciliation notes */
  reconciliationNotes?: string;
}

/**
 * The 9 Canonical Provenance Attributes Interface
 * Mandatory contract for every quantitative metric displayed on the dashboard.
 */
export interface MetricProvenance {
  /** 1. Unique stable metric identifier (e.g. 'REC-ECON-12') */
  metricId: string;
  /** 2. Thematic classification domain */
  thematicDomain: ThematicDomain;
  /** 3. Human-readable metric display name */
  label: string;
  /** 4. Reconciled empirical endline value (numeric or string) */
  verifiedValue: string | number;
  /** 5. Baseline comparative value (if longitudinal) */
  baselineValue?: string | number;
  /** 6. Longitudinal change, percentage growth, or directional delta */
  delta?: string;
  /** Unit of measurement (e.g. 'INR', '%', 'households') */
  unit?: string;
  /** 7. Exact sample size (N) representing the valid surveyed or registered cohort */
  sampleSize: number;
  /** 8. Description of the analyzed cohort or administrative universe */
  cohortDefinition: string;
  /** 9. Full forensic provenance metadata container */
  provenance: ProvenanceDetails;
  /** Top-level audit status mirror for cross-tier auditing */
  auditStatus?: AuditStatus;
}

/**
 * Master catalog of all micro-evidence items, indexed by unique metricId.
 */
export type EvidenceLedger = Record<string, MetricProvenance>;

/**
 * Props for the interactive <EvidenceBadge /> component.
 * Allows instant provenance lookup via drawer or tooltip.
 */
export interface EvidenceBadgeProps {
  /** Target metric identifier present in EvidenceLedger */
  metricId: string;
  /** Optional custom CSS classes for layout positioning */
  className?: string;
  /** Visual display variant */
  variant?: 'inline' | 'card' | 'subtle' | 'pill' | 'button';
  /** Optional flag to show or hide the verified value within the badge */
  showValue?: boolean;
  /** Optional custom text override */
  label?: string;
  /** Whether to show verified icon */
  showIcon?: boolean;
  /** Optional accessible description */
  ariaLabel?: string;
}

/**
 * Props for the slide-over / modal portal <EvidenceDrawer /> component.
 */
export interface EvidenceDrawerProps {
  /** Active metric ID to display; null if drawer is closed */
  activeMetricId?: string | null;
  /** Callback invoked when the user dismisses the drawer */
  onClose?: () => void;
  /** Callback to navigate to forensic ledger tab */
  onNavigateToLedger?: (metricId: string) => void;
}

/**
 * Global React Context interface managing evidence drawer visibility and active selection.
 */
export interface EvidenceContextType {
  /** Currently inspected metric ID, or null if drawer is idle */
  activeMetricId: string | null;
  /** Complete provenance metadata for the active metric, or null */
  activeProvenance: MetricProvenance | null;
  /** Alias for activeProvenance */
  activeMetric: MetricProvenance | null;
  /** Whether drawer is open */
  isOpen: boolean;
  /** Opens the evidence drawer for a specified metricId */
  openEvidence: (metricId: string) => void;
  /** Alias for openEvidence */
  openDrawer: (metricId: string) => void;
  /** Closes the evidence drawer */
  closeEvidence: () => void;
  /** Alias for closeEvidence */
  closeDrawer: () => void;
  /** Synchronously retrieves provenance metadata for any metricId from cache */
  getProvenance: (metricId: string) => MetricProvenance | undefined;
  /** Alias for getProvenance */
  getMetric: (metricId: string) => MetricProvenance | undefined;
  /** Full registry */
  registry: Record<string, MetricProvenance>;
}

