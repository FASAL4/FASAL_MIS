import React from 'react';
import {
  Flame,
  TrendingDown,
  SunMedium,
  FileSearch,
} from 'lucide-react';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import type { DebunkedMythRecord } from '../../types/dashboard';

export interface DebunkedMythRegistryProps {
  myths?: DebunkedMythRecord[];
  className?: string;
}

export const DebunkedMythRegistry: React.FC<DebunkedMythRegistryProps> = ({
  myths: _myths,
  className = '',
}) => {
  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`} id="debunked-myths-card">
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-stress/10 text-accent-stress border border-accent-stress/20">
              Research Governance & Academic Rigor
            </span>
            <EvidenceBadge metricId="REC-LEV-01" variant="card" label="3 Myths Demystified" />
            <EvidenceBadge metricId="REC-LEV-01" variant="card" label="₹7.71 Cr Genuine Total" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            Debunked Myth & Empirical Remediation Registry
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            To uphold publication integrity for APPI grant stakeholders and peer-reviewed agrarian research, three persistent historical myths were systematically dismantled using primary household microdata, physical register audits, and automated regression guards.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border-strong text-content-primary text-xs font-mono font-bold shadow-xs">
            <FileSearch className="w-4 h-4 text-accent-harvest" />
            <span>3 DEBUNKED ARTIFACTS</span>
          </div>
        </div>
      </div>

      {/* 2. The Three Structured Debunking Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Agniastra Zero Presence */}
        <div className="p-5 rounded-xl bg-elevated/40 border border-border-subtle hover:border-border-strong transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-accent-stress/15 text-accent-stress border border-accent-stress/30">
                MYTH-01: Zero Adoption
              </span>
              <span className="text-[10px] font-mono font-bold text-accent-stress">PURGED</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-accent-stress/10 text-accent-stress">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-content-primary">
                "Agniastra" Bio-Pesticide Zero Field Adoption
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-surface border border-border-subtle space-y-0.5">
                <span className="font-mono font-bold text-accent-stress text-[10px] uppercase block">
                  Originating Narrative:
                </span>
                <p className="text-content-muted font-sans leading-normal">
                  Early 2021 draft PoP manuals listed Agniastra (boiled tobacco, chili, garlic formulation) as an organic pest repellent.
                </p>
              </div>

              <div className="p-2.5 rounded bg-surface border border-border-subtle space-y-0.5">
                <span className="font-mono font-bold text-accent-growth text-[10px] uppercase block">
                  Empirical Investigation:
                </span>
                <p className="text-content-secondary font-sans leading-normal">
                  Found exactly <strong>0 mentions across 1,535 household surveys</strong>, 0 mentions in 210 training MIS logs, and 0 adoptions in field diaries.
                </p>
              </div>

              <div className="p-2.5 rounded bg-accent-growth/10 border border-accent-growth/20 space-y-0.5">
                <span className="font-mono font-bold text-accent-growth text-[10px] uppercase block">
                  True Adopted Inputs:
                </span>
                <p className="text-content-secondary font-sans leading-normal">
                  Farmers universally adopted <strong>Neemastra, 10 Parani Ark, and Char Chatni</strong> in 1,120+ 200L bio-fermentation drums.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle/80 flex items-center justify-between text-[11px] font-mono text-content-muted">
            <span>Guarded by Module 11 test</span>
            <span className="text-accent-growth font-bold">100% Remediated</span>
          </div>
        </div>

        {/* Card 2: ₹11.70 Cr Public Leverage Purged */}
        <div className="p-5 rounded-xl bg-elevated/40 border border-border-subtle hover:border-border-strong transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-accent-stress/15 text-accent-stress border border-accent-stress/30">
                MYTH-02: Double Count
              </span>
              <span className="text-[10px] font-mono font-bold text-accent-stress">PURGED</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-accent-stress/10 text-accent-stress">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-content-primary">
                ₹11.70 Crore Public Scheme Leverage Inflation
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-surface border border-border-subtle space-y-0.5">
                <span className="font-mono font-bold text-accent-stress text-[10px] uppercase block">
                  Originating Narrative:
                </span>
                <p className="text-content-muted font-sans leading-normal">
                  Historical reports claimed ₹11,70,21,520 across 583 projects by naively summing spreadsheet columns containing embedded totals.
                </p>
              </div>

              <div className="p-2.5 rounded bg-surface border border-border-subtle space-y-0.5">
                <span className="font-mono font-bold text-accent-growth text-[10px] uppercase block">
                  Empirical Investigation:
                </span>
                <p className="text-content-secondary font-sans leading-normal">
                  Double-counted ₹2.78 Cr in 2025 (Row 165 sum) and ₹1.48 Cr in 2023 (Row 264 subtotal), plus counted 6 spreadsheet footer rows.
                </p>
              </div>

              <div className="p-2.5 rounded bg-accent-growth/10 border border-accent-growth/20 space-y-0.5">
                <span className="font-mono font-bold text-accent-growth text-[10px] uppercase block">
                  Verified Ground Truth:
                </span>
                <p className="text-content-secondary font-sans leading-normal">
                  <strong>₹7,70,98,360 (~₹7.71 Cr)</strong> across <strong>577 genuine civil projects</strong>, achieving a <strong>3.57× catalytic multiplier</strong> on the ₹2.16 Cr grant.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle/80 flex items-center justify-between text-[11px] font-mono text-content-muted">
            <EvidenceBadge metricId="REC-LEV-01" variant="subtle" />
            <span className="text-accent-growth font-bold">100% Remediated</span>
          </div>
        </div>

        {/* Card 3: Summer Hunger Gap Inversion */}
        <div className="p-5 rounded-xl bg-elevated/40 border border-border-subtle hover:border-border-strong transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
                MYTH-03: Inversion
              </span>
              <span className="text-[10px] font-mono font-bold text-accent-growth">INVERTED</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-accent-growth/10 text-accent-growth">
                <SunMedium className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-content-primary">
                The "Summer Hunger Gap" Myth Inversion
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-surface border border-border-subtle space-y-0.5">
                <span className="font-mono font-bold text-accent-stress text-[10px] uppercase block">
                  Originating Narrative:
                </span>
                <p className="text-content-muted font-sans leading-normal">
                  Development literature assumed smallholders collapse into starvation during pre-monsoon summer (May/June), surviving on coarse rice.
                </p>
              </div>

              <div className="p-2.5 rounded bg-surface border border-border-subtle space-y-0.5">
                <span className="font-mono font-bold text-accent-growth text-[10px] uppercase block">
                  Empirical Investigation:
                </span>
                <p className="text-content-secondary font-sans leading-normal">
                  60-month dietary recall proves May/June is empirically the <strong>highest peak of green vegetable intake (67.2% – 70.4%)</strong>.
                </p>
              </div>

              <div className="p-2.5 rounded bg-accent-growth/10 border border-accent-growth/20 space-y-0.5">
                <span className="font-mono font-bold text-accent-growth text-[10px] uppercase block">
                  Agronomic Discovery:
                </span>
                <p className="text-content-secondary font-sans leading-normal">
                  Multi-tier bamboo trellises (<em>Machan</em>) and riverbed cucurbits flourish in heat; winter cold snaps are the true trough, remediated by 1,120+ Poshan Vatikas.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle/80 flex items-center justify-between text-[11px] font-mono text-content-muted">
            <EvidenceBadge metricId="REC-NUTR-02" variant="subtle" />
            <span className="text-accent-growth font-bold">Scientific Finding</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebunkedMythRegistry;
