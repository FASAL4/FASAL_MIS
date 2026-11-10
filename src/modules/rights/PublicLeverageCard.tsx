import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import type { RightsEntitlementsData } from '../../types/dashboard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { formatINR } from './rightsFormatters';

export interface PublicLeverageCardProps {
  leverage: RightsEntitlementsData['publicLeverage'];
  className?: string;
}

export const PublicLeverageCard: React.FC<PublicLeverageCardProps> = ({
  leverage,
  className = '',
}) => {
  const [showForensicDetails, setShowForensicDetails] = useState<boolean>(true);

  const {
    totalLeverageAmountINR, // ₹7,70,98,360
    totalProjectsCount,      // 577
    annualBreakdown,
    categoryBreakdown,
  } = leverage;

  // Chart data for annual trajectory
  const annualChartData = annualBreakdown.map((item) => ({
    year: item.fiscalYear,
    amount: item.verifiedAmountINR,
    amountLakh: Number((item.verifiedAmountINR / 100000).toFixed(1)),
    projects: item.projectItemsCount,
    register: item.registerFile,
  }));

  // Sectoral category mapping with custom styling
  const categoryPalette = [
    '#047857', // PMAY housing (emerald)
    '#0E7490', // Roads & Drains (cyan)
    '#0284C7', // Har Ghar Nal (sky)
    '#92400E', // Latrines (amber/harvest)
    '#F59E0B', // Solar (ochre)
    '#7C3AED', // Engine Borings (purple)
    '#6B7280', // Soak pits (stone)
  ];

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header with Result Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-growth/10 text-accent-growth border border-accent-growth/20">
              Feature F15: Verified Public Scheme Leverage
            </span>
            <EvidenceBadge metricId="REC-LEV-01" variant="card" label="₹7.71 Cr Verified" />
            <EvidenceBadge metricId="METRIC-RGHT-001" variant="card" label="3.57× Grant Multiplier" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            ₹7.71 Crore Verified Public Leverage Across 577 Genuine Civil Projects
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            AAS federation collective advocacy successfully leveraged <strong>₹7,70,98,360 (~₹7.71 Crore)</strong> in statutory government infrastructure and welfare sanctions across 2023–2025. This delivered a decisive <strong>3.57× catalytic multiplier</strong> against the ₹2.16 Crore APPI grant commitment (Grant Ref: G-2110-10970).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-growth/15 border border-accent-growth/30 text-accent-growth text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>3.57× CATALYTIC MULTIPLIER</span>
          </div>
        </div>
      </div>

      {/* 2. Headline Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-accent-growth/10 border border-accent-growth/25 space-y-1">
          <span className="text-[11px] font-mono text-content-muted uppercase">Verified Leverage Total</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-content-primary tabular-nums">
            {formatINR(totalLeverageAmountINR, { compact: true })}
          </div>
          <span className="text-[11px] font-mono text-accent-growth block">₹7,70,98,360 exact</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-xs space-y-1">
          <span className="text-[11px] font-mono text-content-muted uppercase">Genuine Civil Projects</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-content-primary tabular-nums">
            {totalProjectsCount}
          </div>
          <span className="text-[11px] font-mono text-content-muted block">577 genuine line items</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-xs space-y-1">
          <span className="text-[11px] font-mono text-content-muted uppercase">APPI Grant Multiplier</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-content-primary tabular-nums">
            3.57×
          </div>
          <span className="text-[11px] font-mono text-accent-growth block">₹3.57 mobilized per ₹1 grant</span>
        </div>

        <div className="p-4 rounded-xl bg-accent-evidence/10 border border-accent-evidence/25 space-y-1">
          <span className="text-[11px] font-mono text-content-muted uppercase">False Artifact Purged</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-accent-evidence tabular-nums">
            ₹3.99 Cr
          </div>
          <span className="text-[11px] font-mono text-content-muted block">Debunked ₹11.70 Cr neutralized</span>
        </div>
      </div>

      {/* 3. FORENSIC AUDIT & MYTH PURGE BANNER */}
      <div className="p-5 rounded-xl bg-accent-harvest/10 border border-accent-harvest/30 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent-harvest" />
            <h4 className="text-sm font-serif font-bold text-content-primary">
              Forensic Remediation: Neutralization of the Debunked ₹11.70 Crore Double-Counting Artifact (SYS-7)
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setShowForensicDetails(!showForensicDetails)}
            className="text-xs font-mono text-accent-harvest hover:underline cursor-pointer flex items-center gap-1"
          >
            {showForensicDetails ? 'Collapse Audit Details' : 'View Audit Breakdown'}
          </button>
        </div>

        <p className="text-xs text-content-secondary leading-relaxed">
          Historical synthesis drafts asserted public leverage of <strong>₹11,70,21,520 across 583 projects</strong>. The forensic audit proved this was an arithmetic distortion caused by naively summing embedded spreadsheet grand total and subtotal rows:
        </p>

        {showForensicDetails && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 rounded-lg bg-surface/90 border border-border-subtle space-y-1">
              <span className="font-bold text-content-primary block">1. 2025 Doubling Error</span>
              <span className="text-accent-stress block font-bold">+₹2,78,24,960 error</span>
              <p className="text-[11px] text-content-muted font-sans leading-normal">
                Row 165 was an embedded total `=SUM(G7:G164)`. Summing the column doubled ₹2.78 Cr into ₹5.56 Cr.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-surface/90 border border-border-subtle space-y-1">
              <span className="font-bold text-content-primary block">2. 2023 Subtotal Distortion</span>
              <span className="text-accent-stress block font-bold">+₹1,48,33,200 error</span>
              <p className="text-[11px] text-content-muted font-sans leading-normal">
                Row 264 `=SUBTOTAL(9,G103:G263)` was included, while missing ₹27.35 L of road projects in Column H.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-surface/90 border border-border-subtle space-y-1">
              <span className="font-bold text-content-primary block">3. 583 Count Artifact</span>
              <span className="text-accent-stress block font-bold">+6 footer rows counted</span>
              <p className="text-[11px] text-content-muted font-sans leading-normal">
                Naively counting Hindi notes, dates, and signature rows generated 583. Genuine projects equal exactly 577.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Sectoral Civil Works Allocation (Breakdown Table + Progress) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-serif font-bold text-content-primary flex items-center gap-2">
            <Building2 className="w-4 h-4 text-accent-growth" />
            Sectoral Public Scheme Convergence Breakdown (All 577 Genuine Projects)
          </h4>
          <span className="text-xs font-mono text-content-muted">2023–2025 Cumulative</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Sectoral Breakdown Cards */}
          <div className="lg:col-span-2 space-y-3">
            {categoryBreakdown.map((cat, idx) => (
              <div
                key={cat.schemeCategory}
                className="p-3.5 rounded-lg bg-elevated/40 border border-border-subtle hover:border-border-strong transition-all space-y-2"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: categoryPalette[idx % categoryPalette.length] }}
                    />
                    <span className="font-sans font-medium text-xs text-content-primary">
                      {cat.schemeCategory}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-content-primary tabular-nums">
                      {formatINR(cat.amountINR, { compact: true })}
                    </span>
                    <span className="text-content-muted">({cat.percentage}%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-content-muted font-mono">
                  <span>Volume: {cat.unitsSanctioned} {cat.unitDescription}</span>
                  <span>{formatINR(cat.amountINR)}</span>
                </div>

                <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: categoryPalette[idx % categoryPalette.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Col: Annual Progression Chart */}
          <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-content-muted block mb-1">
                Annual Mobilization Series
              </span>
              <h5 className="text-sm font-serif font-bold text-content-primary">
                Public Sanctions by Implementation Year
              </h5>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={annualChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} tickLine={false} />
                  <YAxis unit="L" tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="p-3 bg-surface/95 backdrop-blur-md border border-border-strong rounded-lg shadow-elevated text-xs font-mono space-y-1">
                          <div className="font-bold text-content-primary">Year {label}</div>
                          <div className="text-accent-growth font-bold">{formatINR(d.amount)}</div>
                          <div className="text-content-muted">{d.projects} civil projects</div>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="amountLakh" fill="#047857" radius={[4, 4, 0, 0]}>
                    {annualChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={['#047857', '#0E7490', '#92400E'][index % 3]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="border-t border-border-subtle pt-3 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-content-muted">2023 Register:</span>
                <span className="font-bold text-content-primary">₹2.63 Cr (259 items)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">2024 Register:</span>
                <span className="font-bold text-content-primary">₹2.30 Cr (160 items)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">2025 Register:</span>
                <span className="font-bold text-content-primary">₹2.78 Cr (158 items)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLeverageCard;
