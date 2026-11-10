import React from 'react';
import { TrendingUp, Users, Scale, Landmark } from 'lucide-react';
import { EvidenceBadge } from '../evidence/EvidenceBadge';

export const ExecutiveSummaryBar: React.FC = () => {
  return (
    <section 
      aria-label="Executive Headline KPI Summary" 
      className="bg-elevated/40 border-b border-border-subtle py-4 transition-colors duration-200"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Tile 1: Aggregate Net Farm Profit */}
          <div className="card p-4 rounded-lg bg-surface border border-border-subtle shadow-xs hover:border-accent-primary/40 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-content-muted mb-1.5 font-mono">
                <span className="uppercase tracking-wider font-semibold text-accent-growth flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Aggregate Net Farm Profit
                </span>
                <EvidenceBadge metricId="METRIC-INC-001" variant="subtle" />
              </div>
              <div className="text-2xl font-mono font-bold text-content-primary tracking-tight tabular-nums">
                ₹9,50,45,999<span className="text-xs font-normal text-content-muted font-sans ml-1">(~₹9.50 Cr)</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-mono font-semibold text-accent-growth">
                <span>▲ +84.97% (5-Yr Net Gain)</span>
              </div>
            </div>
            <div className="pt-2 mt-2 border-t border-border-subtle/60 text-[11px] font-mono text-content-secondary flex items-center justify-between">
              <span>N=1,487 Active Farmers</span>
              <EvidenceBadge metricId="METRIC-INC-001" variant="card" label="Income Data!B1492" />
            </div>
          </div>

          {/* Tile 2: Median Smallholder Net Income */}
          <div className="card p-4 rounded-lg bg-surface border border-border-subtle shadow-xs hover:border-accent-primary/40 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-content-muted mb-1.5 font-mono">
                <span className="uppercase tracking-wider font-semibold text-accent-harvest flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" />
                  Median Farm Net Income
                </span>
                <EvidenceBadge metricId="METRIC-INC-002" variant="subtle" />
              </div>
              <div className="text-2xl font-mono font-bold text-content-primary tracking-tight tabular-nums">
                ₹53,400<span className="text-xs font-normal text-content-muted font-sans ml-1">/ Household</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-mono font-semibold text-accent-growth">
                <span>▲ +142.73% (2.43× vs BL)</span>
              </div>
            </div>
            <div className="pt-2 mt-2 border-t border-border-subtle/60 text-[11px] font-mono text-content-secondary flex items-center justify-between">
              <span className="truncate max-w-[130px]" title="Outlier-Resistant Equity Metric">Outlier-Resistant</span>
              <EvidenceBadge metricId="METRIC-INC-002" variant="card" label="Ledger Table 4" />
            </div>
          </div>

          {/* Tile 3: Social Inclusion Saturation */}
          <div className="card p-4 rounded-lg bg-surface border border-border-subtle shadow-xs hover:border-accent-primary/40 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-content-muted mb-1.5 font-mono">
                <span className="uppercase tracking-wider font-semibold text-accent-primary flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  Marginalized Inclusion
                </span>
                <EvidenceBadge metricId="METRIC-SOC-001" variant="subtle" />
              </div>
              <div className="text-2xl font-mono font-bold text-content-primary tracking-tight tabular-nums">
                99.48%<span className="text-xs font-normal text-content-muted font-sans ml-1">(1,527 / 1,535 HHs)</span>
              </div>
              {/* Micro-Composition Stacked Bar */}
              <div className="mt-2 h-2 w-full rounded-full bg-elevated overflow-hidden flex" title="OBC: 58.05% | ST: 24.56% | SC: 16.87% | Gen: 0.52%">
                <div className="h-full bg-amber-600" style={{ width: '58.05%' }} />
                <div className="h-full bg-emerald-700" style={{ width: '24.56%' }} />
                <div className="h-full bg-amber-800" style={{ width: '16.87%' }} />
                <div className="h-full bg-stone-400" style={{ width: '0.52%' }} />
              </div>
            </div>
            <div className="pt-2 mt-2 border-t border-border-subtle/60 text-[11px] font-mono text-content-secondary flex items-center justify-between">
              <span>6,494 Individuals</span>
              <EvidenceBadge metricId="METRIC-SOC-001" variant="card" label="FDB!Caste" />
            </div>
          </div>

          {/* Tile 4: Public Scheme Leverage */}
          <div className="card p-4 rounded-lg bg-surface border border-border-subtle shadow-xs hover:border-accent-primary/40 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-content-muted mb-1.5 font-mono">
                <span className="uppercase tracking-wider font-semibold text-accent-evidence flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5" />
                  Public Policy Leverage
                </span>
                <EvidenceBadge metricId="METRIC-RGHT-001" variant="subtle" />
              </div>
              <div className="text-2xl font-mono font-bold text-content-primary tracking-tight tabular-nums">
                ₹7,70,98,360<span className="text-xs font-normal text-content-muted font-sans ml-1">(~₹7.71 Cr)</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-mono font-semibold text-accent-evidence">
                <span>3.57× Grant Multiplier</span>
              </div>
            </div>
            <div className="pt-2 mt-2 border-t border-border-subtle/60 text-[11px] font-mono text-content-secondary flex items-center justify-between">
              <span>577 Civil Projects</span>
              <EvidenceBadge metricId="METRIC-RGHT-001" variant="card" label="SYS-7 Verified" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExecutiveSummaryBar;

