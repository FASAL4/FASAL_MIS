import React from 'react';
import {
  MonitorCheck,
} from 'lucide-react';
import type { RightsEntitlementsData } from '../../types/dashboard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { formatCount } from './rightsFormatters';

export interface JanSuvidhaKendraCardProps {
  jsk: RightsEntitlementsData['janSuvidhaKendra'];
  className?: string;
}

export const JanSuvidhaKendraCard: React.FC<JanSuvidhaKendraCardProps> = ({
  jsk: _jsk,
  className = '',
}) => {
  // The 4 verified historical service volumes from Sub-Ledger 11
  const verifiedServices = [
    {
      name: 'Individual Household Latrine Applications (SBM-G)',
      volume: 394,
      share: 35.75,
      evidenceId: 'REC-JSK-02',
      department: 'Swachh Bharat Mission (Gramin)',
    },
    {
      name: 'Subsidized Agriculture Minor Irrigation Borings',
      volume: 352,
      share: 31.94,
      evidenceId: 'REC-JSK-03',
      department: 'Minor Irrigation / Agriculture Dept',
    },
    {
      name: 'PM-Kisan Samman Nidhi Verified Portal Registrations',
      volume: 12,
      share: 1.09,
      evidenceId: 'REC-JSK-04',
      department: 'Ministry of Agriculture & Farmers Welfare',
    },
    {
      name: 'Agro-Ecological Input & Biological Drum Bookings',
      volume: 123,
      share: 11.16,
      evidenceId: 'REC-JSK-01',
      department: 'DEHAT Agro-Ecological PoP Linkage',
    },
  ];

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-evidence/10 text-accent-evidence border border-accent-evidence/20">
              Civic Intermediation Infrastructure
            </span>
            <EvidenceBadge metricId="REC-JSK-01" variant="card" label="1,102 Verified Services" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            Jan Suvidha Kendra (JSK): Decentralized Digital Citizen Services
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            Overcoming systemic digital exclusion, bureaucratic barriers, and CSC biometric connectivity issues in the Katarniaghat forest buffer. Operating across 4 localized kiosk centers, trained youth fellows facilitated <strong>1,102 verified citizen service deliveries</strong> between 2022 and 2025.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border-strong text-content-primary text-xs font-mono font-bold shadow-xs">
            <MonitorCheck className="w-4 h-4 text-accent-evidence" />
            <span>4 ACTIVE DIGITAL KIOSKS</span>
          </div>
        </div>
      </div>

      {/* 2. Key Transaction Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {verifiedServices.map((srv) => (
          <div
            key={srv.name}
            className="p-4 rounded-xl bg-elevated/40 border border-border-subtle hover:border-border-strong transition-all space-y-2 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-content-muted tracking-wider">
                {srv.department}
              </span>
              <EvidenceBadge metricId={srv.evidenceId} variant="subtle" />
            </div>

            <span className="text-xs font-serif font-bold text-content-primary block line-clamp-2" title={srv.name}>
              {srv.name}
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-content-primary tabular-nums">
                {formatCount(srv.volume)}
              </span>
              <span className="text-xs font-mono text-content-muted">({srv.share}%)</span>
            </div>

            <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden">
              <div
                className="bg-accent-evidence h-full rounded-full transition-all duration-300"
                style={{ width: `${srv.share}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Audit Exclusion Note */}
      <div className="p-3.5 rounded-lg bg-surface border border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-content-muted">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-content-primary">Historical Register Reconciliation:</span>
          <span>
            Corrects earlier uncleaned draft claim of 1,118 by systematically purging 16 non-data spreadsheet rows (3 title banners, 3 repeat headers, 10 blank serials).
          </span>
        </div>
        <EvidenceBadge metricId="REC-JSK-01" variant="inline" label="Audit: 1,102 Pass" />
      </div>
    </div>
  );
};

export default JanSuvidhaKendraCard;
