/**
 * FASAL Revamp Master Data Store
 * Generated programmatically by compile_master_data.py
 * Contains 100% verified empirical data matching verify_fdb_2026.py
 */

import masterDataJson from './fasalMasterData.json';
import evidenceLedgerJson from './evidenceLedger.json';
import type { FasalMasterData } from '@/types/dashboard';
import type { MetricProvenance } from '@/types/evidence';

export const fasalMasterData = masterDataJson as unknown as FasalMasterData;
export const evidenceLedger = evidenceLedgerJson as unknown as Record<string, MetricProvenance>;

export function getMetricProvenance(metricId: string): MetricProvenance | undefined {
  return evidenceLedger[metricId];
}

export function getAllEvidenceMetrics(): MetricProvenance[] {
  return Object.values(evidenceLedger);
}

export function getMetricsByDomain(domain: string): MetricProvenance[] {
  return Object.values(evidenceLedger).filter(m => m.thematicDomain === domain);
}

export default fasalMasterData;
